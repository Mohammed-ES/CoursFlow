# 🌐 HTTP/HTTPS Protocol Guide

## Complete API Documentation for CoursFlow

This document provides comprehensive information about HTTP/HTTPS protocols, API endpoints, request/response formats, and security configurations for the CoursFlow Learning Management System.

---

## Table of Contents

- [API Overview](#api-overview)
- [Base URLs](#base-urls)
- [Authentication](#authentication)
- [Request/Response Format](#requestresponse-format)
- [API Endpoints](#api-endpoints)
- [HTTP Status Codes](#http-status-codes)
- [CORS Configuration](#cors-configuration)
- [SSL/TLS Setup](#ssltls-setup)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)

---

## API Overview

CoursFlow uses a **RESTful API architecture** with Laravel backend serving JSON responses to the React frontend.

### Key Features

- ✅ **RESTful Design** - Standard HTTP methods (GET, POST, PUT, DELETE)
- ✅ **JSON Format** - All requests and responses use JSON
- ✅ **Token Authentication** - JWT Bearer tokens via Laravel Sanctum
- ✅ **CORS Enabled** - Cross-origin requests supported
- ✅ **Rate Limited** - 60 requests per minute per user
- ✅ **HTTPS Ready** - SSL/TLS configuration for production

---

## Base URLs

### Development

```bash
# Backend API
http://localhost:8000

# Frontend
http://localhost:5173
```

### Production

```bash
# Backend API
https://api.coursflow.com

# Frontend
https://coursflow.com
```

---

## Authentication

### Header Format

All authenticated requests must include the JWT token in the Authorization header:

```http
Authorization: Bearer {token}
```

### Example Request

```bash
curl -X GET http://localhost:8000/api/student/courses \
  -H "Authorization: Bearer 1|abcdef123456789..." \
  -H "Content-Type: application/json"
```

### Token Management

```typescript
// Store token after login
localStorage.setItem('token', response.data.token);

// Add to all API requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Remove on logout
localStorage.removeItem('token');
delete axios.defaults.headers.common['Authorization'];
```

---

## Request/Response Format

### Standard Request

```json
{
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer {token}",
    "Accept": "application/json"
  },
  "body": {
    "key": "value"
  }
}
```

### Standard Response (Success)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Example"
  },
  "message": "Operation successful"
}
```

### Standard Response (Error)

```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

---

## API Endpoints

### 🔐 Authentication Endpoints

#### POST /api/login
Login with email and password

**Request:**
```json
{
  "email": "student@gmail.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "token": "1|abcdef123456...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "student@gmail.com",
    "role": "student"
  }
}
```

---

#### POST /api/register
Register a new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "role": "student"
}
```

**Response (201):**
```json
{
  "token": "1|newtoken...",
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

---

#### POST /api/logout
Logout current user (requires authentication)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### GET /api/user
Get authenticated user details

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "student@gmail.com",
  "role": "student",
  "email_verified_at": "2024-01-10T08:00:00.000000Z",
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

---

### 📚 Course Endpoints

#### GET /api/courses
Get all available courses

**Query Parameters:**
- `category` (optional) - Filter by category
- `teacher_id` (optional) - Filter by teacher
- `free` (optional) - true/false for free courses

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "React Fundamentals",
      "description": "Learn React from scratch",
      "category": "Programming",
      "price": 0,
      "teacher": {
        "id": 2,
        "name": "Prof. Smith"
      },
      "students_count": 150
    }
  ],
  "total": 1
}
```

---

#### GET /api/courses/{id}
Get single course details

**Response (200):**
```json
{
  "id": 1,
  "title": "React Fundamentals",
  "description": "Complete React course",
  "category": "Programming",
  "price": 0,
  "teacher": {
    "id": 2,
    "name": "Prof. Smith",
    "bio": "Experienced developer"
  },
  "content": "Course content here...",
  "students_count": 150,
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

---

#### POST /api/courses
Create new course (teacher/admin only)

**Request:**
```json
{
  "title": "Node.js Advanced",
  "description": "Master Node.js",
  "category": "Backend",
  "price": 49.99,
  "content": "Course content..."
}
```

**Response (201):**
```json
{
  "id": 5,
  "title": "Node.js Advanced",
  "message": "Course created successfully"
}
```

---

### 👨‍🎓 Student Endpoints

#### GET /api/student/courses
Get enrolled courses for authenticated student

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "React Fundamentals",
      "progress": 65,
      "enrollment_date": "2024-01-15",
      "completed_quizzes": 3,
      "total_quizzes": 5
    }
  ]
}
```

---

#### POST /api/student/enroll
Enroll in a course

**Request:**
```json
{
  "course_id": 1
}
```

**Response (200):**
```json
{
  "message": "Successfully enrolled in course",
  "enrollment": {
    "student_id": 1,
    "course_id": 1,
    "enrolled_at": "2024-01-20T10:00:00.000000Z"
  }
}
```

---

#### GET /api/student/dashboard
Get student dashboard data

**Response (200):**
```json
{
  "enrolled_courses": 5,
  "completed_quizzes": 12,
  "average_score": 85.5,
  "upcoming_events": [
    {
      "id": 1,
      "title": "React Class",
      "date": "2024-01-25",
      "time": "14:00"
    }
  ],
  "notifications": [
    {
      "id": 1,
      "message": "New quiz available",
      "created_at": "2024-01-20T09:00:00.000000Z"
    }
  ]
}
```

---

### 🎯 Quiz Endpoints

#### GET /api/quizzes/{id}
Get quiz questions

**Response (200):**
```json
{
  "id": 1,
  "title": "React Basics Quiz",
  "course_id": 1,
  "time_limit": 30,
  "questions": [
    {
      "id": 1,
      "question": "What is JSX?",
      "options": ["A", "B", "C", "D"],
      "points": 10
    }
  ]
}
```

---

#### POST /api/quizzes/submit
Submit quiz answers (AI-powered correction)

**Request:**
```json
{
  "quiz_id": 1,
  "answers": [
    {
      "question_id": 1,
      "answer": "A syntax extension for JavaScript"
    }
  ]
}
```

**Response (200):**
```json
{
  "score": 85,
  "total_points": 100,
  "passed": true,
  "feedback": {
    "overall": "Great job! You have a solid understanding.",
    "by_question": [
      {
        "question_id": 1,
        "correct": true,
        "feedback": "Excellent answer!"
      }
    ]
  },
  "gemini_analysis": "AI-generated detailed feedback..."
}
```

---

### 👨‍🏫 Teacher Endpoints

#### GET /api/teacher/courses
Get teacher's courses

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "React Fundamentals",
      "students_count": 150,
      "quizzes_count": 5,
      "average_score": 82.5
    }
  ]
}
```

---

#### POST /api/teacher/quizzes
Create new quiz

**Request:**
```json
{
  "course_id": 1,
  "title": "Week 1 Quiz",
  "time_limit": 30,
  "questions": [
    {
      "question": "What is React?",
      "correct_answer": "A JavaScript library",
      "points": 10
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 10,
  "message": "Quiz created successfully"
}
```

---

#### GET /api/teacher/students/{course_id}
Get students enrolled in course

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "enrollment_date": "2024-01-15",
      "progress": 65,
      "average_score": 78.5
    }
  ]
}
```

---

### 📅 Event/Calendar Endpoints

#### GET /api/events
Get all events

**Query Parameters:**
- `start_date` - Filter events from date
- `end_date` - Filter events to date
- `course_id` - Filter by course

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "React Live Session",
      "description": "Q&A session",
      "date": "2024-01-25",
      "time": "14:00",
      "duration": 60,
      "course_id": 1,
      "teacher": "Prof. Smith",
      "registered_students": 45
    }
  ]
}
```

