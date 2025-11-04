# 📦 Guide d'Installation Complet - CoursFlow

## 🖥️ Prérequis Système

### Configuration Minimale Requise

<table>
  <tr>
    <th>Composant</th>
    <th>Version Minimale</th>
    <th>Version Recommandée</th>
  </tr>
  <tr>
    <td>💻 Système d'Exploitation</td>
    <td>Windows 10</td>
    <td>Windows 11</td>
  </tr>
  <tr>
    <td>🔧 PHP</td>
    <td>8.1</td>
    <td>8.2+</td>
  </tr>
  <tr>
    <td>🗄️ MySQL</td>
    <td>8.0</td>
    <td>8.0.35+</td>
  </tr>
  <tr>
    <td>🟢 Node.js</td>
    <td>18.x</td>
    <td>20.x LTS</td>
  </tr>
  <tr>
    <td>📦 Composer</td>
    <td>2.5</td>
    <td>2.6+</td>
  </tr>
  <tr>
    <td>💾 RAM</td>
    <td>4 GB</td>
    <td>8 GB+</td>
  </tr>
  <tr>
    <td>💿 Espace Disque</td>
    <td>2 GB</td>
    <td>5 GB+</td>
  </tr>
</table>

---

## 🌐 Installation de XAMPP (Serveur Windows)

### Pourquoi XAMPP ?

XAMPP est une distribution Apache contenant MySQL, PHP et Perl. C'est la solution parfaite pour développer sous Windows.

### Étapes d'Installation

#### 1️⃣ Télécharger XAMPP

```bash
# Visitez: https://www.apachefriends.org/
# Téléchargez la version 8.2.x (avec PHP 8.2)
```

#### 2️⃣ Installer XAMPP

```bash
# Exécutez le fichier téléchargé
# Installez dans: C:\xampp\
# Composants à installer:
#   ✅ Apache
#   ✅ MySQL
#   ✅ PHP
#   ✅ phpMyAdmin
#   ❌ FileZilla (optionnel)
#   ❌ Mercury (optionnel)
```

#### 3️⃣ Démarrer les Services

```bash
# Ouvrez XAMPP Control Panel
# Cliquez sur "Start" pour:
#   - Apache (port 80)
#   - MySQL (port 3306)
```

**⚠️ Problèmes courants:**

<details>
<summary><strong>Port 80 déjà utilisé</strong></summary>

```bash
# Solution 1: Arrêter IIS (Internet Information Services)
# Windows + R → services.msc → Arrêter "World Wide Web Publishing Service"

# Solution 2: Changer le port Apache
# XAMPP Control Panel → Config (Apache) → httpd.conf
# Modifier: Listen 80 → Listen 8080
# Redémarrer Apache
```
</details>

<details>
<summary><strong>Port 3306 déjà utilisé (MySQL)</strong></summary>

```bash
# Vérifier si MySQL est déjà installé
netstat -ano | findstr :3306

# Arrêter le service MySQL existant
net stop MySQL80
```
</details>

#### 4️⃣ Vérifier l'Installation

```bash
# Ouvrez votre navigateur
http://localhost/          # Page d'accueil XAMPP
http://localhost/phpmyadmin # Interface phpMyAdmin
```

---

## 📦 Installation de CoursFlow

### 1️⃣ Cloner le Repository

```bash
# Méthode 1: HTTPS
git clone https://github.com/votre-username/CoursFlow.git

# Méthode 2: SSH (si configuré)
git clone git@github.com:votre-username/CoursFlow.git

# Se placer dans le dossier XAMPP
cd C:\xampp\htdocs\CoursFlow
```

---

### 2️⃣ Configuration du Backend (Laravel)

#### Installer les Dépendances PHP

```bash
cd backend
composer install
```

**🔧 Si Composer n'est pas installé:**

```powershell
# Télécharger Composer depuis: https://getcomposer.org/
# Exécuter l'installateur Windows
# Vérifier l'installation:
composer --version
```

#### Créer le Fichier de Configuration

```bash
# Copier le template
copy .env.example .env

# Générer la clé d'application
php artisan key:generate
```

