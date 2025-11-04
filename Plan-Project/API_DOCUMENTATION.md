# 📚 API Documentation - CoursFlow

## Overview

CoursFlow REST API provides comprehensive endpoints for managing the Learning Management System. The API follows RESTful principles and uses JSON for request and response payloads.

**Base URL:** `http://localhost:8000/api`

**Authentication:** Laravel Sanctum (Token-based)

**Content-Type:** `application/json`

---

## Table of Contents

- [Authentication](#authentication)
- [Student Endpoints](#student-endpoints)
- [Teacher Endpoints](#teacher-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Common Responses](#common-responses)
- [Error Handling](#error-handling)

---

## Authentication

### Register User

**Endpoint:** `POST /register`

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "student"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student"
  }
}
```

---

### Login

**Endpoint:** `POST /login`

**Description:** Authenticate user and receive access token

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student"
  }
}
```

---

### Logout

**Endpoint:** `POST /logout`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Google OAuth

**Redirect to Google:** `GET /auth/google`

**Google Callback:** `GET /auth/google/callback`

**Description:** Handles Google OAuth 2.0 authentication flow

---

## Student Endpoints

All student endpoints require authentication and use prefix `/student`

### Get Student Profile

**Endpoint:** `GET /student/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "student": {
    "id": 1,
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "profile_image_url": "https://example.com/profile.jpg"
  },
  "statistics": {
    "enrolled_courses_count": 5,
    "completed_quizzes_count": 12,
    "average_score": 85.5
  }
}
```

---

### Get Enrolled Courses

**Endpoint:** `GET /student/courses`

**Query Parameters:**
- `search` (optional): Search by course title
- `category` (optional): Filter by category
- `per_page` (optional): Items per page (default: 15)
- `page` (optional): Page number

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "Introduction to React",
      "description": "Learn React fundamentals",
      "teacher": {
        "id": 1,
        "name": "Jane Smith"
      },
      "progress": 65,
      "status": "in_progress"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 15,
    "total": 45
  }
}
```

---

### Get Course Details

**Endpoint:** `GET /student/courses/{id}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Introduction to React",
  "description": "Complete React course",
  "teacher": {
    "id": 1,
    "name": "Jane Smith",
    "bio": "Experienced developer"
  },
  "materials": [
    {
      "id": 1,
      "title": "Lecture 1",
      "type": "pdf",
      "url": "https://example.com/lecture1.pdf"
    }
  ],
  "progress": 65
}
```

---

### Get Available Quizzes

**Endpoint:** `GET /student/quizzes`

**Query Parameters:**
- `course_id` (optional): Filter by course
- `status` (optional): Filter by status (available, completed)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "React Basics Quiz",
      "course": {
        "id": 1,
        "title": "Introduction to React"
      },
      "duration_minutes": 30,
      "total_marks": 100,
      "attempts": 2,
      "best_score": 85
    }
  ]
}
```

---

### Get Quiz Details

**Endpoint:** `GET /student/quizzes/{id}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "React Basics Quiz",
  "description": "Test your React knowledge",
  "duration_minutes": 30,
  "total_marks": 100,
  "passing_marks": 60,
  "questions": [
    {
      "id": 1,
      "question": "What is React?",
      "type": "multiple_choice",
      "options": [
        "A library",
        "A framework",
        "A language",
        "A database"
      ],
      "points": 10
    }
  ]
}
```

---

### Submit Quiz (AI-Powered Correction)

**Endpoint:** `POST /student/analyze-quiz`

**Description:** Submit quiz answers for AI-powered grading using Google Gemini

