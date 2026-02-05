import type { ValidationRules, ValidationPattern } from '../components/DynamicForm/types';

// Pre-defined validation patterns
const PATTERNS: Record<ValidationPattern, RegExp> = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\d{10}$/,
    url: /^https?:\/\/.+/,
    alphanumeric: /^[a-zA-Z0-9\s]+$/,
    alpha: /^[a-zA-Z\s]+$/
};

// Pattern error messages
const PATTERN_MESSAGES: Record<ValidationPattern, string> = {
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid 10-digit phone number',
    url: 'Please enter a valid URL',
    alphanumeric: 'Only letters and numbers are allowed',
    alpha: 'Only letters are allowed'
};

/**
 * Validates a single field value against its validation rules
 * @returns Error message if invalid, null if valid
 */
export const validateField = (
    value: string,
    rules?: ValidationRules,
    required?: boolean
): string | null => {
    // Check required
    if (required && !value.trim()) {
        return 'This field is required';
    }

    // If not required and empty, skip other validations
    if (!value.trim()) {
        return null;
    }

    if (!rules) {
        return null;
    }

    // Check min length
    if (rules.minLength !== undefined && value.length < rules.minLength) {
        return `Must be at least ${rules.minLength} characters`;
    }

    // Check max length
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        return `Must be no more than ${rules.maxLength} characters`;
    }

    // Check min value (for numbers)
    if (rules.min !== undefined) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < rules.min) {
            return `Must be at least ${rules.min}`;
        }
    }

    // Check max value (for numbers)
    if (rules.max !== undefined) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue > rules.max) {
            return `Must be no more than ${rules.max}`;
        }
    }

    // Check pattern
    if (rules.pattern) {
        const pattern = typeof rules.pattern === 'string'
            ? PATTERNS[rules.pattern]
            : rules.pattern;

        if (pattern && !pattern.test(value)) {
            const message = typeof rules.pattern === 'string'
                ? PATTERN_MESSAGES[rules.pattern]
                : 'Invalid format';
            return message;
        }
    }

    // Check date constraints
    if (rules.maxDate) {
        const maxDate = rules.maxDate === 'today'
            ? new Date().toISOString().split('T')[0]
            : rules.maxDate;
        if (value > maxDate) {
            return `Date must be on or before ${rules.maxDate === 'today' ? 'today' : maxDate}`;
        }
    }

    if (rules.minDate) {
        if (value < rules.minDate) {
            return `Date must be on or after ${rules.minDate}`;
        }
    }

    // Custom validation
    if (rules.custom) {
        return rules.custom(value);
    }

    return null;
};

/**
 * Validates all form fields
 * @returns Object with field names as keys and error messages as values
 */
export const validateForm = (
    values: Record<string, string>,
    fields: { name: string; required?: boolean; validation?: ValidationRules }[]
): Record<string, string> => {
    const errors: Record<string, string> = {};

    fields.forEach(field => {
        const error = validateField(values[field.name] || '', field.validation, field.required);
        if (error) {
            errors[field.name] = error;
        }
    });

    return errors;
};
