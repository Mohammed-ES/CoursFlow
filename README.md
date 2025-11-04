<div align="center">

# <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=40&pause=1000&color=6366F1&center=true&vCenter=true&width=600&height=70&lines=🎓+CoursFlow;Smart+Learning+Platform;AI-Powered+Education" alt="CoursFlow Title" />

### *🚀 Transform Education with Artificial Intelligence*

<div>
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel"/>
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
</div>

<div style="margin-top: 10px;">
  <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" alt="Version"/>
  <img src="https://img.shields.io/badge/Maintained-Yes-brightgreen?style=flat-square" alt="Maintained"/>
</div>

</div>

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
| **📚 Course Enrollment** | Browse and enroll in courses with real-time availability |
| **🎯 Interactive Learning** | Access course materials, videos, and resources |
| **🤖 AI-Powered Quizzes** | Take quizzes with instant AI-based correction and feedback |
| **📈 Progress Tracking** | Monitor your learning journey with detailed statistics |
| **📊 Personalized Dashboard** | View enrolled courses, upcoming deadlines, and notifications |
| **🏆 Certificate Generation** | Receive certificates upon course completion |

### 👨‍🏫 Teacher Module

| Feature | Description |
|---------|-------------|
| **📝 Course Management** | Create, edit, and publish courses with rich content |
| **❓ Quiz Creation** | Design quizzes with multiple question types |
| **✨ AI Quiz Generation** | Generate quizzes automatically using Gemini AI |
| **👥 Student Management** | Track student progress and performance |
| **⚡ Automated Grading** | AI-powered quiz correction with detailed feedback |
| **📊 Analytics Dashboard** | View comprehensive statistics and insights |

### 👨‍💼 Admin Module

| Feature | Description |
|---------|-------------|
| **👤 User Management** | Create and manage students, teachers, and admins |
| **✅ Course Approval** | Review and publish submitted courses |
| **📊 System Analytics** | Monitor platform usage and performance metrics |
| **💰 Payment Tracking** | Manage enrollment payments and financial records |
| **🔒 Security Controls** | Configure authentication and access permissions |
| **🗄️ Database Management** | Backup, restore, and optimize system data |

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

### <img src="https://cdn-icons-png.flaticon.com/512/1126/1126012.png" width="20" height="20"/> Frontend Technologies

| Logo | Technology | Version | Purpose |
|------|------------|---------|---------|
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="30"/> | **React** | 18.2.0 | UI framework for building interactive interfaces |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="30"/> | **TypeScript** | 5.0.2 | Type-safe JavaScript for better code quality |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" width="30"/> | **Vite** | 4.4.5 | Fast build tool and development server |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="30"/> | **Tailwind CSS** | 3.4.0 | Utility-first CSS framework for styling |
| <img src="https://cdn.worldvectorlogo.com/logos/framer-motion.svg" width="30"/> | **Framer Motion** | 10.16.4 | Animation library for smooth transitions |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="30"/> | **React Router** | 6.18.0 | Client-side routing and navigation |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/axios/axios-plain.svg" width="30"/> | **Axios** | 1.6.0 | HTTP client for API communication |
| <img src="https://lucide.dev/logo.svg" width="30"/> | **Lucide React** | 0.292.0 | Modern icon library |

### <img src="https://cdn-icons-png.flaticon.com/512/2906/2906274.png" width="20" height="20"/> Backend Technologies

| Logo | Technology | Version | Purpose |
|------|------------|---------|---------|
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/laravel/laravel-original.svg" width="30"/> | **Laravel** | 10.x | PHP framework for robust backend development |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg" width="30"/> | **PHP** | 8.2+ | Server-side programming language |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" width="30"/> | **MySQL** | 8.0 | Relational database management system |
| <img src="https://laravel.com/img/favicon/favicon.ico" width="30"/> | **Laravel Sanctum** | 3.3 | API token authentication |
| <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" width="30"/> | **Google Gemini API** | 2.5 Flash | AI-powered quiz correction and generation |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/composer/composer-original.svg" width="30"/> | **Composer** | 2.x | PHP dependency manager |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/phpunit/phpunit-plain.svg" width="30"/> | **PHPUnit** | 10.x | Testing framework for PHP |

