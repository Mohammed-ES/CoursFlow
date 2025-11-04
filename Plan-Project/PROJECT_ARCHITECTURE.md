# 🏗️ CoursFlow Project Architecture# 🏗️ CoursFlow Project Architecture# 🏗️ Architecture du Projet CoursFlow



## 📊 System Overview



```## 📊 System Overview## 📊 Vue d'Ensemble du Système

┌─────────────────────────────────────────────────────────────┐

│                    COURSFLOW PLATFORM                        │

│         Learning Management System (LMS) with AI            │

└─────────────────────────────────────────────────────────────┘``````

                            │

        ┌───────────────────┼───────────────────┐┌─────────────────────────────────────────────────────────────┐┌─────────────────────────────────────────────────────────────┐

        │                   │                   │

   ┌────▼────┐         ┌────▼────┐        ┌────▼────┐│                    COURSFLOW PLATFORM                        ││                    COURSFLOW PLATFORM                        │

   │ STUDENT │         │ TEACHER │        │  ADMIN  │

   │ MODULE  │         │ MODULE  │        │ MODULE  ││              Course Management System (LMS)                  ││              Course Management System (LMS)                  │

   └────┬────┘         └────┬────┘        └────┬────┘

        │                   │                   │└─────────────────────────────────────────────────────────────┘└─────────────────────────────────────────────────────────────┘

        └───────────────────┼───────────────────┘

                            │                            │                            │

        ┌───────────────────┴───────────────────┐

        │                                       │        ┌───────────────────┼───────────────────┐        ┌───────────────────┼───────────────────┐

   ┌────▼────────┐                      ┌──────▼──────┐

   │   FRONTEND  │                      │   BACKEND   │        │                   │                   │        │                   │                   │

   │ React + TS  │◄─────REST API───────►│  Laravel 10 │

   │  Port 5173  │      (Sanctum)       │  Port 8000  │   ┌────▼────┐         ┌────▼────┐        ┌────▼────┐   ┌────▼────┐         ┌────▼────┐        ┌────▼────┐

   └─────────────┘                      └──────┬──────┘

                                              │   │ STUDENT │         │ TEACHER │        │  ADMIN  │   │ STUDENT │         │ TEACHER │        │  ADMIN  │

                                   ┌──────────┴──────────┐

                                   │                     │   │ MODULE  │         │ MODULE  │        │ MODULE  │   │ MODULE  │         │ MODULE  │        │ MODULE  │

                            ┌──────▼──────┐      ┌──────▼──────┐

                            │   MySQL     │      │  Gemini AI  │   └────┬────┘         └────┬────┘        └────┬────┘   └────┬────┘         └────┬────┘        └────┬────┘

                            │  Database   │      │     API     │

                            └─────────────┘      └─────────────┘        │                   │                   │        │                   │                   │

```

        └───────────────────┼───────────────────┘        └───────────────────┼───────────────────┘

---

                            │                            │

## 🎯 System Modules

        ┌───────────────────┴───────────────────┐        ┌───────────────────┴───────────────────┐

### 1. Student Module

        │                                       │        │                                       │

**Main Files:**

- `frontend/src/pages/student/StudentDashboard.tsx`   ┌────▼────────┐                      ┌──────▼──────┐   ┌────▼────────┐                      ┌──────▼──────┐

- `frontend/src/pages/student/StudentProfile.tsx`

- `frontend/src/components/student/StudentSidebar.tsx`   │   FRONTEND  │                      │   BACKEND   │   │   FRONTEND  │                      │   BACKEND   │

- `backend/app/Http/Controllers/Api/StudentController.php`

- `backend/app/Models/Student.php`   │ React + TS  │◄─────REST API───────►│  Laravel 10 │   │ React + TS  │◄─────REST API───────►│  Laravel 10 │



**Features:**   └─────────────┘                      └──────┬──────┘   └─────────────┘                      └──────┬──────┘

- ✅ Dashboard with statistics

- ✅ Profile management                                              │                                              │

- ✅ Enrolled courses display

- ✅ AI-powered quiz taking                                        ┌─────▼─────┐                                        ┌─────▼─────┐

- ✅ Event calendar

- ✅ Real-time notifications                                        │   MySQL   │                                        │   MySQL   │

- ✅ Progress tracking

                                        │ Database  │                                        │ Database  │

**Key Components:**

                                        └───────────┘                                        └───────────┘

| Component | Purpose |

|-----------|---------|``````

| `StudentDashboard.tsx` | Main dashboard with stats and enrolled courses |

| `StudentProfile.tsx` | Profile management and settings |

| `CourseCard.tsx` | Display course information |

| `QuizInterface.tsx` | Interactive quiz taking with AI correction |------

| `Calendar.tsx` | Event and deadline tracking |



---

## 🎯 System Modules## 🎯 Modules du Système

### 2. Teacher Module



**Main Files:**

- `frontend/src/pages/teacher/TeacherDashboard.tsx`### 1. Student Module### 1. Module Étudiant (Student)

- `frontend/src/pages/teacher/TeacherCourses.tsx`

- `frontend/src/pages/teacher/TeacherQuizzes.tsx`**Fichiers principaux :**

- `backend/app/Http/Controllers/Api/TeacherController.php`

- `backend/app/Models/Teacher.php`**Main Files:**- `frontend/src/pages/student/StudentDashboard.tsx`



**Features:**- `frontend/src/pages/student/StudentDashboard.tsx`- `frontend/src/pages/student/StudentProfile.tsx`

- ✅ Course creation and management

- ✅ Quiz creation and editing- `frontend/src/pages/student/StudentProfile.tsx`- `frontend/src/components/student/StudentSidebar.tsx`

- ✅ AI quiz generation (Gemini)

- ✅ Student performance tracking- `frontend/src/components/student/StudentSidebar.tsx`- `backend/app/Http/Controllers/Api/StudentController.php`

- ✅ Automated grading

