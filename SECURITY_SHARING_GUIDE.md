# 🔐 Guide de Partage Sécurisé - CoursFlow

## ⚠️ Fichiers à NE JAMAIS Partager

<div align="center">

### 🚫 RÈGLE D'OR: Ne JAMAIS commiter ces fichiers sur GitHub !

</div>

---

## 📋 Liste des Fichiers Sensibles

### 🔴 Critique (Contiennent des mots de passe/clés)

```bash
❌ backend/.env                 # Configuration Laravel (DB password, API keys)
❌ backend/.env.backup          # Backup de .env
❌ backend/.env.production      # Config production
❌ backend/.env.API.KEY         # Clés API Google Gemini
❌ frontend/.env                # Configuration React (API keys)
❌ frontend/.env.local          # Config locale
❌ frontend/.env.production     # Config production
```

### 🟡 Important (Peuvent contenir des infos sensibles)

```bash
⚠️ backend/storage/logs/*.log  # Logs peuvent contenir des tokens
⚠️ database/*.sql              # Dumps de BD avec données réelles
⚠️ **/*_credentials.json       # Credentials OAuth
⚠️ **/*_secrets.json           # Secrets divers
```

### 🔵 Volumineux (Ralentissent Git)

```bash
📦 frontend/node_modules/      # 500 MB - Dépendances npm
📦 backend/vendor/             # 50 MB - Dépendances Composer
📦 frontend/dist/              # Build de production
📦 backend/storage/app/        # Fichiers uploadés
```

---

## ✅ Ce Qu'il Faut Partager (Git)

### Template de Configuration

```bash
✅ backend/.env.example         # Template SANS vraies valeurs
✅ frontend/.env.example        # Template SANS vraies valeurs
✅ database/coursflow_schema.sql # Schéma sans données sensibles
✅ README.md                     # Documentation
✅ INSTALLATION_GUIDE.md         # Guide d'installation
✅ .gitignore                    # Protection fichiers sensibles
```

---

## 📝 Créer les Fichiers `.env.example`

### 1. Backend `.env.example`

Créez `backend/.env.example` avec des valeurs génériques:

```env
# ============================================
# APPLICATION CONFIGURATION
# ============================================
APP_NAME=CoursFlow
APP_ENV=local
APP_KEY=                              # Généré avec: php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

# ============================================
# DATABASE CONFIGURATION
# ============================================
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coursflow
DB_USERNAME=root
DB_PASSWORD=                          # XAMPP: laisser vide par défaut

# ============================================
# GOOGLE GEMINI AI CONFIGURATION
# ============================================
# Obtenir une clé: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# ============================================
# GOOGLE OAUTH CONFIGURATION (Optionnel)
# ============================================
# Console: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# ============================================
# SANCTUM CONFIGURATION (Authentication)
# ============================================
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DRIVER=cookie
SESSION_LIFETIME=120

# ============================================
# CORS CONFIGURATION
# ============================================
CORS_ALLOWED_ORIGINS=http://localhost:3000

# ============================================
# MAIL CONFIGURATION (Optionnel)
# ============================================
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your.email@gmail.com
MAIL_PASSWORD=your_app_password_here  # Mot de passe d'application Google
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your.email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# ============================================
# FILESYSTEM (Uploads)
# ============================================
FILESYSTEM_DISK=local

# ============================================
# LOGGING
# ============================================
LOG_CHANNEL=daily
LOG_LEVEL=debug
```

### 2. Frontend `.env.example`

Créez `frontend/.env.example`:

```env
# ============================================
# COURSFLOW FRONTEND CONFIGURATION
# ============================================

# Backend API URL
VITE_API_URL=http://localhost:8000/api

# Google Gemini AI API Key
# Obtenir une clé: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth Client ID (Optionnel)
# Console: https://console.cloud.google.com/
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Application Name
VITE_APP_NAME=CoursFlow

# Enable Debug Mode (Development only)
VITE_DEBUG=true
```

---

## 🔒 Vérifier la Protection `.gitignore`

### Contenu du `.gitignore` (déjà créé)

```bash
# Fichiers d'environnement
.env
.env.*
!.env.example

# Dépendances
node_modules/
vendor/

# Builds
dist/
build/

# Logs
*.log
backend/storage/logs/

# Uploads
backend/storage/app/
uploads/

# Credentials
*_credentials.json
*_secrets.json

# OS
.DS_Store
Thumbs.db
```

### Test de Protection

```bash
# Vérifier que .env n'est PAS tracké
git status

# Si .env apparaît (❌ DANGER!):
git rm --cached backend/.env
git rm --cached frontend/.env

# Ajouter au .gitignore et commit
git add .gitignore
git commit -m "security: Ensure .env files are never tracked"
```

---

## 📤 Processus de Partage Sécurisé

### Pour Partager sur GitHub

```bash
# 1. Vérifier les fichiers à commiter
git status

# 2. Vérifier qu'aucun fichier sensible n'est inclus
git status --ignored

# 3. Voir le diff avant commit
git diff

# 4. Commit uniquement si aucun fichier sensible
git add .
git commit -m "feat: Initial commit of CoursFlow"
git push origin main
```

### Pour Partager à un Collaborateur (Fichiers Sensibles)