**Request Body:**
```json
{
  "quiz_id": 1,
  "answers": [
    "A library",
    "Virtual DOM",
    "Components"
  ],
  "time_spent": 1200
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "score": 85,
    "total_marks": 100,
    "percentage": 85,
    "status": "passed",
    "feedback": {
      "overall": "Great job! You have a solid understanding of React basics.",
      "questions": [
        {
          "question_number": 1,
          "score": 10,
          "max_score": 10,
          "feedback": "Correct! React is indeed a library."
        }
      ]
    },
    "ai_insights": {
      "strengths": ["Understanding of core concepts", "Good grasp of components"],
      "areas_for_improvement": ["State management", "Lifecycle methods"],
      "recommendations": ["Practice with hooks", "Build more projects"]
    }
  }
}
```

---

### Get Quiz Attempts

**Endpoint:** `GET /student/quiz-attempts`

**Query Parameters:**
- `quiz_id` (optional): Filter by quiz

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "quiz_id": 1,
      "score": 85,
      "total_marks": 100,
      "time_spent": 1200,
      "submitted_at": "2025-11-04T10:30:00Z"
    }
  ]
}
```

---

### Get Calendar Events

**Endpoint:** `GET /student/events`

**Query Parameters:**
- `start_date` (optional): Filter from date
- `end_date` (optional): Filter to date

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "React Class",
      "description": "Introduction to hooks",
      "start_time": "2025-11-05T10:00:00Z",
      "end_time": "2025-11-05T12:00:00Z",
      "course": {
        "id": 1,
        "title": "Introduction to React"
      }
    }
  ]
}
```

---

### Get Notifications

**Endpoint:** `GET /student/notifications`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "New Quiz Available",
      "message": "A new quiz has been published in React course",
      "type": "quiz",
      "is_read": false,
      "created_at": "2025-11-04T09:00:00Z"
    }
  ]
}
```

---

### Mark Notification as Read

**Endpoint:** `POST /student/notifications/{id}/mark-read`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Teacher Endpoints

All teacher endpoints require authentication and use prefix `/teachers`

### Get Teacher Dashboard

**Endpoint:** `GET /teachers/dashboard`

**Response:** `200 OK`
```json
{
  "total_students": 150,
  "total_courses": 8,
  "published_courses": 6,
  "total_quizzes": 24,
  "pending_quizzes": 3,
  "recent_activities": [
    {
      "type": "course_enrollment",
      "message": "New student enrolled in React course",
      "timestamp": "2025-11-04T09:00:00Z"
    }
  ]
}
```

---

### Get Students

**Endpoint:** `GET /teachers/students`

**Query Parameters:**
- `search` (optional): Search by name or email
- `course_id` (optional): Filter by course
- `per_page` (optional): Items per page
- `page` (optional): Page number

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "enrolled_courses": 3,
      "average_score": 82.5
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 150
  }
}
```

---

### Get Courses

**Endpoint:** `GET /teachers/courses`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "Introduction to React",
      "description": "Learn React fundamentals",
      "category": "Programming",
      "price": 49.99,
      "status": "published",
      "enrolled_count": 45
    }
  ]
}
```

---

### Create Course

**Endpoint:** `POST /teachers/courses`

**Request Body:**
```json
{
  "title": "Advanced React Patterns",
  "description": "Master advanced React concepts",
  "category": "Programming",
  "level": "advanced",
  "price": 79.99,
  "duration_hours": 40,
  "status": "draft"
}
```

**Response:** `201 Created`
```json
{
  "message": "Course created successfully",
  "course": {
    "id": 2,
    "title": "Advanced React Patterns",
    "status": "draft"
  }
}
```

---

### Update Course

**Endpoint:** `PUT /teachers/courses/{id}`

**Request Body:**
```json
{
  "title": "Advanced React Patterns - Updated",
  "status": "published"
}
```

**Response:** `200 OK`
```json
{
  "message": "Course updated successfully",
  "course": {
    "id": 2,
    "title": "Advanced React Patterns - Updated",
    "status": "published"
  }
}
```

---

### Delete Course

**Endpoint:** `DELETE /teachers/courses/{id}`

**Response:** `200 OK`
```json
{
  "message": "Course deleted successfully"
}
```

---

### Get Quizzes

**Endpoint:** `GET /teachers/quizzes`

**Query Parameters:**
- `course_id` (optional): Filter by course
- `status` (optional): Filter by status (draft, published, archived)
- `is_ai_generated` (optional): Filter AI-generated quizzes

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "React Basics Quiz",
      "course": {
        "id": 1,
        "title": "Introduction to React"
      },
      "duration_minutes": 30,
      "total_marks": 100,
      "status": "published",
      "is_ai_generated": false,
      "questions_count": 10,
      "results_count": 25,
      "average_score": 78.5
    }
  ]
}
```

