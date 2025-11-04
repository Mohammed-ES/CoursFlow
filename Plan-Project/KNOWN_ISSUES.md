# ⚠️ Known Issues & Solutions - CoursFlow

## 📊 Overview

This document lists common issues, bugs, and their solutions encountered in CoursFlow.

---

## Table of Contents

- [Console Errors](#-console-errors)
- [HTTP 500 Server Errors](#-http-500-server-errors)
- [Display Issues](#-display-issues)
- [Localhost Connection Issues](#-localhost-connection-issues)
- [Authentication Issues](#-authentication-issues)
- [Database Issues](#-database-issues)
- [API Issues](#-api-issues)

---

## 🔴 Console Errors

### Issue 1: React Hydration Mismatch

**Symptoms:**
```
Warning: Text content did not match. Server: "0" Client: "3"
Hydration failed because the initial UI does not match what was rendered on the server
```

**Cause:** 
- State updates before component mount
- Async data loading inconsistency
- localStorage data not available during SSR

**Solution:**
```typescript
// Use useEffect to prevent hydration mismatch
const [stats, setStats] = useState({ courses: 0, quizzes: 0 });

useEffect(() => {
  fetchStats().then(data => setStats(data));
}, []);

return <div>{stats.courses}</div>;
```

**Files Modified:**
- `frontend/src/pages/student/StudentDashboard.tsx`
- `frontend/src/components/student/ProfileCard.tsx`

---

### Issue 2: Memory Leak Warning

**Symptoms:**
```
Warning: Can't perform a React state update on an unmounted component
```

**Cause:**
- Async operations continuing after component unmount
- Missing cleanup in useEffect

**Solution:**
```typescript
useEffect(() => {
  let isMounted = true;
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const response = await api.get('/endpoint', {
        signal: controller.signal
      });
      if (isMounted) setData(response.data);
    } catch (error) {
      if (!controller.signal.aborted) console.error(error);
    }
  };

  fetchData();

  return () => {
    isMounted = false;
    controller.abort();
  };
}, []);
```

---

### Issue 3: Prop Type Warning

**Symptoms:**
```
Warning: Failed prop type: Invalid prop `value` of type `string` supplied to `Component`, expected `number`
```

**Solution:**
```typescript
// Add proper type checking
interface Props {
  value: number;  // Explicitly define type
  onChange: (value: number) => void;
}

// Or parse string to number
<Input 
  value={Number(stringValue)} 
  onChange={(e) => handleChange(Number(e.target.value))}
/>
```

---

### Issue 4: Axios Network Error in Console

**Symptoms:**
```
AxiosError: Network Error
  at XMLHttpRequest.handleError
```

**Cause:**
- CORS policy blocking request
- Backend server not running
- Incorrect API URL

**Solution:**

**1. Check backend is running:**
```bash
php artisan serve
# Server should start on http://localhost:8000
```

**2. Verify CORS configuration:**
```php
// backend/config/cors.php
'allowed_origins' => [
    'http://localhost:3000',
    'http://localhost:5173',
],
'supports_credentials' => true,
```

**3. Check API URL in frontend:**
```env
# frontend/.env
VITE_API_URL=http://localhost:8000/api
```

---

### Issue 5: React Router Dom Warning

**Symptoms:**
```
Warning: Invalid DOM property `class`. Did you mean `className`?
```

**Solution:**
```typescript
// ❌ Wrong
<div class="container">Content</div>

// ✅ Correct
<div className="container">Content</div>
```

---

## 🔥 HTTP 500 Server Errors

### Issue 1: Internal Server Error on Quiz Submission

**Symptoms:**
```
POST /api/student/analyze-quiz 500 Internal Server Error
Error: Failed to analyze quiz
```

**Cause:**
- Invalid Gemini API key
- Missing quiz data
- Database connection failure
- JSON parsing error

**Solution:**

**1. Check Gemini API key:**
```bash
# backend/.env
GEMINI_API_KEY=AIzaSy...  # Must be valid
```

**2. Check Laravel logs:**
```bash
tail -f backend/storage/logs/laravel.log
```

**3. Validate request data:**
```php
// backend/app/Http/Controllers/Student/StudentQuizController.php
$validator = Validator::make($request->all(), [
    'quiz_id' => 'required|integer|exists:quizzes,id',
    'answers' => 'required|array',
]);

if ($validator->fails()) {
    return response()->json([
        'success' => false,
        'errors' => $validator->errors()
    ], 422);
}
```

**4. Add try-catch blocks:**
```php
try {
    $result = $geminiService->correctQuiz($quiz, $answers);
    return response()->json(['success' => true, 'data' => $result]);
} catch (\Exception $e) {
    Log::error('Quiz analysis failed: ' . $e->getMessage());
    return response()->json([
        'success' => false,
        'message' => 'Quiz analysis failed',
        'error' => config('app.debug') ? $e->getMessage() : 'Server error'
    ], 500);
}
```

---

### Issue 2: 500 Error on Course Creation

**Symptoms:**
```
POST /api/teachers/courses 500 Internal Server Error
```

**Cause:**
- Database constraint violation
- Missing required fields
- Invalid file upload

**Solution:**

**1. Check database migrations:**
```bash
php artisan migrate:status
php artisan migrate  # If needed
```

**2. Validate all required fields:**
```php
$validated = $request->validate([
    'title' => 'required|string|max:255',
    'description' => 'required|string',
    'category' => 'required|string',
    'price' => 'required|numeric|min:0',
]);
```

**3. Check foreign key constraints:**
```php
// Ensure teacher exists
$teacher = $request->user()->teacher;
if (!$teacher) {
    return response()->json(['error' => 'Teacher profile not found'], 404);
}

$course->teacher_id = $teacher->id;
```

---

### Issue 3: Authentication Endpoint 500 Error

**Symptoms:**
```
POST /api/login 500 Internal Server Error
SQLSTATE[HY000] [2002] Connection refused
```

**Cause:**
- Database not running
- Incorrect database credentials
- Database connection timeout

**Solution:**

**1. Start MySQL:**
```bash
# XAMPP Control Panel -> Start MySQL
# Or via command:
net start MySQL80
```

**2. Verify database credentials:**
```env
# backend/.env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coursflow
DB_USERNAME=root
DB_PASSWORD=  # Empty for XAMPP default
```

**3. Test database connection:**
```bash
php artisan db:show
# Or
php artisan tinker
>>> DB::connection()->getPdo();
```

---

### Issue 4: File Upload 500 Error

**Symptoms:**
```
POST /api/teachers/courses/1/materials 500 Internal Server Error
The file "document.pdf" was not uploaded due to an unknown error
```

**Solution:**

**1. Check storage permissions:**
```bash
# Windows (run as admin)
icacls "backend\storage" /grant Everyone:F /T
```

**2. Create storage link:**
```bash
php artisan storage:link
```

**3. Check upload limits:**
```php
// backend/php.ini
upload_max_filesize = 20M
post_max_size = 20M
max_execution_time = 300
```

**4. Validate file in controller:**
```php
$request->validate([
    'file' => 'required|file|max:20480', // 20MB
    'type' => 'required|in:pdf,docx,pptx,video',
]);
```

---

## 🎨 Display Issues

### Issue 1: Sidebar Not Showing Logo

**Symptoms:**
- Logo doesn't appear in collapsed sidebar
- Broken image icon displayed

**Solution:**
```typescript
// StudentSidebar.tsx
{!isSidebarCollapsed ? (
  <Link to="/student/dashboard">
    <img 
      src="/image/CoursFlow_logo.png" 
      alt="CoursFlow" 
      className="h-10"
      onError={(e) => {
        // Fallback if image fails to load
        e.currentTarget.style.display = 'none';
      }}
    />
  </Link>
) : (
  <Link to="/student/dashboard">
    <img 
      src="/image/CoursFlow_logo.png" 
      alt="CF" 
      className="h-8"
    />
  </Link>
)}
```

**Files Modified:**
- `frontend/src/components/student/StudentSidebar.tsx`
- `frontend/src/components/teacher/TeacherSidebar.tsx`

---

### Issue 2: Statistics Showing 0 Instead of Actual Values

**Symptoms:**
- Dashboard shows 0 for enrolled courses
- 0 completed quizzes
- "N/A" for average score

**Cause:**
- Backend not calculating statistics
- API endpoint returning empty data

**Solution:**

**Backend fix:**
```php
// backend/app/Http/Controllers/Api/StudentController.php
public function getProfile(Request $request)
{
    $student = $request->user()->student;

    $statistics = [
        'enrolled_courses_count' => $student->paidCourses()->count(),
        'completed_quizzes_count' => $student->quizAttempts()
            ->distinct('quiz_id')
            ->count(),
        'average_score' => round($student->quizAttempts()->avg('score') ?? 0, 1),
    ];

    return response()->json([
        'student' => $student,
        'statistics' => $statistics,
    ]);
}
```

**Frontend fix:**
```typescript
// Use actual API data, not hardcoded 0
const [stats, setStats] = useState({
  enrolledCourses: 0,
  completedQuizzes: 0,
  averageScore: 0
});

useEffect(() => {
  api.get('/student/profile').then(response => {
    setStats(response.data.statistics);
  });
}, []);
```

---

### Issue 3: Quiz Questions Not Displaying

**Symptoms:**
- Quiz page shows loading spinner forever
- Questions array is empty
- Console shows "Cannot read property 'questions' of undefined"

**Solution:**

**1. Check backend response:**
```php
// Ensure questions are properly decoded
$quiz = Quiz::findOrFail($id);
$quiz->questions = is_string($quiz->questions) 
    ? json_decode($quiz->questions, true) 
    : $quiz->questions;
```

**2. Handle loading states in frontend:**
```typescript
const [quiz, setQuiz] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  api.get(`/quizzes/${id}`)
    .then(response => {
      setQuiz(response.data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, [id]);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!quiz || !quiz.questions) return <NoDataMessage />;

return <QuizQuestions questions={quiz.questions} />;
```

---

### Issue 4: Responsive Design Broken on Mobile

**Symptoms:**
- Layout breaks on small screens
- Sidebar overlaps content
- Buttons too small to tap

**Solution:**
```typescript
// Use Tailwind responsive classes
<div className="
  w-full                    // Mobile: full width
  md:w-1/2                  // Tablet: half width
  lg:w-1/3                  // Desktop: third width
  px-4 md:px-6 lg:px-8     // Responsive padding
">
  <button className="
    w-full md:w-auto        // Full width on mobile
    text-sm md:text-base    // Responsive text size
    py-2 md:py-3           // Responsive padding
  ">
    Submit
  </button>
</div>
```

---

## 🌐 Localhost Connection Issues

### Issue 1: "localhost refused to connect"

**Symptoms:**
```
ERR_CONNECTION_REFUSED
localhost didn't send any data
```

**Causes & Solutions:**

**1. Backend server not running:**
```bash
# Start Laravel server
cd backend
php artisan serve

# Expected output:
# Laravel development server started: http://127.0.0.1:8000
```

**2. Frontend dev server not running:**
```bash
# Start Vite dev server
cd frontend
npm run dev

# Expected output:
# VITE v5.0.0  ready in 1234 ms
# ➜  Local:   http://localhost:5173/
```

**3. Port already in use:**
```bash
# Windows: Find process using port
netstat -ano | findstr :8000

# Kill process
taskkill /PID <process_id> /F

# Use different port
php artisan serve --port=8001
```

---

### Issue 2: Cannot Access phpMyAdmin

**Symptoms:**
```
localhost/phpmyadmin shows "Access forbidden!"
```

**Solution:**

**1. Check Apache is running:**
- Open XAMPP Control Panel
- Ensure Apache is started (green indicator)

**2. Clear browser cache and retry:**
```
Ctrl + Shift + Delete -> Clear cache
```

**3. Check httpd.conf:**
```apache
# C:\xampp\apache\conf\extra\httpd-xampp.conf
<Directory "C:/xampp/phpMyAdmin">
    AllowOverride AuthConfig Limit
    Require all granted  # Change from 'local' to 'granted'
</Directory>
```

---

### Issue 3: Mixed Content Warning (HTTP/HTTPS)

**Symptoms:**
```
Mixed Content: The page at 'https://...' was loaded over HTTPS,
but requested an insecure resource 'http://...'
```

**Solution:**

**Development:**
```env
# Use HTTP for both frontend and backend in development
VITE_API_URL=http://localhost:8000/api
APP_URL=http://localhost:8000
```

**Production:**
```env
# Use HTTPS in production
VITE_API_URL=https://api.coursflow.com
APP_URL=https://coursflow.com
APP_ENV=production
```

---

### Issue 4: CORS Error "Access-Control-Allow-Origin"

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:8000/api/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**

**1. Update CORS config:**
```php
// backend/config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

**2. Clear config cache:**
```bash
php artisan config:clear
php artisan cache:clear
```

---

## 🔐 Authentication Issues

### Issue: Token Not Persisting

**Symptoms:**
- User logged out after page refresh
- "Unauthenticated" errors

**Solution:**
```typescript
// Proper token storage and retrieval
const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  const { token, user } = response.data;
  
  // Store token
  localStorage.setItem('token', token);
  
  // Set axios default header
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  setUser(user);
};

// On app load, restore session
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Verify token is still valid
    api.get('/user')
      .then(response => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      });
  }
}, []);
```

---

## 🗄️ Database Issues

### Issue: Migration Failed

**Symptoms:**
```
SQLSTATE[42S01]: Base table or view already exists
```

**Solution:**
```bash
# Option 1: Fresh migration
php artisan migrate:fresh --seed

# Option 2: Reset specific migration
php artisan migrate:rollback --step=1
php artisan migrate

# Option 3: Drop all tables and re-migrate
php artisan db:wipe
php artisan migrate --seed
```

---

## 🌟 Best Practices to Avoid Issues

1. ✅ Always check backend and frontend servers are running
2. ✅ Clear cache when changing configuration
3. ✅ Use try-catch blocks for all async operations
4. ✅ Implement proper error boundaries in React
5. ✅ Log errors for debugging (but not in production)
6. ✅ Validate all user inputs on backend
7. ✅ Test API endpoints with Postman before frontend integration
8. ✅ Keep dependencies updated
9. ✅ Use TypeScript for type safety
10. ✅ Monitor Laravel logs regularly

---

## 🛠️ Debugging Tools

### Frontend
```bash
# React DevTools
# Install Chrome extension: React Developer Tools

# Check console for errors
F12 -> Console tab

# Network tab for API calls
F12 -> Network tab -> Filter: XHR
```

### Backend
```bash
# Laravel Telescope (Advanced)
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Access at: http://localhost:8000/telescope

# Laravel logs
tail -f storage/logs/laravel.log

# Enable debug mode (development only!)
# .env
APP_DEBUG=true
```

---

## 📞 Getting Help

If you encounter an issue not listed here:

1. **Check Laravel logs:** `backend/storage/logs/laravel.log`
2. **Check browser console:** F12 -> Console
3. **Create new issue:** Include error messages, screenshots, and steps to reproduce

---

**Last Updated:** November 4, 2025  
**Document Version:** 2.0
