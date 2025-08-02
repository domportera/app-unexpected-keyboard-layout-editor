import { useEffect, useRef } from "preact/hooks";

export interface SimpleNumberModalProps {
    show: boolean;
    title: string;
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    helpText?: string;
    onChange: (value: number) => void;
    onCancel: () => void;
    onSave: () => void;
    saveDisabled?: boolean;
}

export function SimpleNumberModal({
    show,
    title,
    label,
    value,
    min = 0,
    max,
    step = 1,
    unit,
    helpText,
    onChange,
    onCancel,
    onSave,
    saveDisabled,
}: SimpleNumberModalProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (show && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [show]);

    // Keyboard accessibility: Enter = Save, Escape = Cancel
    useEffect(() => {
        if (!show) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                onSave();
            } else if (e.key === "Escape") {
                e.preventDefault();
                onCancel();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [show, onSave, onCancel]);

    if (!show) return null;
    return (
        <div
            class="modal d-block"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            style={{ background: "rgba(0,0,0,0.3)" }}
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{title}</h5>
                        <button type="button" class="btn-close" aria-label="Close" onClick={onCancel} />
                    </div>
                    <div class="modal-body">
                        <label class="form-label">{label}</label>
                        <div class="input-group">
                            <input
                                ref={inputRef}
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min={min}
                                max={max}
                                step={step}
                                class="form-control"
                                value={value}
                                onInput={e => {
                                    const val = (e.target as HTMLInputElement).value;
                                    // Only allow integer values, prevent NaN
                                    if (/^\d+$/.test(val)) {
                                        onChange(parseInt(val, 10));
                                    } else if (val === "") {
                                        onChange(0);
                                    }
                                }}
                            />
                            {unit && <span class="input-group-text">{unit}</span>}
                        </div>
                        {helpText && <div class="form-text">{helpText}</div>}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onClick={onCancel}>Cancel</button>
                        <button class="btn btn-primary" onClick={onSave} disabled={saveDisabled}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
