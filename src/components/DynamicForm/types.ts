// Validation pattern types
export type ValidationPattern = 'email' | 'phone' | 'url' | 'alphanumeric' | 'alpha';

// Validation rules for form fields
export interface ValidationRules {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: ValidationPattern | RegExp;
    maxDate?: 'today' | string;
    minDate?: string;
    custom?: (value: string) => string | null;
}

// Field types supported by the dynamic form
export type FieldType =
    | 'text'
    | 'email'
    | 'tel'
    | 'number'
    | 'date'
    | 'select'
    | 'textarea'
    | 'url';

// Select field option
export interface SelectOption {
    value: string;
    label: string;
}

// Configuration for a single form field
export interface FieldConfig {
    name: string;
    label: string;
    type: FieldType;
    required: boolean;
    placeholder?: string;
    validation?: ValidationRules;
    options?: SelectOption[];  // For select fields
    rows?: number;  // For textarea
    disabled?: boolean;
    defaultValue?: string;
}

// Form state with validation errors
export interface FormState {
    values: Record<string, string>;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
}
