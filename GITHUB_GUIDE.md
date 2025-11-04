# 🚀 CoursFlow GitHub Repository

## 📦 What's Included

This repository contains the complete source code for **CoursFlow**, a modern Learning Management System with AI-powered features.

### ✅ Files Included

```
CoursFlow/
├── backend/                    # Laravel API (PHP 8.2+)
├── frontend/                   # React SPA (TypeScript)
├── database/
│   └── coursflow_schema.sql   # Complete database structure
├── image/                      # Logo and assets
├── Plan-Project/              # Project documentation
├── .gitignore                 # Git exclusions
├── LICENSE                    # MIT License
├── README.md                  # Main documentation (English)
├── INSTALLATION_GUIDE.md      # Setup instructions
├── KNOWN_ISSUES.md            # Troubleshooting guide
└── SECURITY_SHARING_GUIDE.md  # Security best practices
```

---

## 🎯 Quick Start

### 1. Prerequisites

- XAMPP 8.2+ (Apache + MySQL + PHP)
- Node.js 18+
- Composer 2.x
- Git

### 2. Clone & Install

```bash
git clone https://github.com/Mohammed-ES/CoursFlow.git
cd CoursFlow

# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 3. Configure

**Backend (.env):**
```env
DB_DATABASE=coursflow
GEMINI_API_KEY=your-key
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000/api
VITE_GEMINI_API_KEY=your-key
VITE_GOOGLE_CLIENT_ID=your-id
```

### 4. Run

```bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@coursflow.com | password |
| Teacher | teacher@coursflow.com | password |
| Student | student@gmail.com | password |

---

## 📚 Documentation

- **README.md** - Complete project documentation
- **INSTALLATION_GUIDE.md** - Detailed setup instructions
- **KNOWN_ISSUES.md** - Common problems and solutions
- **SECURITY_SHARING_GUIDE.md** - Security best practices
- **Plan-Project/PROJECT_ARCHITECTURE.md** - System architecture

---

## 🔑 API Keys Required

### 1. Google Gemini AI (Required for quiz correction)

1. Visit: https://makersuite.google.com/app/apikey
2. Click "Get API Key"
3. Copy to `.env` files

### 2. Google OAuth 2.0 (Optional - for social login)

1. Visit: https://console.cloud.google.com/
2. Create project: "CoursFlow"
3. Enable OAuth 2.0
4. Add redirect URIs:
   - http://localhost:8000/auth/google/callback
   - http://localhost:5173/auth/google/callback
5. Copy Client ID and Secret to `.env` files

---

## ⚠️ Important Security Notes

### ⛔ Never Commit These Files

- `backend/.env`
- `frontend/.env`
- `node_modules/`
- `vendor/`
- `*.log`

### ✅ Always Use

- `.env.example` templates
- `.gitignore` (already configured)
- Strong passwords in production
- HTTPS in production

---

## 🛠️ Technology Stack

### Frontend
- React 18.2 + TypeScript 5.0
- Vite 4.4
- Tailwind CSS 3.4
- React Router 6
- Axios
- Framer Motion

### Backend
- Laravel 10
- PHP 8.2+
- MySQL 8.0
- Laravel Sanctum

### AI & Auth
- Google Gemini AI (Quiz correction)
- Google OAuth 2.0 (Social login)
- JWT Tokens

---

## 🌟 Key Features

- 🤖 **AI-Powered Quiz Correction** - Google Gemini
- 🔐 **Dual Authentication** - Email/Password + Google OAuth
- 📊 **Real-time Analytics** - Live statistics
- 🗓️ **Event Calendar** - Scheduling system
- 💳 **Payment Tracking** - Course enrollments
- 📱 **Responsive Design** - Mobile-friendly
- 🎨 **Modern UI** - Tailwind CSS + Framer Motion

---

## 🐛 Known Issues

All known issues have been resolved! See [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) for:

- ✅ Logo display fix
- ✅ Statistics calculation fix
- ✅ Performance optimization
- ✅ CORS configuration
- ✅ OAuth setup

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/amazing`
5. Open Pull Request

---

## 📜 License

MIT License - see [LICENSE](./LICENSE)

---

## 📞 Support

- 📖 Documentation: See files above
- 🐛 Issues: [GitHub Issues](https://github.com/Mohammed-ES/CoursFlow/issues)
- 📧 Email: support@coursflow.com

---

## 🙏 Credits

Built with ❤️ by [Mohammed ES](https://github.com/Mohammed-ES)

**Technologies:**
- Laravel Team
- React Team
- Google (Gemini AI & OAuth)
- Tailwind CSS
- Open Source Community

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Ready for production deployment** 🚀

</div>
