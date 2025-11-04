import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, User, BookOpen, CreditCard, Calendar } from 'lucide-react';
import Button from './Button';
import { formatCurrency } from '../../utils/helpers';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payment: PaymentFormData) => void;
}

export interface PaymentFormData {
  student_name: string;
  student_id: number;
  course_name: string;
  course_id: number;
  amount: number;
  payment_method: 'card' | 'paypal' | 'transfer' | 'cash';
  status: 'paid' | 'pending' | 'refunded';
}

interface Student {
  id: number;
  name: string;
  email: string;
}

interface Course {
  id: number;
  title: string;
  price: number | string;
}

const AddPaymentModal = ({ isOpen, onClose, onSubmit }: AddPaymentModalProps) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    student_name: '',
    student_id: 0,
    course_name: '',
    course_id: 0,
    amount: 0,
    payment_method: 'card',
    status: 'paid',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real students and courses from API
  useEffect(() => {
    if (isOpen) {
      fetchStudentsAndCourses();
    }
  }, [isOpen]);

  const fetchStudentsAndCourses = async () => {
    try {
      setLoading(true);
      const [studentsResponse, coursesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/students`, { headers: getAuthHeaders() }),
        axios.get(`${API_BASE_URL}/courses?all=true`, { headers: getAuthHeaders() }),
      ]);
      
      // Transform students data to include full name
      const transformedStudents = studentsResponse.data.map((s: any) => ({
        id: parseInt(s.id.replace(/[^0-9]/g, '')),
        name: `${s.firstName} ${s.lastName}`,
        email: s.email
      }));
      
      setStudents(transformedStudents);
      setCourses(coursesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.student_name) newErrors.student = 'Please select a student';
    if (!formData.course_name) newErrors.course = 'Please select a course';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose();
    setFormData({
      student_name: '',
      student_id: 1,
      course_name: '',
      course_id: 1,
      amount: 0,
      payment_method: 'card',
      status: 'paid',
    });
    setErrors({});
  };

  const handleStudentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = parseInt(e.target.value);
    console.log('Selected student ID:', studentId);
    
    const student = students.find(s => s.id === studentId);
    if (student) {
      setFormData({ ...formData, student_id: studentId, student_name: student.name });
      
      // Fetch enrolled courses for this student
      try {
        console.log('Fetching enrolled courses for student:', studentId);
        const response = await axios.get(
          `${API_BASE_URL}/admin/students/${studentId}/enrolled-courses`,
          { headers: getAuthHeaders() }
        );
        console.log('Enrolled courses response:', response.data);
        const enrolledCourseIds = response.data.enrolled_courses.map((c: any) => c.id);
        console.log('Enrolled course IDs:', enrolledCourseIds);
        setEnrolledCourses(enrolledCourseIds);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setEnrolledCourses([]);
      }
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = parseInt(e.target.value);
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const price = typeof course.price === 'string' ? parseFloat(course.price) : (course.price || 0);
      setFormData({ ...formData, course_id: courseId, course_name: course.title, amount: price });
    }
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
            <div className="bg-white dark:bg-secondary-light rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-lightGray dark:border-secondary-main">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-main dark:text-white">
                      Add New Payment
                    </h2>
                    <p className="text-sm text-neutral-gray">Enter payment details</p>
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
              {loading ? (
                <div className="p-6 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Student Selection */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      <User className="w-4 h-4" />
                      <span>Student</span>
                    </label>
                    <select
                      value={formData.student_id || ''}
                      onChange={handleStudentChange}
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                    >
                      <option value="">Select a student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.email})
                        </option>
                      ))}
                    </select>
                    {errors.student && (
                      <p className="text-red-500 text-sm mt-1">{errors.student}</p>
                    )}
                  </div>

                  {/* Course Selection */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Course</span>
                    </label>
                    <select
                      value={formData.course_id || ''}
                      onChange={handleCourseChange}
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                    >
                      <option value="">Select a course</option>
                      {courses.map(course => {
                        const isEnrolled = enrolledCourses.includes(course.id);
                        return (
                          <option 
                            key={course.id} 
                            value={course.id}
                            disabled={isEnrolled}
                            className={isEnrolled ? 'text-gray-400' : ''}
                          >
                            {course.title} - {formatCurrency(course.price)}
                            {isEnrolled ? ' (Already Enrolled)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {errors.course && (
                      <p className="text-red-500 text-sm mt-1">{errors.course}</p>
                    )}
                    {enrolledCourses.length > 0 && (
                      <p className="text-amber-600 dark:text-amber-400 text-xs mt-2">
                        ⚠️ Courses marked "Already Enrolled" cannot be selected
                      </p>
                    )}
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
                    {formData.amount > 0 && (
                      <p className="text-green-600 text-sm mt-1 font-semibold">
                        = {formatCurrency(formData.amount)}
                      </p>
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
                      <option value="card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Status</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-neutral-lightGray dark:border-secondary-main">
                    <Button type="submit" variant="primary" className="flex-1">
                      Add Payment
                    </Button>
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddPaymentModal;
