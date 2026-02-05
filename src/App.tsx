import { useState, useCallback } from 'react';
import type { User, UserInput } from './types/user';
import { useUsers } from './hooks/useUsers';
import { userFormConfig } from './config/userFormConfig';
import { DynamicForm } from './components/DynamicForm';
import { UserList } from './components/UserList';
import { Modal, Toast, ConfirmDialog } from './components/ui';
import type { ToastType } from './components/ui';
import { Users, UserPlus } from 'lucide-react';
import './App.css';

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

function App() {
  const { users, loading, saving, createUser, updateUser, deleteUser } = useUsers();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Confirm dialog state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Handler for opening create modal
  const handleAddUser = useCallback(() => {
    setEditingUser(null);
    setIsModalOpen(true);
  }, []);

  // Handler for opening edit modal
  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }, []);

  // Handler for closing modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(null);
  }, []);

  // Handler for form submission
  const handleSubmit = useCallback(async (values: Record<string, string>) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values as UserInput);
        showToast('User updated successfully!', 'success');
      } else {
        await createUser(values as UserInput);
        showToast('User created successfully!', 'success');
      }
      handleCloseModal();
    } catch {
      showToast('An error occurred. Please try again.', 'error');
    }
  }, [editingUser, createUser, updateUser, handleCloseModal, showToast]);

  // Handler for initiating delete
  const handleDeleteClick = useCallback((user: User) => {
    setUserToDelete(user);
  }, []);

  // Handler for confirming delete
  const handleConfirmDelete = useCallback(async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      showToast('User deleted successfully!', 'success');
      setUserToDelete(null);
    } catch {
      showToast('Failed to delete user. Please try again.', 'error');
    }
  }, [userToDelete, deleteUser, showToast]);

  // Handler for canceling delete
  const handleCancelDelete = useCallback(() => {
    setUserToDelete(null);
  }, []);

  // Get initial values for edit form
  const getInitialValues = (): Record<string, string> | undefined => {
    if (!editingUser) return undefined;
    const values: Record<string, string> = {};
    userFormConfig.forEach(field => {
      values[field.name] = editingUser[field.name] || '';
    });
    return values;
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <div className="app__logo">
            <div className="app__logo-icon"><Users size={24} /></div>
            <h1 className="app__title">User Management</h1>
          </div>
          <button className="app__add-btn" onClick={handleAddUser}>
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </header>

      <main className="app__main">
        <div className="app__container">
          <div className="app__stats">
            <div className="app__stat-card">
              <span className="app__stat-number">{users.length}</span>
              <span className="app__stat-label">Total Users</span>
            </div>
          </div>

          <UserList
            users={users}
            loading={loading}
            onEdit={handleEditUser}
            onDelete={handleDeleteClick}
          />
        </div>
      </main>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <DynamicForm
          fields={userFormConfig}
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          submitLabel={editingUser ? 'Update' : 'Create'}
          isLoading={saving}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={saving}
        variant="danger"
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;
