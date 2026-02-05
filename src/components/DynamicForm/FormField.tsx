import React from 'react';
import type { FieldConfig } from './types';
import { AlertCircle } from 'lucide-react';
import './FormField.css';

interface FormFieldProps {
    config: FieldConfig;
    value: string;
    error?: string;
    touched?: boolean;
    onChange: (name: string, value: string) => void;
    onBlur: (name: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
    config,
    value,
    error,
    touched,
    onChange,
    onBlur
}) => {
    const { name, label, type, required, placeholder, options, rows, disabled } = config;
    const showError = touched && error;
    const fieldId = `field-${name}`;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        onChange(name, e.target.value);
    };

    const handleBlur = () => {
        onBlur(name);
    };

    const renderInput = () => {
        const commonProps = {
            id: fieldId,
            name,
            value,
            placeholder,
            disabled,
            onChange: handleChange,
            onBlur: handleBlur,
            className: `form-input ${showError ? 'form-input--error' : ''}`,
            'aria-invalid': showError ? true : undefined,
            'aria-describedby': showError ? `${fieldId}-error` : undefined
        };

        switch (type) {
            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="">Select {label}</option>
                        {options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case 'textarea':
                return <textarea {...commonProps} rows={rows || 4} />;

            default:
                return <input {...commonProps} type={type} />;
        }
    };

    return (
        <div className="form-field">
            <label htmlFor={fieldId} className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>
            {renderInput()}
            {showError && (
                <span id={`${fieldId}-error`} className="form-error" role="alert">
                    <AlertCircle size={14} />
                    {error}
                </span>
            )}
        </div>
    );
};
