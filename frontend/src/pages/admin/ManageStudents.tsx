import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  RotateCcw,
  X,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  BookOpen,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Student } from '../../types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const ManageStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletedStudents, setDeletedStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [showPassword, setShowPassword] = useState(false);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [studentCourses, setStudentCourses] = useState<number[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    location: '',
    password: '',
    status: 'active',
  });

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
    fetchDeletedStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setLoading(false);
    }
  };

  const fetchDeletedStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/students/deleted`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeletedStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch deleted students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/courses?all=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvailableCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchStudentCourses = async (studentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const numericId = parseInt(studentId.replace(/[^0-9]/g, ''));
      const response = await axios.get(
        `${API_BASE_URL}/admin/students/${numericId}/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudentCourses(response.data.map((c: any) => c.id));
    } catch (error) {
      console.error('Failed to fetch student courses:', error);
      setStudentCourses([]);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setModalMode('add');
    setCurrentStudent({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      location: '',
      password: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = async (student: Student) => {
    setModalMode('edit');
    setCurrentStudent(student);
    await fetchStudentCourses(student.id);
    setShowModal(true);
  };

  const handleOpenPreviewModal = (student: Student) => {
    setPreviewStudent(student);
    setShowPreviewModal(true);
  };

  const handleSaveStudent = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Prepare data - only send the fields we want to update
      const studentData = {
        firstName: currentStudent.firstName,
        lastName: currentStudent.lastName,
        email: currentStudent.email,
        phone: currentStudent.phone || '',
        address: currentStudent.address || '',
        location: currentStudent.location || '',
        ...(currentStudent.password && { password: currentStudent.password }), // Only include password if it's filled
      };
      
      console.log('Sending student data:', studentData);
      console.log('Current student state:', currentStudent);
      
      if (modalMode === 'add') {
        const response = await axios.post(
          `${API_BASE_URL}/admin/students`,
          studentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudents([...students, response.data.student]);
      } else {
        const response = await axios.put(
          `${API_BASE_URL}/admin/students/${currentStudent.id}`,
          studentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Update courses if in edit mode
        const numericId = parseInt(currentStudent.id!.replace(/[^0-9]/g, ''));
        await axios.put(
          `${API_BASE_URL}/admin/students/${numericId}/courses`,
          { course_ids: studentCourses },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Reload students to get updated course count from database
        await fetchStudents();
      }
      setShowModal(false);
    } catch (error: any) {
      console.error('Failed to save student:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || 'Failed to save student. Please try again.';
      const errors = error.response?.data?.errors;
      
      if (errors) {
        const errorDetails = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        alert(`Validation errors:\n${errorDetails}`);
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudentToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/students/${studentToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Reload both active and deleted students
      await fetchStudents();
      await fetchDeletedStudents();
    } catch (error) {
      console.error('Failed to delete student:', error);
      alert('Failed to delete student. Please try again.');
    } finally {
      setShowConfirmDialog(false);
      setStudentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setStudentToDelete(null);
  };

  const handleRestoreStudent = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const numericId = parseInt(id.replace(/[^0-9]/g, ''));
      
      await axios.post(
        `${API_BASE_URL}/admin/students/${numericId}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reload both active and deleted students
      await fetchStudents();
      await fetchDeletedStudents();
    } catch (error) {
      console.error('Failed to restore student:', error);
      alert('Failed to restore student. Please try again.');
    }
  };

  const handleToggleCourse = (courseId: number) => {
    setStudentCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

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
              Manage Students
            </h1>
            <p className="text-neutral-darkGray dark:text-neutral-gray">
              View, add, edit, and manage all students
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => setShowRestoreModal(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Restore ({deletedStudents.length})</span>
            </Button>
            <Button
              onClick={handleOpenAddModal}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Student</span>
            </Button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
            />
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-lightGray dark:border-secondary-main">
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      ID
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Phone
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Location
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Courses
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-neutral-lightGray dark:border-secondary-main hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-secondary-main dark:text-white font-semibold">
                        {student.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-main to-accent-cyan rounded-full flex items-center justify-center text-white font-bold">
                            {student.firstName[0]}
                            {student.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-secondary-main dark:text-white">
                              {student.firstName} {student.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-darkGray dark:text-neutral-gray">
                        {student.email}
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-darkGray dark:text-neutral-gray">
                        {student.phone}
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-darkGray dark:text-neutral-gray">
                        {student.location}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-darkGray dark:text-neutral-gray">
                        {student.enrolledCourses || 0}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenPreviewModal(student)}
                            className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 transition-colors"
                            title="Preview Student"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenEditModal(student)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
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
            )}
          </Card>
        </motion.div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-secondary-light rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-neutral-lightGray dark:border-secondary-main">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary-main dark:text-white">
                      {modalMode === 'add' ? 'Add New Student' : 'Edit Student'}
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 rounded-lg hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={currentStudent.firstName}
                        onChange={(e) =>
                          setCurrentStudent({
                            ...currentStudent,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={currentStudent.lastName}
                        onChange={(e) =>
                          setCurrentStudent({
                            ...currentStudent,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      <Mail className="w-4 h-4" />
                      <span>Email *</span>
                    </label>
                    <input
                      type="email"
                      value={currentStudent.email}
                      onChange={(e) =>
                        setCurrentStudent({
                          ...currentStudent,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      value={currentStudent.phone}
                      onChange={(e) =>
                        setCurrentStudent({
                          ...currentStudent,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      placeholder="+1234567890"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={currentStudent.address}
                      onChange={(e) =>
                        setCurrentStudent({
                          ...currentStudent,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>Location *</span>
                    </label>
                    <input
                      type="text"
                      value={currentStudent.location}
                      onChange={(e) =>
                        setCurrentStudent({
                          ...currentStudent,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      placeholder="New York, USA"
                    />
                  </div>

                  {/* Password */}
                  {modalMode === 'add' && (
                    <div>
                      <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={currentStudent.password}
                          onChange={(e) =>
                            setCurrentStudent({
                              ...currentStudent,
                              password: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 pr-12 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-primary-main transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      Status
                    </label>
                    <select
                      value={currentStudent.status}
                      onChange={(e) =>
                        setCurrentStudent({
                          ...currentStudent,
                          status: e.target.value as 'active' | 'inactive' | 'suspended',
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  {/* Courses Management (Edit Mode Only) */}
                  {modalMode === 'edit' && (
                    <div className="col-span-2">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-3">
                        <BookOpen className="w-4 h-4" />
                        <span>Enrolled Courses ({studentCourses.length})</span>
                      </label>
                      <div className="bg-neutral-offWhite dark:bg-secondary-dark/50 rounded-xl p-4 max-h-64 overflow-y-auto border border-neutral-gray/20 dark:border-secondary-main">
                        {availableCourses.length === 0 ? (
                          <p className="text-center text-neutral-gray text-sm py-4">No courses available</p>
                        ) : (
                          <div className="space-y-2">
                            {availableCourses.map((course) => (
                              <label
                                key={course.id}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                                  studentCourses.includes(course.id)
                                    ? 'bg-primary-main/10 border-2 border-primary-main'
                                    : 'bg-white dark:bg-secondary-dark border-2 border-transparent hover:border-primary-main/30'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={studentCourses.includes(course.id)}
                                  onChange={() => handleToggleCourse(course.id)}
                                  className="w-5 h-5 rounded border-neutral-gray text-primary-main focus:ring-2 focus:ring-primary-main"
                                />
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-semibold text-secondary-main dark:text-white">
                                    {course.title}
                                  </p>
                                  <p className="text-xs text-neutral-gray mt-0.5">
                                    {course.description || 'No description'}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-neutral-lightGray dark:border-secondary-main flex items-center justify-end space-x-4">
                  <Button onClick={() => setShowModal(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveStudent} variant="primary">
                    {modalMode === 'add' ? 'Add Student' : 'Save Changes'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Restore Modal */}
        <AnimatePresence>
          {showRestoreModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowRestoreModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-secondary-light rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-neutral-lightGray dark:border-secondary-main">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary-main dark:text-white">
                      Restore Deleted Students
                    </h2>
                    <button
                      onClick={() => setShowRestoreModal(false)}
                      className="p-2 rounded-lg hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {deletedStudents.length === 0 ? (
                    <div className="text-center py-12">
                      <RotateCcw className="w-16 h-16 mx-auto mb-4 text-neutral-gray" />
                      <p className="text-neutral-gray">No deleted students to restore</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {deletedStudents.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-4 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-main to-accent-cyan rounded-full flex items-center justify-center text-white font-bold">
                              {student.firstName[0]}
                              {student.lastName[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-secondary-main dark:text-white">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-sm text-neutral-gray">
                                {student.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleRestoreStudent(student.id)}
                            variant="primary"
                            className="flex items-center space-x-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Restore</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Student Modal */}
        <AnimatePresence>
          {showPreviewModal && previewStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreviewModal(false)}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-secondary-light rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-neutral-lightGray dark:border-secondary-main bg-gradient-to-r from-primary-main to-accent-cyan">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      Student Details
                    </h2>
                    <button
                      onClick={() => setShowPreviewModal(false)}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Student Avatar & Basic Info */}
                  <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-neutral-lightGray dark:border-secondary-main">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-main to-accent-cyan rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {previewStudent.firstName[0]}{previewStudent.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-secondary-main dark:text-white mb-1">
                        {previewStudent.firstName} {previewStudent.lastName}
                      </h3>
                      <p className="text-neutral-gray text-sm mb-2">ID: {previewStudent.id}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          previewStudent.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}
                      >
                        {previewStudent.status}
                      </span>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 mb-6">
                    <h4 className="text-lg font-bold text-secondary-main dark:text-white mb-4">
                      Contact Information
                    </h4>
                    
                    <div className="flex items-start space-x-3 p-4 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl">
                      <Mail className="w-5 h-5 text-primary-main mt-0.5" />
                      <div>
                        <p className="text-xs text-neutral-gray mb-1">Email</p>
                        <p className="text-sm font-semibold text-secondary-main dark:text-white">
                          {previewStudent.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl">
                      <Phone className="w-5 h-5 text-primary-main mt-0.5" />
                      <div>
                        <p className="text-xs text-neutral-gray mb-1">Phone Number</p>
                        <p className="text-sm font-semibold text-secondary-main dark:text-white">
                          {previewStudent.phone || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl">
                      <MapPin className="w-5 h-5 text-primary-main mt-0.5" />
                      <div>
                        <p className="text-xs text-neutral-gray mb-1">Address</p>
                        <p className="text-sm font-semibold text-secondary-main dark:text-white">
                          {previewStudent.address || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl">
                      <MapPin className="w-5 h-5 text-primary-main mt-0.5" />
                      <div>
                        <p className="text-xs text-neutral-gray mb-1">Location</p>
                        <p className="text-sm font-semibold text-secondary-main dark:text-white">
                          {previewStudent.location || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-secondary-main dark:text-white mb-4">
                      Academic Information
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-primary-main/10 to-accent-cyan/10 dark:from-primary-main/20 dark:to-accent-cyan/20 rounded-xl">
                        <p className="text-xs text-neutral-gray mb-1">Enrolled Courses</p>
                        <p className="text-2xl font-bold text-primary-main">
                          {previewStudent.enrolledCourses || 0}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                        <p className="text-xs text-neutral-gray mb-1">First Login</p>
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">
                          {previewStudent.firstLoginDate || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 mt-6 pt-6 border-t border-neutral-lightGray dark:border-secondary-main">
                    <Button 
                      onClick={() => {
                        setShowPreviewModal(false);
                        handleOpenEditModal(previewStudent);
                      }}
                      variant="primary" 
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Student
                    </Button>
                    <Button 
                      onClick={() => setShowPreviewModal(false)}
                      variant="secondary" 
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title="Delete Student"
          message="Are you sure you want to delete this student? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default ManageStudents;
