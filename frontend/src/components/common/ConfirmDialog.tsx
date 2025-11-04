import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
}) => {
  const variantStyles = {
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-orange-600 dark:text-orange-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-secondary-dark rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-lightGray dark:border-secondary-main">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-opacity-10 ${variantStyles[variant]}`}>
                    <AlertTriangle className={`w-6 h-6 ${variantStyles[variant]}`} />
                  </div>
                  <h2 className="text-xl font-bold text-secondary-main dark:text-white">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onCancel}
                  className="p-2 rounded-lg hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-gray" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-neutral-darkGray dark:text-neutral-gray leading-relaxed">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-neutral-lightGray dark:border-secondary-main flex items-center justify-end space-x-3">
              <Button onClick={onCancel} variant="outline">
                {cancelText}
              </Button>
              <Button
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                variant="primary"
                className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