---

#### POST /api/events
Create new event (teacher only)

**Request:**
```json
{
  "title": "Node.js Workshop",
  "description": "Hands-on coding",
  "date": "2024-02-01",
  "time": "15:00",
  "duration": 120,
  "course_id": 2
}
```

**Response (201):**
```json
{
  "id": 15,
  "message": "Event created successfully"
}
```

---

#### POST /api/events/{id}/register
Register for event (student)

**Response (200):**
```json
{
  "message": "Successfully registered for event",
  "event": {
    "id": 1,
    "title": "React Live Session",
    "date": "2024-01-25"
  }
}
```

---

### 💳 Payment Endpoints

#### POST /api/payments
Process course payment

**Request:**
```json
{
  "course_id": 5,
  "amount": 49.99,
  "payment_method": "card",
  "card_token": "tok_xxx..."
}
```

**Response (200):**
```json
{
  "payment_id": "pay_123abc",
  "status": "completed",
  "message": "Payment successful",
  "enrollment": {
    "course_id": 5,
    "enrolled_at": "2024-01-20T11:00:00.000000Z"
  }
}
```

---

### 🔔 Notification Endpoints

#### GET /api/notifications
Get user notifications

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "type": "quiz_result",
      "message": "Your quiz score: 85/100",
      "read": false,
      "created_at": "2024-01-20T10:30:00.000000Z"
    }
  ],
  "unread_count": 3
}
```

---

#### PUT /api/notifications/{id}/read
Mark notification as read

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

---

### 👨‍💼 Admin Endpoints

#### GET /api/admin/stats
Get platform statistics

**Response (200):**
```json
{
  "total_users": 1250,
  "total_courses": 45,
  "total_revenue": 125000,
  "active_students": 890,
  "new_users_this_month": 67,
  "course_completion_rate": 72.5
}
```

---

#### GET /api/admin/users
Get all users (with pagination)

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 15)
- `role` - Filter by role
- `search` - Search by name/email

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "current_page": 1,
  "total": 1250,
  "per_page": 15,
  "last_page": 84
}
```

