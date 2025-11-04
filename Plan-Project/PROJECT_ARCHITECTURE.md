# 🏗️ CoursFlow Project Architecture# 🏗️ Architecture du Projet CoursFlow



## 📊 System Overview## 📊 Vue d'Ensemble du Système



``````

┌─────────────────────────────────────────────────────────────┐┌─────────────────────────────────────────────────────────────┐

│                    COURSFLOW PLATFORM                        ││                    COURSFLOW PLATFORM                        │

│              Course Management System (LMS)                  ││              Course Management System (LMS)                  │

└─────────────────────────────────────────────────────────────┘└─────────────────────────────────────────────────────────────┘

                            │                            │

        ┌───────────────────┼───────────────────┐        ┌───────────────────┼───────────────────┐

        │                   │                   │        │                   │                   │

   ┌────▼────┐         ┌────▼────┐        ┌────▼────┐   ┌────▼────┐         ┌────▼────┐        ┌────▼────┐

   │ STUDENT │         │ TEACHER │        │  ADMIN  │   │ STUDENT │         │ TEACHER │        │  ADMIN  │

   │ MODULE  │         │ MODULE  │        │ MODULE  │   │ MODULE  │         │ MODULE  │        │ MODULE  │

   └────┬────┘         └────┬────┘        └────┬────┘   └────┬────┘         └────┬────┘        └────┬────┘

        │                   │                   │        │                   │                   │

        └───────────────────┼───────────────────┘        └───────────────────┼───────────────────┘

                            │                            │

        ┌───────────────────┴───────────────────┐        ┌───────────────────┴───────────────────┐

        │                                       │        │                                       │

   ┌────▼────────┐                      ┌──────▼──────┐   ┌────▼────────┐                      ┌──────▼──────┐

   │   FRONTEND  │                      │   BACKEND   │   │   FRONTEND  │                      │   BACKEND   │

   │ React + TS  │◄─────REST API───────►│  Laravel 10 │   │ React + TS  │◄─────REST API───────►│  Laravel 10 │

   └─────────────┘                      └──────┬──────┘   └─────────────┘                      └──────┬──────┘

                                              │                                              │

                                        ┌─────▼─────┐                                        ┌─────▼─────┐

                                        │   MySQL   │                                        │   MySQL   │

                                        │ Database  │                                        │ Database  │

                                        └───────────┘                                        └───────────┘

``````



------



## 🎯 System Modules## 🎯 Modules du Système



### 1. Student Module### 1. Module Étudiant (Student)

**Fichiers principaux :**

**Main Files:**- `frontend/src/pages/student/StudentDashboard.tsx`

- `frontend/src/pages/student/StudentDashboard.tsx`- `frontend/src/pages/student/StudentProfile.tsx`

- `frontend/src/pages/student/StudentProfile.tsx`- `frontend/src/components/student/StudentSidebar.tsx`

- `frontend/src/components/student/StudentSidebar.tsx`- `backend/app/Http/Controllers/Api/StudentController.php`

- `backend/app/Http/Controllers/Api/StudentController.php`- `backend/app/Models/Student.php`

- `backend/app/Models/Student.php`

**Fonctionnalités :**

**Features:**- ✅ Tableau de bord avec statistiques

- ✅ Dashboard with statistics- ✅ Gestion du profil

- ✅ Profile management- ✅ Affichage des cours inscrits

- ✅ Enrolled courses display- ✅ Passage de quiz avec correction AI

- ✅ AI-powered quiz taking- ✅ Calendrier des événements

- ✅ Events calendar- ✅ Notifications en temps réel

- ✅ Real-time notifications- ✅ Assistant AI Gemini

- ✅ Gemini AI assistant

**Relations Base de Données :**

**Database Relations:**```sql

```sqlstudents

students├── user_id (FK → users)

├── user_id (FK → users)├── paidCourses (Many-to-Many via course_student)

├── paidCourses (Many-to-Many via course_student)├── quizAttempts (One-to-Many)

├── quizAttempts (One-to-Many)└── events (Many-to-Many via student_events)

└── events (Many-to-Many via student_events)```

```

---

---

