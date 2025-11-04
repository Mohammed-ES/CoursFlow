# 🎓 CoursFlow - Modern Learning Management System<div align="center">



<div align="center"><img src="./image/CoursFlow_logo.png" alt="CoursFlow Logo" width="200"/>



![CoursFlow Logo](./image/logo.png)# 🎓 CoursFlow - Smart Learning Management System



[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)### *Transformez l'Éducation avec l'Intelligence Artificielle*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)<p align="center">

[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>

[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>

  <img src="https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel"/>

**A comprehensive e-learning platform with AI-powered quiz correction and Google OAuth**  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>

  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Demo](#-demo) • [Contributing](#-contributing)</p>



</div><p align="center">

  <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square" alt="Status"/>

---  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" alt="Version"/>

  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>

## 📋 Table of Contents  <img src="https://img.shields.io/badge/Maintained-Yes-brightgreen?style=flat-square" alt="Maintained"/>

</p>

- [About](#-about)

- [Key Features](#-key-features)---

- [Tech Stack](#-tech-stack)

- [Architecture](#-architecture)### 🌟 Plateforme complète de gestion de cours avec **correction automatique par IA (Google Gemini)**

- [Installation](#-installation)

- [Configuration](#-configuration)</div>

- [Database Schema](#-database-schema)

- [Authentication](#-authentication)<br/>

- [AI Integration](#-ai-integration)

- [Known Issues](#-known-issues)## 📺 Démonstration

- [Contributing](#-contributing)

- [License](#-license)> 💡 **Une plateforme moderne qui révolutionne l'apprentissage en ligne**



---```ascii

┌─────────────────────────────────────────────────────────────────┐

## 🎯 About│                     🎯 COURSFLOW ECOSYSTEM                      │

├─────────────────────────────────────────────────────────────────┤

**CoursFlow** is a modern Learning Management System (LMS) built with cutting-edge web technologies. It provides a complete solution for online education with three distinct modules: Student, Teacher, and Administrator.│                                                                 │

│  👨‍🎓 ÉTUDIANTS          👨‍🏫 ENSEIGNANTS          👨‍💼 ADMIN      │

### 🌟 What Makes CoursFlow Special?│  • Dashboard           • Créer des cours      • Gestion users  │

│  • Quiz avec IA        • Générer des quiz     • Analytics      │

- 🤖 **AI-Powered Grading** - Automatic quiz correction using Google Gemini AI│  • Calendrier          • Suivi étudiants      • Paiements      │

- 🔐 **Dual Authentication** - Traditional login + Google OAuth 2.0│  • Notifications       • Calendrier pro       • Supervision    │

- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile│                                                                 │

- 🎨 **Modern UI/UX** - Built with Tailwind CSS and Framer Motion animations│              ╔══════════════════════════╗                       │

- 📊 **Real-time Analytics** - Live statistics and progress tracking│              ║  🤖 GOOGLE GEMINI AI   ║                       │

- 🗓️ **Integrated Calendar** - Event management and scheduling│              ║  Correction Automatique ║                       │

- 💳 **Payment Integration** - Course enrollment with payment tracking│              ╚══════════════════════════╝                       │

- 🔔 **Smart Notifications** - Real-time alerts and updates│                                                                 │

└─────────────────────────────────────────────────────────────────┘

---```



## ✨ Key Features---



### 👨‍🎓 Student Module## 📋 Table des Matières



<details><details>

<summary><b>Click to expand student features</b></summary><summary>Cliquez pour développer 📖</summary>



- **Dashboard**- [🎯 À Propos](#-à-propos)

  - Personalized welcome with profile picture- [✨ Fonctionnalités](#-fonctionnalités)

  - Real-time statistics (enrolled courses, completed quizzes, average scores)- [🛠️ Stack Technologique](#️-stack-technologique)

  - Quick access to courses and calendar- [🏗️ Architecture](#️-architecture)

  - [📦 Installation](#-installation)

- **Course Management**- [⚙️ Configuration](#️-configuration)

  - Browse available courses with search and filters- [🚀 Démarrage](#-démarrage)

  - View course details (description, teacher, price, duration)- [🗄️ Base de Données](#️-base-de-données)

  - Enroll in courses (free or paid)- [🔌 Intégration API Gemini](#-intégration-api-gemini)

  - Track course progress- [🌐 Serveur Windows (XAMPP)](#-serveur-windows-xampp)

  - [⚠️ Problèmes Connus & Solutions](#️-problèmes-connus--solutions)

- **Quiz System**- [📸 Captures d'Écran](#-captures-décran)

  - Take quizzes for enrolled courses- [🤝 Contribution](#-contribution)

  - AI-powered automatic correction (Google Gemini)- [📄 License](#-license)

  - View detailed results and feedback- [👥 Équipe](#-équipe)

  - Track quiz history and scores

  </details>

- **Calendar & Events**

  - View scheduled events and classes---

  - Register for events

  - Get reminders and notifications## 🎯 À Propos

  

- **Profile Management****CoursFlow** est une plateforme LMS (Learning Management System) de nouvelle génération qui intègre l'intelligence artificielle pour automatiser la correction des quiz et offrir une expérience d'apprentissage personnalisée.

  - Edit personal information

  - Upload profile picture### 🌟 Points Forts

  - Change password

  - View enrollment history<table>

  <tr>

</details>    <td align="center">🤖</td>

    <td><strong>Intelligence Artificielle</strong><br/>Correction automatique des quiz via Google Gemini AI</td>

### 👨‍🏫 Teacher Module  </tr>

  <tr>

<details>    <td align="center">🎨</td>

<summary><b>Click to expand teacher features</b></summary>    <td><strong>Interface Moderne</strong><br/>Design professionnel avec Tailwind CSS et Framer Motion</td>

  </tr>

- **Course Creation & Management**  <tr>

  - Create new courses with rich content    <td align="center">🔐</td>

  - Edit and update course materials    <td><strong>Sécurité Renforcée</strong><br/>Laravel Sanctum + Google OAuth 2.0</td>

  - Set course pricing and duration  </tr>

  - Publish/unpublish courses  <tr>

      <td align="center">📱</td>

- **Quiz Builder**    <td><strong>100% Responsive</strong><br/>Fonctionne sur desktop, tablette et mobile</td>

  - Create quizzes with multiple question types  </tr>

  - Set difficulty levels and time limits  <tr>

  - Configure passing scores    <td align="center">⚡</td>

  - Review student submissions    <td><strong>Performance Optimale</strong><br/>Vite build tool + optimisations Laravel</td>

    </tr>

- **Student Management**  <tr>

  - View enrolled students    <td align="center">🌙</td>

  - Track student progress    <td><strong>Mode Sombre</strong><br/>Thème clair/sombre avec transition fluide</td>

  - Monitor quiz performance  </tr>

  - Export student data</table>

  

- **Analytics Dashboard**---

  - Course enrollment statistics

  - Student performance metrics## ✨ Fonctionnalités

  - Revenue tracking (for paid courses)

  - Engagement analytics### 👨‍🎓 Module Étudiant

  

- **Event Scheduling**<details>

  - Create class events<summary><b>Cliquez pour voir les détails</b></summary>

  - Set recurring events

  - Manage event attendance#### 📊 Dashboard Interactif

- **Statistiques en temps réel**

</details>  - Nombre de cours inscrits

  - Quiz complétés (avec score moyen)

### 👨‍💼 Admin Module  - Progression globale

- **Graphiques visuels** (Recharts)

<details>- **Notifications push**

<summary><b>Click to expand admin features</b></summary>

#### 📚 Gestion des Cours

- **User Management**- Catalogue de cours avec filtres

  - Create/edit/delete users (students, teachers, admins)- Inscription en un clic

  - Manage user roles and permissions- Suivi de progression (0-100%)

  - View user activity logs- Système de notation (1-5 étoiles)

  

- **Course Oversight**#### 📝 Quiz Intelligents avec IA

  - Approve/reject course submissions- **Correction automatique** par Google Gemini

  - Monitor course quality- **Feedback personnalisé** pour chaque réponse

  - Manage course categories- Types de questions :

    - Questions à choix multiples

- **System Configuration**  - Vrai/Faux

  - Configure platform settings  - Réponses courtes

  - Manage payment gateways  - Questions ouvertes (correction IA)

  - Set system-wide preferences- Historique des tentatives

  - Score et classement

- **Reports & Analytics**

  - Platform-wide statistics#### 👤 Profil Personnalisé

  - Revenue reports- Modification des informations (nom, téléphone, adresse)

  - User engagement metrics- **Changement de mot de passe sécurisé**

  - Export data for analysis- Upload de photo de profil

- Statistiques personnelles

</details>

#### 📅 Calendrier Intelligent

---- Vue des événements à venir

- Filtres par type (cours, examen, réunion)

## 🛠️ Tech Stack- Synchronisation avec les cours inscrits

- Rappels automatiques

### Frontend

- **React 18.2** - UI Framework#### 🔔 Système de Notifications

- **TypeScript 5.0** - Type Safety- Notifications en temps réel

- **Vite 4.4** - Build Tool- Types : Info, Succès, Avertissement, Erreur

- **Tailwind CSS 3.4** - Styling- Badge de comptage

- **React Router 6** - Navigation- Marquage "lu/non lu"

- **Axios** - HTTP Client

- **Framer Motion** - Animations</details>

- **React Hook Form** - Form Management

- **Lucide React** - Icons### 👨‍🏫 Module Enseignant



### Backend<details>

- **Laravel 10** - PHP Framework<summary><b>Cliquez pour voir les détails</b></summary>

- **PHP 8.2+** - Server Language

- **MySQL 8.0** - Database#### 📚 Création de Cours

- **Laravel Sanctum** - API Authentication- Éditeur de contenu riche

- **Composer** - Dependency Manager- Upload de vidéos et documents

- Catégorisation (Développement, Design, Marketing, etc.)

### AI & Authentication- Niveaux (Débutant, Intermédiaire, Avancé)

- **Google Gemini AI** - Quiz correction & feedback- Définition du prix

- **Google OAuth 2.0** - Social authentication

- **JWT Tokens** - Secure API access#### 📝 Gestion des Quiz

- Création de quiz avec générateur IA

### Development Tools- Questions multiples types

- **XAMPP** - Local server (Apache + MySQL)- Correction automatique par Gemini

- **Git** - Version control- Analyse des résultats étudiants

- **VS Code** - IDE

- **Postman** - API testing#### 👥 Suivi des Étudiants

- Liste des étudiants inscrits

---- Statistiques individuelles

- Historique des quiz

## 🏗️ Architecture- Taux de réussite



```#### 📅 Calendrier Professionnel

┌─────────────────────────────────────────────────────────────┐- Planification des cours

│                      COURSFLOW SYSTEM                        │- Événements récurrents

├─────────────────────────────────────────────────────────────┤- Gestion des examens

│                                                              │- Disponibilité

│  ┌──────────────┐         ┌──────────────┐                 │

│  │   Browser    │ ◄─────► │   Frontend   │                 │#### ✅ Gestion de Présence

│  │  (Client)    │  HTTPS  │ React + TS   │                 │- Marquage présent/absent/retard

│  └──────────────┘         └──────┬───────┘                 │- Export des rapports

│                                   │                          │- Statistiques de présence

│                                   │ REST API                 │

│                                   │ (Axios)                  │</details>

│                                   │                          │

│                          ┌────────▼─────────┐               │### 👨‍💼 Module Administrateur

│                          │    Backend       │               │

│                          │  Laravel 10      │               │<details>

│                          │                  │               │<summary><b>Cliquez pour voir les détails</b></summary>

│                          │  • Controllers   │               │

│                          │  • Services      │               │#### 👥 Gestion des Utilisateurs

│                          │  • Models        │               │- CRUD complet (Create, Read, Update, Delete)

│                          │  • Middleware    │               │- Attribution des rôles

│                          └────────┬─────────┘               │- Suspension/Activation des comptes

│                                   │                          │- Historique des actions

│                                   │ Eloquent ORM             │

│                                   │                          │#### 💳 Gestion des Paiements

│                          ┌────────▼─────────┐               │- Liste des transactions

│                          │    Database      │               │- Statuts (En attente, Complété, Échoué)

│                          │   MySQL 8.0      │               │- Remboursements

│                          │                  │               │- Rapports financiers

│                          │  • Tables        │               │

│                          │  • Triggers      │               │#### 📊 Analytics & Rapports

│                          │  • Views         │               │- Dashboard global

│                          └──────────────────┘               │- Statistiques détaillées

│                                                              │- Graphiques de performance

│  ┌──────────────────────────────────────────────┐          │- Export en PDF/Excel

│  │         External Services                     │          │

│  ├──────────────────────────────────────────────┤          │#### ⚙️ Configuration Système

│  │  • Google Gemini API (AI Quiz Correction)    │          │- Paramètres globaux

│  │  • Google OAuth 2.0 (Authentication)         │          │- Gestion des catégories

│  └──────────────────────────────────────────────┘          │- Configuration emails

│                                                              │- Maintenance

└─────────────────────────────────────────────────────────────┘

```</details>



------



## 📦 Installation## 🛠️ Stack Technologique



### Prerequisites### 🎨 Frontend



| Requirement | Version | Download |<table>

|-------------|---------|----------|  <tr>

| **XAMPP** | 8.2+ | [Download](https://www.apachefriends.org/) |    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40"/></td>

| **Node.js** | 18+ | [Download](https://nodejs.org/) |    <td><strong>React 18.2</strong><br/>Library UI avec hooks modernes</td>

| **Composer** | 2.x | [Download](https://getcomposer.org/) |  </tr>

| **Git** | Latest | [Download](https://git-scm.com/) |  <tr>

    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40"/></td>

### Quick Start    <td><strong>TypeScript 5.0</strong><br/>Type safety et autocomplétion</td>

  </tr>

```bash  <tr>

# 1. Clone the repository    <td>🎨</td>

git clone https://github.com/Mohammed-ES/CoursFlow.git    <td><strong>Tailwind CSS 3.4</strong><br/>Utility-first CSS framework</td>

cd CoursFlow  </tr>

  <tr>

# 2. Backend Setup    <td>🎬</td>

cd backend    <td><strong>Framer Motion</strong><br/>Animations fluides et professionnelles</td>

composer install  </tr>

cp .env.example .env  <tr>

php artisan key:generate    <td>🛣️</td>

    <td><strong>React Router v6</strong><br/>Navigation SPA avec protected routes</td>

# 3. Database Setup  </tr>

# Create database 'coursflow' in phpMyAdmin  <tr>

# Then run migrations    <td>📡</td>

php artisan migrate    <td><strong>Axios</strong><br/>HTTP client avec interceptors</td>

php artisan db:seed  </tr>

  <tr>

# 4. Frontend Setup    <td>📊</td>

cd ../frontend    <td><strong>Recharts</strong><br/>Graphiques et visualisations de données</td>

npm install  </tr>

cp .env.example .env  <tr>

    <td>📅</td>

# 5. Start Servers    <td><strong>React Big Calendar</strong><br/>Calendrier interactif</td>

# Terminal 1 - Backend  </tr>

cd backend  <tr>

php artisan serve    <td>⚡</td>

    <td><strong>Vite</strong><br/>Build tool ultra-rapide (HMR instantané)</td>

# Terminal 2 - Frontend  </tr>

cd frontend  <tr>

npm run dev    <td>🎯</td>

```    <td><strong>Lucide React</strong><br/>Icons modernes</td>

  </tr>

### Default Accounts</table>



| Role | Email | Password |### 🔧 Backend

|------|-------|----------|

| **Admin** | admin@coursflow.com | password |<table>

| **Teacher** | teacher@coursflow.com | password |  <tr>

| **Student** | student@gmail.com | password |    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg" width="40"/></td>

    <td><strong>Laravel 10.x</strong><br/>Framework PHP robuste et élégant</td>

---  </tr>

  <tr>

## ⚙️ Configuration    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" width="40"/></td>

    <td><strong>MySQL 8.0</strong><br/>Base de données relationnelle</td>

### Backend Environment (.env)  </tr>

  <tr>

```env    <td>🔐</td>

APP_NAME=CoursFlow    <td><strong>Laravel Sanctum</strong><br/>Authentification API token-based</td>

APP_URL=http://localhost:8000  </tr>

  <tr>

DB_CONNECTION=mysql    <td>🗄️</td>

DB_HOST=127.0.0.1    <td><strong>Eloquent ORM</strong><br/>Gestion de base de données intuitive</td>

DB_PORT=3306  </tr>

DB_DATABASE=coursflow  <tr>

DB_USERNAME=root    <td>📝</td>

DB_PASSWORD=    <td><strong>Laravel Validation</strong><br/>Validation robuste des données</td>

  </tr>

# Google Gemini AI  <tr>

GEMINI_API_KEY=your-gemini-api-key-here    <td>📧</td>

    <td><strong>Laravel Mail</strong><br/>Système d'emails</td>

# Google OAuth 2.0  </tr>

GOOGLE_CLIENT_ID=your-google-client-id</table>

GOOGLE_CLIENT_SECRET=your-google-client-secret

GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback### 🤖 Intelligence Artificielle



# Laravel Sanctum<table>

SANCTUM_STATEFUL_DOMAINS=localhost:5173  <tr>

SESSION_DOMAIN=localhost    <td>🧠</td>

    <td><strong>Google Gemini AI</strong><br/>Modèle de langage pour la correction automatique</td>

# CORS  </tr>

CORS_ALLOWED_ORIGINS=http://localhost:5173  <tr>

```    <td>🔍</td>

    <td><strong>Natural Language Processing</strong><br/>Analyse sémantique des réponses</td>

### Frontend Environment (.env)  </tr>

  <tr>

```env    <td>📊</td>

VITE_API_URL=http://localhost:8000/api    <td><strong>Scoring Algorithm</strong><br/>Algorithme de notation intelligent</td>

VITE_GEMINI_API_KEY=your-gemini-api-key-here  </tr>

VITE_GOOGLE_CLIENT_ID=your-google-client-id</table>

```

### 🔐 Authentification & Sécurité

---

<table>

## 🗄️ Database Schema  <tr>

    <td>🔑</td>

### Core Tables (13 total)    <td><strong>Google OAuth 2.0</strong><br/>Connexion via compte Google</td>

  </tr>

- **users** - Authentication (email, password, role, google_id)  <tr>

- **students** - Student profiles    <td>🛡️</td>

- **teachers** - Teacher profiles      <td><strong>CSRF Protection</strong><br/>Protection contre les attaques CSRF</td>

- **courses** - Course catalog  </tr>

- **course_student** - Enrollments (pivot)  <tr>

- **quizzes** - Quiz definitions    <td>🔒</td>

- **quiz_questions** - Question bank    <td><strong>Bcrypt Hashing</strong><br/>Hachage sécurisé des mots de passe</td>

- **quiz_attempts** - Student submissions  </tr>

- **payments** - Transaction records  <tr>

- **events** - Calendar events    <td>⏱️</td>

- **student_events** - Event registrations (pivot)    <td><strong>Rate Limiting</strong><br/>Protection contre les attaques par force brute</td>

- **notifications** - User alerts  </tr>

- **personal_access_tokens** - Sanctum tokens</table>



### Advanced Features---



✅ **Foreign Keys** - Referential integrity with CASCADE  ## 🏗️ Architecture

✅ **Indexes** - Query optimization (5ms vs 150ms)  

✅ **Triggers** - Auto-update enrollment counts  ### 📐 Architecture Globale

✅ **Views** - Pre-computed statistics  

✅ **Stored Procedures** - Complex queries  ```

┌────────────────────────────────────────────────────────────┐

📄 **Full Schema**: [database/coursflow_schema.sql](./database/coursflow_schema.sql)│                      NAVIGATEUR WEB                        │

│                    (Chrome, Firefox...)                    │

---└──────────────────────┬─────────────────────────────────────┘

                       │

## 🔐 Authentication                       │ HTTP/HTTPS

                       ▼

### Dual Authentication System┌────────────────────────────────────────────────────────────┐

│                   FRONTEND (React + TS)                    │

#### 1️⃣ Traditional Email/Password│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │

│  │ Student  │  │ Teacher  │  │  Admin   │  │  Auth    │  │

```typescript│  │  Pages   │  │  Pages   │  │  Pages   │  │  Pages   │  │

POST /api/login│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │

{│                                                             │

  "email": "student@gmail.com",│  ┌─────────────────────────────────────────────────────┐  │

  "password": "password"│  │          React Context (Auth, Theme)                 │  │

}│  └─────────────────────────────────────────────────────┘  │

```└──────────────────────┬─────────────────────────────────────┘

                       │

#### 2️⃣ Google OAuth 2.0                       │ REST API (JSON)

                       │ Authorization: Bearer {token}

```typescript                       ▼

// Redirect to Google┌────────────────────────────────────────────────────────────┐

GET /auth/google│                  BACKEND (Laravel 10)                      │

│                                                             │

// Handle callback│  ┌──────────────────────────────────────────────────────┐ │

GET /auth/google/callback?code=xxxx│  │              API Controllers                          │ │

```│  │  • StudentController  • TeacherController             │ │

│  │  • AdminController    • AuthController                │ │

### Google OAuth Setup│  └──────────────────────────────────────────────────────┘ │

│                       │                                    │

1. **Create Google Cloud Project**│                       │                                    │

   - Visit [Google Cloud Console](https://console.cloud.google.com/)│  ┌──────────────────────────────────────────────────────┐ │

   - Create project: "CoursFlow"│  │                Middleware Layer                       │ │

│  │  • Authentication  • CORS  • Rate Limiting            │ │

2. **Enable OAuth 2.0**│  └──────────────────────────────────────────────────────┘ │

   - Go to "APIs & Services" > "Credentials"│                       │                                    │

   - Create "OAuth 2.0 Client ID"│                       │                                    │

   - Application type: "Web application"│  ┌──────────────────────────────────────────────────────┐ │

│  │              Eloquent Models                          │ │

3. **Configure Consent Screen**│  │  • User  • Student  • Teacher  • Course  • Quiz      │ │

   - App name: CoursFlow│  └──────────────────────────────────────────────────────┘ │

   - Support email: your-email@example.com│                       │                                    │

│                       ▼                                    │

4. **Add Authorized URIs**│  ┌──────────────────────────────────────────────────────┐ │

   ```│  │                Services Layer                         │ │

   http://localhost:8000/auth/google/callback│  │  • GeminiService  • PaymentService                    │ │

   http://localhost:5173/auth/google/callback│  └──────────────────────────────────────────────────────┘ │

   ```└──────────────────────┬─────────────────────────────────────┘

                       │

5. **Copy Credentials to .env**                       │ MySQL Protocol

   ```env                       ▼

   GOOGLE_CLIENT_ID=your-client-id┌────────────────────────────────────────────────────────────┐

   GOOGLE_CLIENT_SECRET=your-client-secret│                   BASE DE DONNÉES MySQL                    │

   ```│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │

│  │  users   │  │ students │  │ courses  │  │  quizzes │  │

---│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │

│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │

## 🤖 AI Integration│  │ teachers │  │ payments │  │  events  │  │  notif.  │  │

│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │

### Google Gemini for Quiz Correction└────────────────────────────────────────────────────────────┘



CoursFlow uses **Google Gemini 1.5 Pro** for intelligent quiz grading.                    ┌──────────────────┐

                    │  GOOGLE GEMINI   │

#### Get API Key                    │       API        │

                    │  (Correction IA) │

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)                    └──────────────────┘

2. Click "Get API Key"```

3. Copy to `.env` files

### 📁 Structure des Dossiers

#### How It Works

```

```CoursFlow/

Student Submits Quiz├── 📁 frontend/                    # Application React

       ↓│   ├── 📁 public/

Backend Prepares Payload│   │   └── 📁 image/              # Logo CoursFlow

       ↓│   ├── 📁 src/

Send to Gemini API│   │   ├── 📁 assets/             # Images, fonts, icons

       ↓│   │   ├── 📁 components/         # Composants React

AI Analyzes Answers│   │   │   ├── 📁 common/         # Boutons, Inputs, Cards

       ↓│   │   │   ├── 📁 student/        # Composants étudiants

Returns Score + Feedback│   │   │   ├── 📁 teacher/        # Composants enseignants

       ↓│   │   │   └── 📁 admin/          # Composants admin

Save to Database│   │   ├── 📁 pages/              # Pages de l'application

```│   │   │   ├── 📁 auth/           # Login, Register

│   │   │   ├── 📁 student/        # Dashboard, Profile, Courses

#### Features│   │   │   ├── 📁 teacher/        # Dashboard, Courses, Quiz

│   │   │   └── 📁 admin/          # Dashboard, Users, Payments

- ✅ Context-aware grading│   │   ├── 📁 context/            # React Context API

- ✅ Detailed feedback per question│   │   │   ├── AuthContext.tsx    # Authentification

- ✅ Performance summary│   │   │   ├── ThemeContext.tsx   # Mode sombre/clair

- ✅ Fallback system if API fails│   │   │   └── StudentContext.tsx # État étudiant

│   │   ├── 📁 services/           # API Services

---│   │   │   ├── api.ts             # Axios instance

│   │   │   ├── authService.ts     # Auth API

## ⚠️ Known Issues│   │   │   └── courseService.ts   # Cours API

│   │   ├── 📁 types/              # TypeScript types

### Resolved Issues│   │   ├── 📁 utils/              # Fonctions utilitaires

│   │   ├── App.tsx                # Composant racine

✅ Logo not displaying  │   │   └── main.tsx               # Point d'entrée

✅ Statistics showing 0  │   ├── .env.example               # Template de config

✅ Password change not working  │   ├── package.json               # Dépendances npm

✅ Quiz count incorrect  │   ├── tailwind.config.js         # Config Tailwind

✅ CORS errors  │   ├── tsconfig.json              # Config TypeScript

✅ OAuth redirect mismatch  │   └── vite.config.ts             # Config Vite

✅ Performance optimization  │

├── 📁 backend/                     # Application Laravel

📄 **Full List**: [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)│   ├── 📁 app/

│   │   ├── 📁 Http/

---│   │   │   ├── 📁 Controllers/

│   │   │   │   └── 📁 Api/

## 📁 Project Structure│   │   │   │       ├── StudentController.php

│   │   │   │       ├── TeacherController.php

```│   │   │   │       ├── AdminController.php

CoursFlow/│   │   │   │       └── AuthController.php

├── backend/              # Laravel API│   │   │   └── 📁 Middleware/

│   ├── app/│   │   │       └── CheckRole.php

│   │   ├── Http/Controllers/│   │   ├── 📁 Models/

│   │   ├── Models/│   │   │   ├── User.php

│   │   └── Services/│   │   │   ├── Student.php

│   ├── database/│   │   │   ├── Teacher.php

│   │   ├── migrations/│   │   │   ├── Course.php

│   │   └── seeders/│   │   │   ├── Quiz.php

│   └── routes/api.php│   │   │   ├── QuizAttempt.php

││   │   │   ├── Payment.php

├── frontend/             # React SPA│   │   │   └── Event.php

│   ├── src/│   │   └── 📁 Services/

│   │   ├── components/│   │       └── GeminiService.php  # Service IA

│   │   ├── pages/│   ├── 📁 config/                 # Configuration Laravel

│   │   ├── services/│   ├── 📁 database/

│   │   └── contexts/│   │   ├── 📁 migrations/         # Migrations SQL

│   └── .env.example│   │   └── 📁 seeders/            # Données de test

││   ├── 📁 routes/

├── database/│   │   ├── api.php                # Routes API

│   └── coursflow_schema.sql│   │   └── web.php                # Routes web

││   ├── 📁 storage/

└── README.md│   │   ├── 📁 app/public/         # Fichiers uploadés

```│   │   └── 📁 logs/               # Logs Laravel

│   ├── .env.example               # Template de config

---│   ├── composer.json              # Dépendances PHP

│   └── artisan                    # CLI Laravel

## 🤝 Contributing│

├── 📁 database/                    # Scripts SQL

Contributions are welcome! Please follow these steps:│   ├── coursflow.sql              # Dump complet

│   └── coursflow_schema.sql       # Schéma avec docs

1. Fork the repository│

2. Create feature branch (`git checkout -b feature/amazing`)├── 📁 Plan-Project/                # Documentation projet

3. Commit changes (`git commit -m 'Add feature'`)│   └── PROJECT_ARCHITECTURE.md    # Architecture détaillée

4. Push to branch (`git push origin feature/amazing`)│

5. Open Pull Request├── 📁 image/                       # Ressources images

│   └── CoursFlow_logo.png         # Logo principal

### Code Style│

├── .gitignore                      # Fichiers ignorés par Git

- **PHP**: PSR-12 standards├── README.md                       # Ce fichier

- **TypeScript**: ESLint rules├── LICENSE                         # Licence MIT

- **Commits**: Conventional commits└── GITHUB_DEPLOYMENT.md            # Guide déploiement

```

---

---

## 📜 License

## 🚀 Getting Started

MIT License - see [LICENSE](./LICENSE) file

### Prerequisites

```

Copyright (c) 2024 Mohammed ES- **Node.js** >= 18.x

- **PHP** >= 8.2

Permission is hereby granted, free of charge...- **Composer** >= 2.x

```- **MySQL** >= 8.x

- **Java JDK** >= 17

---- **Maven** or **Gradle**



## 📞 Contact---



- 📧 Email: support@coursflow.com## 📦 Installation

- 🐛 Issues: [GitHub Issues](https://github.com/Mohammed-ES/CoursFlow/issues)

- 📖 Docs: [Installation Guide](./INSTALLATION_GUIDE.md)### 1. Clone the Repository



---```bash

git clone https://github.com/yourusername/coursflow.git

## 🙏 Acknowledgmentscd coursflow

```

- Laravel Team - Amazing framework

- React Team - Powerful library### 2. Frontend Setup

- Google - Gemini AI & OAuth

- Tailwind CSS - Beautiful styling```bash

- Open Source Communitycd frontend

npm install

---```



<div align="center">Create `.env` file from `.env.example`:



### ⭐ Star this repo if you find it helpful!```bash

cp .env.example .env

**Built with ❤️ by [Mohammed ES](https://github.com/Mohammed-ES)**```



[⬆ Back to Top](#-coursflow---modern-learning-management-system)Edit `.env` with your configuration:



</div>```env

VITE_API_URL=http://localhost:8000/api
VITE_JAVA_API_URL=http://localhost:8080/api
VITE_AI_API_KEY=your_openai_or_gemini_api_key
```

### 3. Backend (Laravel) Setup

```bash
cd ../backend/laravel-app
composer install
```

Create `.env` file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Configure database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coursflow
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

Run migrations and seeders:

```bash
php artisan migrate --seed
```

### 4. Java Service Setup

```bash
cd ../java-service
```

Configure `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/coursflow
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
server.port=8080
```

Build the project:

```bash
mvn clean install
# or
./gradlew build
```

---

## ⚙️ Configuration

### Design System

The visual theme is defined in `info.style.json`. This file contains:

- Color palette (primary, secondary, accent colors)
- Typography settings (fonts, sizes, weights)
- Spacing and border radius values
- Component styles (buttons, cards, inputs)
- Animation configurations

### Logo Integration

Place your logo file (`coursflow_logo.png`) in:
```
frontend/src/assets/logo/coursflow_logo.png
```

The logo is automatically displayed in:
- Navbar
- Login/Register pages
- Dashboard header
- Footer

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```
Access at: `http://localhost:3000`

**Terminal 2 - Laravel Backend:**
```bash
cd backend/laravel-app
php artisan serve
```
API runs at: `http://localhost:8000`

**Terminal 3 - Java Service:**
```bash
cd backend/java-service
mvn spring-boot:run
# or
java -jar target/coursflow-service.jar
```
Service runs at: `http://localhost:8080`

---

## 🔗 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | User login |
| POST | `/api/logout` | User logout |
| GET | `/api/user` | Get authenticated user |

### Course Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/{id}` | Get course details |
| POST | `/api/courses` | Create course (teacher/admin) |
| PUT | `/api/courses/{id}` | Update course |
| DELETE | `/api/courses/{id}` | Delete course |
| POST | `/api/courses/{id}/enroll` | Enroll in course |

### Notes Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | List user notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/{id}` | Update note |
| DELETE | `/api/notes/{id}` | Delete note |
| GET | `/api/notes/{id}/export` | Export note as PDF |

### AI Assistant Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Send message to AI |
| POST | `/api/ai/quiz` | Generate quiz from notes |
| POST | `/api/ai/summarize` | Summarize text/notes |

---

## 🎨 Design System

CoursFlow uses a carefully crafted design system defined in `info.style.json`:

### Colors
- **Primary**: `#5175FF` (Blue)
- **Secondary**: `#2C2F3E` (Dark Gray)
- **Accent**: Cyan `#5FDDE5`, Pink `#FFB3C1`, Purple `#8B7FFF`

### Typography
- **Font Family**: Kumbh Sans, Inter
- **Headings**: Bold, from 1.5rem to 3rem
- **Body**: Regular, 1rem with 1.5 line height

### Components
- **Buttons**: Rounded (`1.75rem`), hover animations
- **Cards**: Elevated with shadows, hover effects
- **Inputs**: Border focus states with ring effects

---

## 🌙 Light/Dark Mode

The platform supports automatic theme switching:
- Toggle via navbar icon
- Persists user preference in localStorage
- Smooth transitions between modes

---

## 🔒 Security Features

- **JWT Authentication** via Laravel Sanctum
- **CSRF Protection**
- **Input Validation** on frontend and backend
- **XSS Prevention**
- **SQL Injection Protection** via Eloquent ORM
- **Rate Limiting** on API endpoints
- **Password Hashing** with bcrypt

---

## 📊 Performance Optimization

- **Lazy Loading** for routes and images
- **Code Splitting** via Vite
- **API Response Caching**
- **Image Optimization**
- **Gzip Compression**
- **Database Indexing**

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend/laravel-app
php artisan test
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the app:
```bash
npm run build
```

2. Deploy `dist/` folder to Vercel or Netlify

### Backend (VPS/Cloud)

1. Set up production environment
2. Configure web server (Nginx/Apache)
3. Set up SSL certificates
4. Configure environment variables
5. Run migrations:
```bash
php artisan migrate --force
```

---

## 👥 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

- **Website**: [coursflow.com](https://coursflow.com)
- **Email**: info@coursflow.com
- **GitHub**: [@coursflow](https://github.com/coursflow)

---

## 🙏 Acknowledgments

- Design inspiration from modern SaaS platforms
- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

<div align="center">

Made with ❤️ by the CoursFlow Team

**[⬆ back to top](#-coursflow---smart-course-management-platform)**

</div>
