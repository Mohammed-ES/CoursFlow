import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, User, BookOpen, CreditCard, CheckCircle } from 'lucide-react';
import Button from './Button';
import { formatCurrency } from '../../utils/helpers';

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentId: number, data: EditPaymentFormData) => void;
  payment: {
    id: number;
    student_name: string;
    course_name: string;
    amount: number;
    payment_method: string;
    status: string;
  } | null;
}

export interface EditPaymentFormData {
  amount: number;
  payment_method: 'card' | 'paypal' | 'transfer' | 'cash';
  status: 'paid' | 'pending' | 'failed';
}

const EditPaymentModal = ({ isOpen, onClose, onSubmit, payment }: EditPaymentModalProps) => {
  const [formData, setFormData] = useState<EditPaymentFormData>({
    amount: 0,
    payment_method: 'card',
    status: 'paid',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (payment && isOpen) {
      setFormData({
        amount: payment.amount,
        payment_method: payment.payment_method as any,
        status: payment.status === 'completed' ? 'paid' : (payment.status as any),
      });
    }
  }, [payment, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (payment) {
      onSubmit(payment.id, formData);
    }
    onClose();
    setErrors({});
  };

  if (!payment) return null;

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
            <div className="bg-white dark:bg-secondary-light rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-lightGray dark:border-secondary-main">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-main dark:text-white">
                      Edit Payment
                    </h2>
                    <p className="text-sm text-neutral-gray">Update payment details</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-gray" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Student Info (Read-only) */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-gray dark:text-neutral-lightGray mb-2">
                      <User className="w-4 h-4" />
                      <span>Student</span>
                    </label>
                    <div className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl text-secondary-main dark:text-white">
                      {payment.student_name}
                    </div>
                  </div>

                  {/* Course Info (Read-only) */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-gray dark:text-neutral-lightGray mb-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Course</span>
                    </label>
                    <div className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl text-secondary-main dark:text-white">
                      {payment.course_name}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Amount (DH)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Payment Method</span>
                    </label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as any })}
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Payment Status</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-8">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Update Payment
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditPaymentModal;
