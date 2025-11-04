import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Edit2, Trash2, X, Upload, FileText, Video, Image as ImageIcon, File, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TeacherLayout from '../../components/layout/TeacherLayout';
import ConfirmModal from '../../components/common/ConfirmModal';
import teacherAPI from '../../services/teacherAPI';
import { ToastContainer } from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  level: string;
  price: number;
  duration_hours?: number;
  start_date: string;
  end_date: string;
  max_students: number;
  enrolled_count: number;
  materials_count: number;
  status: 'draft' | 'published' | 'archived';
}

interface Material {
  id: number;
  title: string;
  type: 'pdf' | 'video' | 'image' | 'document';
  file_path: string;
  file_size: number;
  uploaded_at: string;
}

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteMaterialModal, setShowDeleteMaterialModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { toasts, removeToast, success, error: showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    level: 'beginner',
    price: 0,
    duration_hours: 10,
    start_date: '',
    end_date: '',
    max_students: 30,
    status: 'draft' as Course['status'],
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getCourses({});
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setSelectedCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        subject: course.subject,
        level: course.level,
        price: course.price,
        duration_hours: course.duration_hours || 10,
        start_date: course.start_date,
        end_date: course.end_date,
        max_students: course.max_students,
        status: course.status,
      });
    } else {
      setSelectedCourse(null);
      setFormData({
        title: '',
        description: '',
        subject: '',
        level: 'beginner',
        price: 0,
        duration_hours: 10,
        start_date: '',
        end_date: '',
        max_students: 30,
        status: 'draft',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCourse) {
        await teacherAPI.updateCourse(selectedCourse.id, formData);
      } else {
        await teacherAPI.createCourse(formData);
      }
      setShowModal(false);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      showError('Erreur lors de la sauvegarde du cours.');
    }
  };

  const handleDelete = async (id: number) => {
    setCourseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (courseToDelete === null) return;
    
    try {
      await teacherAPI.deleteCourse(courseToDelete);
      setShowDeleteModal(false);
      setCourseToDelete(null);
      // Rafraîchir la liste immédiatement
      await fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      showError('Erreur lors de la suppression du cours');
    }
  };

  const handleOpenMaterialsModal = async (course: Course) => {
    setSelectedCourse(course);
    setShowMaterialsModal(true);
    try {
      const response = await teacherAPI.getCourseMaterials(course.id);
      console.log('Materials response:', response);
      setMaterials(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedCourse) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('description', `Uploaded on ${new Date().toLocaleDateString()}`);
    formData.append('is_public', '1');

    try {
      setUploadingFile(true);
      console.log('Uploading file for course:', selectedCourse.id);
      const response = await teacherAPI.uploadCourseMaterial(selectedCourse.id, formData);
      console.log('Upload response:', response);
      
      // Recharger les matériaux
      const materialsResponse = await teacherAPI.getCourseMaterials(selectedCourse.id);
      setMaterials(Array.isArray(materialsResponse.data) ? materialsResponse.data : []);
      
      // Reset input
      e.target.value = '';
      success('✅ Fichier uploadé avec succès!');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Erreur lors de l\'upload du fichier.';
      showError('❌ ' + errorMsg);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (!selectedCourse) return;
    setMaterialToDelete(materialId);
    setShowDeleteMaterialModal(true);
  };

  const confirmDeleteMaterial = async () => {
    if (!selectedCourse || !materialToDelete) return;

    try {
      await teacherAPI.deleteCourseMaterial(selectedCourse.id, materialToDelete);
      const response = await teacherAPI.getCourseMaterials(selectedCourse.id);
      setMaterials(response.data);
      success('✅ Matériel supprimé avec succès!');
      setShowDeleteMaterialModal(false);
      setMaterialToDelete(null);
    } catch (error) {
      console.error('Error deleting material:', error);
      showError('❌ Erreur lors de la suppression du matériel');
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success-light/20 text-success-main';
      case 'draft':
        return 'bg-warning-light/20 text-warning-main';
      case 'archived':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-secondary-main dark:text-white mb-2">
              Courses Management
            </h1>
            <p className="text-neutral-darkGray dark:text-neutral-gray">
              Manage your courses and materials ({courses.length} courses)
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-main to-accent-cyan text-white rounded-xl
              hover:shadow-lg transition-all font-semibold"
            type="button"
          >
            <Plus className="w-5 h-5" />
            Create Course
          </motion.button>
        </motion.div>

        {/* Courses Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No courses created yet</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Materials
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {courses.map((course, index) => (
                    <motion.tr
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* Course Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-main to-secondary-main
                            flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {course.duration_hours || 0}h duration
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">{course.subject}</span>
                      </td>

                      {/* Level */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded capitalize">
                          {course.level}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-semibold text-success-main">
                          {course.price} DH
                        </span>
                      </td>

                      {/* Students */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1 text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">{course.enrolled_count}</span>
                          <span className="text-gray-500 dark:text-gray-400">/</span>
                          <span className="text-gray-500 dark:text-gray-400">{course.max_students}</span>
                        </div>
                      </td>

                      {/* Materials */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                          bg-primary-light/20 text-primary-main">
                          <FileText className="w-3 h-3" />
                          {course.materials_count || 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                          <span className={`w-2 h-2 rounded-full ${
                            course.status === 'published' ? 'bg-success-main' :
                            course.status === 'draft' ? 'bg-warning-main' : 'bg-gray-400'
                          }`}></span>
                          {course.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/teacher/courses/${course.id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-primary-main hover:text-primary-dark
                              hover:bg-primary-light/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenModal(course)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenMaterialsModal(course)}
                            className="p-2 text-secondary-main dark:text-secondary-light hover:bg-secondary-light/10 rounded-lg transition-colors"
                            title="Materials"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="p-2 text-error-main hover:bg-error-light/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Course Modal */}
        {showModal && createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedCourse ? 'Edit Course' : 'Create New Course'}
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                          focus:ring-2 focus:ring-primary-main focus:border-transparent
                          dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                          focus:ring-2 focus:ring-primary-main focus:border-transparent
                          dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Subject *
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            focus:ring-2 focus:ring-primary-main focus:border-transparent
                            dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Level *
                        </label>
                        <select
                          value={formData.level}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            focus:ring-2 focus:ring-primary-main focus:border-transparent
                            dark:bg-gray-700 dark:text-white"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Price (DH)
                        </label>
                        <input
                          type="number"
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            focus:ring-2 focus:ring-primary-main focus:border-transparent
                            dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Duration (Hours) *
                        </label>
                        <input
                          type="number"
                          value={formData.duration_hours || ''}
                          onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value ? parseInt(e.target.value) : 10 })}
                          min="1"
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            focus:ring-2 focus:ring-primary-main focus:border-transparent
                            dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Max Students
                        </label>
                        <input
                          type="number"
                          value={formData.max_students || ''}
                          onChange={(e) => setFormData({ ...formData, max_students: e.target.value ? parseInt(e.target.value) : 30 })}
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            focus:ring-2 focus:ring-primary-main focus:border-transparent
                            dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            focus:ring-2 focus:ring-primary-main focus:border-transparent
                            dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            focus:ring-2 focus:ring-primary-main focus:border-transparent
                            dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Course['status'] })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                          focus:ring-2 focus:ring-primary-main focus:border-transparent
                          dark:bg-gray-700 dark:text-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                          hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-main text-white rounded-lg
                          hover:bg-primary-dark transition-colors"
                      >
                        {selectedCourse ? 'Update' : 'Create'} Course
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

        {/* Materials Modal */}
        {showMaterialsModal && selectedCourse && createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
              onClick={() => setShowMaterialsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Course Materials
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {selectedCourse.title}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowMaterialsModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Upload Section */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700">
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload className="w-12 h-12 text-purple-500 mb-2" />
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Upload Material
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        PDF, Videos, Images, Documents
                      </span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.mkv,.jpg,.jpeg,.png,.gif,.webp"
                        className="hidden"
                        disabled={uploadingFile}
                      />
                      {uploadingFile ? (
                        <div className="flex items-center gap-2 text-purple-600">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <span className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                          Choose File
                        </span>
                      )}
                    </label>
                  </div>

                  {/* Materials List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Uploaded Materials ({materials?.length || 0})
                    </h4>
                    
                    {!materials || materials.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No materials uploaded yet</p>
                      </div>
                    ) : (
                      materials.map((material) => (
                        <motion.div
                          key={material.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {getMaterialIcon(material.type)}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {material.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(material.file_size)} • {new Date(material.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`http://127.0.0.1:8000/storage/${material.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              View
                            </a>
                            <button
                              onClick={() => handleDeleteMaterial(material.id)}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Supprimer le cours"
        message="Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmColor="red"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setCourseToDelete(null);
        }}
      />

      <ConfirmModal
        isOpen={showDeleteMaterialModal}
        title="Supprimer le matériel"
        message="Êtes-vous sûr de vouloir supprimer ce matériel ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmColor="red"
        onConfirm={confirmDeleteMaterial}
        onCancel={() => {
          setShowDeleteMaterialModal(false);
          setMaterialToDelete(null);
        }}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </TeacherLayout>
  );
};

export default Courses;
