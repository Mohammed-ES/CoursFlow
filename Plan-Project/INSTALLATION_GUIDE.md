# 📦 Complete Installation Guide - CoursFlow

## 🖥️ System Requirements

### Minimum Required Configuration

| Component | Minimum Version | Recommended Version |
|-----------|----------------|---------------------|
| 💻 Operating System | Windows 10 | Windows 11 |
| 🔧 PHP | 8.1 | 8.2+ |
| 🗄️ MySQL | 8.0 | 8.0.35+ |
| 🟢 Node.js | 18.x | 20.x LTS |
| 📦 Composer | 2.5 | 2.6+ |
| 💾 RAM | 4 GB | 8 GB+ |
| 💿 Disk Space | 2 GB | 5 GB+ |

---

## 🌐 XAMPP Installation (Windows Server)

### Why XAMPP?

XAMPP is an Apache distribution containing MySQL, PHP, and Perl. It's the perfect solution for Windows development.

### Installation Steps

#### 1️⃣ Download XAMPP

```bash
# Visit: https://www.apachefriends.org/
# Download version 8.2.x (with PHP 8.2)
```

#### 2️⃣ Install XAMPP

```bash
# Run the downloaded file
# Install in: C:\xampp\
# Components to install:
#   ✅ Apache
#   ✅ MySQL
#   ✅ PHP
#   ✅ phpMyAdmin
#   ❌ FileZilla (optional)
#   ❌ Mercury (optional)
```

#### 3️⃣ Start Services

```bash
# Open XAMPP Control Panel
# Click "Start" for:
#   - Apache (port 80)
#   - MySQL (port 3306)
```

**⚠️ Common Issues:**

<details>
<summary><strong>Port 80 already in use</strong></summary>

```bash
# Solution 1: Stop IIS (Internet Information Services)
# Windows + R → services.msc → Stop "World Wide Web Publishing Service"

# Solution 2: Change Apache port
# XAMPP Control Panel → Config (Apache) → httpd.conf
# Modify: Listen 80 → Listen 8080
# Restart Apache
```
</details>

<details>
<summary><strong>Port 3306 already in use (MySQL)</strong></summary>

```bash
# Check if MySQL is already installed
netstat -ano | findstr :3306

# Stop existing MySQL service
net stop MySQL80
```
</details>

#### 4️⃣ Verify Installation

```bash
# Open your browser
http://localhost/          # XAMPP homepage
http://localhost/phpmyadmin # phpMyAdmin interface
```

---

## 📦 CoursFlow Installation

### 1️⃣ Clone the Repository

```bash
# Method 1: HTTPS
git clone https://github.com/Mohammed-ES/CoursFlow.git

# Method 2: SSH (if configured)
git clone git@github.com:Mohammed-ES/CoursFlow.git

# Navigate to XAMPP folder
cd C:\xampp\htdocs\CoursFlow
```

---

### 2️⃣ Backend Configuration (Laravel)

#### Install PHP Dependencies

```bash
cd backend
composer install
```

**🔧 If Composer is not installed:**

```powershell
# Download Composer from: https://getcomposer.org/
# Run the Windows installer
# Verify installation:
composer --version
```

#### Create Configuration File

```bash
# Copy the template
copy .env.example .env

# Generate application key
php artisan key:generate
```

#### Configure Database

Edit the `backend/.env` file:

```env
# Database configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coursflow
DB_USERNAME=root
DB_PASSWORD=              # Leave empty by default for XAMPP

# Application configuration
APP_NAME=CoursFlow
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Sanctum configuration (authentication)
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DRIVER=cookie
SESSION_LIFETIME=120

# CORS configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Create Database

**Method 1: Via phpMyAdmin**

```bash
1. Open http://localhost/phpmyadmin
2. Click "New"
3. Database name: coursflow
4. Collation: utf8mb4_unicode_ci
5. Click "Create"
```

**Method 2: Via Command Line**

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE coursflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Method 3: Use SQL Script**

```bash
# From CoursFlow folder
mysql -u root -p < database/coursflow_schema.sql
```

#### Run Migrations

```bash
# Create tables
php artisan migrate

