import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import Button from './Button';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
}

const AlertDialog = ({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info',
}: AlertDialogProps) => {
  const variantStyles = {
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

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

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-secondary-light rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header with Icon */}
              <div className={`${style.bgColor} ${style.borderColor} border-b p-6`}>
                <div className="flex items-start space-x-4">
                  <div className={`${style.iconColor} flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-secondary-main dark:text-white">
                      {title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-neutral-gray dark:text-neutral-lightGray">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 p-6 pt-0">
                <Button
                  onClick={onClose}
                  variant="primary"
                >
                  OK
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertDialog;
