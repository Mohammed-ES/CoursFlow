import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Search,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Calendar,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import AddPaymentModal, { PaymentFormData } from '../../components/common/AddPaymentModal';
import EditPaymentModal, { EditPaymentFormData } from '../../components/common/EditPaymentModal';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import AlertDialog from '../../components/common/AlertDialog';
import PaymentAnalyticsChart from '../../components/charts/PaymentAnalyticsChart';
import { adminService, Payment as PaymentType, PaymentStats } from '../../services/adminService';
import { formatCurrency } from '../../utils/helpers';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const Payments = () => {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'error' | 'warning' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const [paymentsData, statsData] = await Promise.all([
        adminService.getAllPayments(),
        adminService.getPaymentStats(),
      ]);
      setPayments(paymentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statsCards = stats ? [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Paid',
      value: stats.paidCount.toString(),
      icon: CheckCircle,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Pending',
      value: stats.pendingCount.toString(),
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Failed',
      value: stats.failedCount.toString(),
      icon: XCircle,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ] : [];

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Student,Course,Amount,Date,Status,Payment Method,Transaction ID\n' +
      payments
        .map((p) => {
          const date = p.payment_date 
            ? new Date(p.payment_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })
            : 'N/A';
          
          return `${p.id},"${p.student_name}","${p.course_name}",${p.amount},"${date}",${p.status},"${p.payment_method || 'N/A'}","${p.transaction_id}"`;
        })
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'payments_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddPayment = async (formData: PaymentFormData) => {
    try {
      const payload = {
        user_id: formData.student_id,
        course_id: formData.course_id,
        amount_paid: formData.amount,
        payment_status: formData.status,
        payment_method: formData.payment_method,
      };
      
      console.log('Sending payment data:', payload);
      
      const response = await axios.post(
        `${API_BASE_URL}/admin/payments`,
        payload,
        { headers: getAuthHeaders() }
      );
      
      console.log('Payment created:', response.data);
      
      // Reload payments after adding
      await loadPayments();
      setShowAddModal(false);
      
      // Show success message
      setAlertDialog({
        isOpen: true,
        title: 'Success',
        message: 'Payment created successfully!',
        variant: 'success',
      });
    } catch (error: any) {
      console.error('Error adding payment:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Failed to add payment. Please try again.';
      
      // Show error dialog
      setAlertDialog({
        isOpen: true,
        title: 'Error',
        message: errorMsg,
        variant: 'error',
      });
    }
  };

  const handleDeletePayment = async () => {
    if (selectedPayment) {
      try {
        await axios.delete(
          `${API_BASE_URL}/admin/payments/${selectedPayment.id}`,
          { headers: getAuthHeaders() }
        );
        
        // Reload payments after deleting
        await loadPayments();
        setSelectedPayment(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Failed to delete payment. Please try again.');
      }
    }
  };

  const handleEditClick = (payment: PaymentType) => {
    setSelectedPayment(payment);
    setShowEditModal(true);
  };

  const handleEditPayment = async (paymentId: number, formData: EditPaymentFormData) => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/payments/${paymentId}`,
        {
          amount_paid: formData.amount,
          payment_method: formData.payment_method,
          payment_status: formData.status,
        },
        { headers: getAuthHeaders() }
      );
      
      // Reload payments after updating
      await loadPayments();
      setShowEditModal(false);
      setSelectedPayment(null);
      
      // Show success message
      setAlertDialog({
        isOpen: true,
        title: 'Success',
        message: 'Payment updated successfully!',
        variant: 'success',
      });
    } catch (error: any) {
      console.error('Error updating payment:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update payment. Please try again.';
      
      // Show error dialog
      setAlertDialog({
        isOpen: true,
        title: 'Error',
        message: errorMsg,
        variant: 'error',
      });
    }
  };

  const handleDeleteClick = (payment: PaymentType) => {
    setSelectedPayment(payment);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-secondary-main dark:text-white mb-2">
              Payments
            </h1>
            <p className="text-neutral-darkGray dark:text-neutral-gray">
              Track and manage all student payments
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Payment</span>
            </Button>
            <Button
              onClick={handleExport}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="relative overflow-hidden">
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full -mr-16 -mt-16`}
                  ></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-neutral-darkGray dark:text-neutral-gray text-sm mb-1">
                          {stat.title}
                        </p>
                        <h3 className="text-3xl font-bold text-secondary-main dark:text-white">
                          {stat.value}
                        </h3>
                      </div>
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
            <input
              type="text"
              placeholder="Search by student, course, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <Card>
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-neutral-lightGray dark:border-secondary-main">
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Transaction ID
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Student
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Course
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Amount
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Payment Method
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-neutral-lightGray dark:border-secondary-main hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-secondary-main dark:text-white font-mono">
                        {payment.transaction_id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-main to-accent-cyan rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {payment.student_name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-secondary-main dark:text-white">
                              {payment.student_name}
                            </p>
                            <p className="text-xs text-neutral-gray">
                              #{payment.student_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-secondary-main dark:text-white font-medium max-w-xs truncate">
                          {payment.course_name}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2 text-sm text-neutral-darkGray dark:text-neutral-gray">
                          <Calendar className="w-4 h-4" />
                          <span>{payment.payment_date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-darkGray dark:text-neutral-gray">
                        {payment.payment_method}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {payment.status === 'completed' && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {payment.status === 'pending' && (
                            <Clock className="w-3 h-3" />
                          )}
                          {payment.status === 'failed' && (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span className="capitalize">{payment.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditClick(payment)}
                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                            title="Edit payment"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteClick(payment)}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                            title="Delete payment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Payment Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-6">
              Analyse des Paiements
            </h3>
            <PaymentAnalyticsChart payments={payments} />
          </Card>
        </motion.div>
      </div>

      {/* Modals */}
      <AddPaymentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddPayment}
      />

      <EditPaymentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPayment(null);
        }}
        onSubmit={handleEditPayment}
        payment={selectedPayment}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPayment(null);
        }}
        onConfirm={handleDeletePayment}
        title="Delete Payment"
        message="Are you sure you want to delete this payment? This action cannot be undone."
        itemName={selectedPayment ? `${selectedPayment.transaction_id} - ${formatCurrency(selectedPayment.amount)}` : ''}
      />

      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
      />
    </AdminLayout>
  );
};

export default Payments;
