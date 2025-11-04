import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, Plus, Trash2, AlertCircle, Loader2
} from 'lucide-react';
import TeacherLayout from '../../components/layout/TeacherLayout';
import teacherAPI from '../../services/teacherAPI';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import ConfirmModal from '../../components/common/ConfirmModal';

interface Question {
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  course_id: number;
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published';
  total_marks: number;
  duration_minutes: number;
  passing_marks: number;
}

const QuizEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, removeToast, success, error: showError } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    duration_minutes: 30,
    passing_marks: 60,
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuizDetails();
    fetchCourses();
  }, [id]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getQuiz(parseInt(id!));
      
      setFormData({
        title: response.title,
        description: response.description,
        course_id: response.course?.id?.toString() || '',
        difficulty: response.difficulty,
        duration_minutes: response.duration_minutes,
        passing_marks: response.passing_marks,
      });
      
      setQuestions(Array.isArray(response.questions) ? response.questions : []);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      showError('Failed to load quiz details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await teacherAPI.getCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      points: 1,
    };
    setQuestions([...questions, newQuestion]);
    success('New question added!');
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestionToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteQuestion = () => {
    if (questionToDelete !== null) {
      setQuestions(questions.filter((_, i) => i !== questionToDelete));
      success('Question deleted successfully!');
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    }
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      showError('Please enter a quiz title.');
      return;
    }

    if (questions.length === 0) {
      showError('Please add at least one question.');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        showError(`Question ${i + 1}: Please enter a question.`);
        return;
      }
      if (!q.correct_answer) {
        showError(`Question ${i + 1}: Please select a correct answer.`);
        return;
      }
      if (q.type === 'multiple_choice' && q.options.some(opt => !opt.trim())) {
        showError(`Question ${i + 1}: All options must be filled.`);
        return;
      }
    }

    try {
      setSaving(true);
      const totalMarks = questions.reduce((sum, q) => sum + q.points, 0);

      await teacherAPI.updateQuiz(parseInt(id!), {
        ...formData,
        course_id: parseInt(formData.course_id),
        questions: questions,
        total_marks: totalMarks,
      });

      success('Quiz updated successfully!');
      setTimeout(() => navigate('/teacher/quiz'), 1500);
    } catch (error) {
      console.error('Error updating quiz:', error);
      showError('Failed to update quiz. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="max-w-4xl mx-auto px-6 -mt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/teacher/quiz')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-main mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Quizzes
          </button>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Quiz</h1>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Quiz Details Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quiz Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
                placeholder="Enter quiz title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
                placeholder="Enter quiz description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course
              </label>
              <select
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
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
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={formData.passing_marks}
                onChange={(e) => setFormData({ ...formData, passing_marks: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
                min="0"
                max="100"
              />
            </div>
          </div>
        </motion.div>

        {/* Questions Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Questions ({questions.length})
            </h2>
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No questions yet. Click "Add Question" to start.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Question {qIndex + 1}
                    </h3>
                    <button
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove question"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Question Text *
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your question"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => {
                            const newType = e.target.value as 'multiple_choice' | 'true_false';
                            handleQuestionChange(qIndex, 'type', newType);
                            if (newType === 'true_false') {
                              handleQuestionChange(qIndex, 'options', ['True', 'False']);
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="true_false">True/False</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Points
                        </label>
                        <input
                          type="number"
                          value={question.points}
                          onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
                          min="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Options *
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correct_answer === option}
                              onChange={() => handleQuestionChange(qIndex, 'correct_answer', option)}
                              className="w-4 h-4 text-primary-main focus:ring-primary-main"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
                              placeholder={`Option ${oIndex + 1}`}
                              disabled={question.type === 'true_false'}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Select the correct answer by clicking the radio button
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Explanation (Optional)
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main dark:bg-gray-700 dark:text-white"
                        placeholder="Explain why this answer is correct"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Question Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setQuestionToDelete(null);
          }}
          onConfirm={confirmDeleteQuestion}
          title="Delete Question"
          message={`Are you sure you want to delete question ${(questionToDelete ?? 0) + 1}? This action cannot be undone.`}
          confirmText="Delete"
          confirmStyle="danger"
        />
      </div>
    </TeacherLayout>
  );
};

export default QuizEdit;