# Add test data (optional)
php artisan db:seed
```

**🎉 Expected output:**
```
Migration table created successfully.
Migrating: 2014_10_12_000000_create_users_table
Migrated:  2014_10_12_000000_create_users_table (45.32ms)
Migrating: 2024_01_01_000000_create_students_table
Migrated:  2024_01_01_000000_create_students_table (32.15ms)
...
```

#### Create Administrator Account

```bash
php artisan db:seed --class=AdminSeeder

# Or create manually via Tinker
php artisan tinker

# In Tinker:
$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'admin@coursflow.com';
$user->password = Hash::make('password');
$user->role = 'admin';
$user->save();
```

---

### 3️⃣ Frontend Configuration (React)

#### Install Node.js

```bash
# Check if Node.js is installed
node --version

# If not installed, download from:
# https://nodejs.org/ (LTS version recommended)
```

#### Install Dependencies

```bash
cd ../frontend
npm install

# Or with Yarn
yarn install
```

**⏱️ Installation time: 2-5 minutes**

#### Create Configuration File

```bash
# Copy the template
copy .env.example .env
```

Edit the `frontend/.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api

# Google Gemini API Key (see next section)
VITE_GEMINI_API_KEY=your_api_key_here

# Google OAuth configuration (optional)
VITE_GOOGLE_CLIENT_ID=your_client_id
```

---

### 4️⃣ Get Google Gemini API Key

#### Detailed Steps

**1. Create a Google Cloud Account**

```bash
# Visit: https://makersuite.google.com/app/apikey
# Sign in with your Google account
```

**2. Create an API Key**

```bash
# 1. Click "Create API Key"
# 2. Select "Create API key in new project"
# 3. Copy the generated key (starts with AIza...)
```

**3. Add the Key to Configuration Files**

**Backend (`backend/.env`):**
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Frontend (`frontend/.env`):**
```env
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ IMPORTANT:** NEVER commit these keys to GitHub!

---

### 5️⃣ Start the Application

#### Terminal 1: Start Backend

```bash
cd C:\xampp\htdocs\CoursFlow\backend
php artisan serve

# Expected output:
#   Starting Laravel development server: http://127.0.0.1:8000
#   [Mon Nov  4 10:30:00 2025] PHP 8.2.0 Development Server (http://127.0.0.1:8000) started
```

**✅ Backend available at:** `http://localhost:8000`

#### Terminal 2: Start Frontend

```bash
cd C:\xampp\htdocs\CoursFlow\frontend
npm run dev

# Expected output:
#   VITE v5.0.0  ready in 1234 ms
#   ➜  Local:   http://localhost:3000/
#   ➜  Network: use --host to expose
```

**✅ Frontend available at:** `http://localhost:3000`

---

## ✅ Installation Verification

### Backend Test

```bash
# Test 1: API Health Check
curl http://localhost:8000/api

# Test 2: Database connection test
php artisan db:show

# Test 3: List routes
php artisan route:list
```

### Frontend Test

```bash
# Open your browser
http://localhost:3000

# You should see:
#   - Login page
#   - CoursFlow logo
#   - Login/register form
```

### Test Credentials

```
Administrator:
  Email: admin@coursflow.com
  Password: password

Teacher:
  Email: teacher@coursflow.com
  Password: password

Student:
  Email: student@gmail.com
  Password: password
```

---

## 🔧 Advanced Configuration

### Optimize Performance

```bash
# Backend
cd backend
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend
cd frontend
npm run build  # Production build
```

### Email Configuration (Optional)

Edit `backend/.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your.email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your.email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Google OAuth Configuration (Optional)

```env
# Backend .env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Frontend .env
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

---

## ⚠️ Troubleshooting

<details>
<summary><strong>Error: Port 8000 already in use</strong></summary>

```bash
# Solution: Use another port
php artisan serve --port=8001
```
</details>

<details>
<summary><strong>Error: CORS Policy</strong></summary>

```bash
# Check backend/.env
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Check backend/config/cors.php
'allowed_origins' => [env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')],
```
</details>

<details>
<summary><strong>Error: npm ERR! code ENOENT</strong></summary>

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```
</details>

---

## 📚 Next Steps

1. ✅ [Read API Documentation](./API_DOCUMENTATION.md)
2. ✅ [Configure Gemini Integration](./GEMINI_INTEGRATION.md)
3. ✅ [Understand Architecture](./PROJECT_ARCHITECTURE.md)
4. ✅ [Check Known Issues](./KNOWN_ISSUES.md)

---

**🎉 Congratulations! CoursFlow is now installed and ready to use!**