- ✅ Analytics dashboard- `backend/app/Http/Controllers/Api/StudentController.php`- `backend/app/Models/Student.php`

- ✅ Content management

- `backend/app/Models/Student.php`

**Key Components:**

**Fonctionnalités :**

| Component | Purpose |

|-----------|---------|**Features:**- ✅ Tableau de bord avec statistiques

| `TeacherDashboard.tsx` | Teacher statistics and overview |

| `CourseCreator.tsx` | Create and edit courses |- ✅ Dashboard with statistics- ✅ Gestion du profil

| `QuizCreator.tsx` | Design quizzes with multiple question types |

| `AIQuizGenerator.tsx` | Generate quizzes using Gemini AI |- ✅ Profile management- ✅ Affichage des cours inscrits

| `StudentList.tsx` | View and manage enrolled students |

| `GradingPanel.tsx` | Review and manage quiz results |- ✅ Enrolled courses display- ✅ Passage de quiz avec correction AI



---- ✅ AI-powered quiz taking- ✅ Calendrier des événements



### 3. Admin Module- ✅ Events calendar- ✅ Notifications en temps réel



**Main Files:**- ✅ Real-time notifications- ✅ Assistant AI Gemini

- `frontend/src/pages/admin/AdminDashboard.tsx`

- `frontend/src/pages/admin/AdminUsers.tsx`- ✅ Gemini AI assistant

- `frontend/src/pages/admin/AdminCourses.tsx`

- `backend/app/Http/Controllers/Api/AdminController.php`**Relations Base de Données :**

- `backend/app/Models/Admin.php`

**Database Relations:**```sql

**Features:**

- ✅ User management (students, teachers, admins)```sqlstudents

- ✅ Course approval and publishing

- ✅ System analyticsstudents├── user_id (FK → users)

- ✅ Payment tracking

- ✅ Security controls├── user_id (FK → users)├── paidCourses (Many-to-Many via course_student)

- ✅ Database management

- ✅ Platform configuration├── paidCourses (Many-to-Many via course_student)├── quizAttempts (One-to-Many)



**Key Components:**├── quizAttempts (One-to-Many)└── events (Many-to-Many via student_events)



| Component | Purpose |└── events (Many-to-Many via student_events)```

|-----------|---------|

| `AdminDashboard.tsx` | Platform-wide statistics and overview |```

| `UserManagement.tsx` | Create, edit, and delete users |

| `CourseApproval.tsx` | Review and approve teacher courses |---

| `PaymentTracking.tsx` | Monitor enrollment payments |

| `SystemSettings.tsx` | Configure platform settings |---

| `Analytics.tsx` | View detailed platform analytics |

### 2. Module Enseignant (Teacher)

---

### 2. Teacher Module**Fichiers principaux :**

## 🗄️ Database Schema

- `frontend/src/pages/teacher/TeacherDashboard.tsx`

### Core Tables

**Main Files:**- `frontend/src/pages/teacher/TeacherCourses.tsx`

#### 1. users

```sql- `frontend/src/pages/teacher/TeacherDashboard.tsx`- `frontend/src/pages/teacher/TeacherQuizzes.tsx`

CREATE TABLE users (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,- `frontend/src/pages/teacher/TeacherCourses.tsx`- `backend/app/Http/Controllers/Api/TeacherController.php`

    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,- `frontend/src/pages/teacher/TeacherQuizzes.tsx`- `backend/app/Models/Teacher.php`

    password VARCHAR(255) NOT NULL,

    role ENUM('student', 'teacher', 'admin') NOT NULL,- `backend/app/Http/Controllers/Api/TeacherController.php`

    google_id VARCHAR(255) NULL,

    email_verified_at TIMESTAMP NULL,- `backend/app/Models/Teacher.php`**Fonctionnalités :**

    remember_token VARCHAR(100) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,- ✅ Création et gestion de cours

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

);**Features:**- ✅ Gestion de quiz avec AI

```

- ✅ Course creation and management- ✅ Suivi des étudiants

#### 2. students

```sql- ✅ AI-powered quiz management- ✅ Calendrier professionnel

CREATE TABLE students (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,- ✅ Student tracking- ✅ Gestion des présences

    user_id BIGINT NOT NULL,

    student_id VARCHAR(50) UNIQUE NOT NULL,- ✅ Professional calendar- ✅ Statistiques de performance

    date_of_birth DATE NULL,

    phone VARCHAR(20) NULL,- ✅ Attendance management

    address TEXT NULL,

    enrollment_date DATE NOT NULL,- ✅ Performance statistics**Relations Base de Données :**

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,```sql

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);**Database Relations:**teachers

```

```sql├── user_id (FK → users)

#### 3. teachers

```sqlteachers├── courses (One-to-Many)

CREATE TABLE teachers (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,├── user_id (FK → users)├── quizzes (One-to-Many)

    user_id BIGINT NOT NULL,

    teacher_id VARCHAR(50) UNIQUE NOT NULL,├── courses (One-to-Many)└── events (One-to-Many)

    specialization VARCHAR(255) NULL,

    phone VARCHAR(20) NULL,├── quizzes (One-to-Many)```

    bio TEXT NULL,

    hire_date DATE NOT NULL,└── events (One-to-Many)

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,```---

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);

```

---### 3. Module Administrateur (Admin)

#### 4. admins

```sql**Fichiers principaux :**

CREATE TABLE admins (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,### 3. Administrator Module- `frontend/src/pages/admin/AdminDashboard.tsx`

    user_id BIGINT NOT NULL,

    admin_id VARCHAR(50) UNIQUE NOT NULL,- `frontend/src/pages/admin/AdminUsers.tsx`

    phone VARCHAR(20) NULL,

    department VARCHAR(255) NULL,**Main Files:**- `frontend/src/pages/admin/AdminPayments.tsx`

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,- `frontend/src/pages/admin/AdminDashboard.tsx`- `backend/app/Http/Controllers/Api/AdminController.php`

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);- `frontend/src/pages/admin/AdminUsers.tsx`

```