### 2. Module Enseignant (Teacher)

### 2. Teacher Module**Fichiers principaux :**

- `frontend/src/pages/teacher/TeacherDashboard.tsx`

**Main Files:**- `frontend/src/pages/teacher/TeacherCourses.tsx`

- `frontend/src/pages/teacher/TeacherDashboard.tsx`- `frontend/src/pages/teacher/TeacherQuizzes.tsx`

- `frontend/src/pages/teacher/TeacherCourses.tsx`- `backend/app/Http/Controllers/Api/TeacherController.php`

- `frontend/src/pages/teacher/TeacherQuizzes.tsx`- `backend/app/Models/Teacher.php`

- `backend/app/Http/Controllers/Api/TeacherController.php`

- `backend/app/Models/Teacher.php`**Fonctionnalités :**

- ✅ Création et gestion de cours

**Features:**- ✅ Gestion de quiz avec AI

- ✅ Course creation and management- ✅ Suivi des étudiants

- ✅ AI-powered quiz management- ✅ Calendrier professionnel

- ✅ Student tracking- ✅ Gestion des présences

- ✅ Professional calendar- ✅ Statistiques de performance

- ✅ Attendance management

- ✅ Performance statistics**Relations Base de Données :**

```sql

**Database Relations:**teachers

```sql├── user_id (FK → users)

teachers├── courses (One-to-Many)

├── user_id (FK → users)├── quizzes (One-to-Many)

├── courses (One-to-Many)└── events (One-to-Many)

├── quizzes (One-to-Many)```

└── events (One-to-Many)

```---



---### 3. Module Administrateur (Admin)

**Fichiers principaux :**

### 3. Administrator Module- `frontend/src/pages/admin/AdminDashboard.tsx`

- `frontend/src/pages/admin/AdminUsers.tsx`

**Main Files:**- `frontend/src/pages/admin/AdminPayments.tsx`

- `frontend/src/pages/admin/AdminDashboard.tsx`- `backend/app/Http/Controllers/Api/AdminController.php`

- `frontend/src/pages/admin/AdminUsers.tsx`

- `frontend/src/pages/admin/AdminPayments.tsx`**Fonctionnalités :**

- `backend/app/Http/Controllers/Api/AdminController.php`- ✅ Gestion des utilisateurs (CRUD)

- ✅ Gestion des paiements

**Features:**- ✅ Supervision des cours

- ✅ User management (CRUD)- ✅ Analytics globales

- ✅ Payment management- ✅ Gestion des notifications

- ✅ Course supervision- ✅ Configuration du système

- ✅ Global analytics

- ✅ Notification management**Relations Base de Données :**

- ✅ System configuration```sql

users (role = 'admin')

**Database Relations:**├── students (supervision)

```sql├── teachers (supervision)

users (role = 'admin')├── courses (supervision)

├── students (supervision)└── payments (gestion)

├── teachers (supervision)```

├── courses (supervision)

└── payments (management)---

```

## 🗄️ Base de Données - Structure Complète

---

### Tables Principales

## 🗄️ Database - Complete Structure

#### 1. **users** (Authentification)

### Main Tables```sql

- id (PK)

#### 1. **users** (Authentication)- name

```sql- email (unique)

- id (PK)- password (hashed)

- name- role (student/teacher/admin)

- email (unique)- email_verified_at

- password (hashed)- google_id (OAuth)

- role (student/teacher/admin)- remember_token

- email_verified_at- created_at, updated_at

- google_id (OAuth)```

- remember_token

- created_at, updated_at#### 2. **students** (Profils Étudiants)

``````sql

- id (PK)

#### 2. **students** (Student Profiles)- user_id (FK → users)

```sql- phone

- id (PK)- address

- user_id (FK → users)- date_of_birth

- phone- profile_image

- address- created_at, updated_at

- date_of_birth```

- profile_image

- created_at, updated_at#### 3. **teachers** (Profils Enseignants)

``````sql

- id (PK)

#### 3. **teachers** (Teacher Profiles)- user_id (FK → users)

```sql- specialization

- id (PK)- bio

- user_id (FK → users)- phone

- specialization- profile_image

- bio- created_at, updated_at

- phone```

