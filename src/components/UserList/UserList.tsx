import React from 'react';
import type { User } from '../../types/user';
import { userFormConfig } from '../../config/userFormConfig';
import { Users, Pencil, Trash2, Loader2 } from 'lucide-react';
import './UserList.css';

interface UserListProps {
    users: User[];
    loading: boolean;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({
    users,
    loading,
    onEdit,
    onDelete
}) => {
    // Get field labels from config for dynamic table headers
    const displayFields = userFormConfig.map(field => ({
        key: field.name,
        label: field.label
    }));

    if (loading) {
        return (
            <div className="user-list__loading">
                <Loader2 className="user-list__spinner-icon" size={48} />
                <p>Loading users...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="user-list__empty">
                <div className="user-list__empty-icon">
                    <Users size={56} />
                </div>
                <h3>No users yet</h3>
                <p>Click "Add User" to create your first user</p>
            </div>
        );
    }

    return (
        <div className="user-list">
            <div className="user-list__table-container">
                <table className="user-list__table">
                    <thead>
                        <tr>
                            {displayFields.map(field => (
                                <th key={field.key}>{field.label}</th>
                            ))}
                            <th className="user-list__actions-header">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                {displayFields.map(field => (
                                    <td key={field.key} data-label={field.label}>
                                        {user[field.key] || '-'}
                                    </td>
                                ))}
                                <td className="user-list__actions">
                                    <button
                                        className="user-list__btn user-list__btn--edit"
                                        onClick={() => onEdit(user)}
                                        title="Edit user"
                                    >
                                        <Pencil size={14} /> Edit
                                    </button>
                                    <button
                                        className="user-list__btn user-list__btn--delete"
                                        onClick={() => onDelete(user)}
                                        title="Delete user"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
