# 🏗️ CoursFlow Project Architecture

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    COURSFLOW PLATFORM                        │
│         Learning Management System (LMS) with AI            │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐         ┌────▼────┐        ┌────▼────┐
   │ STUDENT │         │ TEACHER │        │  ADMIN  │
   │ MODULE  │         │ MODULE  │        │ MODULE  │
   └────┬────┘         └────┬────┘        └────┬────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
   ┌────▼────────┐                      ┌──────▼──────┐
   │   FRONTEND  │                      │   BACKEND   │
   │ React + TS  │◄─────REST API───────►│  Laravel 10 │
   │  Port 5173  │      (Sanctum)       │  Port 8000  │
   └─────────────┘                      └──────┬──────┘
                                              │
                                   ┌──────────┴──────────┐
                                   │                     │
                            ┌──────▼──────┐      ┌──────▼──────┐
                            │   MySQL     │      │  Gemini AI  │
                            │  Database   │      │     API     │
                            └─────────────┘      └─────────────┘
```

---

## 🎯 System Modules

### 1. Student Module

**Main Files:**
- `frontend/src/pages/student/StudentDashboard.tsx`
- `frontend/src/pages/student/StudentProfile.tsx`
- `frontend/src/components/student/StudentSidebar.tsx`
- `backend/app/Http/Controllers/Api/StudentController.php`
- `backend/app/Models/Student.php`

**Features:**
- ✅ Dashboard with statistics
- ✅ Profile management
- ✅ Enrolled courses display
- ✅ AI-powered quiz taking
- ✅ Event calendar
- ✅ Real-time notifications
- ✅ Progress tracking

**Key Components:**

| Component | Purpose |
|-----------|---------|
| `StudentDashboard.tsx` | Main dashboard with stats and enrolled courses |
| `StudentProfile.tsx` | Profile management and settings |
| `CourseCard.tsx` | Display course information |
| `QuizInterface.tsx` | Interactive quiz taking with AI correction |
| `Calendar.tsx` | Event and deadline tracking |

---

### 2. Teacher Module

**Main Files:**
- `frontend/src/pages/teacher/TeacherDashboard.tsx`
- `frontend/src/pages/teacher/TeacherCourses.tsx`
- `frontend/src/pages/teacher/TeacherQuizzes.tsx`
- `backend/app/Http/Controllers/Api/TeacherController.php`
- `backend/app/Models/Teacher.php`

**Features:**
- ✅ Course creation and management
- ✅ Quiz creation and editing
- ✅ AI quiz generation (Gemini)
- ✅ Student performance tracking
- ✅ Automated grading
- ✅ Analytics dashboard
- ✅ Content management

**Key Components:**

| Component | Purpose |
|-----------|---------|
| `TeacherDashboard.tsx` | Teacher statistics and overview |
| `CourseCreator.tsx` | Create and edit courses |
| `QuizCreator.tsx` | Design quizzes with multiple question types |
| `AIQuizGenerator.tsx` | Generate quizzes using Gemini AI |
| `StudentList.tsx` | View and manage enrolled students |
| `GradingPanel.tsx` | Review and manage quiz results |

---

### 3. Admin Module

**Main Files:**
- `frontend/src/pages/admin/AdminDashboard.tsx`
- `frontend/src/pages/admin/AdminUsers.tsx`
- `frontend/src/pages/admin/AdminCourses.tsx`
- `backend/app/Http/Controllers/Api/AdminController.php`
- `backend/app/Models/Admin.php`

**Features:**
- ✅ User management (students, teachers, admins)
- ✅ Course approval and publishing
- ✅ System analytics
- ✅ Payment tracking
- ✅ Security controls
- ✅ Database management
- ✅ Platform configuration

**Key Components:**

| Component | Purpose |
|-----------|---------|
| `AdminDashboard.tsx` | Platform-wide statistics and overview |
| `UserManagement.tsx` | Create, edit, and delete users |
| `CourseApproval.tsx` | Review and approve teacher courses |
| `PaymentTracking.tsx` | Monitor enrollment payments |
| `SystemSettings.tsx` | Configure platform settings |
| `Analytics.tsx` | View detailed platform analytics |

---

## 🗄️ Database Schema

### Core Tables

#### 1. users
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    google_id VARCHAR(255) NULL,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. students
```sql
CREATE TABLE students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    date_of_birth DATE NULL,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    enrollment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 3. teachers
```sql
CREATE TABLE teachers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    teacher_id VARCHAR(50) UNIQUE NOT NULL,
    specialization VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    bio TEXT NULL,
    hire_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 4. courses
```sql
CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    teacher_id BIGINT NOT NULL,
    category VARCHAR(100) NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    duration_hours INT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    max_students INT DEFAULT 30,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    start_date DATE NULL,
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);
```

#### 5. enrollments
```sql
CREATE TABLE enrollments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_amount DECIMAL(10, 2) NULL,
    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    progress_percentage DECIMAL(5, 2) DEFAULT 0.00,
    completion_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);
