import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  BookOpen,
  Filter,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Teacher } from '../../types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [showPassword, setShowPassword] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Partial<Teacher>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    location: '',
    password: '',
    subject: '',
    specialization: '',
    experience: 0,
    status: 'active',
  });

  const subjects = [
    'All Subjects',
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'Mobile Development',
    'AI & Machine Learning',
    'Business & Marketing',
    'Photography',
    'Languages',
  ];

  // Fetch teachers from API
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/teachers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeachers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject =
      selectedSubject === 'all' || teacher.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  const handleOpenAddModal = () => {
    setModalMode('add');
    setCurrentTeacher({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      location: '',
      password: '',
      subject: '',
      specialization: '',
      experience: 0,
      status: 'active',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    setModalMode('edit');
    setCurrentTeacher(teacher);
    setShowModal(true);
  };

  const handleSaveTeacher = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const teacherData = {
        firstName: currentTeacher.firstName,
        lastName: currentTeacher.lastName,
        email: currentTeacher.email,
        phone: currentTeacher.phone || '',
        address: currentTeacher.address || '',
        location: currentTeacher.location || '',
        subject: currentTeacher.subject || '',
        specialization: currentTeacher.specialization || '',
        experience: currentTeacher.experience || 0,
        ...(currentTeacher.password && { password: currentTeacher.password }),
      };
      
      if (modalMode === 'add') {
        const response = await axios.post(
          `${API_BASE_URL}/admin/teachers`,
          teacherData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await fetchTeachers(); // Reload teachers
      } else {
        await axios.put(
          `${API_BASE_URL}/admin/teachers/${currentTeacher.id}`,
          teacherData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await fetchTeachers(); // Reload teachers
      }
      setShowModal(false);
    } catch (error: any) {
      console.error('Failed to save teacher:', error);
      alert(error.response?.data?.message || 'Failed to save teacher. Please try again.');
    }
  };

  const handleDeleteTeacher = (id: string) => {
    setTeacherToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!teacherToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/teachers/${teacherToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchTeachers(); // Reload teachers
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      alert('Failed to delete teacher. Please try again.');
    } finally {
      setShowConfirmDialog(false);
      setTeacherToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setTeacherToDelete(null);
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
              Manage Teachers
            </h1>
            <p className="text-neutral-darkGray dark:text-neutral-gray">
              View, add, edit, and manage all teachers
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Teacher</span>
          </Button>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
            />
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white appearance-none cursor-pointer"
            >
              {subjects.map((subject) => (
                <option
                  key={subject}
                  value={subject === 'All Subjects' ? 'all' : subject}
                >
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Teachers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-gray">No teachers found</p>
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
                      Teacher
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Subject
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Experience
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Students
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Status
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-bold text-secondary-main dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher, index) => (
                    <motion.tr
                      key={teacher.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-neutral-lightGray dark:border-secondary-main hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-secondary-main dark:text-white font-semibold">
                        {teacher.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {teacher.firstName[0]}
                            {teacher.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-secondary-main dark:text-white">
                              {teacher.firstName} {teacher.lastName}
                            </p>
                            <p className="text-xs text-neutral-gray">
                              {teacher.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-darkGray dark:text-neutral-gray">
                        {teacher.email}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-primary-main" />
                          <span className="text-sm font-semibold text-secondary-main dark:text-white">
                            {teacher.subject}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-darkGray dark:text-neutral-gray">
                        {teacher.experience ? `${teacher.experience} years` : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-darkGray dark:text-neutral-gray">
                        {teacher.studentsCount}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            teacher.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}
                        >
                          {teacher.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenEditModal(teacher)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTeacher(teacher.id)}
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
                      {modalMode === 'add' ? 'Add New Teacher' : 'Edit Teacher'}
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
                        value={currentTeacher.firstName}
                        onChange={(e) =>
                          setCurrentTeacher({
                            ...currentTeacher,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                        placeholder="Angela"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={currentTeacher.lastName}
                        onChange={(e) =>
                          setCurrentTeacher({
                            ...currentTeacher,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                        placeholder="Yu"
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
                      value={currentTeacher.email}
                      onChange={(e) =>
                        setCurrentTeacher({
                          ...currentTeacher,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      placeholder="teacher@coursflow.com"
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
                      value={currentTeacher.phone}
                      onChange={(e) =>
                        setCurrentTeacher({
                          ...currentTeacher,
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
                      value={currentTeacher.address}
                      onChange={(e) =>
                        setCurrentTeacher({
                          ...currentTeacher,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      placeholder="123 Education St"
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
                      value={currentTeacher.location}
                      onChange={(e) =>
                        setCurrentTeacher({
                          ...currentTeacher,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      placeholder="San Francisco, USA"
                    />
                  </div>

                  {/* Subject & Specialization */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-secondary-main dark:text-white mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Subject *</span>
                      </label>
                      <input
                        type="text"
                        value={currentTeacher.subject}
                        onChange={(e) =>
                          setCurrentTeacher({
                            ...currentTeacher,
                            subject: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                        placeholder="e.g., Mathematics, Physics, Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                        Experience (years)
                      </label>
                      <input
                        type="number"
                        value={currentTeacher.experience || 0}
                        onChange={(e) =>
                          setCurrentTeacher({
                            ...currentTeacher,
                            experience: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                        placeholder="5"
                      />
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={currentTeacher.specialization}
                      onChange={(e) =>
                        setCurrentTeacher({
                          ...currentTeacher,
                          specialization: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      placeholder="e.g., Full Stack Development"
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
                          value={currentTeacher.password}
                          onChange={(e) =>
                            setCurrentTeacher({
                              ...currentTeacher,
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
                      value={currentTeacher.status}
                      onChange={(e) =>
                        setCurrentTeacher({
                          ...currentTeacher,
                          status: e.target.value as 'active' | 'inactive',
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 border-t border-neutral-lightGray dark:border-secondary-main flex items-center justify-end space-x-4">
                  <Button onClick={() => setShowModal(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveTeacher} variant="primary">
                    {modalMode === 'add' ? 'Add Teacher' : 'Save Changes'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title="Delete Teacher"
          message="Are you sure you want to delete this teacher? This action cannot be undone."
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

export default ManageTeachers;
