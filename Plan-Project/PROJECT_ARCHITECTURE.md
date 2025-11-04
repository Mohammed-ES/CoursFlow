# 🏗️ Architecture du Projet CoursFlow

## 📊 Vue d'Ensemble du Système

```
┌─────────────────────────────────────────────────────────────┐
│                    COURSFLOW PLATFORM                        │
│              Course Management System (LMS)                  │
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
   └─────────────┘                      └──────┬──────┘
                                              │
                                        ┌─────▼─────┐
                                        │   MySQL   │
                                        │ Database  │
                                        └───────────┘
```

---

## 🎯 Modules du Système

### 1. Module Étudiant (Student)
**Fichiers principaux :**
- `frontend/src/pages/student/StudentDashboard.tsx`
- `frontend/src/pages/student/StudentProfile.tsx`
- `frontend/src/components/student/StudentSidebar.tsx`
- `backend/app/Http/Controllers/Api/StudentController.php`
- `backend/app/Models/Student.php`

**Fonctionnalités :**
- ✅ Tableau de bord avec statistiques
- ✅ Gestion du profil
- ✅ Affichage des cours inscrits
- ✅ Passage de quiz avec correction AI
- ✅ Calendrier des événements
- ✅ Notifications en temps réel
- ✅ Assistant AI Gemini

**Relations Base de Données :**
```sql
students
├── user_id (FK → users)
├── paidCourses (Many-to-Many via course_student)
├── quizAttempts (One-to-Many)
└── events (Many-to-Many via student_events)
```

---

### 2. Module Enseignant (Teacher)
**Fichiers principaux :**
- `frontend/src/pages/teacher/TeacherDashboard.tsx`
- `frontend/src/pages/teacher/TeacherCourses.tsx`
- `frontend/src/pages/teacher/TeacherQuizzes.tsx`
- `backend/app/Http/Controllers/Api/TeacherController.php`
- `backend/app/Models/Teacher.php`

**Fonctionnalités :**
- ✅ Création et gestion de cours
- ✅ Gestion de quiz avec AI
- ✅ Suivi des étudiants
- ✅ Calendrier professionnel
- ✅ Gestion des présences
- ✅ Statistiques de performance

**Relations Base de Données :**
```sql
teachers
├── user_id (FK → users)
├── courses (One-to-Many)
├── quizzes (One-to-Many)
└── events (One-to-Many)
```

---

### 3. Module Administrateur (Admin)
**Fichiers principaux :**
- `frontend/src/pages/admin/AdminDashboard.tsx`
- `frontend/src/pages/admin/AdminUsers.tsx`
- `frontend/src/pages/admin/AdminPayments.tsx`
- `backend/app/Http/Controllers/Api/AdminController.php`

**Fonctionnalités :**
- ✅ Gestion des utilisateurs (CRUD)
- ✅ Gestion des paiements
- ✅ Supervision des cours
- ✅ Analytics globales
- ✅ Gestion des notifications
- ✅ Configuration du système

**Relations Base de Données :**
```sql
users (role = 'admin')
├── students (supervision)
├── teachers (supervision)
├── courses (supervision)
└── payments (gestion)
```

---

## 🗄️ Base de Données - Structure Complète

### Tables Principales

#### 1. **users** (Authentification)
```sql
- id (PK)
- name
- email (unique)
- password (hashed)
- role (student/teacher/admin)
- email_verified_at
- google_id (OAuth)
- remember_token
- created_at, updated_at
```

#### 2. **students** (Profils Étudiants)
```sql
- id (PK)
- user_id (FK → users)
- phone
- address
- date_of_birth
- profile_image
- created_at, updated_at
```

#### 3. **teachers** (Profils Enseignants)
```sql
- id (PK)
- user_id (FK → users)
- specialization
- bio
- phone
- profile_image
- created_at, updated_at
```

#### 4. **courses** (Cours)
```sql
- id (PK)
- teacher_id (FK → teachers)
- title
- description
- category
- level (beginner/intermediate/advanced)
- price
- duration
- thumbnail
- video_url
- status (active/inactive)
- created_at, updated_at
```

#### 5. **quizzes** (Quiz)
```sql
- id (PK)
- course_id (FK → courses)
- teacher_id (FK → teachers)
- title
- description
- duration (minutes)
- passing_score
- status (active/inactive)
- created_at, updated_at
```

#### 6. **quiz_questions** (Questions de Quiz)
```sql
- id (PK)
- quiz_id (FK → quizzes)
- question
- type (multiple_choice/true_false/short_answer)
- options (JSON)
- correct_answer
- points
- created_at, updated_at
```

