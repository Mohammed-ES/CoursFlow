import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileQuestion, Plus, Edit2, Trash2, Eye, Sparkles, 
  BookOpen, Award, Filter, X, Save, Loader2, CheckCircle, XCircle
} from 'lucide-react';
import TeacherLayout from '../../components/layout/TeacherLayout';
import teacherAPI from '../../services/teacherAPI';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';

interface Quiz {
  id: number;
  title: string;
  description: string;
  course: {
    id: number;
    title: string;
  };
  questions_count: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published';
  is_ai_generated: boolean;
  total_marks: number;
  duration_minutes: number;
  results_count: number;
  average_score: number;
}

interface Question {
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [quizToPublish, setQuizToPublish] = useState<{ id: number; status: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);
  
  const { toasts, removeToast, success, error: showError } = useToast();

  const [aiFormData, setAiFormData] = useState({
    course_id: '',
    topic: '',
    num_questions: 10,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    question_types: ['multiple_choice'] as string[],
  });

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, [filterCourse, filterStatus]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterCourse !== 'all') params.course_id = filterCourse;
      if (filterStatus !== 'all') params.status = filterStatus;

      const response = await teacherAPI.getQuizzes(params);
      console.log('Full API response:', response);
      console.log('Response data:', response.data);
      console.log('Is array?', Array.isArray(response.data));
      
      // The response from teacherAPI is the Laravel pagination object
      // It has: { data: [...items...], current_page, total, per_page, ... }
      if (response && response.data) {
        setQuizzes(Array.isArray(response.data) ? response.data : []);
      } else {
        setQuizzes([]);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await teacherAPI.getCourses({});
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiFormData.course_id || !aiFormData.topic) {
      alert('Please select a course and enter a topic');
      return;
    }

    try {
      setGenerating(true);
      const response = await teacherAPI.generateQuizWithAI({
        course_id: parseInt(aiFormData.course_id),
        topic: aiFormData.topic,
        num_questions: aiFormData.num_questions,
        difficulty: aiFormData.difficulty,
        question_types: aiFormData.question_types,
      });

      setGeneratedQuestions(response.quiz_data.questions);
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAIQuiz = async () => {
    if (generatedQuestions.length === 0) return;

    try {
      const course = courses.find(c => c.id === parseInt(aiFormData.course_id));
      
      await teacherAPI.saveAIQuiz({
        course_id: parseInt(aiFormData.course_id),
        title: `${aiFormData.topic} Quiz`,
        description: `AI-generated quiz on ${aiFormData.topic} for ${course?.title}`,
        questions: generatedQuestions,
        duration_minutes: aiFormData.num_questions * 2,
        total_marks: generatedQuestions.reduce((sum, q) => sum + q.points, 0),
        passing_marks: Math.ceil(generatedQuestions.reduce((sum, q) => sum + q.points, 0) * 0.6),
        difficulty: aiFormData.difficulty,
        status: 'draft',
      });

      setShowAIModal(false);
      setGeneratedQuestions([]);
      setAiFormData({
        course_id: '',
        topic: '',
        num_questions: 10,
        difficulty: 'medium',
        question_types: ['multiple_choice'],
      });
      fetchQuizzes();
      success('Quiz saved successfully!');
    } catch (error) {
      console.error('Error saving quiz:', error);
      showError('Failed to save quiz. Please try again.');
    }
  };

  const handlePublishQuiz = async (quizId: number, currentStatus: string) => {
    setQuizToPublish({ id: quizId, status: currentStatus });
    setShowPublishModal(true);
  };

  const confirmPublishQuiz = async () => {
    if (!quizToPublish) return;

    const newStatus = quizToPublish.status === 'published' ? 'draft' : 'published';
    const action = newStatus === 'published' ? 'publish' : 'unpublish';

    try {
      await teacherAPI.updateQuiz(quizToPublish.id, { status: newStatus });
      fetchQuizzes();
      success(`Quiz ${action}ed successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing quiz:`, error);
      showError(`Failed to ${action} quiz. Please try again.`);
    } finally {
      setShowPublishModal(false);
      setQuizToPublish(null);
    }
  };

  const handleDeleteQuiz = (quizId: number) => {
    setQuizToDelete(quizId);
    setShowDeleteModal(true);
  };

  const confirmDeleteQuiz = async () => {
    if (!quizToDelete) return;

    try {
      await teacherAPI.deleteQuiz(quizToDelete);
      fetchQuizzes();
      success('Quiz deleted successfully!');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      showError('Failed to delete quiz. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setQuizToDelete(null);
    }
  };

  const handleEditQuiz = (quizId: number) => {
    // Navigate to edit page in new tab
    window.open(`/teacher/quiz/${quizId}/edit`, '_blank');
  };

  const handlePreviewQuiz = (quizId: number) => {
    // Navigate to preview page in new tab
    window.open(`/teacher/quiz/${quizId}/preview`, '_blank');
  };

  const handleEditQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...generatedQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setGeneratedQuestions(updated);
  };

  const handleToggleQuestionType = (type: string) => {
    if (aiFormData.question_types.includes(type)) {
      setAiFormData({
        ...aiFormData,
        question_types: aiFormData.question_types.filter(t => t !== type),
      });
    } else {
      setAiFormData({
        ...aiFormData,
        question_types: [...aiFormData.question_types, type],
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success-light/20 text-success-main';
      case 'medium':
        return 'bg-warning-light/20 text-warning-main';
      case 'hard':
        return 'bg-error-light/20 text-error-main';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published'
      ? 'bg-success-light/20 text-success-main'
      : 'bg-warning-light/20 text-warning-main';
  };

  return (
    <TeacherLayout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-main dark:text-white mb-2">
            Quiz Management
          </h1>
          <p className="text-neutral-darkGray dark:text-neutral-gray">
            Create and manage quizzes with AI assistance
          </p>
        </motion.div>

        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                focus:ring-2 focus:ring-primary-main focus:border-transparent
                dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                focus:ring-2 focus:ring-primary-main focus:border-transparent
                dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Generate AI Button */}
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500
              text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg
              hover:shadow-xl transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Generate with AI
          </button>
        </div>

        {/* Quizzes Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No quizzes created yet</p>
              <button
                onClick={() => setShowAIModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg
                  hover:bg-primary-dark transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate First Quiz with AI
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Course
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Questions
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      AI Generated
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {quizzes.map((quiz, index) => (
                    <motion.tr
                      key={quiz.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {quiz.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {quiz.duration_minutes} min • {quiz.total_marks} marks
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {quiz.course?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 text-xs font-medium bg-primary-light/20 text-primary-main rounded">
                          {quiz.questions_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(quiz.status)}`}>
                          {quiz.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {quiz.is_ai_generated && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium
                            bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handlePublishQuiz(quiz.id, quiz.status)}
                            className={`p-1 ${quiz.status === 'published' ? 'text-orange-600 hover:bg-orange-100' : 'text-green-600 hover:bg-green-100'} rounded transition-colors`}
                            title={quiz.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            {quiz.status === 'published' ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handlePreviewQuiz(quiz.id)}
                            className="p-1 text-primary-main hover:bg-primary-light/20 rounded transition-colors"
                            title="View Results"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditQuiz(quiz.id)}
                            className="p-1 text-warning-main hover:bg-warning-light/20 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="p-1 text-error-main hover:bg-error-light/20 rounded transition-colors"
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
          )}
        </motion.div>

        {/* AI Generation Modal */}
        <AnimatePresence>
          {showAIModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => !generating && setShowAIModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Generate Quiz with AI
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Powered by Gemini 2.0 Flash
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => !generating && setShowAIModal(false)}
                      disabled={generating}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {generatedQuestions.length === 0 ? (
                    /* Generation Form */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <BookOpen className="inline w-4 h-4 mr-1" />
                            Course *
                          </label>
                          <select
                            value={aiFormData.course_id}
                            onChange={(e) => setAiFormData({ ...aiFormData, course_id: e.target.value })}
                            disabled={generating}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                              focus:ring-2 focus:ring-primary-main focus:border-transparent
                              dark:bg-gray-700 dark:text-white disabled:opacity-50"
                          >
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Topic *
                          </label>
                          <input
                            type="text"
                            value={aiFormData.topic}
                            onChange={(e) => setAiFormData({ ...aiFormData, topic: e.target.value })}
                            disabled={generating}
                            placeholder="e.g., Laravel Eloquent ORM"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                              focus:ring-2 focus:ring-primary-main focus:border-transparent
                              dark:bg-gray-700 dark:text-white disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Number of Questions: {aiFormData.num_questions}
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="20"
                          value={aiFormData.num_questions}
                          onChange={(e) => setAiFormData({ ...aiFormData, num_questions: parseInt(e.target.value) })}
                          disabled={generating}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>5 questions</span>
                          <span>20 questions</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Difficulty
                        </label>
                        <div className="flex gap-3">
                          {(['easy', 'medium', 'hard'] as const).map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setAiFormData({ ...aiFormData, difficulty: level })}
                              disabled={generating}
                              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                ${aiFormData.difficulty === level
                                  ? 'bg-primary-main text-white shadow-md'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                } disabled:opacity-50`}
                            >
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Question Types
                        </label>
                        <div className="flex gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={aiFormData.question_types.includes('multiple_choice')}
                              onChange={() => handleToggleQuestionType('multiple_choice')}
                              disabled={generating}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Multiple Choice</span>
                          </label>
                          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={aiFormData.question_types.includes('true_false')}
                              onChange={() => handleToggleQuestionType('true_false')}
                              disabled={generating}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">True/False</span>
                          </label>
                        </div>
                      </div>

                      <button
                        onClick={handleGenerateWithAI}
                        disabled={generating || !aiFormData.course_id || !aiFormData.topic || aiFormData.question_types.length === 0}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500
                          text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating with AI... (this may take 5-10 seconds)
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generate Quiz
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Generated Questions Preview */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Generated Questions ({generatedQuestions.length})
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Review and edit questions before saving
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Marks</p>
                          <p className="text-2xl font-bold text-primary-main">
                            {generatedQuestions.reduce((sum, q) => sum + q.points, 0)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {generatedQuestions.map((question, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2"
                          >
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {index + 1}. {question.question}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs bg-primary-light/20 text-primary-main rounded">
                                  {question.type}
                                </span>
                                <span className="px-2 py-1 text-xs bg-success-light/20 text-success-main rounded">
                                  {question.points} pts
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              {question.options.map((option, i) => (
                                <div
                                  key={i}
                                  className={`pl-2 ${
                                    option === question.correct_answer
                                      ? 'text-success-main font-medium'
                                      : ''
                                  }`}
                                >
                                  • {option}
                                  {option === question.correct_answer && ' ✓'}
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                              {question.explanation}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setGeneratedQuestions([])}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Regenerate
                        </button>
                        <button
                          onClick={handleSaveAIQuiz}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg
                            hover:bg-primary-dark transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Save Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Publish/Unpublish Confirmation Modal */}
        <ConfirmModal
          isOpen={showPublishModal}
          onClose={() => {
            setShowPublishModal(false);
            setQuizToPublish(null);
          }}
          onConfirm={confirmPublishQuiz}
          title={quizToPublish?.status === 'published' ? 'Unpublish Quiz' : 'Publish Quiz'}
          message={
            quizToPublish?.status === 'published'
              ? 'Are you sure you want to unpublish this quiz? Students will no longer be able to take it.'
              : 'Are you sure you want to publish this quiz? Students will be able to take it.'
          }
          confirmText={quizToPublish?.status === 'published' ? 'Unpublish' : 'Publish'}
          confirmStyle={quizToPublish?.status === 'published' ? 'danger' : 'primary'}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setQuizToDelete(null);
          }}
          onConfirm={confirmDeleteQuiz}
          title="Delete Quiz"
          message="Are you sure you want to delete this quiz? This action cannot be undone and all associated data will be permanently removed."
          confirmText="Delete"
          confirmStyle="danger"
        />
      </div>
    </TeacherLayout>
  );
};

export default Quiz;