---

### Create Quiz

**Endpoint:** `POST /teachers/quizzes`

**Request Body:**
```json
{
  "course_id": 1,
  "title": "React Hooks Quiz",
  "description": "Test your knowledge of React Hooks",
  "questions": [
    {
      "question": "What is useState?",
      "type": "multiple_choice",
      "options": ["A hook", "A component", "A library", "A function"],
      "correct_answer": "A hook",
      "points": 10
    }
  ],
  "duration_minutes": 30,
  "total_marks": 100,
  "passing_marks": 60,
  "difficulty": "medium",
  "status": "draft"
}
```

**Response:** `201 Created`
```json
{
  "message": "Quiz created successfully",
  "quiz": {
    "id": 2,
    "title": "React Hooks Quiz",
    "status": "draft"
  }
}
```

---

### Generate Quiz with AI

**Endpoint:** `POST /teachers/quizzes/generate-ai`

**Description:** Generate quiz questions using Google Gemini AI

**Request Body:**
```json
{
  "course_id": 1,
  "topic": "React Hooks and State Management",
  "num_questions": 10,
  "difficulty": "medium",
  "question_types": ["multiple_choice", "true_false", "short_answer"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "questions": [
    {
      "question": "What is the purpose of useState hook?",
      "type": "multiple_choice",
      "options": [
        "To manage component state",
        "To fetch data",
        "To handle events",
        "To render components"
      ],
      "correct_answer": "To manage component state",
      "explanation": "useState is a hook that allows functional components to have state.",
      "points": 10
    }
  ],
  "metadata": {
    "topic": "React Hooks and State Management",
    "difficulty": "medium",
    "total_questions": 10
  }
}
```

---

### Save AI-Generated Quiz

**Endpoint:** `POST /teachers/quizzes/save-ai`

**Request Body:**
```json
{
  "course_id": 1,
  "title": "AI-Generated React Quiz",
  "description": "Generated by Gemini AI",
  "questions": [...],
  "duration_minutes": 30,
  "total_marks": 100,
  "passing_marks": 60,
  "difficulty": "medium",
  "status": "draft"
}
```

**Response:** `201 Created`
```json
{
  "message": "AI-generated quiz saved successfully",
  "quiz": {
    "id": 3,
    "title": "AI-Generated React Quiz",
    "is_ai_generated": true
  }
}
```

---

### Get Quiz Results

**Endpoint:** `GET /teachers/quizzes/{id}/results`

**Response:** `200 OK`
```json
{
  "quiz": {
    "id": 1,
    "title": "React Basics Quiz",
    "total_marks": 100
  },
  "statistics": {
    "total_attempts": 45,
    "average_score": 78.5,
    "highest_score": 98,
    "lowest_score": 45,
    "pass_rate": 82.2
  },
  "results": [
    {
      "student": {
        "id": 1,
        "name": "John Doe"
      },
      "score": 85,
      "percentage": 85,
      "status": "passed",
      "submitted_at": "2025-11-04T10:30:00Z"
    }
  ]
}
```

---

### Record Attendance

**Endpoint:** `POST /teachers/attendance`

**Request Body:**
```json
{
  "course_id": 1,
  "date": "2025-11-04",
  "attendances": [
    {
      "student_id": 1,
      "status": "present"
    },
    {
      "student_id": 2,
      "status": "absent"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "message": "Attendance recorded successfully",
  "count": 2
}
```

