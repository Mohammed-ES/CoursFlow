import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Clock, Award, BookOpen, AlertCircle, 
  CheckCircle, XCircle, Eye 
} from 'lucide-react';
import TeacherLayout from '../../components/layout/TeacherLayout';
import teacherAPI from '../../services/teacherAPI';

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
  course: {
    id: number;
    title: string;
  } | null;
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published';
  total_marks: number;
  duration_minutes: number;
  passing_marks: number;
}

const QuizPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    fetchQuizDetails();
  }, [id]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getQuiz(parseInt(id!));
      setQuiz(response);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading quiz preview...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  if (!quiz) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">The quiz you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/teacher/quiz')}
              className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto px-6 -mt-20">
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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-6 h-6 text-primary-main" />
                  <span className="text-sm font-medium text-primary-main">PREVIEW MODE</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {quiz.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{quiz.duration_minutes} min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Marks</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{quiz.total_marks}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Questions</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{quiz.questions.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Passing</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{quiz.passing_marks}%</p>
                </div>
              </div>
            </div>

            {quiz.course && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Course: <span className="font-semibold text-gray-900 dark:text-white">{quiz.course.title}</span>
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Toggle Answers Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showAnswers
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {showAnswers ? 'Hide Correct Answers' : 'Show Correct Answers'}
          </button>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-main text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {question.question}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
                      {question.type === 'multiple_choice' ? 'Multiple Choice' : 'True/False'}
                    </span>
                    <span className="font-medium">{question.points} points</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 ml-12">
                {question.options.map((option, optionIndex) => {
                  const isCorrect = option === question.correct_answer;
                  const showCorrectIndicator = showAnswers && isCorrect;

                  return (
                    <div
                      key={optionIndex}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        showCorrectIndicator
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            showCorrectIndicator
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {showCorrectIndicator && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <span className={`${
                            showCorrectIndicator
                              ? 'font-semibold text-green-700 dark:text-green-300'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {option}
                          </span>
                        </div>
                        {showCorrectIndicator && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {showAnswers && question.explanation && (
                <div className="mt-4 ml-12 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Explanation:
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    {question.explanation}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-300 mb-1">
                Preview Mode
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-400">
                This is how students will see the quiz. Students won't be able to see correct answers 
                until after they submit their attempt.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </TeacherLayout>
  );
};

export default QuizPreview;