#### Configurer la Base de Données

Éditez le fichier `backend/.env`:

```env
# Configuration de la base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coursflow
DB_USERNAME=root
DB_PASSWORD=              # Laisser vide par défaut pour XAMPP

# Configuration de l'application
APP_NAME=CoursFlow
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Configuration Sanctum (authentification)
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DRIVER=cookie
SESSION_LIFETIME=120

# Configuration CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Créer la Base de Données

**Méthode 1: Via phpMyAdmin**

```bash
1. Ouvrez http://localhost/phpmyadmin
2. Cliquez sur "Nouveau" (New)
3. Nom de la base: coursflow
4. Interclassement: utf8mb4_unicode_ci
5. Cliquez sur "Créer"
```

**Méthode 2: Via Ligne de Commande**

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE coursflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Méthode 3: Utiliser le Script SQL**

```bash
# Depuis le dossier CoursFlow
mysql -u root -p < database/coursflow_schema.sql
```

#### Exécuter les Migrations

```bash
# Créer les tables
php artisan migrate

# Ajouter des données de test (optionnel)
php artisan db:seed
```

**🎉 Résultat attendu:**
```
Migration table created successfully.
Migrating: 2014_10_12_000000_create_users_table
Migrated:  2014_10_12_000000_create_users_table (45.32ms)
Migrating: 2024_01_01_000000_create_students_table
Migrated:  2024_01_01_000000_create_students_table (32.15ms)
...
```

#### Créer un Compte Administrateur

```bash
php artisan db:seed --class=AdminSeeder

# Ou créer manuellement via Tinker
php artisan tinker

# Dans Tinker:
$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'admin@coursflow.com';
$user->password = Hash::make('password');
$user->role = 'admin';
$user->save();
```

---

### 3️⃣ Configuration du Frontend (React)

#### Installer Node.js

```bash
# Vérifier si Node.js est installé
node --version

# Si pas installé, télécharger depuis:
# https://nodejs.org/ (version LTS recommandée)
```

#### Installer les Dépendances

```bash
cd ../frontend
npm install

# Ou avec Yarn
yarn install
```

**⏱️ Temps d'installation: 2-5 minutes**

#### Créer le Fichier de Configuration

```bash
# Copier le template
copy .env.example .env
```

Éditez le fichier `frontend/.env`:

```env
# URL de l'API Backend
VITE_API_URL=http://localhost:8000/api

# Clé API Google Gemini (voir section suivante)
VITE_GEMINI_API_KEY=votre_cle_api_ici

# Configuration Google OAuth (optionnel)
VITE_GOOGLE_CLIENT_ID=votre_client_id
```

---

### 4️⃣ Obtenir une Clé API Google Gemini

#### Étapes Détaillées

**1. Créer un Compte Google Cloud**

```bash
# Visitez: https://makersuite.google.com/app/apikey
# Connectez-vous avec votre compte Google
```

**2. Créer une Clé API**

```bash
# 1. Cliquez sur "Create API Key"
# 2. Sélectionnez "Create API key in new project"
# 3. Copiez la clé générée (commence par AIza...)
```

**3. Ajouter la Clé dans les Fichiers de Configuration**

**Backend (`backend/.env`):**
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Frontend (`frontend/.env`):**
```env
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ IMPORTANT:** Ne commitez JAMAIS ces clés sur GitHub !

#### Configuration du Service Gemini (Backend)

