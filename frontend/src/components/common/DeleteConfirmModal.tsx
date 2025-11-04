import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
}: DeleteConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-secondary-light rounded-2xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-lightGray dark:border-secondary-main">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-secondary-main dark:text-white">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-gray" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-neutral-darkGray dark:text-neutral-gray mb-4">
                  {message}
                </p>
                {itemName && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30">
                    <p className="text-sm text-red-800 dark:text-red-400 font-semibold">
                      {itemName}
                    </p>
                  </div>
                )}
                <p className="text-sm text-neutral-gray mt-4">
                  This action cannot be undone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 p-6 border-t border-neutral-lightGray dark:border-secondary-main">
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
                <Button onClick={onClose} variant="secondary" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
