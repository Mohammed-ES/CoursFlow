# 🎓 CoursFlow - Modern Learning Management System

### *Transform Education with Artificial Intelligence*

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Maintained](https://img.shields.io/badge/Maintained-Yes-brightgreen?style=flat-square)

---

## 📖 About

**CoursFlow** is a next-generation Learning Management System (LMS) that combines modern web technologies with artificial intelligence to transform online education. Designed for students, teachers, and administrators, CoursFlow provides an intuitive and powerful platform for course management, interactive learning, and intelligent assessment.

### 🌟 What is CoursFlow?

CoursFlow is a comprehensive e-learning platform built with cutting-edge technologies that offers:

- **Smart Learning Environment** - Modern, responsive interface optimized for all devices
- **AI-Powered Assessment** - Automatic quiz grading using Google Gemini 2.5 Flash API
- **Secure Authentication** - Dual login system with email/password and Google OAuth 2.0
- **Real-Time Collaboration** - Live notifications, interactive calendar, and instant feedback
- **Scalable Architecture** - Enterprise-ready with optimized database performance
- **Complete LMS Solution** - Three distinct modules for students, teachers, and administrators

---

## ✨ Key Features

### 👨‍🎓 Student Module

| Feature | Description |
|---------|-------------|
| **Course Enrollment** | Browse and enroll in courses with real-time availability |
| **Interactive Learning** | Access course materials, videos, and resources |
| **AI-Powered Quizzes** | Take quizzes with instant AI-based correction and feedback |
| **Progress Tracking** | Monitor your learning journey with detailed statistics |
| **Personalized Dashboard** | View enrolled courses, upcoming deadlines, and notifications |
| **Certificate Generation** | Receive certificates upon course completion |

### 👨‍🏫 Teacher Module

| Feature | Description |
|---------|-------------|
| **Course Management** | Create, edit, and publish courses with rich content |
| **Quiz Creation** | Design quizzes with multiple question types |
| **AI Quiz Generation** | Generate quizzes automatically using Gemini AI |
| **Student Management** | Track student progress and performance |
| **Automated Grading** | AI-powered quiz correction with detailed feedback |
| **Analytics Dashboard** | View comprehensive statistics and insights |

### 👨‍💼 Admin Module

| Feature | Description |
|---------|-------------|
| **User Management** | Create and manage students, teachers, and admins |
| **Course Approval** | Review and publish submitted courses |
| **System Analytics** | Monitor platform usage and performance metrics |
| **Payment Tracking** | Manage enrollment payments and financial records |
| **Security Controls** | Configure authentication and access permissions |
| **Database Management** | Backup, restore, and optimize system data |

---

## 🚀 Quick Installation

### Prerequisites

- **PHP** 8.2 or higher
- **Composer** 2.x
- **Node.js** 18.x or higher
- **MySQL** 8.0 or higher
- **XAMPP** (recommended for Windows)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/Mohammed-ES/CoursFlow.git
cd CoursFlow
```

2. **Backend Setup**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Configure Environment**

Edit `backend/.env`:
```env
DB_DATABASE=coursflow_database
DB_USERNAME=root
DB_PASSWORD=

GEMINI_API_KEY=your_gemini_api_key_here

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

5. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

📚 **For detailed installation instructions, see [INSTALLATION_GUIDE.md](./Plan-Project/INSTALLATION_GUIDE.md)**

---

## 🛠️ Technologies Used

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework for building interactive interfaces |
| **TypeScript** | 5.0.2 | Type-safe JavaScript for better code quality |
| **Vite** | 4.4.5 | Fast build tool and development server |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework for styling |
| **Framer Motion** | 10.16.4 | Animation library for smooth transitions |
| **React Router** | 6.18.0 | Client-side routing and navigation |
| **Axios** | 1.6.0 | HTTP client for API communication |
| **Lucide React** | 0.292.0 | Modern icon library |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel** | 10.x | PHP framework for robust backend development |
| **PHP** | 8.2+ | Server-side programming language |
| **MySQL** | 8.0 | Relational database management system |
| **Laravel Sanctum** | 3.3 | API token authentication |
| **Google Gemini API** | 2.5 Flash | AI-powered quiz correction and generation |
| **Composer** | 2.x | PHP dependency manager |
| **PHPUnit** | 10.x | Testing framework for PHP |

### Development Tools

| Tool | Purpose |
|------|---------|
| **XAMPP** | Local development environment (Apache + MySQL) |
| **Git** | Version control system |
| **Postman** | API testing and documentation |
| **VS Code** | Code editor with extensions |

---

## 🔒 Security Features

| Feature | Implementation | Description |
|---------|----------------|-------------|
| **Dual Authentication** | Email/Password + OAuth 2.0 | Secure login with multiple authentication methods |
| **Token-Based API** | Laravel Sanctum | Stateless authentication for API requests |
| **Password Encryption** | bcrypt hashing | Secure password storage with industry-standard encryption |
| **CSRF Protection** | Laravel middleware | Protection against cross-site request forgery attacks |
| **Input Validation** | Laravel Form Requests | Server-side validation for all user inputs |
| **SQL Injection Prevention** | Eloquent ORM | Parameterized queries to prevent SQL injection |
| **XSS Protection** | Input sanitization | Protection against cross-site scripting attacks |
| **Rate Limiting** | Laravel Throttle | API rate limiting to prevent abuse |
| **CORS Configuration** | Custom middleware | Controlled cross-origin resource sharing |
| **Environment Variables** | .env file | Secure storage of sensitive credentials |
| **API Key Management** | Encrypted storage | Secure handling of third-party API keys |
| **Session Security** | HTTP-only cookies | Secure session management |

---

## 📁 Documentation

Comprehensive documentation is available in the `Plan-Project` folder:

- **[Installation Guide](./Plan-Project/INSTALLATION_GUIDE.md)** - Complete setup instructions
- **[API Documentation](./Plan-Project/API_DOCUMENTATION.md)** - REST API endpoints reference
- **[Authentication Guide](./Plan-Project/AUTHENTICATION.md)** - Security and authentication details
- **[Gemini Integration](./Plan-Project/GEMINI_INTEGRATION.md)** - AI integration implementation
- **[Project Architecture](./Plan-Project/PROJECT_ARCHITECTURE.md)** - System design and architecture
- **[Known Issues](./Plan-Project/KNOWN_ISSUES.md)** - Troubleshooting and common problems

---

## 🎯 Project Goals

- ✅ Provide a modern, intuitive learning platform
- ✅ Leverage AI for intelligent assessment and feedback
- ✅ Ensure enterprise-grade security and scalability
- ✅ Support multiple user roles with distinct functionalities
- ✅ Deliver exceptional user experience across all devices
- ✅ Maintain clean, documented, and maintainable code

---

## 👥 User Roles

### Students
- Browse and enroll in courses
- Take AI-graded quizzes
- Track learning progress
- Receive certificates

### Teachers
- Create and manage courses
- Design and publish quizzes
- Use AI for quiz generation
- Monitor student performance

### Administrators
- Manage users and permissions
- Oversee platform operations
- Monitor system analytics
- Configure platform settings

---

## 🚦 Getting Started

1. **Read the [Installation Guide](./Plan-Project/INSTALLATION_GUIDE.md)** for complete setup instructions
2. **Check [API Documentation](./Plan-Project/API_DOCUMENTATION.md)** for backend integration
3. **Review [Authentication Guide](./Plan-Project/AUTHENTICATION.md)** for security implementation
4. **Explore [Project Architecture](./Plan-Project/PROJECT_ARCHITECTURE.md)** for system overview
5. **Consult [Known Issues](./Plan-Project/KNOWN_ISSUES.md)** if you encounter problems

---

## 📞 Support

For issues, questions, or contributions:
- **Email**: mohammedelouazzani.dev@gamil.com
- **Documentation**: See `Plan-Project` folder

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google Gemini API** for AI-powered features
- **Laravel Community** for excellent framework and resources
- **React Team** for the powerful UI library
- **Open Source Contributors** for various dependencies

---

<div align="center">

  <p>© 2025 CoursFlow. All rights reserved.</p>
</div>