```

#### 6. quizzes
```sql
CREATE TABLE quizzes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    duration_minutes INT NOT NULL,
    passing_score DECIMAL(5, 2) DEFAULT 50.00,
    max_attempts INT DEFAULT 3,
    is_published BOOLEAN DEFAULT FALSE,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES teachers(id) ON DELETE CASCADE
);
```

#### 7. quiz_attempts
```sql
CREATE TABLE quiz_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiz_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    attempt_number INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP NULL,
    score DECIMAL(5, 2) NULL,
    ai_feedback TEXT NULL,
    status ENUM('in_progress', 'submitted', 'graded') DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
```

---

## 🔄 Data Flow Diagrams

### Course Enrollment Flow

```
Student                 Frontend                Backend                Database
  │                       │                       │                       │
  │──Select Course───────►│                       │                       │
  │                       │──API Request─────────►│                       │
  │                       │   POST /enroll        │                       │
  │                       │                       │──Check Availability──►│
  │                       │                       │◄──Return Status──────│
  │                       │                       │──Create Enrollment───►│
  │                       │                       │◄──Return Success─────│
  │                       │◄──Response───────────│                       │
  │◄──Confirmation───────│                       │                       │
```

### AI Quiz Correction Flow

```
Student                 Frontend                Backend              Gemini AI
  │                       │                       │                       │
  │──Submit Quiz─────────►│                       │                       │
  │                       │──API Request─────────►│                       │
  │                       │   POST /quiz/submit   │                       │
  │                       │                       │──Prepare Prompt──────►│
  │                       │                       │   (Questions + Answers)
  │                       │                       │                       │
  │                       │                       │◄──AI Analysis────────│
  │                       │                       │   (Score + Feedback)  │
  │                       │                       │                       │
  │                       │                       │──Save Results────────►DB
  │                       │◄──Response───────────│                       │
  │◄──Show Results───────│   (Score + Feedback)  │                       │
```

---

## 🔐 Authentication Flow

### Email/Password Authentication

```
1. User enters email and password
2. Frontend sends POST to /api/login
3. Backend validates credentials
4. Laravel Sanctum creates token
5. Token returned to frontend
6. Token stored in localStorage
7. Token sent with every API request
```

### Google OAuth 2.0 Flow

```
1. User clicks "Login with Google"
2. Redirected to Google OAuth consent screen
3. User approves permissions
4. Google redirects with authorization code
5. Backend exchanges code for user data
6. Create/update user in database
7. Generate Sanctum token
8. Return token to frontend
9. Store token and redirect to dashboard
```

---

## 🌐 API Endpoints Summary

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Email/password login
- `POST /api/logout` - Logout user
- `GET /api/auth/google` - Google OAuth redirect
- `GET /api/auth/google/callback` - Google OAuth callback

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update profile
- `GET /api/student/courses` - Get enrolled courses
- `POST /api/student/enroll` - Enroll in course
- `GET /api/student/quizzes` - Get available quizzes
- `POST /api/student/quiz/submit` - Submit quiz (AI correction)

### Teacher Endpoints
- `GET /api/teacher/profile` - Get teacher profile
- `GET /api/teacher/courses` - Get created courses
- `POST /api/teacher/courses` - Create new course
- `PUT /api/teacher/courses/{id}` - Update course
- `DELETE /api/teacher/courses/{id}` - Delete course
- `POST /api/teacher/quizzes` - Create quiz
- `POST /api/teacher/quiz/generate` - AI quiz generation

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/courses` - Get all courses
- `PUT /api/admin/courses/{id}/approve` - Approve course
- `GET /api/admin/analytics` - Get platform analytics

---

## 📂 File Structure

### Frontend
```
frontend/src/
├── components/
│   ├── common/
│   ├── student/
│   ├── teacher/
│   └── admin/
├── pages/
│   ├── student/
│   ├── teacher/
│   └── admin/
├── services/
├── context/
├── types/
└── utils/
```

### Backend
```
backend/
├── app/
│   ├── Http/Controllers/Api/
│   ├── Models/
│   └── Services/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
```

---

## 🚀 Deployment

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

### Production Requirements
- Node.js 18.x+
- PHP 8.2+
- MySQL 8.0+
- Composer 2.x

---

## 🔒 Security Measures

1. **Authentication**: Laravel Sanctum + Google OAuth 2.0
2. **Authorization**: Role-based access control
3. **Data Validation**: Laravel Form Requests
4. **SQL Injection Prevention**: Eloquent ORM
5. **XSS Protection**: Input sanitization
6. **CSRF Protection**: Laravel middleware
7. **Rate Limiting**: API throttling
8. **Password Hashing**: bcrypt algorithm

---

<div align="center">
  <p><strong>CoursFlow Architecture v1.0</strong></p>
  <p>Last Updated: November 2024</p>
</div>
