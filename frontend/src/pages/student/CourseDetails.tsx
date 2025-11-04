import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Download,
  FileText,
  Image,
  Video,
  Clock,
  User,
  ArrowLeft,
  CheckCircle,
  PlayCircle,
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import studentAPI, { Course } from '../../services/studentAPI';
import { useParams, Link, useNavigate } from 'react-router-dom';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getCourseDetails(Number(id));
      // Convert progress to number if it's a string
      const courseData = {
        ...response.data,
        progress: typeof response.data.progress === 'string' 
          ? parseFloat(response.data.progress) 
          : response.data.progress
      };
      setCourse(courseData);
    } catch (error) {
      console.error('Failed to fetch course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (fileType: string, fileName: string) => {
    try {
      setDownloadingFile(fileType);
      const blob = await studentAPI.downloadCourseFile(Number(id), fileType);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `${fileType}.${getFileExtension(fileType)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadingFile(null);
    }
  };

  const getFileExtension = (fileType: string): string => {
    if (fileType.includes('pdf')) return 'pdf';
    if (fileType.includes('image')) return 'jpg';
    if (fileType.includes('video')) return 'mp4';
    return 'file';
  };

  const updateProgress = async (newProgress: number) => {
    try {
      console.log('Updating progress to:', newProgress, 'for course:', id);
      const response = await studentAPI.updateCourseProgress(Number(id), newProgress);
      console.log('Update response:', response);
      
      if (course) {
        setCourse({ ...course, progress: newProgress });
      }
      
      // Show success message
      alert(`Progress updated to ${newProgress}%!`);
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  if (loading) {
    return (
      <StudentLayout title="Course Details" subtitle="Loading course information...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </StudentLayout>
    );
  }

  if (!course) {
    return (
      <StudentLayout title="Course Not Found" subtitle="The course you're looking for doesn't exist">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h2>
          <Link
            to="/student/courses"
            className="text-primary-main hover:text-primary-dark transition-colors"
          >
            ← Back to Courses
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title={course.title} subtitle={`Track your progress and access course materials`}>
      <div className="space-y-6">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <button
            onClick={() => navigate('/student/courses')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-main transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
        </motion.div>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="md:flex">
            {/* Thumbnail */}
            <div className="md:w-1/3 h-64 md:h-auto bg-gradient-to-br from-primary-main to-secondary-main flex items-center justify-center">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="w-24 h-24 text-white opacity-50" />
              )}
            </div>

            {/* Course Info */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {course.title}
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mb-6">{course.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <User className="w-5 h-5 mr-2 text-primary-main" />
                  <div>
                    <p className="text-xs">Instructor</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {course.teacher.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="w-5 h-5 mr-2 text-primary-main" />
                  <div>
                    <p className="text-xs">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {course.duration_hours} hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-semibold">Your Progress</span>
                  <span className="font-bold text-primary-main">{course.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-main to-primary-light transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lessons */}
            {course.lessons && course.lessons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <PlayCircle className="w-6 h-6 mr-2 text-primary-main" />
                  Course Lessons
                </h2>
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-start p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-main text-white flex items-center justify-center font-bold text-sm mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Course Materials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Download className="w-6 h-6 mr-2 text-primary-main" />
                Course Materials
              </h2>

              {course.file_urls && Object.keys(course.file_urls).length > 0 ? (
                <div className="space-y-3">
                  {course.file_urls.pdf && (
                    <button
                      onClick={() => handleDownloadFile('pdf', `${course.title}.pdf`)}
                      disabled={downloadingFile === 'pdf'}
                      className="w-full flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Course PDF
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Study material
                          </p>
                        </div>
                      </div>
                      <Download
                        className={`w-5 h-5 text-red-600 ${downloadingFile === 'pdf' ? 'animate-bounce' : ''}`}
                      />
                    </button>
                  )}

                  {course.file_urls.images && course.file_urls.images.length > 0 && (
                    <button
                      onClick={() => handleDownloadFile('images', `${course.title}-images.zip`)}
                      disabled={downloadingFile === 'images'}
                      className="w-full flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-center">
                        <Image className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Course Images
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {course.file_urls.images.length} images
                          </p>
                        </div>
                      </div>
                      <Download
                        className={`w-5 h-5 text-blue-600 ${downloadingFile === 'images' ? 'animate-bounce' : ''}`}
                      />
                    </button>
                  )}

                  {course.file_urls.videos && course.file_urls.videos.length > 0 && (
                    <button
                      onClick={() => handleDownloadFile('videos', `${course.title}-videos.zip`)}
                      disabled={downloadingFile === 'videos'}
                      className="w-full flex items-center justify-between p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-center">
                        <Video className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Course Videos
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {course.file_urls.videos.length} videos
                          </p>
                        </div>
                      </div>
                      <Download
                        className={`w-5 h-5 text-purple-600 ${downloadingFile === 'videos' ? 'animate-bounce' : ''}`}
                      />
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No downloadable materials available yet
                </p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quizzes */}
            {course.quizzes && course.quizzes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Available Quizzes
                </h3>
                <div className="space-y-3">
                  {course.quizzes.map((quiz) => (
                    <Link
                      key={quiz.id}
                      to={`/student/quizzes/${quiz.id}`}
                      className="block p-4 rounded-lg bg-gradient-to-r from-primary-light/10 to-secondary-light/10 hover:from-primary-light/20 hover:to-secondary-light/20 border border-primary-light/30 transition-all"
                    >
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        {quiz.title}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{quiz.duration_minutes} min</span>
                        <span className="font-semibold text-primary-main">
                          {quiz.total_marks} pts
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Progress Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Update Progress
              </h3>
              <div className="space-y-3">
                {[25, 50, 75, 100].map((progress) => (
                  <button
                    key={progress}
                    onClick={() => updateProgress(progress)}
                    disabled={course.progress >= progress}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                      course.progress >= progress
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 cursor-not-allowed'
                        : 'bg-primary-main hover:bg-primary-dark text-white'
                    }`}
                  >
                    {course.progress >= progress ? (
                      <span className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {progress}% Completed
                      </span>
                    ) : (
                      `Mark ${progress}% Complete`
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default CourseDetails;
