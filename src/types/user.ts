// User type definition
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    [key: string]: string; // Allow additional dynamic fields
}

export type UserInput = Omit<User, 'id'>;

export type UserFormData = Partial<UserInput>;
