import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Edit2, Trash2, Upload, Download, Eye, X,
  FileText, Video, Image as ImageIcon, File, Users, 
  Calendar, DollarSign, Clock, BookOpen 
} from 'lucide-react';
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

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<{ id: number; title: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await teacherAPI.getCourse(parseInt(id!));
      setCourse(data);
      
      // Populate form data
      setFormData({
        title: data.title,
        description: data.description,
        subject: data.subject,
        level: data.level,
        price: data.price,
        duration_hours: data.duration_hours || 10,
        start_date: data.start_date,
        end_date: data.end_date,
        max_students: data.max_students,
        status: data.status,
      });
      
      // Fetch materials
      const materialsData = await teacherAPI.getCourseMaterials(parseInt(id!));
      setMaterials(materialsData.data || []);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !id) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('description', `Uploaded on ${new Date().toLocaleDateString()}`);
    formData.append('is_public', '1');

    try {
      setUploadingFile(true);
      await teacherAPI.uploadCourseMaterial(parseInt(id), formData);
      
      // Recharger les matériaux
      const materialsData = await teacherAPI.getCourseMaterials(parseInt(id));
      setMaterials(materialsData.data || []);
      
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

  const handleDeleteMaterial = async (materialId: number, materialTitle: string) => {
    setMaterialToDelete({ id: materialId, title: materialTitle });
    setShowDeleteModal(true);
  };

  const confirmDeleteMaterial = async () => {
    if (!materialToDelete) return;

    try {
      await teacherAPI.deleteMaterial(parseInt(id), materialToDelete.id);
      
      // Recharger les matériaux
      const materialsData = await teacherAPI.getCourseMaterials(parseInt(id));
      setMaterials(materialsData.data || []);
      
      success('✅ Matériel supprimé avec succès!');
      setShowDeleteModal(false);
      setMaterialToDelete(null);
      
      success('✅ Matériel supprimé avec succès!');
    } catch (error: any) {
      console.error('Error deleting material:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Erreur lors de la suppression.';
      showError('❌ ' + errorMsg);
    }
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teacherAPI.updateCourse(parseInt(id!), formData);
      setShowEditModal(false);
      await fetchCourseDetails();
      success('✅ Cours mis à jour avec succès!');
    } catch (error) {
      console.error('Error updating course:', error);
      showError('❌ Erreur lors de la mise à jour du cours');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleDownload = async (courseId: number, materialId: number, title: string) => {
    try {
      const blob = await teacherAPI.downloadMaterial(courseId, materialId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading material:', error);
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </TeacherLayout>
    );
  }

  if (!course) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Course not found</p>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/teacher/courses')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {course.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Course Details & Materials
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Course
            </button>
          </div>
        </div>

        {/* Course Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Students</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {course.enrolled_count}/{course.max_students}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {course.price} DH
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {course.duration_hours || 0}h
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Materials</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {course.materials_count || 0}
            </p>
          </motion.div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {course.description}
              </p>
            </motion.div>

            {/* Materials Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Course Materials
                  </h2>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.mkv,.jpg,.jpeg,.png,.gif,.webp"
                      className="hidden"
                      disabled={uploadingFile}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingFile}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark 
                        transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingFile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {materials.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No materials uploaded yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getMaterialIcon(material.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {material.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatFileSize(material.file_size)} • {material.type.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownload(course.id, material.id, material.title)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            title="Télécharger"
                          >
                            <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(material.id, material.title)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors group"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Course Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                  <span className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 block">Subject</label>
                  <p className="text-gray-900 dark:text-white font-medium mt-1">{course.subject}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 block">Level</label>
                  <p className="text-gray-900 dark:text-white font-medium mt-1 capitalize">{course.level}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 block">Start Date</label>
                  <p className="text-gray-900 dark:text-white font-medium mt-1">
                    {new Date(course.start_date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 block">End Date</label>
                  <p className="text-gray-900 dark:text-white font-medium mt-1">
                    {new Date(course.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {showEditModal && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            onClick={() => setShowEditModal(false)}
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
                    Edit Course
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Level *
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Course['status'] })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Update Course
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Supprimer le matériel"
        message={`Êtes-vous sûr de vouloir supprimer "${materialToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDeleteMaterial}
        onCancel={() => {
          setShowDeleteModal(false);
          setMaterialToDelete(null);
        }}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </TeacherLayout>
  );
};

export default CourseDetails;
