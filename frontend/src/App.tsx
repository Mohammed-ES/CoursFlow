import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Planning from './pages/Planning';
import Notes from './pages/Notes';
import AIAssistant from './pages/AIAssistant';
import Announcements from './pages/Announcements';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageTeachers from './pages/admin/ManageTeachers';
import Payments from './pages/admin/Payments';
import AdminSettings from './pages/admin/AdminSettings';
import AdminNotifications from './pages/admin/Notifications';
import Profile from './pages/admin/Profile';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherStudents from './pages/teacher/Students';
import TeacherStudentDetails from './pages/teacher/StudentDetails';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherNotifications from './pages/teacher/Notifications';
import TeacherCalendar from './pages/teacher/Calendar';
import TeacherProfile from './pages/teacher/Profile';
import TeacherCourses from './pages/teacher/Courses';
import TeacherCourseDetails from './pages/teacher/CourseDetails';
import TeacherQuiz from './pages/teacher/Quiz';
import TeacherQuizPreview from './pages/teacher/QuizPreview';
import TeacherQuizEdit from './pages/teacher/QuizEdit';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentCourseDetails from './pages/student/CourseDetails';
import StudentQuizzes from './pages/student/Quizzes';
import StudentQuizAttempt from './pages/student/QuizAttempt';
import StudentCalendar from './pages/student/Calendar';
import StudentNotifications from './pages/student/Notifications';
import StudentProfile from './pages/student/Profile';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastContainer />
          <Routes>
            {/* Public Routes with Layout (Header + Footer) */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="services" element={<Services />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetails />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="planning" element={<Planning />} />
                <Route path="notes" element={<Notes />} />
                <Route path="assistant" element={<AIAssistant />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Auth Routes without Footer */}
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* OAuth Callback Route (no layout) */}
            <Route path="auth/callback" element={<AuthCallback />} />

            {/* Admin Routes - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/students" element={<ManageStudents />} />
              <Route path="admin/teachers" element={<ManageTeachers />} />
              <Route path="admin/payments" element={<Payments />} />
              <Route path="admin/notifications" element={<AdminNotifications />} />
              <Route path="admin/settings" element={<AdminSettings />} />
              <Route path="admin/profile" element={<Profile />} />
            </Route>

            {/* Teacher Routes - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="teacher/students" element={<TeacherStudents />} />
              <Route path="teacher/students/:id" element={<TeacherStudentDetails />} />
              <Route path="teacher/attendance" element={<TeacherAttendance />} />
              <Route path="teacher/courses" element={<TeacherCourses />} />
              <Route path="teacher/courses/:id" element={<TeacherCourseDetails />} />
              <Route path="teacher/quiz" element={<TeacherQuiz />} />
              <Route path="teacher/quiz/:id/preview" element={<TeacherQuizPreview />} />
              <Route path="teacher/quiz/:id/edit" element={<TeacherQuizEdit />} />
              <Route path="teacher/notifications" element={<TeacherNotifications />} />
              <Route path="teacher/calendar" element={<TeacherCalendar />} />
              <Route path="teacher/profile" element={<TeacherProfile />} />
            </Route>

            {/* Student Routes - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="student/dashboard" element={<StudentDashboard />} />
              <Route path="student/courses" element={<StudentCourses />} />
              <Route path="student/courses/:id" element={<StudentCourseDetails />} />
              <Route path="student/quizzes" element={<StudentQuizzes />} />
              <Route path="student/quizzes/:id/attempt" element={<StudentQuizAttempt />} />
              <Route path="student/calendar" element={<StudentCalendar />} />
              <Route path="student/notifications" element={<StudentNotifications />} />
              <Route path="student/profile" element={<StudentProfile />} />
            </Route>
              
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