---

### Create Calendar Event

**Endpoint:** `POST /teachers/events`

**Request Body:**
```json
{
  "title": "React Advanced Session",
  "description": "Deep dive into React patterns",
  "start_time": "2025-11-10T10:00:00Z",
  "end_time": "2025-11-10T12:00:00Z",
  "course_id": 1,
  "is_recurring": false
}
```

**Response:** `201 Created`
```json
{
  "message": "Event created successfully",
  "event": {
    "id": 1,
    "title": "React Advanced Session"
  }
}
```

---

### Send Notification

**Endpoint:** `POST /teachers/notifications`

**Request Body:**
```json
{
  "title": "New Material Available",
  "message": "New lecture slides have been uploaded",
  "type": "course_update",
  "course_id": 1,
  "target_audience": "enrolled_students",
  "status": "published"
}
```

**Response:** `201 Created`
```json
{
  "message": "Notification sent successfully",
  "notification": {
    "id": 1,
    "recipients_count": 45
  }
}
```

---

## Admin Endpoints

All admin endpoints require authentication and use prefix `/admin`

### Get Dashboard Statistics

**Endpoint:** `GET /admin/dashboard/stats`

**Response:** `200 OK`
```json
{
  "total_users": 500,
  "total_students": 400,
  "total_teachers": 95,
  "total_admins": 5,
  "total_courses": 50,
  "published_courses": 42,
  "total_revenue": 125000.50,
  "active_students": 350
}
```

---

### Get All Students

**Endpoint:** `GET /admin/students`

**Query Parameters:**
- `search` (optional): Search by name or email
- `status` (optional): Filter by status
- `per_page` (optional): Items per page

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "status": "active",
      "enrolled_courses": 5,
      "total_spent": 299.95
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 400
  }
}
```

---

### Get All Teachers

**Endpoint:** `GET /admin/teachers`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "status": "active",
      "total_courses": 8,
      "total_students": 150
    }
  ]
}
```

---

### Approve/Reject Course

**Endpoint:** `PATCH /admin/courses/{id}/status`

**Request Body:**
```json
{
  "status": "approved",
  "admin_notes": "Course content meets quality standards"
}
```

**Response:** `200 OK`
```json
{
  "message": "Course status updated successfully",
  "course": {
    "id": 1,
    "status": "approved"
  }
}
```

---

### Get Revenue Reports

**Endpoint:** `GET /admin/reports/revenue`

**Query Parameters:**
- `start_date` (optional): Start date for report
- `end_date` (optional): End date for report
- `group_by` (optional): Group by (day, week, month)

**Response:** `200 OK`
```json
{
  "total_revenue": 125000.50,
  "total_transactions": 850,
  "period": {
    "start": "2025-10-01",
    "end": "2025-11-04"
  },
  "breakdown": [
    {
      "date": "2025-11-01",
      "revenue": 2500.00,
      "transactions": 25
    }
  ]
}
```

---

## Common Responses

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {...}
}
```

---

### Pagination Response

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 10,
    "per_page": 15,
    "to": 15,
    "total": 150
  }
}
```

---

## Error Handling

### Validation Error (422)

```json
{
  "success": false,
  "message": "Invalid input data",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

---

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

---

### Forbidden (403)

```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

---

### Not Found (404)

```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Default:** 60 requests per minute per IP
- **Authenticated:** 100 requests per minute per user

When rate limit is exceeded:

```json
{
  "message": "Too Many Attempts",
  "retry_after": 60
}
```

---

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Use pagination** for list endpoints to improve performance
3. **Handle errors gracefully** on the client side
4. **Validate input** before making requests
5. **Store tokens securely** (never in localStorage for sensitive apps)
6. **Implement retry logic** for failed requests
7. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE)
8. **Keep API keys secure** (never commit to version control)

---

**Last Updated:** November 4, 2025  
**API Version:** 1.0.0