- `frontend/src/pages/admin/AdminPayments.tsx`**Fonctionnalités :**

#### 5. courses

```sql- `backend/app/Http/Controllers/Api/AdminController.php`- ✅ Gestion des utilisateurs (CRUD)

CREATE TABLE courses (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,- ✅ Gestion des paiements

    course_code VARCHAR(50) UNIQUE NOT NULL,

    title VARCHAR(255) NOT NULL,**Features:**- ✅ Supervision des cours

    description TEXT NULL,

    teacher_id BIGINT NOT NULL,- ✅ User management (CRUD)- ✅ Analytics globales

    category VARCHAR(100) NULL,

    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,- ✅ Payment management- ✅ Gestion des notifications

    duration_hours INT NULL,

    price DECIMAL(10, 2) DEFAULT 0.00,- ✅ Course supervision- ✅ Configuration du système

    max_students INT DEFAULT 30,

    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',- ✅ Global analytics

    start_date DATE NULL,

    end_date DATE NULL,- ✅ Notification management**Relations Base de Données :**

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,- ✅ System configuration```sql

    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE

);users (role = 'admin')

```

**Database Relations:**├── students (supervision)

#### 6. enrollments

```sql```sql├── teachers (supervision)

CREATE TABLE enrollments (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,users (role = 'admin')├── courses (supervision)

    student_id BIGINT NOT NULL,

    course_id BIGINT NOT NULL,├── students (supervision)└── payments (gestion)

    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',├── teachers (supervision)```

    payment_amount DECIMAL(10, 2) NULL,

    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',├── courses (supervision)

    progress_percentage DECIMAL(5, 2) DEFAULT 0.00,

    completion_date TIMESTAMP NULL,└── payments (management)---

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,```

    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,

    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,## 🗄️ Base de Données - Structure Complète

    UNIQUE KEY unique_enrollment (student_id, course_id)

);---

```

### Tables Principales

#### 7. quizzes

```sql## 🗄️ Database - Complete Structure

CREATE TABLE quizzes (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,#### 1. **users** (Authentification)

    course_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,### Main Tables```sql

    description TEXT NULL,

    duration_minutes INT NOT NULL,- id (PK)

    passing_score DECIMAL(5, 2) DEFAULT 50.00,

    max_attempts INT DEFAULT 3,#### 1. **users** (Authentication)- name

    is_published BOOLEAN DEFAULT FALSE,

    created_by BIGINT NOT NULL,```sql- email (unique)

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,- id (PK)- password (hashed)

    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,

    FOREIGN KEY (created_by) REFERENCES teachers(id) ON DELETE CASCADE- name- role (student/teacher/admin)

);

```- email (unique)- email_verified_at



#### 8. quiz_questions- password (hashed)- google_id (OAuth)

```sql

CREATE TABLE quiz_questions (- role (student/teacher/admin)- remember_token

    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    quiz_id BIGINT NOT NULL,- email_verified_at- created_at, updated_at

    question_text TEXT NOT NULL,

    question_type ENUM('multiple_choice', 'true_false', 'short_answer', 'essay') NOT NULL,- google_id (OAuth)```

    points DECIMAL(5, 2) DEFAULT 1.00,

    correct_answer TEXT NULL,- remember_token

    options JSON NULL,

    order_number INT DEFAULT 0,- created_at, updated_at#### 2. **students** (Profils Étudiants)

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,``````sql

    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE

);- id (PK)

```

#### 2. **students** (Student Profiles)- user_id (FK → users)

#### 9. quiz_attempts

```sql```sql- phone

CREATE TABLE quiz_attempts (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,- id (PK)- address

    quiz_id BIGINT NOT NULL,

    student_id BIGINT NOT NULL,- user_id (FK → users)- date_of_birth

    attempt_number INT NOT NULL,

    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,- phone- profile_image

    submitted_at TIMESTAMP NULL,

    score DECIMAL(5, 2) NULL,- address- created_at, updated_at

    ai_feedback TEXT NULL,

    status ENUM('in_progress', 'submitted', 'graded') DEFAULT 'in_progress',- date_of_birth```

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,- profile_image

    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,

    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE- created_at, updated_at#### 3. **teachers** (Profils Enseignants)

);

`````````sql



#### 10. quiz_answers- id (PK)

```sql

