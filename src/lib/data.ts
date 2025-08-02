import { z } from "zod";

//#region Data Structures

/** Data structure for a single key. */
export interface KeyData {
    /** Width of the key. Defaults to 1. */
    width: number;
    /** Horizontal offset of the key. Defaults to 0. */
    shift: number;
    /** The main insert sequence of the key. */
    c: string;
    /** The top-left insert sequence of the key. */
    nw: string;
    /** The top-right insert sequence of the key. */
    ne: string;
    /** The bottom-left insert sequence of the key. */
    sw: string;
    /** The bottom-right insert sequence of the key. */
    se: string;
    /** The left insert sequence of the key. */
    w: string;
    /** The right insert sequence of the key. */
    e: string;
    /** The top insert sequence of the key. */
    n: string;
    /** The bottom insert sequence of the key. */
    s: string;
    /**
     * If this key can activate its {@link w} or {@link e} sequences by
     * swiping.
     */
    slider: boolean;
}

/** Data structure for a single row. */
export interface RowData {
    /** Height of the row. Defaults to 1. */
    height: number;
    /** Amount of padding to add above the row. Defaults to 0. */
    shift: number;
    /** Keys in the row. */
    keys: KeyData[];
}

/** Data structure for a keyboard. */
export interface KeyboardData {
    /** The name of the keyboard. */
    name: string;
    /** The writing script of the keyboard. */
    script: string;
    /** Rows in the keyboard. */
    rows: RowData[];
    /** If the default bottom row should be added. */
    bottomRow: boolean;
    /** A width that overrides each row's width. */
    width?: number;
}
//#endregion

//#region Constructors
/** Create a default {@link KeyData}. */
export function newKey(): KeyData {
    return {
        shift: 0,
        width: 1,
        c: "",
        nw: "",
        ne: "",
        sw: "",
        se: "",
        w: "",
        e: "",
        n: "",
        s: "",
        slider: false,
    };
}

/** Create a default {@link RowData}. */
export function newRow(): RowData {
    return {
        height: 1,
        shift: 0,
        keys: [],
    };
}

/** Create a default {@link KeyboardData}. */
export function newKeyboard(): KeyboardData {
    return {
        name: "Custom Layout",
        script: "",
        rows: [],
        bottomRow: true,
    };
}
//#endregion

//#region Utility Functions
/** Returns the width for a keyboard. */
export function getKeyboardWidth(data: KeyboardData): number {
    // If a width is specified, use that.
    if (data.width !== undefined) return data.width;
    // Otherwise, find the widest row.
    return Math.max(
        ...data.rows.map((row) =>
            row.keys.reduce((sum, key) => sum + key.width + key.shift, 0),
        ),
    );
}
//#endregion

//#region Serialization

/* xml2js parses xml out to objects where attributes are stored in the `$` key,
   and child elements are stored in the child element's name. */

const xmlSchema = z.object({
    keyboard: z.object({
        $: z
            .object({
                name: z.string().optional(),
                script: z.string().optional(),
                bottom_row: z.coerce.boolean().optional(),
                /** Deprecated alias for `bottom_row`. */
                bottomRow: z.coerce.boolean().optional(),
                width: z.coerce.number().positive().optional(),
            })
            .transform((o) => ({
                name: o.name,
                script: o.script,
                width: o.width,
                bottom_row: o.bottom_row ?? o.bottomRow,
            }))
            .optional(),
        row: z.array(
            z.object({
                $: z
                    .object({
                        height: z.coerce.number().positive().optional(),
                        shift: z.coerce.number().positive().optional(),
                    })
                    .optional(),
                key: z.array(
                    z.object({
                        $: z.object({
                            width: z.coerce.number().positive().optional(),
                            shift: z.coerce.number().positive().optional(),
                            c: z.string().optional(),
                            nw: z.string().optional(),
                            ne: z.string().optional(),
                            sw: z.string().optional(),
                            se: z.string().optional(),
                            w: z.string().optional(),
                            e: z.string().optional(),
                            n: z.string().optional(),
                            s: z.string().optional(),
                            slider: z.coerce.boolean().optional(),
                        }).optional(),
                    }),
                ),
            }),
        ),
    }),
});
export type XmlKeyboard = z.infer<typeof xmlSchema>;

