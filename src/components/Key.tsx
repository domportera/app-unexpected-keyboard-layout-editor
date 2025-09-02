import { useMemo, useState, useRef, useEffect } from "preact/hooks";
import { KeyData, KeyboardData, getKeyboardWidth } from "../lib/data";
import { KeyDialog } from "./KeyDialog";
import { KeyLegend } from "./KeyLegend";
import { useNumberModal } from "./useNumberModal";

/** Props for the Key component */
export interface KeyProps {
    /** The key data */
    keyData: KeyData;
    /** Callback to update the key data */
    updateKey: (key: KeyData) => void;
    /** Callback to delete the key */
    deleteKey: () => void;
    /** Callback to insert a key before this key */
    insertKeyBefore: () => void;
    /** The entire keyboard data */
    keyboardData: KeyboardData;
}

/** A single key on the keyboard that supports editing */
export function Key(props: KeyProps) {
    // Context menu open/close logic
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    useEffect(() => {
        if (!contextMenuOpen) return;
        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            if (contextMenuRef.current && !(contextMenuRef.current as any).contains(e.target)) {
                setContextMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [contextMenuOpen]);
    // Rotate helpers
    const handleRotateCW = () => {
        const { nw, n, ne, e, se, s, sw, w, ...rest } = props.keyData;
        props.updateKey({
            ...rest,
            nw: w,
            n: nw,
            ne: n,
            e: ne,
            se: e,
            s: se,
            sw: s,
            w: sw,
        });
    };
    const handleRotateCCW = () => {
        const { nw, n, ne, e, se, s, sw, w, ...rest } = props.keyData;
        props.updateKey({
            ...rest,
            nw: n,
            n: ne,
            ne: e,
            e: se,
            se: s,
            s: sw,
            sw: w,
            w: nw,
        });
    };
    // Flip helpers
    const handleFlipHorizontal = () => {
        const flipped: KeyData = {
            ...props.keyData,
            nw: props.keyData.ne,
            ne: props.keyData.nw,
            sw: props.keyData.se,
            se: props.keyData.sw,
            w: props.keyData.e,
            e: props.keyData.w,
        };
        props.updateKey(flipped);
    };
    const handleFlipVertical = () => {
        const flipped: KeyData = {
            ...props.keyData,
            nw: props.keyData.sw,
            sw: props.keyData.nw,
            ne: props.keyData.se,
            se: props.keyData.ne,
            n: props.keyData.s,
            s: props.keyData.n,
        };
        props.updateKey(flipped);
    };
    const [dialogOpen, setDialogOpen] = useState(false);
    const [menuPos, setMenuPos] = useState<{x: number, y: number} | null>(null);

    // For mobile long-press
    let longPressTimer: number | null = null;

    const handleContextMenu = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        let x = 0, y = 0;
        if ('touches' in e && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else if ('clientX' in e) {
            x = e.clientX;
            y = e.clientY;
        }
        setMenuPos({ x, y });
        setContextMenuOpen(true);
    };

    const handleTouchStart = (e: TouchEvent) => {
        longPressTimer = window.setTimeout(() => handleContextMenu(e), 500);
    };
    const handleTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };

    const keyboardWidth = useMemo(
        () => getKeyboardWidth(props.keyboardData),
        [props.keyboardData],
    );

    // Key clipboard helpers
    const KEY_CLIPBOARD_KEY = "ukeyboard_key_clipboard";
    const handleCopy = () => {
        try {
            localStorage.setItem(KEY_CLIPBOARD_KEY, JSON.stringify(props.keyData));
        } catch {}
    };
    const handlePaste = () => {
        try {
            const data = localStorage.getItem(KEY_CLIPBOARD_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                // Only paste if parsed is an object
                if (parsed && typeof parsed === "object") {
                    props.updateKey(parsed);
                }
            }
        } catch {}
    };

    // Set Key Width modal logic using useNumberModal
    const widthModal = useNumberModal({
        title: "Set Key Width",
        label: "Key width as a percent of a normal key",
        min: 11,
        step: 1,
        unit: "%",
        helpText: "Minimum: 11%",
        initialValue: Math.round((props.keyData.width || 1) * 100),
        onSave: (val) => props.updateKey({ ...props.keyData, width: val / 100 }),
    });
    const handleSetKeyWidth = () => widthModal.open(Math.round((props.keyData.width || 1) * 100));

    return (
        <>
            <button
                class="btn btn-secondary position-relative h-100"
                onClick={() => setDialogOpen(true)}
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
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
            {contextMenuOpen && menuPos && (
                <div
                    ref={contextMenuRef}
                    class="dropdown-menu show p-0 border-0 shadow"
                    style={{
                        position: "fixed",
                        top: menuPos.y,
                        left: menuPos.x,
                        zIndex: 1000,
                        minWidth: "140px",
                        pointerEvents: "auto",
                    }}
                >
                    <button
                        class="dropdown-item w-100 text-start"
                        onClick={e => {
                            e.stopPropagation();
                            setContextMenuOpen(false);
                            props.insertKeyBefore();
                        }}
                    >
                        Insert key before
                    </button>
                    <hr class="dropdown-divider" />
                    <button
                        class="dropdown-item w-100 text-start"
                        onClick={e => {
                            e.stopPropagation();
                            setContextMenuOpen(false);
                            handleCopy();
                        }}
                    >
                        Copy from
                    </button>
                    <button
                        class="dropdown-item w-100 text-start"
                        onClick={e => {
                            e.stopPropagation();
                            setContextMenuOpen(false);
                            handlePaste();
                        }}
                    >
                        Paste to
                    </button>
                    <button
                        class="dropdown-item w-100 text-start"
                        onClick={e => {
                            e.stopPropagation();
                            setContextMenuOpen(false);
                            handleSetKeyWidth();
                        }}
                    >
                        Set Key Width
                    </button>
                    <hr class="dropdown-divider" />
                    <button
                        class="dropdown-item w-100 text-start"
                        onClick={e => {
                            e.stopPropagation();
                            setContextMenuOpen(false);
                            handleFlipHorizontal();
                        }}
                    >
                        Flip horizontal
                    </button>
                    <button
                        class="dropdown-item w-100 text-start"
                        onClick={e => {
                            e.stopPropagation();
                            setContextMenuOpen(false);
                            handleFlipVertical();
                        }}
                    >
                        Flip vertical
                    </button>
                    <button
                        class="dropdown-item w-100 text-start"
                        onClick={e => {
                            e.stopPropagation();
                            setContextMenuOpen(false);
                            handleRotateCW();
                        }}
                    >
                        Rotate CW
                    </button>
                    <button
                        class="dropdown-item w-100 text-start"
                        onClick={e => {
                            e.stopPropagation();
                            setContextMenuOpen(false);
                            handleRotateCCW();
                        }}
                    >
                        Rotate CCW
                    </button>
                </div>
            )}
            {dialogOpen && (
                <KeyDialog
                    keyData={props.keyData}
                    updateKey={props.updateKey}
                    deleteKey={props.deleteKey}
                    onClose={() => setDialogOpen(false)}
                />
            )}
            {widthModal.modal}
        </>
    );
}