CREATE TABLE quiz_answers (#### 3. **teachers** (Teacher Profiles)- user_id (FK → users)

    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    attempt_id BIGINT NOT NULL,```sql- specialization

    question_id BIGINT NOT NULL,

    answer_text TEXT NULL,- id (PK)- bio

    is_correct BOOLEAN NULL,

    points_earned DECIMAL(5, 2) DEFAULT 0.00,- user_id (FK → users)- phone

    ai_feedback TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,- specialization- profile_image

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,- bio- created_at, updated_at

    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE

);- phone```

```

- profile_image

#### 11. notifications

```sql- created_at, updated_at#### 4. **courses** (Cours)

CREATE TABLE notifications (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,``````sql

    user_id BIGINT NOT NULL,

    type VARCHAR(50) NOT NULL,- id (PK)

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,#### 4. **courses** (Courses)- teacher_id (FK → teachers)

    is_read BOOLEAN DEFAULT FALSE,

    related_id BIGINT NULL,```sql- title

    related_type VARCHAR(50) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,- id (PK)- description

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE- teacher_id (FK → teachers)- category

);

```- title- level (beginner/intermediate/advanced)



#### 12. activities- description- price

```sql

CREATE TABLE activities (- category- duration

    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,- level (beginner/intermediate/advanced)- thumbnail

    type VARCHAR(50) NOT NULL,

    description TEXT NOT NULL,- price- video_url

    metadata JSON NULL,

    ip_address VARCHAR(45) NULL,- duration- status (active/inactive)

    user_agent TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,- thumbnail- created_at, updated_at

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);- video_url```

```

- status (active/inactive)

---

- created_at, updated_at#### 5. **quizzes** (Quiz)

## 🔄 Data Flow Diagrams

``````sql

### Course Enrollment Flow

- id (PK)

```

Student                 Frontend                Backend                Database#### 5. **quizzes** (Quizzes)- course_id (FK → courses)

  │                       │                       │                       │

  │──Select Course───────►│                       │                       │```sql- teacher_id (FK → teachers)

  │                       │──API Request─────────►│                       │

  │                       │   POST /enroll        │                       │- id (PK)- title

  │                       │                       │──Check Availability──►│

  │                       │                       │◄──Return Status──────│- course_id (FK → courses)- description

  │                       │                       │──Create Enrollment───►│

  │                       │                       │◄──Return Success─────│- teacher_id (FK → teachers)- duration (minutes)

  │                       │◄──Response───────────│                       │

  │◄──Confirmation───────│                       │                       │- title- passing_score

  │                       │                       │                       │

  │                       │──Send Notification───►│                       │- description- status (active/inactive)

  │◄──Email Notification─┴───────────────────────┴───────────────────────┘

```- duration (minutes)- created_at, updated_at



### AI Quiz Correction Flow- passing_score```



```- status (active/inactive)

Student                 Frontend                Backend              Gemini AI

  │                       │                       │                       │- created_at, updated_at#### 6. **quiz_questions** (Questions de Quiz)

  │──Submit Quiz─────────►│                       │                       │

  │                       │──API Request─────────►│                       │``````sql

  │                       │   POST /quiz/submit   │                       │

  │                       │                       │──Prepare Prompt──────►│- id (PK)

  │                       │                       │   (Questions + Answers)

  │                       │                       │                       │#### 6. **quiz_questions** (Quiz Questions)- quiz_id (FK → quizzes)

  │                       │                       │◄──AI Analysis────────│

  │                       │                       │   (Score + Feedback)  │```sql- question

  │                       │                       │                       │

  │                       │                       │──Save Results────────►DB- id (PK)- type (multiple_choice/true_false/short_answer)

  │                       │◄──Response───────────│                       │

  │◄──Show Results───────│   (Score + Feedback)  │                       │- quiz_id (FK → quizzes)- options (JSON)

```

- question- correct_answer

---

- type (multiple_choice/true_false/short_answer)- points

## 🔐 Authentication Flow

- options (JSON)- created_at, updated_at

### Email/Password Authentication

- correct_answer```

```

1. User enters email and password- points

2. Frontend sends POST to /api/login

3. Backend validates credentials- created_at, updated_at#### 7. **quiz_attempts** (Tentatives de Quiz)

4. Laravel Sanctum creates token

5. Token returned to frontend``````sql

6. Token stored in localStorage

7. Token sent with every API request- id (PK)

```

#### 7. **quiz_attempts** (Quiz Attempts)- student_id (FK → students)

### Google OAuth 2.0 Flow

```sql- quiz_id (FK → quizzes)

```

1. User clicks "Login with Google"- id (PK)- score

2. Redirected to Google OAuth consent screen

3. User approves permissions- student_id (FK → students)- answers (JSON)

4. Google redirects with authorization code

5. Backend exchanges code for user data- quiz_id (FK → quizzes)- status (graded/pending)

6. Create/update user in database

7. Generate Sanctum token- score- started_at

8. Return token to frontend

9. Store token and redirect to dashboard- answers (JSON)- completed_at

```

- status (graded/pending)- created_at, updated_at

---

- started_at```

## 🌐 API Endpoints Summary

- completed_at

### Authentication

- `POST /api/register` - Register new user- created_at, updated_at#### 8. **course_student** (Inscriptions Pivot)

- `POST /api/login` - Email/password login

- `POST /api/logout` - Logout user``````sql

- `GET /api/auth/google` - Google OAuth redirect

- `GET /api/auth/google/callback` - Google OAuth callback- id (PK)



### Student Endpoints#### 8. **course_student** (Enrollment Pivot)- student_id (FK → students)

- `GET /api/student/profile` - Get student profile

- `PUT /api/student/profile` - Update profile```sql- course_id (FK → courses)

- `GET /api/student/courses` - Get enrolled courses

- `POST /api/student/enroll` - Enroll in course- id (PK)- enrolled_at

- `GET /api/student/quizzes` - Get available quizzes

- `POST /api/student/quiz/submit` - Submit quiz (AI correction)- student_id (FK → students)- payment_status (paid/pending/free)



### Teacher Endpoints- course_id (FK → courses)- progress (0-100)

- `GET /api/teacher/profile` - Get teacher profile

- `GET /api/teacher/courses` - Get created courses- enrolled_at- completed_at

- `POST /api/teacher/courses` - Create new course

- `PUT /api/teacher/courses/{id}` - Update course- payment_status (paid/pending/free)- created_at, updated_at

- `DELETE /api/teacher/courses/{id}` - Delete course

- `POST /api/teacher/quizzes` - Create quiz- progress (0-100)```

- `POST /api/teacher/quiz/generate` - AI quiz generation

- completed_at

### Admin Endpoints

- `GET /api/admin/users` - Get all users- created_at, updated_at#### 9. **payments** (Paiements)

- `POST /api/admin/users` - Create user

- `PUT /api/admin/users/{id}` - Update user``````sql

- `DELETE /api/admin/users/{id}` - Delete user

- `GET /api/admin/courses` - Get all courses- id (PK)

- `PUT /api/admin/courses/{id}/approve` - Approve course

- `GET /api/admin/analytics` - Get platform analytics#### 9. **payments** (Payments)- student_id (FK → students)



---```sql- course_id (FK → courses)



## 📂 Frontend File Structure- id (PK)- amount



```- student_id (FK → students)- payment_method

frontend/src/

├── components/- course_id (FK → courses)- transaction_id

│   ├── common/

│   │   ├── Navbar.tsx- amount- status (completed/pending/failed)

│   │   ├── Sidebar.tsx

│   │   ├── Footer.tsx- payment_method- paid_at

│   │   └── LoadingSpinner.tsx

│   ├── student/- transaction_id- created_at, updated_at

│   │   ├── StudentSidebar.tsx

│   │   ├── CourseCard.tsx- status (completed/pending/failed)```

│   │   ├── QuizInterface.tsx

│   │   └── Calendar.tsx- paid_at

│   ├── teacher/

│   │   ├── TeacherSidebar.tsx- created_at, updated_at#### 10. **events** (Événements Calendrier)

│   │   ├── CourseCreator.tsx

│   │   ├── QuizCreator.tsx``````sql

│   │   └── AIQuizGenerator.tsx

│   └── admin/- id (PK)

│       ├── AdminSidebar.tsx

│       ├── UserManagement.tsx#### 10. **events** (Calendar Events)- teacher_id (FK → teachers)

│       └── Analytics.tsx

├── pages/```sql- title

│   ├── Home.tsx

│   ├── Login.tsx- id (PK)- description

│   ├── Register.tsx

│   ├── student/- teacher_id (FK → teachers)- start_time

│   │   ├── StudentDashboard.tsx

│   │   ├── StudentProfile.tsx- title- end_time

│   │   └── StudentCourses.tsx

│   ├── teacher/- description- location

│   │   ├── TeacherDashboard.tsx

│   │   ├── TeacherCourses.tsx- start_time- type (class/exam/meeting)

│   │   └── TeacherQuizzes.tsx

│   └── admin/- end_time- created_at, updated_at

│       ├── AdminDashboard.tsx

│       ├── AdminUsers.tsx- location```

│       └── AdminCourses.tsx

├── services/- type (class/exam/meeting)

│   ├── api.ts

│   ├── authService.ts- created_at, updated_at#### 11. **student_events** (Événements Étudiants Pivot)

│   ├── studentService.ts

│   ├── teacherService.ts``````sql

│   └── adminService.ts

├── context/- id (PK)

│   └── AuthContext.tsx

├── types/#### 11. **student_events** (Student Events Pivot)- student_id (FK → students)

│   └── index.ts

├── utils/```sql- event_id (FK → events)

│   ├── formatters.ts

│   └── validators.ts- id (PK)- status (invited/confirmed/declined)

├── App.tsx

└── main.tsx- student_id (FK → students)- created_at, updated_at

```

- event_id (FK → events)```

---

- status (invited/confirmed/declined)

## 📂 Backend File Structure

- created_at, updated_at#### 12. **notifications** (Notifications)

```

backend/``````sql

├── app/

│   ├── Http/- id (PK)

│   │   ├── Controllers/

│   │   │   └── Api/#### 12. **notifications** (Notifications)- user_id (FK → users)

│   │   │       ├── AuthController.php

│   │   │       ├── StudentController.php```sql- type (info/warning/success/error)

│   │   │       ├── TeacherController.php

│   │   │       ├── AdminController.php- id (PK)- title

│   │   │       ├── CourseController.php

│   │   │       └── QuizController.php- user_id (FK → users)- message

│   │   ├── Middleware/

│   │   │   ├── Authenticate.php- type (info/warning/success/error)- read_at

│   │   │   ├── RoleMiddleware.php

│   │   │   └── CorsMiddleware.php- title- created_at, updated_at

│   │   └── Requests/

│   │       ├── LoginRequest.php- message```

│   │       ├── RegisterRequest.php

│   │       └── CourseRequest.php- read_at

│   ├── Models/

│   │   ├── User.php- created_at, updated_at---

│   │   ├── Student.php

│   │   ├── Teacher.php```

│   │   ├── Admin.php

│   │   ├── Course.php## 🔄 Flux de Données

│   │   ├── Enrollment.php

│   │   ├── Quiz.php---

│   │   └── QuizAttempt.php

│   └── Services/### Flux d'Inscription à un Cours

│       ├── GeminiService.php

│       ├── AuthService.php## 🔄 Data Flow

│       └── NotificationService.php

├── config/```

│   ├── app.php

│   ├── database.php### Course Enrollment Flow┌──────────┐     1. Sélection     ┌──────────┐

│   ├── cors.php

│   ├── sanctum.php│ Student  │─────────────────────►│  Course  │

│   └── services.php

├── database/```│ Frontend │                       │   List   │

│   ├── migrations/

│   └── seeders/┌──────────┐     1. Selection     ┌──────────┐└──────────┘                       └──────────┘

├── routes/

│   ├── api.php│ Student  │─────────────────────►│  Course  │     │                                   │

│   └── web.php

└── .env│ Frontend │                       │   List   │     │ 2. Click "Enroll"                 │

```

└──────────┘                       └──────────┘     ▼                                   ▼

---

     │                                   │┌──────────────────────────────────────────┐

## 🚀 Deployment Specifications

     │ 2. Click "Enroll"                 ││      POST /api/courses/{id}/enroll       │

### Development Environment

- **Frontend**: Vite Dev Server on `http://localhost:5173`     ▼                                   ▼└──────────────────────────────────────────┘

- **Backend**: Laravel Artisan on `http://localhost:8000`

- **Database**: MySQL on `localhost:3306`┌──────────────────────────────────────────┐     │



### Production Requirements│      POST /api/courses/{id}/enroll       │     │ 3. Vérification paiement



#### Frontend (Vercel/Netlify)└──────────────────────────────────────────┘     ▼

- Node.js 18.x or higher

- Build command: `npm run build`     │┌──────────────────────────────────────────┐

- Output directory: `dist`

- Environment variables: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`     │ 3. Payment verification│   CourseController@enroll (Laravel)      │



#### Backend (AWS/DigitalOcean)     ▼└──────────────────────────────────────────┘

- PHP 8.2 or higher

- Composer 2.x┌──────────────────────────────────────────┐     │

- MySQL 8.0 or higher

- Laravel optimizations: `php artisan optimize`, `php artisan config:cache`│   CourseController@enroll (Laravel)      │     │ 4. Création enregistrement

- Environment variables: Database credentials, Gemini API key, Google OAuth

└──────────────────────────────────────────┘     ▼

#### Database

- MySQL 8.0 with InnoDB engine     │┌──────────────────────────────────────────┐

- Regular backups scheduled

- Indexes on foreign keys and frequently queried columns     │ 4. Create enrollment record│  course_student table (MySQL)            │



---     ▼│  - student_id                            │



## 🔧 Key Technologies Integration┌──────────────────────────────────────────┐│  - course_id                             │



### Google Gemini AI Integration│  course_student table (MySQL)            ││  - payment_status: 'paid'                │

**File**: `backend/app/Services/GeminiService.php`

│  - student_id                            │└──────────────────────────────────────────┘

**Features**:

- Quiz auto-correction│  - course_id                             │     │

- Quiz generation from course topics

- Intelligent feedback generation│  - payment_status: 'paid'                │     │ 5. Notification

- Error handling and retry logic

└──────────────────────────────────────────┘     ▼

### Laravel Sanctum Authentication

**Configuration**: `config/sanctum.php`     │┌──────────────────────────────────────────┐



**Features**:     │ 5. Send notification│  notifications table                     │

- Stateless API authentication

- Token management     ▼│  "Vous êtes inscrit au cours X"         │

- CORS configuration

- Middleware protection┌──────────────────────────────────────────┐└──────────────────────────────────────────┘



### React Router Integration│  notifications table                     │```

**File**: `frontend/src/App.tsx`

│  "You are enrolled in course X"          │

**Routes**:

- Public routes: `/`, `/login`, `/register`└──────────────────────────────────────────┘---

- Protected routes: `/student/*`, `/teacher/*`, `/admin/*`

- Role-based route guards```



---### Flux de Correction de Quiz par AI



## 📊 Performance Optimization---



### Frontend```

- Code splitting with React.lazy()

- Image optimization### AI Quiz Correction Flow┌──────────┐     1. Soumet Quiz    ┌──────────┐

- Tailwind CSS purging

- Vite build optimization│ Student  │─────────────────────►│   Quiz   │



### Backend```│          │                       │  Answers │

- Eloquent query optimization

- Database indexing┌──────────┐     1. Submit Quiz    ┌──────────┐└──────────┘                       └──────────┘

- Response caching

- API rate limiting│ Student  │─────────────────────►│   Quiz   │     │                                   │



### Database│          │                       │  Answers │     │ 2. POST /api/quiz/submit          │

- Proper indexing on foreign keys

- Query optimization└──────────┘                       └──────────┘     ▼                                   ▼

- Connection pooling

- Regular maintenance     │                                   │┌──────────────────────────────────────────┐



---     │ 2. POST /api/quiz/submit          ││    QuizController@submit (Laravel)       │



## 🔒 Security Measures     ▼                                   ▼└──────────────────────────────────────────┘



1. **Authentication**: Laravel Sanctum + Google OAuth 2.0┌──────────────────────────────────────────┐     │

2. **Authorization**: Role-based access control

3. **Data Validation**: Laravel Form Requests│    QuizController@submit (Laravel)       │     │ 3. Envoi à Gemini AI

4. **SQL Injection Prevention**: Eloquent ORM

5. **XSS Protection**: Input sanitization└──────────────────────────────────────────┘     ▼

6. **CSRF Protection**: Laravel middleware

7. **HTTPS**: SSL/TLS encryption     │┌──────────────────────────────────────────┐

8. **Environment Variables**: Secure credential storage

9. **Rate Limiting**: API throttling     │ 3. Send to Gemini AI│       Google Gemini API                  │

10. **Password Hashing**: bcrypt algorithm

     ▼│   - Analyse des réponses                 │

---

┌──────────────────────────────────────────┐│   - Génération du score                  │

## 📈 Scalability Considerations

│       Google Gemini API                  ││   - Feedback personnalisé                │

### Horizontal Scaling

- Load balancing for backend servers│   - Analyze answers                      │└──────────────────────────────────────────┘

- Database replication (master-slave)

- CDN for static assets│   - Generate score                       │     │

- Redis for caching and sessions

│   - Personalized feedback                │     │ 4. Sauvegarde résultats

### Vertical Scaling

- Optimize database queries└──────────────────────────────────────────┘     ▼

- Implement caching strategies

- Use queue workers for heavy tasks     │┌──────────────────────────────────────────┐

- Monitor and optimize resource usage

     │ 4. Save results│   quiz_attempts table                    │

---

     ▼│   - score calculé                        │

## 🎯 Future Enhancements

┌──────────────────────────────────────────┐│   - status: 'graded'                     │

- [ ] Video streaming integration

- [ ] Live chat between students and teachers│   quiz_attempts table                    ││   - answers avec feedback AI             │

- [ ] Mobile application (React Native)

- [ ] Advanced analytics and reporting│   - calculated score                     │└──────────────────────────────────────────┘

- [ ] Gamification features

- [ ] Multi-language support│   - status: 'graded'                     │     │

- [ ] Payment gateway integration

- [ ] Certificate blockchain verification│   - answers with AI feedback             │     │ 5. Notification résultat



---└──────────────────────────────────────────┘     ▼



<div align="center">     │┌──────────────────────────────────────────┐

  <p><strong>CoursFlow Architecture v1.0</strong></p>

  <p>Last Updated: November 2024</p>     │ 5. Result notification│  Student Dashboard                       │

</div>

     ▼│  Score affiché + Feedback AI             │

┌──────────────────────────────────────────┐└──────────────────────────────────────────┘

│  Student Dashboard                       │```

│  Display Score + AI Feedback             │

└──────────────────────────────────────────┘---

```

## 🔐 Authentification & Sécurité

---

### Flux d'Authentification (Laravel Sanctum)

## 🔐 Authentication & Security

```

### Authentication Flow (Laravel Sanctum)┌──────────┐                         ┌──────────┐

│  Login   │                         │ Laravel  │

```│  Form    │                         │ Backend  │

┌──────────┐                         ┌──────────┐└────┬─────┘                         └────┬─────┘

│  Login   │                         │ Laravel  │     │                                    │

│  Form    │                         │ Backend  │     │ 1. POST /api/login                 │

└────┬─────┘                         └────┬─────┘     │    { email, password }             │

     │                                    │     ├───────────────────────────────────►│

     │ 1. POST /api/login                 │     │                                    │

     │    { email, password }             │     │                   2. Vérification  │

     ├───────────────────────────────────►│     │                      - Hash check  │

     │                                    │     │                      - User exists │

     │                   2. Verification  │     │                                    │

     │                      - Hash check  │     │ 3. Token + User data               │

     │                      - User exists │     │◄───────────────────────────────────┤

     │                                    │     │    { token, user, role }           │

     │ 3. Token + User data               │     │                                    │

     │◄───────────────────────────────────┤     │ 4. Stockage token                  │

     │    { token, user, role }           │     │    localStorage.setItem()          │

     │                                    │     │                                    │

     │ 4. Store token                     │     │ 5. Requêtes authentifiées          │

     │    localStorage.setItem()          │     │    Headers: Authorization Bearer   │

     │                                    │     ├───────────────────────────────────►│

     │ 5. Authenticated requests          │     │                                    │

     │    Headers: Authorization Bearer   │```

     ├───────────────────────────────────►│

     │                                    │### Sécurité Mise en Place

```

✅ **Authentification**

### Security Implementation- Laravel Sanctum (token-based)

- Password hashing avec bcrypt

✅ **Authentication**- Google OAuth 2.0 integration

- Laravel Sanctum (token-based)

- Password hashing with bcrypt✅ **Protection**

- Google OAuth 2.0 integration- CSRF tokens

- XSS prevention (React escaping)

✅ **Protection**- SQL injection (Eloquent ORM)

- CSRF tokens- Rate limiting API (60 req/min)

- XSS prevention (React escaping)

- SQL injection (Eloquent ORM)✅ **Validation**

- API rate limiting (60 req/min)- Frontend: React Hook Form

- Backend: Laravel Request Validation

✅ **Validation**- Double validation (client + serveur)

- Frontend: React Hook Form

- Backend: Laravel Request Validation---

- Double validation (client + server)

## 🌐 API Endpoints

---

### Authentication

## 🌐 API Endpoints```

POST   /api/register         - Inscription

### AuthenticationPOST   /api/login           - Connexion

```POST   /api/logout          - Déconnexion

POST   /api/register         - RegistrationGET    /api/user            - User actuel

POST   /api/login            - LoginPOST   /api/google/callback - OAuth Google

POST   /api/logout           - Logout```

GET    /api/user             - Current user

POST   /api/google/callback  - Google OAuth### Students

``````

GET    /api/student/profile          - Profil étudiant

### StudentsPUT    /api/student/profile          - Mise à jour profil

```GET    /api/student/courses          - Cours inscrits

GET    /api/student/profile          - Student profileGET    /api/student/quiz/{id}        - Détails quiz

PUT    /api/student/profile          - Update profilePOST   /api/student/quiz/submit      - Soumettre quiz

GET    /api/student/courses          - Enrolled coursesGET    /api/student/events           - Événements

GET    /api/student/quiz/{id}        - Quiz detailsGET    /api/student/notifications    - Notifications

POST   /api/student/quiz/submit      - Submit quiz```

GET    /api/student/events           - Events

GET    /api/student/notifications    - Notifications### Teachers

``````

GET    /api/teacher/dashboard        - Dashboard

### TeachersGET    /api/teacher/courses          - Mes cours

```POST   /api/teacher/courses          - Créer cours

GET    /api/teacher/dashboard        - DashboardPUT    /api/teacher/courses/{id}     - Modifier cours

GET    /api/teacher/courses          - My coursesDELETE /api/teacher/courses/{id}     - Supprimer cours

POST   /api/teacher/courses          - Create courseGET    /api/teacher/students         - Mes étudiants

PUT    /api/teacher/courses/{id}     - Update coursePOST   /api/teacher/quiz             - Créer quiz

DELETE /api/teacher/courses/{id}     - Delete courseGET    /api/teacher/events           - Mes événements

GET    /api/teacher/students         - My students```

POST   /api/teacher/quiz             - Create quiz

GET    /api/teacher/events           - My events### Admin

``````

GET    /api/admin/users              - Liste utilisateurs

### AdminPOST   /api/admin/users              - Créer utilisateur

```PUT    /api/admin/users/{id}         - Modifier utilisateur

GET    /api/admin/users              - List usersDELETE /api/admin/users/{id}         - Supprimer utilisateur

POST   /api/admin/users              - Create userGET    /api/admin/payments           - Gestion paiements

PUT    /api/admin/users/{id}         - Update userGET    /api/admin/courses            - Tous les cours

DELETE /api/admin/users/{id}         - Delete userGET    /api/admin/statistics         - Statistiques globales

GET    /api/admin/payments           - Payment management```

GET    /api/admin/courses            - All courses

GET    /api/admin/statistics         - Global statistics---

```

## 📁 Structure des Fichiers

---

### Frontend (React + TypeScript)

## 📁 File Structure```

frontend/src/

### Frontend (React + TypeScript)├── assets/                 # Images, logos, fonts

```├── components/

frontend/src/│   ├── common/            # Composants réutilisables

├── assets/                 # Images, logos, fonts│   │   ├── Button.tsx

├── components/│   │   ├── Input.tsx

│   ├── common/            # Reusable components│   │   └── Card.tsx

│   │   ├── Button.tsx│   ├── student/           # Composants étudiants

│   │   ├── Input.tsx│   │   ├── StudentSidebar.tsx

│   │   └── Card.tsx│   │   └── StudentNavbar.tsx

│   ├── student/           # Student components│   ├── teacher/           # Composants enseignants

│   │   ├── StudentSidebar.tsx│   └── admin/             # Composants admin

│   │   └── StudentNavbar.tsx├── pages/

│   ├── teacher/           # Teacher components│   ├── student/           # Pages étudiants

│   └── admin/             # Admin components│   ├── teacher/           # Pages enseignants

├── pages/│   └── admin/             # Pages admin

│   ├── student/           # Student pages├── context/               # React Context

│   ├── teacher/           # Teacher pages│   ├── AuthContext.tsx

│   └── admin/             # Admin pages│   └── ThemeContext.tsx

├── context/               # React Context├── services/              # Services API

│   ├── AuthContext.tsx│   ├── api.ts

│   └── ThemeContext.tsx│   ├── authService.ts

├── services/              # API services│   └── courseService.ts

│   ├── api.ts├── utils/                 # Utilitaires

│   ├── authService.ts├── types/                 # Types TypeScript

│   └── courseService.ts└── App.tsx               # Composant principal

├── utils/                 # Utilities```

├── types/                 # TypeScript types

└── App.tsx                # Main component### Backend (Laravel)

``````

backend/

### Backend (Laravel)├── app/

```│   ├── Http/

backend/│   │   ├── Controllers/

├── app/│   │   │   └── Api/

│   ├── Http/│   │   │       ├── StudentController.php

│   │   ├── Controllers/│   │   │       ├── TeacherController.php

│   │   │   └── Api/│   │   │       └── AdminController.php

│   │   │       ├── StudentController.php│   │   └── Middleware/

│   │   │       ├── TeacherController.php│   │       └── CheckRole.php

│   │   │       └── AdminController.php│   ├── Models/

│   │   └── Middleware/│   │   ├── User.php

│   │       └── CheckRole.php│   │   ├── Student.php

│   ├── Models/│   │   ├── Teacher.php

│   │   ├── User.php│   │   ├── Course.php

│   │   ├── Student.php│   │   ├── Quiz.php

│   │   ├── Teacher.php│   │   └── Payment.php

│   │   ├── Course.php│   └── Services/

│   │   ├── Quiz.php│       └── GeminiService.php

│   │   └── Payment.php├── database/

│   └── Services/│   ├── migrations/        # Migrations SQL

│       └── GeminiService.php│   └── seeders/          # Données de test

├── database/├── routes/

│   ├── migrations/        # SQL migrations│   └── api.php           # Routes API

│   └── seeders/           # Test data└── storage/

├── routes/    ├── app/public/       # Fichiers uploadés

│   └── api.php            # API routes    └── logs/             # Logs application

└── storage/```

    ├── app/public/        # Uploaded files

    └── logs/              # Application logs---

```

## 🚀 Déploiement

---

### Environnement de Développement

## 🚀 Deployment- **OS**: Windows 10/11

- **Serveur**: XAMPP (Apache + MySQL)

### Development Environment- **PHP**: 8.1+

- **OS**: Windows 10/11- **Node.js**: 18.x

- **Server**: XAMPP (Apache + MySQL)- **Database**: MySQL 8.0

- **PHP**: 8.1+

- **Node.js**: 18.x### Environnement de Production (Recommandé)

- **Database**: MySQL 8.0- **Serveur**: VPS Linux (Ubuntu 22.04)

- **Web Server**: Nginx

### Production Environment (Recommended)- **PHP**: PHP-FPM 8.2

- **Server**: VPS Linux (Ubuntu 22.04)- **Database**: MySQL 8.0

- **Web Server**: Nginx- **SSL**: Let's Encrypt

- **PHP**: PHP-FPM 8.2- **Process Manager**: PM2 (pour Node si besoin)

- **Database**: MySQL 8.0

- **SSL**: Let's Encrypt---

- **Process Manager**: PM2 (for Node if needed)

## 📝 Notes Importantes

---

### Performance

## 📊 Technology Stack- ✅ Lazy loading des composants React

- ✅ Code splitting avec Vite

### Frontend- ✅ Optimisation des images

| Technology | Version | Purpose |- ✅ Cache API avec Redis (recommandé prod)

|------------|---------|---------|

| React | 18.2.0 | UI library |### Scalabilité

| TypeScript | 5.0.2 | Type safety |- ✅ Architecture modulaire

| Vite | 4.4.5 | Build tool |- ✅ Séparation frontend/backend

| Tailwind CSS | 3.4.0 | Styling |- ✅ API RESTful stateless

| Framer Motion | 10.16.4 | Animations |- ✅ Base de données normalisée

| React Router | 6.16.0 | Routing |

| Axios | 1.5.0 | HTTP client |### Maintenance

- ✅ Logs centralisés (Laravel)

### Backend- ✅ Error handling complet

| Technology | Version | Purpose |- ✅ Tests unitaires (à développer)

|------------|---------|---------|- ✅ Documentation complète

| Laravel | 10.x | PHP framework |

| PHP | 8.2+ | Server language |---

| MySQL | 8.0 | Database |

| Laravel Sanctum | 3.3 | Authentication |**Dernière mise à jour:** 4 Novembre 2025

| Google Gemini API | Latest | AI integration |
| Laravel Socialite | 5.9 | OAuth |

---

## 📝 Important Notes

### Performance
- ✅ Lazy loading of React components
- ✅ Code splitting with Vite
- ✅ Image optimization
- ✅ API caching with Redis (recommended for prod)

### Scalability
- ✅ Modular architecture
- ✅ Frontend/backend separation
- ✅ RESTful stateless API
- ✅ Normalized database

### Maintenance
- ✅ Centralized logging (Laravel)
- ✅ Complete error handling
- ✅ Unit tests (to be developed)
- ✅ Complete documentation

---

**Last Updated:** November 4, 2025
