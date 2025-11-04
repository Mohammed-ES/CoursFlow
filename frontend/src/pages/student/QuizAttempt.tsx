import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Send,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import studentAPI, { Quiz, QuizResult } from '../../services/studentAPI';
import { useParams, useNavigate } from 'react-router-dom';

interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  marks: number;
}

const QuizAttempt = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    if (id) {
      fetchQuizDetails();
    }
  }, [id]);

  useEffect(() => {
    if (timeRemaining > 0 && !result) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, result]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const quizResponse = await studentAPI.getQuizzes();
      const quizData = quizResponse.data.find((q) => q.id === Number(id));
      
      if (!quizData) {
        throw new Error('Quiz not found');
      }

      setQuiz(quizData);
      
      // Simulate fetching questions (in real app, this would come from API)
      const mockQuestions: QuizQuestion[] = [
        {
          id: 1,
          question_text: 'What is the primary purpose of React hooks?',
          question_type: 'multiple_choice',
          options: [
            'To manage state in functional components',
            'To create class components',
            'To style components',
            'To handle routing',
          ],
          marks: 5,
        },
        {
          id: 2,
          question_text: 'TypeScript is a superset of JavaScript.',
          question_type: 'true_false',
          options: ['True', 'False'],
          marks: 3,
        },
        {
          id: 3,
          question_text: 'Explain the difference between props and state in React.',
          question_type: 'short_answer',
          marks: 10,
        },
      ];
      
      setQuestions(mockQuestions);
      setTimeRemaining(quizData.duration_minutes * 60);
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      alert('Failed to load quiz. Redirecting...');
      navigate('/student/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      const confirm = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!confirm) return;
    }

    try {
      setSubmitting(true);
      
      // Calculate time spent
      const totalTimeSeconds = quiz ? quiz.duration_minutes * 60 - timeRemaining : 0;
      
      const response = await studentAPI.submitQuiz(Number(id), answers, totalTimeSeconds);
      setResult(response.data);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    if (timeRemaining > 300) return 'text-green-600 dark:text-green-400';
    if (timeRemaining > 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400 animate-pulse';
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <StudentLayout title="Quiz" subtitle="Loading quiz...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </StudentLayout>
    );
  }

  if (!quiz) {
    return (
      <StudentLayout title="Quiz Not Found" subtitle="The quiz you're looking for doesn't exist">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Not Found</h2>
          <button
            onClick={() => navigate('/student/quizzes')}
            className="text-primary-main hover:text-primary-dark transition-colors"
          >
            ← Back to Quizzes
          </button>
        </div>
      </StudentLayout>
    );
  }

  // Results View
  if (result) {
    const percentage = (result.score / result.total_marks) * 100;
    
    return (
      <StudentLayout title="Quiz Results" subtitle={`${quiz.title} - Your Performance`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Results Header */}
          <div className="bg-gradient-to-br from-primary-main to-secondary-main rounded-xl shadow-2xl p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-4"
            >
              {percentage >= 60 ? (
                <CheckCircle className="w-20 h-20" />
              ) : (
                <XCircle className="w-20 h-20" />
              )}
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">
              {percentage >= 80 ? 'Excellent Work!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </h1>
            <p className="text-primary-light mb-6">Quiz completed successfully</p>
            <div className="flex justify-center items-baseline gap-2">
              <span className="text-6xl font-bold">{result.score}</span>
              <span className="text-3xl">/ {result.total_marks}</span>
            </div>
            <p className="mt-4 text-xl">
              Score: <span className="font-bold">{percentage.toFixed(1)}%</span>
            </p>
          </div>

          {/* AI Feedback */}
          {result.ai_feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
                AI-Generated Feedback
              </h2>
              
              <div className="space-y-4">
                {result.ai_feedback.overall_feedback && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-gray-700 dark:text-gray-300">{result.ai_feedback.overall_feedback}</p>
                  </div>
                )}

                {result.ai_feedback.strengths && result.ai_feedback.strengths.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {result.ai_feedback.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.ai_feedback.improvements && result.ai_feedback.improvements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-2 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {result.ai_feedback.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-amber-500 mr-2">→</span>
                          <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.ai_feedback.recommendations && result.ai_feedback.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {result.ai_feedback.recommendations.map((recommendation, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-purple-500 mr-2">💡</span>
                          <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/student/quizzes')}
              className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Back to Quizzes
            </button>
            {quiz.can_retake && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-main to-primary-dark text-white font-semibold rounded-lg hover:from-primary-dark hover:to-primary-main transition-all"
              >
                Retake Quiz
              </button>
            )}
          </div>
        </motion.div>
      </StudentLayout>
    );
  }

  // Quiz Taking View
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <StudentLayout title={quiz.title} subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quiz Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to leave? Your progress will be lost.')) {
                  navigate('/student/quizzes');
                }
              }}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-main transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Exit Quiz
            </button>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className={`w-5 h-5 mr-2 ${getTimeColor()}`} />
                <span className={`font-bold text-lg ${getTimeColor()}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Award className="w-5 h-5 mr-2 text-primary-main" />
                <span className="font-semibold">{quiz.total_marks} points</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h1>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-main to-secondary-main"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
                {currentQ.question_text}
              </h2>
              <span className="ml-4 px-3 py-1 bg-primary-light/20 text-primary-dark dark:text-primary-light rounded-full text-sm font-semibold">
                {currentQ.marks} pts
              </span>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.question_type === 'multiple_choice' || currentQ.question_type === 'true_false' ? (
                currentQ.options?.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[currentQ.id] === option
                        ? 'border-primary-main bg-primary-light/10'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-light'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={option}
                      checked={answers[currentQ.id] === option}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      className="w-5 h-5 text-primary-main focus:ring-primary-main"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white font-medium">{option}</span>
                  </label>
                ))
              ) : (
                <textarea
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-main focus:ring-2 focus:ring-primary-main/20 resize-none"
                />
              )}
            </div>

            {/* Warning if unanswered */}
            {!answers[currentQ.id] && (
              <div className="mt-4 flex items-center text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">This question hasn't been answered yet</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  idx === currentQuestion
                    ? 'bg-primary-main text-white'
                    : answers[questions[idx].id]
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center"
            >
              <Send className="w-5 h-5 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              className="px-6 py-3 bg-primary-main hover:bg-primary-dark text-white font-semibold rounded-lg transition-all"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default QuizAttempt;