- profile_image

- created_at, updated_at#### 4. **courses** (Cours)

``````sql

- id (PK)

#### 4. **courses** (Courses)- teacher_id (FK → teachers)

```sql- title

- id (PK)- description

- teacher_id (FK → teachers)- category

- title- level (beginner/intermediate/advanced)

- description- price

- category- duration

- level (beginner/intermediate/advanced)- thumbnail

- price- video_url

- duration- status (active/inactive)

- thumbnail- created_at, updated_at

- video_url```

- status (active/inactive)

- created_at, updated_at#### 5. **quizzes** (Quiz)

``````sql

- id (PK)

#### 5. **quizzes** (Quizzes)- course_id (FK → courses)

```sql- teacher_id (FK → teachers)

- id (PK)- title

- course_id (FK → courses)- description

- teacher_id (FK → teachers)- duration (minutes)

- title- passing_score

- description- status (active/inactive)

- duration (minutes)- created_at, updated_at

- passing_score```

- status (active/inactive)

- created_at, updated_at#### 6. **quiz_questions** (Questions de Quiz)

``````sql

- id (PK)

#### 6. **quiz_questions** (Quiz Questions)- quiz_id (FK → quizzes)

```sql- question

- id (PK)- type (multiple_choice/true_false/short_answer)

- quiz_id (FK → quizzes)- options (JSON)

- question- correct_answer

- type (multiple_choice/true_false/short_answer)- points

- options (JSON)- created_at, updated_at

- correct_answer```

- points

- created_at, updated_at#### 7. **quiz_attempts** (Tentatives de Quiz)

``````sql

- id (PK)

#### 7. **quiz_attempts** (Quiz Attempts)- student_id (FK → students)

```sql- quiz_id (FK → quizzes)

- id (PK)- score

- student_id (FK → students)- answers (JSON)

- quiz_id (FK → quizzes)- status (graded/pending)

- score- started_at

- answers (JSON)- completed_at

- status (graded/pending)- created_at, updated_at

- started_at```

- completed_at

- created_at, updated_at#### 8. **course_student** (Inscriptions Pivot)

``````sql

- id (PK)

#### 8. **course_student** (Enrollment Pivot)- student_id (FK → students)

```sql- course_id (FK → courses)

- id (PK)- enrolled_at

- student_id (FK → students)- payment_status (paid/pending/free)

- course_id (FK → courses)- progress (0-100)

- enrolled_at- completed_at

- payment_status (paid/pending/free)- created_at, updated_at

- progress (0-100)```

- completed_at

- created_at, updated_at#### 9. **payments** (Paiements)

``````sql

- id (PK)

#### 9. **payments** (Payments)- student_id (FK → students)

```sql- course_id (FK → courses)

- id (PK)- amount

- student_id (FK → students)- payment_method

- course_id (FK → courses)- transaction_id

- amount- status (completed/pending/failed)

- payment_method- paid_at

- transaction_id- created_at, updated_at

- status (completed/pending/failed)```

- paid_at

- created_at, updated_at#### 10. **events** (Événements Calendrier)

``````sql

- id (PK)

#### 10. **events** (Calendar Events)- teacher_id (FK → teachers)

```sql- title

- id (PK)- description

- teacher_id (FK → teachers)- start_time

- title- end_time

- description- location

- start_time- type (class/exam/meeting)

- end_time- created_at, updated_at

- location```

- type (class/exam/meeting)

- created_at, updated_at#### 11. **student_events** (Événements Étudiants Pivot)

``````sql

- id (PK)

#### 11. **student_events** (Student Events Pivot)- student_id (FK → students)

```sql- event_id (FK → events)

- id (PK)- status (invited/confirmed/declined)

- student_id (FK → students)- created_at, updated_at

- event_id (FK → events)```

- status (invited/confirmed/declined)

- created_at, updated_at#### 12. **notifications** (Notifications)

``````sql

- id (PK)

#### 12. **notifications** (Notifications)- user_id (FK → users)

```sql- type (info/warning/success/error)

- id (PK)- title

- user_id (FK → users)- message

- type (info/warning/success/error)- read_at

- title- created_at, updated_at

- message```

