import type { User, UserInput } from '../types/user';

// In Docker: uses nginx proxy at /api, locally: direct to json-server
const API_URL = import.meta.env.VITE_API_URL || '/api/users';

// Simulate network delay for better UX demonstration
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * User Service - Handles all API operations for users
 * Uses fetch API for REST operations
 */
export const userService = {
    /**
     * Get all users
     */
    async getAll(): Promise<User[]> {
        await delay(300); // Simulate network latency
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();
    },

    /**
     * Get a single user by ID
     */
    async getById(id: string): Promise<User> {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return response.json();
    },

    /**
     * Create a new user
     */
    async create(user: UserInput): Promise<User> {
        await delay(500); // Simulate network latency
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Failed to create user');
        }
        return response.json();
    },

    /**
     * Update an existing user
     */
    async update(id: string, user: UserInput): Promise<User> {
        await delay(500); // Simulate network latency
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        return response.json();
    },

    /**
     * Delete a user
     */
    async delete(id: string): Promise<void> {
        await delay(400); // Simulate network latency
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
    },
};