---

## HTTP Status Codes

### Success Codes

| Code | Name | Description |
|------|------|-------------|
| **200** | OK | Request successful |
| **201** | Created | Resource created successfully |
| **204** | No Content | Successful with no response body |

### Client Error Codes

| Code | Name | Description |
|------|------|-------------|
| **400** | Bad Request | Invalid request format |
| **401** | Unauthorized | Authentication required or failed |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **422** | Unprocessable Entity | Validation failed |
| **429** | Too Many Requests | Rate limit exceeded |

### Server Error Codes

| Code | Name | Description |
|------|------|-------------|
| **500** | Internal Server Error | Server encountered an error |
| **503** | Service Unavailable | Server temporarily unavailable |

---

## CORS Configuration

### Laravel CORS Setup

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
        'http://localhost:3000',
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];
```

### Frontend Axios Configuration

```typescript
// src/utils/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;
```

---

## SSL/TLS Setup

### Production Configuration

#### 1. Obtain SSL Certificate

```bash
# Using Let's Encrypt (Free)
sudo apt install certbot
sudo certbot --nginx -d api.coursflow.com
```

#### 2. Nginx Configuration

```nginx
# /etc/nginx/sites-available/coursflow
server {
    listen 443 ssl http2;
    server_name api.coursflow.com;

    ssl_certificate /etc/letsencrypt/live/api.coursflow.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.coursflow.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name api.coursflow.com;
    return 301 https://$server_name$request_uri;
}
```

#### 3. Laravel Environment

```env
# .env
APP_URL=https://api.coursflow.com
FRONTEND_URL=https://coursflow.com
SESSION_SECURE_COOKIE=true
```

---

## Rate Limiting

### Laravel Rate Limiting Configuration

```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'api' => [
        'throttle:api', // 60 requests per minute
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

### Custom Rate Limits

```php
// app/Providers/RouteServiceProvider.php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

protected function configureRateLimiting()
{
    // Default API rate limit
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    // Stricter limit for login attempts
    RateLimiter::for('login', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });

    // Higher limit for authenticated users
    RateLimiter::for('authenticated', function (Request $request) {
        return Limit::perMinute(120)->by($request->user()->id);
    });
}
```

### Apply to Routes

```php
// routes/api.php
Route::middleware('throttle:login')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function () {
    Route::get('/student/courses', [StudentController::class, 'courses']);
});
```

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Resource not found",
  "code": "RESOURCE_NOT_FOUND",
  "status": 404
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ],
    "password": [
      "The password must be at least 8 characters."
    ]
  }
}
```

### Laravel Exception Handler

```php
// app/Exceptions/Handler.php
public function render($request, Throwable $exception)
{
    if ($request->expectsJson()) {
        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'error' => 'Resource not found',
            ], 404);
        }

        if ($exception instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthenticated',
            ], 401);
        }

        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $exception->errors(),
            ], 422);
        }
    }

    return parent::render($request, $exception);
}
```

---

## Security Headers

### Recommended Headers

```php
// app/Http/Middleware/SecurityHeaders.php
namespace App\Http\Middleware;

use Closure;

class SecurityHeaders
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        return $response;
    }
}
```

---

## Testing API Endpoints

### Using curl

```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@gmail.com","password":"password"}'

# Get courses (authenticated)
curl -X GET http://localhost:8000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create course
curl -X POST http://localhost:8000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Course","category":"Programming","price":0}'
```

### Using Postman

1. Import collection from `postman/CoursFlow.postman_collection.json`
2. Set environment variable `base_url` to `http://localhost:8000`
3. Set `token` variable after login
4. Test all endpoints

---

<div align="center">

## Need Help?

📧 Email: support@coursflow.com  
🐛 GitHub Issues: [Report an Issue](https://github.com/Mohammed-ES/CoursFlow/issues)  
💬 Discussions: [Ask Questions](https://github.com/Mohammed-ES/CoursFlow/discussions)

---

[⬆ Back to README](./README.md) • [📖 View All Documentation](./README.md#-documentation)

**CoursFlow** • API Documentation

</div>