### <img src="https://cdn-icons-png.flaticon.com/512/2721/2721297.png" width="20" height="20"/> Development Tools

| Logo | Tool | Purpose |
|------|------|---------|
| <img src="https://cdn.worldvectorlogo.com/logos/xampp.svg" width="30"/> | **XAMPP** | Local development environment (Apache + MySQL) |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" width="30"/> | **Git** | Version control system |
| <img src="https://www.svgrepo.com/show/354202/postman-icon.svg" width="30"/> | **Postman** | API testing and documentation |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" width="30"/> | **VS Code** | Code editor with extensions |

### <img src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png" width="20" height="20"/> Security Features

| Logo | Feature | Implementation | Description |
|------|---------|----------------|-------------|
| 🔐 | **Dual Authentication** | Email/Password + OAuth 2.0 | Secure login with multiple authentication methods |
| 🎫 | **Token-Based API** | Laravel Sanctum | Stateless authentication for API requests |
| 🔒 | **Password Encryption** | bcrypt hashing | Secure password storage with industry-standard encryption |
| 🛡️ | **CSRF Protection** | Laravel middleware | Protection against cross-site request forgery attacks |
| ✅ | **Input Validation** | Laravel Form Requests | Server-side validation for all user inputs |
| 💉 | **SQL Injection Prevention** | Eloquent ORM | Parameterized queries to prevent SQL injection |
| 🚫 | **XSS Protection** | Input sanitization | Protection against cross-site scripting attacks |
| ⏱️ | **Rate Limiting** | Laravel Throttle | API rate limiting to prevent abuse |
| 🌐 | **CORS Configuration** | Custom middleware | Controlled cross-origin resource sharing |
| 🔑 | **Environment Variables** | .env file | Secure storage of sensitive credentials |
| 🗝️ | **API Key Management** | Encrypted storage | Secure handling of third-party API keys |
| 🍪 | **Session Security** | HTTP-only cookies | Secure session management |

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

<div align="center">

| 👨‍🎓 **Students** | 👨‍🏫 **Teachers** | 👨‍💼 **Administrators** |
|:---:|:---:|:---:|
| Browse and enroll in courses | Create and manage courses | Manage users and permissions |
| Take AI-graded quizzes | Design and publish quizzes | Oversee platform operations |
| Track learning progress | Use AI for quiz generation | Monitor system analytics |
| Receive certificates | Monitor student performance | Configure platform settings |

</div>

---

## 🚦 Getting Started

<div align="center">

| Step | Action | Documentation |
|:----:|--------|---------------|
| **1️⃣** | Read the Installation Guide | [INSTALLATION_GUIDE.md](./Plan-Project/INSTALLATION_GUIDE.md) |
| **2️⃣** | Check API Documentation | [API_DOCUMENTATION.md](./Plan-Project/API_DOCUMENTATION.md) |
| **3️⃣** | Review Authentication Guide | [AUTHENTICATION.md](./Plan-Project/AUTHENTICATION.md) |
| **4️⃣** | Explore Project Architecture | [PROJECT_ARCHITECTURE.md](./Plan-Project/PROJECT_ARCHITECTURE.md) |
| **5️⃣** | Consult Known Issues | [KNOWN_ISSUES.md](./Plan-Project/KNOWN_ISSUES.md) |

</div>

---

## 📞 Support

<div align="center">

For issues, questions, or contributions:

[![Email](https://img.shields.io/badge/Email-Contact-blue?style=for-the-badge&logo=gmail)](mailto:mohammedelouazzani.dev.com)
[![Documentation](https://img.shields.io/badge/Documentation-Plan--Project-green?style=for-the-badge&logo=readthedocs)](./Plan-Project)

</div>

---

## 🙏 Acknowledgments

<div align="center">

| Partner | Contribution |
|:-------:|:------------:|
| **Google Gemini API** | AI-powered features |
| **Laravel Community** | Excellent framework and resources |
| **React Team** | Powerful UI library |
| **Open Source Contributors** | Various dependencies |

</div>

---

<div align="center">
  
### Made with ❤️ by the CoursFlow Team

**© 2025 CoursFlow. All rights reserved.**

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" width="100%"/>

</div>
