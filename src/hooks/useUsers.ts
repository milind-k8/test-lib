import { useState, useEffect, useCallback } from 'react';
import type { User, UserInput } from '../types/user';
import { userService } from '../services/userService';

interface UseUsersState {
    users: User[];
    loading: boolean;
    error: string | null;
    saving: boolean;
}

interface UseUsersReturn extends UseUsersState {
    fetchUsers: () => Promise<void>;
    createUser: (user: UserInput) => Promise<void>;
    updateUser: (id: string, user: UserInput) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    clearError: () => void;
}

/**
 * Custom hook for managing user CRUD operations
 * Handles loading states, errors, and API calls
 */
export const useUsers = (): UseUsersReturn => {
    const [state, setState] = useState<UseUsersState>({
        users: [],
        loading: false,
        error: null,
        saving: false,
    });

    const fetchUsers = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const users = await userService.getAll();
            setState(prev => ({ ...prev, users, loading: false }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err.message : 'Failed to fetch users',
            }));
        }
    }, []);

    const createUser = useCallback(async (user: UserInput) => {
        setState(prev => {
            // Check phone number uniqueness against existing users
            const phoneExists = prev.users.some(u => u.phoneNumber === user.phoneNumber);
            if (phoneExists) {
                return { ...prev, saving: false, error: 'Phone number already exists. Please use a different phone number.' };
            }
            return { ...prev, saving: true, error: null };
        });

        // Check again after setState (need to access current state)
        const phoneExists = state.users.some(u => u.phoneNumber === user.phoneNumber);
        if (phoneExists) {
            throw new Error('Phone number already exists. Please use a different phone number.');
        }

        try {
            const newUser = await userService.create(user);
            setState(prev => ({
                ...prev,
                users: [...prev.users, newUser],
                saving: false,
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                saving: false,
                error: err instanceof Error ? err.message : 'Failed to create user',
            }));
            throw err;
        }
    }, [state.users]);

    const updateUser = useCallback(async (id: string, user: UserInput) => {
        // Check phone number uniqueness (exclude current user)
        const phoneExists = state.users.some(u => u.id !== id && u.phoneNumber === user.phoneNumber);
        if (phoneExists) {
            setState(prev => ({ ...prev, error: 'Phone number already exists. Please use a different phone number.' }));
            throw new Error('Phone number already exists. Please use a different phone number.');
        }

        setState(prev => ({ ...prev, saving: true, error: null }));
        try {
            const updatedUser = await userService.update(id, user);
            setState(prev => ({
                ...prev,
                users: prev.users.map(u => (u.id === id ? updatedUser : u)),
                saving: false,
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                saving: false,
                error: err instanceof Error ? err.message : 'Failed to update user',
            }));
            throw err;
        }
    }, [state.users]);

    const deleteUser = useCallback(async (id: string) => {
        setState(prev => ({ ...prev, saving: true, error: null }));
        try {
            await userService.delete(id);
            setState(prev => ({
                ...prev,
                users: prev.users.filter(u => u.id !== id),
                saving: false,
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                saving: false,
                error: err instanceof Error ? err.message : 'Failed to delete user',
            }));
            throw err;
        }
    }, []);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Load users on mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        ...state,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        clearError,
    };
};