#### Option 1: Transmission Sécurisée

```bash
# Créer un fichier compressé des configs
# ⚠️ NE JAMAIS envoyer par email non chiffré!

# 1. Créer un fichier avec les vraies valeurs
backend/.env.production
frontend/.env.production

# 2. Compresser avec mot de passe
7z a -p"mot_de_passe_fort" env_files.7z backend/.env frontend/.env

# 3. Envoyer via:
# - Signal (chiffrement end-to-end)
# - Telegram Secret Chat
# - WeTransfer avec password
# - USB directement

# 4. Envoyer le mot de passe séparément (SMS, autre canal)
```

#### Option 2: Variables d'Environnement Serveur

```bash
# Sur le serveur de production
# Ajouter les variables dans le panneau d'hébergement

# Exemples:
# - Heroku: heroku config:set GEMINI_API_KEY=xxx
# - Vercel: Dashboard → Environment Variables
# - AWS: Parameter Store / Secrets Manager
```

---

## 📖 Documentation pour les Nouveaux Développeurs

### Créer `SETUP_FOR_DEVELOPERS.md`

```markdown
# Configuration pour Développeurs

## 1. Cloner le Repository

```bash
git clone https://github.com/votre-username/CoursFlow.git
cd CoursFlow
```

## 2. Créer les Fichiers de Configuration

### Backend
```bash
cd backend
cp .env.example .env
```

**Éditer `backend/.env` et configurer:**
- `DB_PASSWORD`: Votre mot de passe MySQL (vide pour XAMPP)
- `GEMINI_API_KEY`: Votre clé API (voir section suivante)
- `APP_KEY`: Généré automatiquement avec `php artisan key:generate`

### Frontend
```bash
cd ../frontend
cp .env.example .env
```

**Éditer `frontend/.env` et configurer:**
- `VITE_API_URL`: http://localhost:8000/api
- `VITE_GEMINI_API_KEY`: Même clé que backend

## 3. Obtenir une Clé API Google Gemini

1. Visitez: https://makersuite.google.com/app/apikey
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Copiez la clé (commence par `AIza...`)
5. Ajoutez-la dans `.env` files

## 4. Installer les Dépendances

```bash
# Backend
cd backend
composer install
php artisan key:generate
php artisan migrate --seed

# Frontend
cd ../frontend
npm install
```

## 5. Démarrer l'Application

**Terminal 1:**
```bash
cd backend
php artisan serve
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

## 6. Accéder à l'Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

## 7. Comptes de Test

```
Admin:
  Email: admin@coursflow.com
  Password: password

Teacher:
  Email: teacher@coursflow.com
  Password: password

Student:
  Email: student@gmail.com
  Password: password
```

## ⚠️ IMPORTANT

- Ne JAMAIS commiter les fichiers `.env`
- Ne JAMAIS partager les clés API publiquement
- Utiliser des mots de passe forts en production
```

---

## 🔍 Audit de Sécurité

### Checklist Avant Partage

- [ ] Vérifier `.gitignore` inclut tous les fichiers sensibles
- [ ] Confirmer qu'aucun `.env` n'est tracké par Git
- [ ] Vérifier qu'aucune clé API n'est dans le code
- [ ] Confirmer que `backend/storage/logs/` est ignoré
- [ ] Vérifier que `node_modules/` est ignoré
- [ ] Confirmer que tous les mots de passe sont hashés (bcrypt)
- [ ] Vérifier qu'aucun credential n'est en dur dans le code
- [ ] Tester le clone sur une machine fraîche

### Commande de Vérification

```bash
# Rechercher des patterns suspects dans le code
git grep -i "password.*=" -- '*.php' '*.ts' '*.tsx'
git grep -i "api.*key.*=" -- '*.php' '*.ts' '*.tsx'
git grep -i "secret.*=" -- '*.php' '*.ts' '*.tsx'

# Vérifier l'historique Git pour des fichiers sensibles
git log --all --full-history -- backend/.env
git log --all --full-history -- frontend/.env

# Si trouvés, nettoyer l'historique (⚠️ Dangereux!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 🚀 Déploiement Production

### Variables d'Environnement Serveur

#### Heroku

```bash
# Backend
heroku config:set APP_KEY="base64:xxx"
heroku config:set DB_HOST="hostname"
heroku config:set DB_PASSWORD="password"
heroku config:set GEMINI_API_KEY="AIza..."

# Frontend (Vercel)
vercel env add VITE_API_URL production
vercel env add VITE_GEMINI_API_KEY production
```

#### AWS (via Parameter Store)

```bash
aws ssm put-parameter \
  --name /coursflow/prod/db-password \
  --value "secure_password" \
  --type SecureString

aws ssm put-parameter \
  --name /coursflow/prod/gemini-api-key \
  --value "AIza..." \
  --type SecureString
```

---

## 📞 Support Sécurité

En cas de fuite de credentials:

1. **Changer immédiatement** tous les mots de passe
2. **Régénérer** toutes les clés API
3. **Notifier** l'équipe
4. **Auditer** l'accès aux services
5. **Documenter** l'incident

---

**Dernière mise à jour:** 4 Novembre 2025  
**Classification:** Documentation Publique