#### 7. **quiz_attempts** (Tentatives de Quiz)
```sql
- id (PK)
- student_id (FK → students)
- quiz_id (FK → quizzes)
- score
- answers (JSON)
- status (graded/pending)
- started_at
- completed_at
- created_at, updated_at
```

#### 8. **course_student** (Inscriptions Pivot)
```sql
- id (PK)
- student_id (FK → students)
- course_id (FK → courses)
- enrolled_at
- payment_status (paid/pending/free)
- progress (0-100)
- completed_at
- created_at, updated_at
```

#### 9. **payments** (Paiements)
```sql
- id (PK)
- student_id (FK → students)
- course_id (FK → courses)
- amount
- payment_method
- transaction_id
- status (completed/pending/failed)
- paid_at
- created_at, updated_at
```

#### 10. **events** (Événements Calendrier)
```sql
- id (PK)
- teacher_id (FK → teachers)
- title
- description
- start_time
- end_time
- location
- type (class/exam/meeting)
- created_at, updated_at
```

#### 11. **student_events** (Événements Étudiants Pivot)
```sql
- id (PK)
- student_id (FK → students)
- event_id (FK → events)
- status (invited/confirmed/declined)
- created_at, updated_at
```

#### 12. **notifications** (Notifications)
```sql
- id (PK)
- user_id (FK → users)
- type (info/warning/success/error)
- title
- message
- read_at
- created_at, updated_at
```

---

## 🔄 Flux de Données

### Flux d'Inscription à un Cours

```
┌──────────┐     1. Sélection     ┌──────────┐
│ Student  │─────────────────────►│  Course  │
│ Frontend │                       │   List   │
└──────────┘                       └──────────┘
     │                                   │
     │ 2. Click "Enroll"                 │
     ▼                                   ▼
┌──────────────────────────────────────────┐
│      POST /api/courses/{id}/enroll       │
└──────────────────────────────────────────┘
     │
     │ 3. Vérification paiement
     ▼
┌──────────────────────────────────────────┐
│   CourseController@enroll (Laravel)      │
└──────────────────────────────────────────┘
     │
     │ 4. Création enregistrement
     ▼
┌──────────────────────────────────────────┐
│  course_student table (MySQL)            │
│  - student_id                            │
│  - course_id                             │
│  - payment_status: 'paid'                │
└──────────────────────────────────────────┘
     │
     │ 5. Notification
     ▼
┌──────────────────────────────────────────┐
│  notifications table                     │
│  "Vous êtes inscrit au cours X"         │
└──────────────────────────────────────────┘
```

---

### Flux de Correction de Quiz par AI

```
┌──────────┐     1. Soumet Quiz    ┌──────────┐
│ Student  │─────────────────────►│   Quiz   │
│          │                       │  Answers │
└──────────┘                       └──────────┘
     │                                   │
     │ 2. POST /api/quiz/submit          │
     ▼                                   ▼
┌──────────────────────────────────────────┐
│    QuizController@submit (Laravel)       │
└──────────────────────────────────────────┘
     │
     │ 3. Envoi à Gemini AI
     ▼
┌──────────────────────────────────────────┐
│       Google Gemini API                  │
│   - Analyse des réponses                 │
│   - Génération du score                  │
│   - Feedback personnalisé                │
└──────────────────────────────────────────┘
     │
     │ 4. Sauvegarde résultats
     ▼
┌──────────────────────────────────────────┐
│   quiz_attempts table                    │
│   - score calculé                        │
│   - status: 'graded'                     │
│   - answers avec feedback AI             │
└──────────────────────────────────────────┘
     │
     │ 5. Notification résultat
     ▼
┌──────────────────────────────────────────┐
│  Student Dashboard                       │
│  Score affiché + Feedback AI             │
└──────────────────────────────────────────┘
```

---

## 🔐 Authentification & Sécurité

### Flux d'Authentification (Laravel Sanctum)

```
┌──────────┐                         ┌──────────┐
│  Login   │                         │ Laravel  │
│  Form    │                         │ Backend  │
└────┬─────┘                         └────┬─────┘
     │                                    │
     │ 1. POST /api/login                 │
     │    { email, password }             │
     ├───────────────────────────────────►│
     │                                    │
     │                   2. Vérification  │
     │                      - Hash check  │
     │                      - User exists │
     │                                    │
     │ 3. Token + User data               │
     │◄───────────────────────────────────┤
     │    { token, user, role }           │
     │                                    │
     │ 4. Stockage token                  │
     │    localStorage.setItem()          │
     │                                    │
     │ 5. Requêtes authentifiées          │
     │    Headers: Authorization Bearer   │
     ├───────────────────────────────────►│
     │                                    │
```

