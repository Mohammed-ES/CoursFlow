# 🚀 CoursFlow Deployment Guide

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Backend Deployment (Render.com)](#backend-deployment-rendercom)
- [Database Setup (Railway)](#database-setup-railway)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Post-Deployment Steps](#post-deployment-steps)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before deploying, ensure you have:

1. ✅ **GitHub Account** - Your code must be on GitHub
2. ✅ **Render Account** - For backend hosting (free tier available)
3. ✅ **Railway Account** - For MySQL database hosting (free $5 credit)
4. ✅ **Vercel Account** - For frontend hosting (free tier available)
5. ✅ **Gemini API Key** - From Google AI Studio

---

## 🗄️ Database Setup (Railway)

### Step 1: Create MySQL Database on Railway

1. Go to [Railway.app](https://railway.app/)
2. Click **"New Project"** → **"Provision MySQL"**
3. Click on the MySQL service → **"Variables"** tab
4. Copy these values (you'll need them later):
   ```
   MYSQL_HOST: containers-us-west-xxx.railway.app
   MYSQL_PORT: 3306
   MYSQL_DATABASE: railway
   MYSQL_USER: root
   MYSQL_PASSWORD: xxxxxxxxxxxxx
   ```

### Step 2: Import Your Database Schema

1. Download **MySQL Workbench** or use Railway's **Query** tab
2. Connect using Railway credentials
3. Execute the SQL script from `database/coursflow_database.sql`

**Or use command line:**
```bash
mysql -h containers-us-west-xxx.railway.app -u root -p railway < database/coursflow_database.sql
```

---

## 🔙 Backend Deployment (Render.com)

### Step 1: Prepare Your Laravel Backend

1. **Push your code to GitHub** (if not done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Ensure you have these files in `backend/` folder:**
   - ✅ `composer.json`
   - ✅ `artisan`
   - ✅ `.env.example`

### Step 2: Create Web Service on Render

1. Go to [Render.com](https://render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Mohammed-ES/CoursFlow`
4. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `coursflow-backend` |
   | **Region** | Choose closest to you (e.g., Frankfurt) |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | `PHP` |
   | **Build Command** | `composer install --optimize-autoloader --no-dev` |
   | **Start Command** | `php artisan serve --host=0.0.0.0 --port=$PORT` |

5. Click **"Advanced"** → Add **Build Command:**
   ```bash
   composer install --optimize-autoloader --no-dev && php artisan config:cache && php artisan route:cache && php artisan view:cache
   ```

### Step 3: Configure Environment Variables on Render

Click **"Environment"** tab and add these variables:

```env
APP_NAME=CoursFlow
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:gDWua8vZrZ8dP0xKzaYMIBcA5UAnUI/G7EYJtme7AGk=
APP_URL=https://coursflow-backend.onrender.com

DB_CONNECTION=mysql
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=your_railway_mysql_password

GEMINI_API_KEY=your_gemini_api_key_here

CORS_ALLOWED_ORIGINS=https://coursflow.vercel.app

SESSION_DRIVER=database
SESSION_LIFETIME=120

CACHE_DRIVER=file
QUEUE_CONNECTION=sync

LOG_CHANNEL=stack
LOG_LEVEL=error
```

### Step 4: Generate APP_KEY (If needed)

**Option 1: Local command**
```bash
cd backend
php artisan key:generate --show
```

**Option 2: Online generator**
- Go to: https://generate-random.org/laravel-key-generator
- Copy the generated `base64:xxxxx` key

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update Frontend API URL

1. Open `frontend/src/config/api.ts` (or where you define API base URL)
2. Update to production backend URL:
   ```typescript
   const API_BASE_URL = import.meta.env.PROD 
     ? 'https://coursflow-backend.onrender.com/api'
     : 'http://localhost:8000/api';
   ```

3. Commit changes:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push origin main
   ```

### Step 2: Deploy on Vercel

1. Go to [Vercel.com](https://vercel.com/)
2. Click **"Add New Project"**
3. Import your GitHub repository: `Mohammed-ES/CoursFlow`
4. Configure:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

5. Add **Environment Variables:**
   ```env
   VITE_API_URL=https://coursflow-backend.onrender.com/api
   ```

6. Click **"Deploy"**

---

## 🔐 Environment Variables Configuration

### 📊 Complete .env Template for Production

Create this configuration on **Render.com** for your backend:

```env
# ===================================
# APPLICATION SETTINGS
# ===================================
APP_NAME=CoursFlow
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:gDWua8vZrZ8dP0xKzaYMIBcA5UAnUI/G7EYJtme7AGk=
APP_URL=https://coursflow-backend.onrender.com
APP_TIMEZONE=UTC

# ===================================
# DATABASE CONFIGURATION (Railway)
# ===================================
DB_CONNECTION=mysql
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=your_railway_password_here

# ===================================
# GEMINI AI API
# ===================================
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ===================================
# CORS SETTINGS
# ===================================
CORS_ALLOWED_ORIGINS=https://coursflow.vercel.app

# ===================================
# SESSION & CACHE
# ===================================
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true

CACHE_DRIVER=file
QUEUE_CONNECTION=sync

# ===================================
# LOGGING
# ===================================
LOG_CHANNEL=stack
LOG_LEVEL=error

# ===================================
# SECURITY
# ===================================
SANCTUM_STATEFUL_DOMAINS=coursflow.vercel.app
SESSION_DOMAIN=.onrender.com
```

### 📝 How to Fill Each Variable:

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `APP_KEY` | Run `php artisan key:generate --show` locally | `base64:gDWua8vZrZ8dP0xKz...` |
| `APP_URL` | Your Render backend URL | `https://coursflow-backend.onrender.com` |
| `DB_HOST` | Railway MySQL **Variables** tab | `containers-us-west-123.railway.app` |
| `DB_PORT` | Railway MySQL **Variables** tab | `3306` |
| `DB_DATABASE` | Railway MySQL **Variables** tab | `railway` |
| `DB_USERNAME` | Railway MySQL **Variables** tab | `root` |
| `DB_PASSWORD` | Railway MySQL **Variables** tab | `xxxxxxxxxxxxx` |
| `GEMINI_API_KEY` | [Google AI Studio](https://makersuite.google.com/app/apikey) | `AIzaSyXXXXXXXXXXXXX` |
| `CORS_ALLOWED_ORIGINS` | Your Vercel frontend URL | `https://coursflow.vercel.app` |

---

## 🔑 Getting Your Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click **"Create API Key"**
3. Select **"Create API key in new project"**
4. Copy the key (starts with `AIzaSy...`)
5. ⚠️ **Never share this key publicly!**

---

## ✅ Post-Deployment Steps

### 1. Run Laravel Migrations on Render

In Render dashboard, open **Shell** tab and run:
```bash
php artisan migrate --force
php artisan db:seed --force
```

### 2. Test Your Backend API

```bash
curl https://coursflow-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 3. Update CORS Settings

In `backend/config/cors.php`, ensure:
```php
'allowed_origins' => [
    env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173')
],
```

### 4. Test Frontend Connection

1. Open your Vercel URL: `https://coursflow.vercel.app`
2. Try to login
3. Check browser console for errors

---

## 🐛 Troubleshooting

### ❌ Error: "CORS policy blocking requests"

**Solution:** Add frontend URL to backend `.env`:
```env
CORS_ALLOWED_ORIGINS=https://coursflow.vercel.app,https://coursflow-git-main-mohammed-es.vercel.app
```

### ❌ Error: "Database connection failed"

**Check:**
1. ✅ Railway database is running
2. ✅ Credentials are correct in Render env vars
3. ✅ Railway allows external connections (default: yes)

**Test connection from Render Shell:**
```bash
php artisan tinker
DB::connection()->getPdo();
```

### ❌ Error: "Class not found" or "Vendor not found"

**Solution:** Redeploy with proper build command:
```bash
composer install --optimize-autoloader --no-dev && php artisan config:clear
```

### ❌ Error: "Session/Cookie not working"

**Add to Render env vars:**
```env
SESSION_SECURE_COOKIE=true
SESSION_DOMAIN=.onrender.com
SANCTUM_STATEFUL_DOMAINS=coursflow.vercel.app
```

### ❌ Frontend shows blank page

**Check:**
1. ✅ Vite build completed successfully on Vercel
2. ✅ `VITE_API_URL` is set correctly
3. ✅ Backend API is responding

**View Vercel logs:**
```bash
vercel logs coursflow --follow
```

---

## 🎯 Quick Deployment Checklist

- [ ] **Database:** MySQL created on Railway ✅
- [ ] **Database:** Schema imported successfully ✅
- [ ] **Backend:** Code pushed to GitHub ✅
- [ ] **Backend:** Render service created ✅
- [ ] **Backend:** All environment variables configured ✅
- [ ] **Backend:** Migrations run successfully ✅
- [ ] **Frontend:** API URL updated in code ✅
- [ ] **Frontend:** Vercel deployment successful ✅
- [ ] **Testing:** Can login from production URL ✅
- [ ] **Testing:** API requests work correctly ✅
- [ ] **Security:** No sensitive data in public repos ✅

---

## 🌐 Your Production URLs

After deployment, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| 🎨 **Frontend** | `https://coursflow.vercel.app` | User interface |
| 🔙 **Backend API** | `https://coursflow-backend.onrender.com/api` | REST API |
| 🗄️ **Database** | `containers-us-west-xxx.railway.app:3306` | MySQL database |

---

## 📧 Need Help?

If you encounter issues:

1. Check **Render logs**: Dashboard → Logs tab
2. Check **Vercel logs**: Project → Deployments → View logs
3. Check **Railway logs**: Service → Logs
4. Test API endpoints with Postman
5. Check browser console for frontend errors

---

## 🎉 Congratulations!

Your **CoursFlow** platform is now live on the internet! 🚀

**Next steps:**
- Configure custom domain (optional)
- Set up monitoring and alerts
- Enable automatic deployments from GitHub
- Add SSL certificate (automatic on Vercel/Render)

---

*Last updated: November 4, 2025*
