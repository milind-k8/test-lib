import React, { useState, useCallback } from 'react';
import type { FieldConfig, FormState } from './types';
import { FormField } from './FormField';
import { validateField, validateForm } from '../../utils/validation';
import { getInitialFormValues } from '../../config/userFormConfig';
import './DynamicForm.css';

interface DynamicFormProps {
    fields: FieldConfig[];
    initialValues?: Record<string, string>;
    onSubmit: (values: Record<string, string>) => void;
    onCancel?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
    fields,
    initialValues,
    onSubmit,
    onCancel,
    submitLabel = 'Save',
    cancelLabel = 'Cancel',
    isLoading = false
}) => {
    const [formState, setFormState] = useState<FormState>(() => ({
        values: initialValues || getInitialFormValues(fields),
        errors: {},
        touched: {}
    }));

    const handleChange = useCallback((name: string, value: string) => {
        setFormState((prev) => {
            const newValues = { ...prev.values, [name]: value };

            // Validate on change if field was touched
            const field = fields.find((f) => f.name === name);
            const newErrors = { ...prev.errors };

            if (prev.touched[name] && field) {
                const error = validateField(value, field.validation, field.required);
                if (error) {
                    newErrors[name] = error;
                } else {
                    delete newErrors[name];
                }
            }

            return {
                ...prev,
                values: newValues,
                errors: newErrors
            };
        });
    }, [fields]);

    const handleBlur = useCallback((name: string) => {
        setFormState((prev) => {
            const field = fields.find((f) => f.name === name);
            const newErrors = { ...prev.errors };

            if (field) {
                const error = validateField(prev.values[name], field.validation, field.required);
                if (error) {
                    newErrors[name] = error;
                } else {
                    delete newErrors[name];
                }
            }

            return {
                ...prev,
                touched: { ...prev.touched, [name]: true },
                errors: newErrors
            };
        });
    }, [fields]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = fields.reduce((acc, field) => {
            acc[field.name] = true;
            return acc;
        }, {} as Record<string, boolean>);

        // Validate all fields
        const errors = validateForm(formState.values, fields);

        setFormState((prev) => ({
            ...prev,
            touched: allTouched,
            errors
        }));

        // If no errors, submit
        if (Object.keys(errors).length === 0) {
            onSubmit(formState.values);
        }
    };

    return (
        <form className="dynamic-form" onSubmit={handleSubmit} noValidate>
            <div className="dynamic-form__fields">
                {fields.map((field) => (
                    <FormField
                        key={field.name}
                        config={field}
                        value={formState.values[field.name] || ''}
                        error={formState.errors[field.name]}
                        touched={formState.touched[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                ))}
            </div>
            <div className="dynamic-form__actions">
                {onCancel && (
                    <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>
                )}
                <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="btn__spinner"></span>
                            Saving...
                        </>
                    ) : (
                        submitLabel
                    )}
                </button>
            </div>
        </form>
    );
};