- read_at

- created_at, updated_at---

```

## 🔄 Flux de Données

---

### Flux d'Inscription à un Cours

## 🔄 Data Flow

```

### Course Enrollment Flow┌──────────┐     1. Sélection     ┌──────────┐

│ Student  │─────────────────────►│  Course  │

```│ Frontend │                       │   List   │

┌──────────┐     1. Selection     ┌──────────┐└──────────┘                       └──────────┘

│ Student  │─────────────────────►│  Course  │     │                                   │

│ Frontend │                       │   List   │     │ 2. Click "Enroll"                 │

└──────────┘                       └──────────┘     ▼                                   ▼

     │                                   │┌──────────────────────────────────────────┐

     │ 2. Click "Enroll"                 ││      POST /api/courses/{id}/enroll       │

     ▼                                   ▼└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐     │

│      POST /api/courses/{id}/enroll       │     │ 3. Vérification paiement

└──────────────────────────────────────────┘     ▼

     │┌──────────────────────────────────────────┐

     │ 3. Payment verification│   CourseController@enroll (Laravel)      │

     ▼└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐     │

│   CourseController@enroll (Laravel)      │     │ 4. Création enregistrement

└──────────────────────────────────────────┘     ▼

     │┌──────────────────────────────────────────┐

     │ 4. Create enrollment record│  course_student table (MySQL)            │

     ▼│  - student_id                            │

┌──────────────────────────────────────────┐│  - course_id                             │

│  course_student table (MySQL)            ││  - payment_status: 'paid'                │

│  - student_id                            │└──────────────────────────────────────────┘

│  - course_id                             │     │

│  - payment_status: 'paid'                │     │ 5. Notification

└──────────────────────────────────────────┘     ▼

     │┌──────────────────────────────────────────┐

     │ 5. Send notification│  notifications table                     │

     ▼│  "Vous êtes inscrit au cours X"         │

┌──────────────────────────────────────────┐└──────────────────────────────────────────┘

│  notifications table                     │```

│  "You are enrolled in course X"          │

└──────────────────────────────────────────┘---

```

### Flux de Correction de Quiz par AI

---

```

### AI Quiz Correction Flow┌──────────┐     1. Soumet Quiz    ┌──────────┐

│ Student  │─────────────────────►│   Quiz   │

```│          │                       │  Answers │

┌──────────┐     1. Submit Quiz    ┌──────────┐└──────────┘                       └──────────┘

│ Student  │─────────────────────►│   Quiz   │     │                                   │

│          │                       │  Answers │     │ 2. POST /api/quiz/submit          │

└──────────┘                       └──────────┘     ▼                                   ▼

     │                                   │┌──────────────────────────────────────────┐

     │ 2. POST /api/quiz/submit          ││    QuizController@submit (Laravel)       │

     ▼                                   ▼└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐     │

│    QuizController@submit (Laravel)       │     │ 3. Envoi à Gemini AI

└──────────────────────────────────────────┘     ▼

     │┌──────────────────────────────────────────┐

     │ 3. Send to Gemini AI│       Google Gemini API                  │

     ▼│   - Analyse des réponses                 │

┌──────────────────────────────────────────┐│   - Génération du score                  │

│       Google Gemini API                  ││   - Feedback personnalisé                │

│   - Analyze answers                      │└──────────────────────────────────────────┘

│   - Generate score                       │     │

│   - Personalized feedback                │     │ 4. Sauvegarde résultats

└──────────────────────────────────────────┘     ▼

     │┌──────────────────────────────────────────┐

     │ 4. Save results│   quiz_attempts table                    │

     ▼│   - score calculé                        │

┌──────────────────────────────────────────┐│   - status: 'graded'                     │

│   quiz_attempts table                    ││   - answers avec feedback AI             │

│   - calculated score                     │└──────────────────────────────────────────┘

│   - status: 'graded'                     │     │

│   - answers with AI feedback             │     │ 5. Notification résultat

└──────────────────────────────────────────┘     ▼

     │┌──────────────────────────────────────────┐

     │ 5. Result notification│  Student Dashboard                       │

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