// A set of characters that need to be escaped in android XML files.
const androidEscapeChars = /^[@#\\?]$/;

/** Convert a {@link KeyboardData} to a {@link XmlKeyboard}. */
export function toXmlKeyboard(data: KeyboardData): XmlKeyboard {
    function str(value: unknown): string {
        const v = String(value);
        if (androidEscapeChars.test(v)) {
            return "\\" + v;
        }
        return v;
    }

    return {
        keyboard: {
            $: {
                bottom_row: data.bottomRow ? undefined : false,
                width: data.width,
                name: str(data.name),
                script: data.script !== "" ? str(data.script) : undefined,
            },
            row: data.rows.map((row) => ({
                $: {
                    height: row.height !== 1 ? row.height : undefined,
                    shift: row.shift !== 0 ? row.shift : undefined,
                },
                key: row.keys.map((key) => {
                    // Compare to blank key
                    const blankKey = newKey();
                    // Shallow compare all properties
                    const isBlank = Object.keys(blankKey).every(
                        (k) => (key as any)[k] === (blankKey as any)[k]
                    );
                    if (isBlank) {
                        return { $: {} };
                    }
                    return {
                        $: {
                            width: key.width !== 1 ? key.width : undefined,
                            shift: key.shift !== 0 ? key.shift : undefined,
                            slider: key.slider ? true : undefined,
                            c: key.c !== "" ? str(key.c) : undefined,
                            nw: key.nw !== "" ? str(key.nw) : undefined,
                            ne: key.ne !== "" ? str(key.ne) : undefined,
                            sw: key.sw !== "" ? str(key.sw) : undefined,
                            se: key.se !== "" ? str(key.se) : undefined,
                            w: key.w !== "" ? str(key.w) : undefined,
                            e: key.e !== "" ? str(key.e) : undefined,
                            n: key.n !== "" ? str(key.n) : undefined,
                            s: key.s !== "" ? str(key.s) : undefined,
                        },
                    };
                }),
            })),
        },
    };
}

/** Convert a {@link XmlKeyboard} to a {@link KeyboardData}. */
export function fromXmlKeyboard(xml: XmlKeyboard): KeyboardData {
    function str(value: string | undefined, defaultValue = ""): string {
        if (value === undefined) return defaultValue;
        if (
            value.length === 2 &&
            value[0] === "\\" &&
            androidEscapeChars.test(value[1]!)
        ) {
            return value[1]!;
        }
        return value;
    }
    function num(value: string | undefined): number | undefined {
        if (value === undefined) return undefined;
        const v = parseFloat(value);
        if (isNaN(v)) return undefined;
        return v;
    }
    function toBool(val: any, defaultValue = true): boolean {
        if (val === undefined) return defaultValue;
        if (typeof val === "boolean") return val;
        if (typeof val === "string") return val.toLowerCase() === "true";
        return Boolean(val);
    }

    return {
        name: str(xml.keyboard?.$?.name, "Custom Layout"),
        script: str(xml.keyboard?.$?.script),
        rows: xml.keyboard.row.map((row: any) => ({
            height: row.$?.height ?? 1,
            shift: row.$?.shift ?? 0,
            keys: row.key.map((key: any) => {
                // If the key is empty (no attributes), treat as blank key
                if (!key.$ || Object.keys(key.$).length === 0) {
                    return newKey();
                }
                // Legacy key0-8 mapping to new property names
                const legacyKeyMap: Record<string, keyof KeyData> = {
                    key0: "c",
                    key1: "nw",
                    key2: "ne",
                    key3: "sw",
                    key4: "se",
                    key5: "w",
                    key6: "e",
                    key7: "n",
                    key8: "s",
                };
                // Copy all fields as normal
                let keyObj: any = {
                    width: key.$.width ?? 1,
                    shift: key.$.shift ?? 0,
                    c: str(key.$.c),
                    nw: str(key.$.nw),
                    ne: str(key.$.ne),
                    sw: str(key.$.sw),
                    se: str(key.$.se),
                    w: str(key.$.w),
                    e: str(key.$.e),
                    n: str(key.$.n),
                    s: str(key.$.s),
                    slider: key.$.slider ?? false,
                };
                // Map legacy key0-8 to their new property names
                for (const legacy in legacyKeyMap) {
                    const mapped = legacyKeyMap[legacy];
                    if (mapped && typeof key.$[legacy] === "string" && key.$[legacy]) {
                        keyObj[mapped] = str(key.$[legacy]);
                    }
                }
                return keyObj;
            }),
        })),
        // Respect both bottom_row and bottomRow, defaulting to true only if both are undefined
        bottomRow: toBool(xml.keyboard.$?.bottom_row ?? xml.keyboard.$?.bottomRow, true),
        width: xml.keyboard.$?.width,
    };
}

/** Returns `undefined` if an object is an {@link XmlKeyboard}, otherwise an error message. */
export function isXmlKeyboard(xml: unknown): string | undefined {
    const result = xmlSchema.safeParse(xml);
    if (!result.success) {
        return result.error.message;
    }
    return undefined;
}

//#endregion
