import { useState, useCallback } from "preact/hooks";
import { SimpleNumberModal } from "./SimpleNumberModal";

export interface UseNumberModalOptions {
    title: string;
    label: string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    helpText?: string;
    initialValue: number;
    onSave: (value: number) => void;
}

export function useNumberModal({
    title,
    label,
    min = 0,
    max,
    step = 1,
    unit,
    helpText,
    initialValue,
    onSave,
}: UseNumberModalOptions) {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState(initialValue);

    const open = useCallback((val?: number) => {
        setValue(typeof val === "number" ? val : initialValue);
        setShow(true);
    }, [initialValue]);
    const close = useCallback(() => setShow(false), []);
    const handleSave = useCallback(() => {
        if (Number.isInteger(value) && (min === undefined || value >= min) && (max === undefined || value <= max)) {
            onSave(value);
            setShow(false);
        }
    }, [value, min, max, onSave]);

    const modal = (
        <SimpleNumberModal
            show={show}
            title={title}
            label={label}
            value={value}
            min={min}
            max={max}
            step={step}
            unit={unit}
            helpText={helpText}
            onChange={setValue}
            onCancel={close}
            onSave={handleSave}
            saveDisabled={!Number.isInteger(value) || (min !== undefined && value < min) || (max !== undefined && value > max)}
        />
    );

    return { open, close, modal, value, setValue, show };
}
