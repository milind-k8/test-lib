import React from 'react';
import { AlertTriangle, Zap, Info } from 'lucide-react';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    variant?: 'danger' | 'warning' | 'info';
}

const ICONS: Record<string, React.ReactNode> = {
    danger: <AlertTriangle size={32} />,
    warning: <Zap size={32} />,
    info: <Info size={32} />
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    isLoading = false,
    variant = 'danger'
}) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div
                className="confirm-dialog"
                onClick={(e) => e.stopPropagation()}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-message"
            >
                <div className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}>
                    {ICONS[variant]}
                </div>
                <h3 id="confirm-title" className="confirm-dialog__title">{title}</h3>
                <p id="confirm-message" className="confirm-dialog__message">{message}</p>
                <div className="confirm-dialog__actions">
                    <button
                        className="confirm-btn confirm-btn--secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={`confirm-btn confirm-btn--${variant}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
