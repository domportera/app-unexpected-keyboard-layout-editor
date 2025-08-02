import { useMemo, useState } from "preact/hooks";
import { KeyData, KeyboardData, getKeyboardWidth } from "../lib/data";
import { KeyDialog } from "./KeyDialog";
import { KeyLegend } from "./KeyLegend";

/** Props for the Key component */
export interface KeyProps {
    /** The key data */
    keyData: KeyData;
    /** Callback to update the key data */
    updateKey: (key: KeyData) => void;
    /** Callback to delete the key */
    deleteKey: () => void;
    /** The entire keyboard data */
    keyboardData: KeyboardData;
}

/** A single key on the keyboard that supports editing */
export function Key(props: KeyProps) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const keyboardWidth = useMemo(
        () => getKeyboardWidth(props.keyboardData),
        [props.keyboardData],
    );

    return (
        <>
            <button
                class="btn btn-secondary position-relative h-100"
                onClick={() => setDialogOpen(true)}
                style={{
                    width: (props.keyData.width / keyboardWidth) * 100 + "%",
                    marginLeft:
                        (props.keyData.shift / keyboardWidth) * 100 + "%",
                }}
            >
                <KeyLegend legend={props.keyData.c} />
                {props.keyData.nw && (
                    <KeyLegend
                        legend={props.keyData.nw}
                        class="position-absolute top-0 start-0 px-1"
                    />
                )}
                {props.keyData.ne && (
                    <KeyLegend
                        legend={props.keyData.ne}
                        class="position-absolute top-0 end-0 px-1"
                    />
                )}
                {props.keyData.sw && (
                    <KeyLegend
                        legend={props.keyData.sw}
                        class="position-absolute bottom-0 start-0 px-1"
                    />
                )}
                {props.keyData.se && (
                    <KeyLegend
                        legend={props.keyData.se}
                        class="position-absolute bottom-0 end-0 px-1"
                    />
                )}
                {props.keyData.w && (
                    <KeyLegend
                        legend={props.keyData.w}
                        class="position-absolute top-50 start-0 translate-middle-y px-1"
                    />
                )}
                {props.keyData.e && (
                    <KeyLegend
                        legend={props.keyData.e}
                        class="position-absolute top-50 end-0 translate-middle-y px-1"
                    />
                )}
                {props.keyData.n && (
                    <KeyLegend
                        legend={props.keyData.n}
                        class="position-absolute top-0 start-50 translate-middle-x px-1"
                    />
                )}
                {props.keyData.s && (
                    <KeyLegend
                        legend={props.keyData.s}
                        class="position-absolute bottom-0 start-50 translate-middle-x px-1"
                    />
                )}
            </button>
            {dialogOpen && (
                <KeyDialog
                    keyData={props.keyData}
                    updateKey={props.updateKey}
                    deleteKey={props.deleteKey}
                    onClose={() => setDialogOpen(false)}
                />
            )}
        </>
    );
}
