import type { FieldConfig } from '../components/DynamicForm/types';

/**
 * User Form Configuration
 * 
 * EXTENSIBILITY: To add a new field, simply add a new entry to this array.
 * No changes needed to form components, API service, or UI components!
 * 
 * Example - Adding Date of Birth:
 * {
 *   name: 'dateOfBirth',
 *   label: 'Date of Birth',
 *   type: 'date',
 *   required: false,
 *   validation: { maxDate: 'today' }
 * }
 */
export const userFormConfig: FieldConfig[] = [
    {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'Enter first name',
        validation: {
            minLength: 2,
            maxLength: 50,
            pattern: 'alpha'
        }
    },
    {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'Enter last name',
        validation: {
            minLength: 2,
            maxLength: 50,
            pattern: 'alpha'
        }
    },
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'Enter email address',
        validation: {
            pattern: 'email'
        }
    },
    {
        name: 'phoneNumber',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        placeholder: 'Enter phone number (10 digits)',
        validation: {
            pattern: 'phone'
        }
    }
];

// Generate initial form values from config
export const getInitialFormValues = (config: FieldConfig[]): Record<string, string> => {
    return config.reduce((acc, field) => {
        acc[field.name] = field.defaultValue || '';
        return acc;
    }, {} as Record<string, string>);
};