### Sécurité Mise en Place

✅ **Authentification**
- Laravel Sanctum (token-based)
- Password hashing avec bcrypt
- Google OAuth 2.0 integration

✅ **Protection**
- CSRF tokens
- XSS prevention (React escaping)
- SQL injection (Eloquent ORM)
- Rate limiting API (60 req/min)

✅ **Validation**
- Frontend: React Hook Form
- Backend: Laravel Request Validation
- Double validation (client + serveur)

---

## 🌐 API Endpoints

### Authentication
```
POST   /api/register         - Inscription
POST   /api/login           - Connexion
POST   /api/logout          - Déconnexion
GET    /api/user            - User actuel
POST   /api/google/callback - OAuth Google
```

### Students
```
GET    /api/student/profile          - Profil étudiant
PUT    /api/student/profile          - Mise à jour profil
GET    /api/student/courses          - Cours inscrits
GET    /api/student/quiz/{id}        - Détails quiz
POST   /api/student/quiz/submit      - Soumettre quiz
GET    /api/student/events           - Événements
GET    /api/student/notifications    - Notifications
```

### Teachers
```
GET    /api/teacher/dashboard        - Dashboard
GET    /api/teacher/courses          - Mes cours
POST   /api/teacher/courses          - Créer cours
PUT    /api/teacher/courses/{id}     - Modifier cours
DELETE /api/teacher/courses/{id}     - Supprimer cours
GET    /api/teacher/students         - Mes étudiants
POST   /api/teacher/quiz             - Créer quiz
GET    /api/teacher/events           - Mes événements
```

### Admin
```
GET    /api/admin/users              - Liste utilisateurs
POST   /api/admin/users              - Créer utilisateur
PUT    /api/admin/users/{id}         - Modifier utilisateur
DELETE /api/admin/users/{id}         - Supprimer utilisateur
GET    /api/admin/payments           - Gestion paiements
GET    /api/admin/courses            - Tous les cours
GET    /api/admin/statistics         - Statistiques globales
```

---

## 📁 Structure des Fichiers

### Frontend (React + TypeScript)
```
frontend/src/
├── assets/                 # Images, logos, fonts
├── components/
│   ├── common/            # Composants réutilisables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── student/           # Composants étudiants
│   │   ├── StudentSidebar.tsx
│   │   └── StudentNavbar.tsx
│   ├── teacher/           # Composants enseignants
│   └── admin/             # Composants admin
├── pages/
│   ├── student/           # Pages étudiants
│   ├── teacher/           # Pages enseignants
│   └── admin/             # Pages admin
├── context/               # React Context
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── services/              # Services API
│   ├── api.ts
│   ├── authService.ts
│   └── courseService.ts
├── utils/                 # Utilitaires
├── types/                 # Types TypeScript
└── App.tsx               # Composant principal
```

### Backend (Laravel)
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── StudentController.php
│   │   │       ├── TeacherController.php
│   │   │       └── AdminController.php
│   │   └── Middleware/
│   │       └── CheckRole.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Student.php
│   │   ├── Teacher.php
│   │   ├── Course.php
│   │   ├── Quiz.php
│   │   └── Payment.php
│   └── Services/
│       └── GeminiService.php
├── database/
│   ├── migrations/        # Migrations SQL
│   └── seeders/          # Données de test
├── routes/
│   └── api.php           # Routes API
└── storage/
    ├── app/public/       # Fichiers uploadés
    └── logs/             # Logs application
```

---

## 🚀 Déploiement

### Environnement de Développement
- **OS**: Windows 10/11
- **Serveur**: XAMPP (Apache + MySQL)
- **PHP**: 8.1+
- **Node.js**: 18.x
- **Database**: MySQL 8.0

### Environnement de Production (Recommandé)
- **Serveur**: VPS Linux (Ubuntu 22.04)
- **Web Server**: Nginx
- **PHP**: PHP-FPM 8.2
- **Database**: MySQL 8.0
- **SSL**: Let's Encrypt
- **Process Manager**: PM2 (pour Node si besoin)

---

## 📝 Notes Importantes

### Performance
- ✅ Lazy loading des composants React
- ✅ Code splitting avec Vite
- ✅ Optimisation des images
- ✅ Cache API avec Redis (recommandé prod)

### Scalabilité
- ✅ Architecture modulaire
- ✅ Séparation frontend/backend
- ✅ API RESTful stateless
- ✅ Base de données normalisée

### Maintenance
- ✅ Logs centralisés (Laravel)
- ✅ Error handling complet
- ✅ Tests unitaires (à développer)
- ✅ Documentation complète

---

**Dernière mise à jour:** 4 Novembre 2025