Le fichier `backend/app/Services/GeminiService.php` gère l'intégration:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{
    protected $apiKey;
    protected $baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
    }

    public function correctQuiz($questions, $answers)
    {
        $prompt = $this->buildPrompt($questions, $answers);
        
        $response = Http::post("{$this->baseUrl}/models/gemini-pro:generateContent", [
            'key' => $this->apiKey,
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        return $this->parseResponse($response->json());
    }

    private function buildPrompt($questions, $answers)
    {
        $prompt = "Tu es un correcteur de quiz professionnel. Corrige les réponses suivantes et donne un score et un feedback pour chaque question.\n\n";
        
        foreach ($questions as $index => $question) {
            $prompt .= "Question {$index}: {$question['question']}\n";
            $prompt .= "Réponse correcte: {$question['correct_answer']}\n";
            $prompt .= "Réponse de l'étudiant: {$answers[$index]}\n\n";
        }
        
        $prompt .= "Retourne un JSON avec:\n";
        $prompt .= "- score_total (0-100)\n";
        $prompt .= "- feedback_general\n";
        $prompt .= "- details (array avec score et feedback par question)";
        
        return $prompt;
    }

    private function parseResponse($response)
    {
        // Parser la réponse de l'API
        $text = $response['candidates'][0]['content']['parts'][0]['text'] ?? '';
        
        // Extraire le JSON de la réponse
        preg_match('/\{.*\}/s', $text, $matches);
        
        return json_decode($matches[0] ?? '{}', true);
    }
}
```

**Ajouter dans `backend/config/services.php`:**

```php
'gemini' => [
    'api_key' => env('GEMINI_API_KEY'),
],
```

---

### 5️⃣ Démarrer l'Application

#### Terminal 1: Démarrer le Backend

```bash
cd C:\xampp\htdocs\CoursFlow\backend
php artisan serve

# Sortie attendue:
#   Starting Laravel development server: http://127.0.0.1:8000
#   [Mon Nov  4 10:30:00 2025] PHP 8.2.0 Development Server (http://127.0.0.1:8000) started
```

**✅ Backend disponible sur:** `http://localhost:8000`

#### Terminal 2: Démarrer le Frontend

```bash
cd C:\xampp\htdocs\CoursFlow\frontend
npm run dev

# Sortie attendue:
#   VITE v5.0.0  ready in 1234 ms
#   ➜  Local:   http://localhost:3000/
#   ➜  Network: use --host to expose
```

**✅ Frontend disponible sur:** `http://localhost:3000`

---

## ✅ Vérification de l'Installation

### Test Backend

```bash
# Test 1: API Health Check
curl http://localhost:8000/api

# Test 2: Test de connexion base de données
php artisan db:show

# Test 3: Liste des routes
php artisan route:list
```

### Test Frontend

```bash
# Ouvrez votre navigateur
http://localhost:3000

# Vous devriez voir:
#   - Page de connexion
#   - Logo CoursFlow
#   - Formulaire de login/register
```

### Connexion de Test

```
Administrateur:
  Email: admin@coursflow.com
  Password: password

Enseignant:
  Email: teacher@coursflow.com
  Password: password

Étudiant:
  Email: student@gmail.com
  Password: password
```

---

## 🔧 Configuration Avancée

### Optimiser les Performances

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

### Configuration Email (Optionnel)

Éditez `backend/.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre.email@gmail.com
MAIL_PASSWORD=votre_mot_de_passe_app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=votre.email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Configuration Google OAuth (Optionnel)

```env
# Backend .env
GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Frontend .env
VITE_GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com
```

---

## ⚠️ Dépannage

<details>
<summary><strong>Erreur: Port 8000 déjà utilisé</strong></summary>

```bash
# Solution: Utiliser un autre port
php artisan serve --port=8001
```
</details>

<details>
<summary><strong>Erreur: CORS Policy</strong></summary>

```bash
# Vérifiez backend/.env
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Vérifiez backend/config/cors.php
'allowed_origins' => [env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')],
```
</details>

<details>
<summary><strong>Erreur: npm ERR! code ENOENT</strong></summary>

```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules package-lock.json
npm install
```
</details>

---

## 📚 Prochaines Étapes

1. ✅ [Lire la documentation de l'API](./API_DOCUMENTATION.md)
2. ✅ [Configurer l'intégration Gemini](./GEMINI_INTEGRATION.md)
3. ✅ [Comprendre l'architecture](./Plan-Project/PROJECT_ARCHITECTURE.md)
4. ✅ [Consulter les problèmes connus](./KNOWN_ISSUES.md)

---

**🎉 Félicitations ! CoursFlow est maintenant installé et prêt à l'emploi !**
