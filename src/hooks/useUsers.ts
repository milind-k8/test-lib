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
        setState(prev => ({ ...prev, saving: true, error: null }));
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
    }, []);

    const updateUser = useCallback(async (id: string, user: UserInput) => {
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
    }, []);

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
