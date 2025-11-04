import { toast, ToastOptions } from 'react-toastify';

// Default toast configuration
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
};

// Success notification
export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

// Error notification
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

// Warning notification
export const showWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    ...defaultOptions,
    ...options,
  });
};

// Info notification
export const showInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

// Loading notification
export const showLoading = (message: string = 'Loading...') => {
  return toast.loading(message, {
    position: 'top-right',
    theme: 'light',
  });
};

// Update loading notification
export const updateLoading = (
  toastId: any,
  type: 'success' | 'error' | 'info' | 'warning',
  message: string
) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
  });
};

// Promise notification (for async operations)
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    pending: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(
    promise,
    {
      pending: messages.pending,
      success: messages.success,
      error: messages.error,
    },
    defaultOptions
  );
};

export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  updateLoading,
  promise: showPromise,
};
