import { useState, useRef, useEffect } from "preact/hooks";
import { KeyData } from "../lib/data";
import { KeyInput } from "./KeyInput";
import { KeyLegend } from "./KeyLegend";

/** Props for the KeyDialog component */
export interface KeyDialogProps {
    /** The key data */
    keyData: KeyData;
    /** Callback to update the key data */
    updateKey: (key: KeyData) => void;
    /** Callback to delete the key */
    deleteKey: () => void;
    /** Callback to close the dialog */
    onClose: () => void;
}

/** A dialog for editing a single key on the keyboard */
// (removed duplicate import)

export function KeyDialog(props: KeyDialogProps) {
    const [shift, setShift] = useState(props.keyData.shift * 100);
    const [width, setWidth] = useState(props.keyData.width * 100);
    const [slider, setSlider] = useState(false);
    const [c, setc] = useState(props.keyData.c);
    const [nw, setnw] = useState(props.keyData.nw);
    const [ne, setne] = useState(props.keyData.ne);
    const [sw, setsw] = useState(props.keyData.sw);
    const [se, setse] = useState(props.keyData.se);
    const [w, setw] = useState(props.keyData.w);
    const [e, sete] = useState(props.keyData.e);
    const [n, setn] = useState(props.keyData.n);
    const [s, sets] = useState(props.keyData.s);

    const [showCornerKeys, setShowCornerKeys] = useState(false);
    const [showEdgeKeys, setShowEdgeKeys] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState<
        | "c"
        | "nw"
        | "ne"
        | "sw"
        | "se"
        | "w"
        | "e"
        | "n"
        | "s"
    >("c");
    // Ref for the KeyInput
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus and select input when selectedRegion changes
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [selectedRegion]);

    return (
        <>
            <div class="modal d-block" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="modal-title">Edit Key</h3>
                            <button
                                type="button"
                                class="btn-close"
                                aria-label="Close"
                                onClick={props.onClose}
                            />
                        </div>
                        <div class="modal-body text-wrap">
                            <p class="mb-1">Select a region to edit.</p>
                            <p>
                                The center key is sent when tapping the key, and
                                the surrounding keys are sent when swiping in
                                the direction of those regions.
                            </p>
                            <div class="d-flex justify-content-center mb-3">
                                <div
                                    style={{
                                        position: "relative",
                                        aspectRatio: "1.25/1",
                                        width: "20em",
                                    }}
                                >
                                    <button
                                        class={`btn btn-secondary position-absolute ${
                                            selectedRegion === "c" &&
                                            "active"
                                        }`}
                                        style={{
                                            top: "30%",
                                            left: "30%",
                                            width: "40%",
                                            height: "40%",
                                        }}
                                    onClick={() => setSelectedRegion("c")}
                                        title="Tap Input"
                                    >
                                        <KeyLegend legend={c} />
                                    </button>
                                    <button
                                        class={`btn btn-secondary position-absolute ${
                                            selectedRegion === "nw" &&
                                            "active"
                                        }`}
                                        style={{
                                            top: "0%",
                                            left: "0%",
                                            width: "25%",
                                            height: "25%",
                                        }}
                                    onClick={() => setSelectedRegion("nw")}
                                        title="Swipe Up-Left Input"
                                    >
                                        <KeyLegend legend={nw} />
                                    </button>
                                    <button
                                        class={`btn btn-secondary position-absolute ${
                                            selectedRegion === "ne" &&
                                            "active"
                                        }`}
                                        style={{
                                            top: "0%",
                                            right: "0%",
                                            width: "25%",
                                            height: "25%",
                                        }}
                                    onClick={() => setSelectedRegion("ne")}
                                        title="Swipe Up-Right Input"
                                    >
                                        <KeyLegend legend={ne} />
                                    </button>
                                    <button
                                        class={`btn btn-secondary position-absolute ${
                                            selectedRegion === "sw" &&
                                            "active"
                                        }`}
                                        style={{
                                            bottom: "0%",
                                            left: "0%",
                                            width: "25%",
                                            height: "25%",
                                        }}
                                    onClick={() => setSelectedRegion("sw")}
                                        title="Swipe Down-Left Input"
                                    >
                                        <KeyLegend legend={sw} />
                                    </button>
                                    <button
                                        class={`btn btn-secondary position-absolute ${
                                            selectedRegion === "se" &&
                                            "active"
                                        }`}
                                        style={{
                                            bottom: "0%",
                                            right: "0%",
                                            width: "25%",
                                            height: "25%",
                                        }}
                                    onClick={() => setSelectedRegion("se")}
                                        title="Swipe Down-Right Input"
                                    >
                                        <KeyLegend legend={se} />
                                    </button>
                                    <button
                                        class={`btn btn-secondary position-absolute ${
                                            selectedRegion === "w" &&
                                            "active"
                                        }`}
                                        style={{
                                            left: "0%",
                                            top: "30%",
                                            width: "25%",
                                            height: "40%",
                                        }}
                                    onClick={() => setSelectedRegion("w")}
                                        title="Swipe Left Input"
                                    >
                                        <KeyLegend legend={w} />
                                    </button>
                                    <button
                                        class={`btn btn-secondary position-absolute ${
                                            selectedRegion === "e" &&
                                            "active"
                                        }`}
                                        style={{
                                            right: "0%",
                                            top: "30%",
                                            width: "25%",
                                            height: "40%",
                                        }}
                                    onClick={() => setSelectedRegion("e")}
                                        title="Swipe Right Input"
                                    >
                                        <KeyLegend legend={e} />
                                    </button>
                                    <button
                                        class={`btn btn-secondary position-absolute ${
                                            selectedRegion === "n" &&
                                            "active"
                                        }`}
                                        style={{
                                            top: "0%",
                                            left: "30%",
                                            width: "40%",
                                            height: "25%",
                                        }}
                                    onClick={() => setSelectedRegion("n")}
                                        title="Swipe Up Input"
                                    >
                                        <KeyLegend legend={n} />
                                    </button>
                                    <button
                                        class={`btn btn-secondary position-absolute ${
                                            selectedRegion === "s" &&
                                            "active"
                                        }`}
                                        style={{
                                            bottom: "0%",
                                            left: "30%",
                                            width: "40%",
                                            height: "25%",
                                        }}
                                    onClick={() => setSelectedRegion("s")}
                                        title="Swipe Down Input"
                                    >
                                        <KeyLegend legend={s} />
                                    </button>
                                </div>
                            </div>

                            <div class="mb-3">
                                <KeyInput
                                    input={
                                        selectedRegion === "c"
                                            ? c
                                            : selectedRegion === "nw"
                                            ? nw
                                            : selectedRegion === "ne"
                                            ? ne
                                            : selectedRegion === "sw"
                                            ? sw
                                            : selectedRegion === "se"
                                            ? se
                                            : selectedRegion === "w"
                                            ? w
                                            : selectedRegion === "e"
                                            ? e
                                            : selectedRegion === "n"
                                            ? n
                                            : selectedRegion === "s"
                                            ? s
                                            : ""
                                    }
                                    updateInput={(value) => {
                                        switch (selectedRegion) {
                                            case "c":
                                                setc(value);
                                                break;
                                            case "nw":
                                                setnw(value);
                                                break;
                                            case "ne":
                                                setne(value);
                                                break;
                                            case "sw":
                                                setsw(value);
                                                break;
                                            case "se":
                                                setse(value);
                                                break;
                                            case "w":
                                                setw(value);
                                                break;
                                            case "e":
                                                sete(value);
                                                break;
                                            case "n":
                                                setn(value);
                                                break;
                                            case "s":
                                                sets(value);
                                                break;
                                        }
                                    }}
                                    inputRef={inputRef}
                                />
                            </div>

                            <button
                                class="btn btn-outline-secondary dropdown-toggle"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                            >
                                {showAdvanced ? "Hide" : "Show"} Advanced
                            </button>
                            {/* Advanced Options */}
                            {showAdvanced && (
                                <>
                                    <div class="mb-3">
                                        <label
                                            class="form-label"
                                            for="width-input"
                                        >
                                            Key Width
                                        </label>
                                        <div class="input-group">
                                            <input
                                                id="width-input"
                                                class="form-control"
                                                type="number"
                                                min="10"
                                                max="1000"
                                                step="1"
                                                value={width}
                                                onInput={(e) =>
                                                    setWidth(
                                                        parseInt(
                                                            (
                                                                e.target as HTMLInputElement
                                                            ).value,
                                                        ),
                                                    )
                                                }
                                            />
                                            <span class="input-group-text">
                                                %
                                            </span>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label
                                            class="form-label"
                                            for="shift-input"
                                        >
                                            Offset
                                        </label>
                                        <div class="input-group">
                                            <input
                                                id="shift-input"
                                                class="form-control"
                                                type="number"
                                                min="0"
                                                max="1000"
                                                step="1"
                                                value={shift}
                                                onInput={(e) =>
                                                    setShift(
                                                        parseInt(
                                                            (
                                                                e.target as HTMLInputElement
                                                            ).value,
                                                        ),
                                                    )
                                                }
                                            />
                                            <span class="input-group-text">
                                                %
                                            </span>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div class="form-check form-switch">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                id="slider-switch"
                                                checked={slider}
                                                onChange={(e) =>
                                                    setSlider(
                                                        (
                                                            e.target as HTMLInputElement
                                                        ).checked,
                                                    )
                                                }
                                            />
                                            <label
                                                class="form-check-label"
                                                for="slider-switch"
                                            >
                                                Slider
                                            </label>
                                        </div>

                                        <div class="form-text">
                                            "Slider" keys are keys that will
                                            activate their Left Key and Right
                                            Key inputs by sliding your finger
                                            across the key.
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div class="modal-footer">
                            <div class="d-flex justify-content-between w-100">
                                {/* Delete Key Button */}
                                <button
                                    class="btn btn-outline-danger"
                                    onClick={() => {
                                        props.deleteKey();
                                        props.onClose();
                                    }}
                                >
                                    Delete Key
                                </button>
                                <div>
                                    {/* Save Button */}
                                    <button
                                        class="btn btn-primary me-2"
                                        onClick={() => {
                                            props.updateKey({
                                                ...props.keyData,
                                                shift: shift / 100,
                                                width: width / 100,
                                                c,
                                                nw,
                                                ne,
                                                sw,
                                                se,
                                                w,
                                                e,
                                                n,
                                                s,
                                            });
                                            props.onClose();
                                        }}
                                    >
                                        Save
                                    </button>
                                    {/* Cancel Button */}
                                    <button
                                        class="btn btn-secondary"
                                        onClick={props.onClose}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show" />
        </>
    );
}
