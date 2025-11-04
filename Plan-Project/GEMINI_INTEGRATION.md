# 🤖 Google Gemini AI Integration - CoursFlow

## Overview

CoursFlow integrates **Google Gemini 2.5 Flash** for intelligent quiz correction and feedback generation. This AI-powered feature provides instant, personalized feedback to students and assists teachers in creating high-quality quiz questions.

---

## Table of Contents

- [Features](#features)
- [Setup Guide](#setup-guide)
- [AI Quiz Correction](#ai-quiz-correction)
- [AI Quiz Generation](#ai-quiz-generation)
- [Implementation Details](#implementation-details)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Features

### For Students
- ✅ **Instant Feedback** - Receive detailed AI-generated feedback on quiz submissions
- ✅ **Personalized Insights** - Get customized learning recommendations
- ✅ **Performance Analysis** - AI analyzes strengths and weaknesses
- ✅ **Natural Language Processing** - Understands complex answers

### For Teachers
- ✅ **AI Quiz Generation** - Generate quiz questions automatically
- ✅ **Quality Assurance** - AI ensures question clarity and validity
- ✅ **Time Saving** - Create comprehensive quizzes in minutes
- ✅ **Customizable Difficulty** - Generate questions for any skill level

---

## Setup Guide

### 1. Get Google Gemini API Key

#### Step 1: Create Google Cloud Account

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Accept the terms of service

#### Step 2: Generate API Key

1. Click **"Create API Key"**
2. Select **"Create API key in new project"** or choose an existing project
3. Copy the generated API key (starts with `AIza...`)

**⚠️ Important:** Keep your API key secure and never commit it to version control!

---

### 2. Configure Backend

#### Add API Key to Environment

Edit `backend/.env`:

```env
# Google Gemini AI Configuration
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
GEMINI_MODEL=gemini-2.5-flash
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7
```

#### Update Services Configuration

Edit `backend/config/services.php`:

```php
<?php

return [
    // ... other services

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-2.5-flash'),
        'max_tokens' => env('GEMINI_MAX_TOKENS', 2048),
        'temperature' => env('GEMINI_TEMPERATURE', 0.7),
        'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
    ],
];
```

---

### 3. Configure Frontend (Optional)

If you want to call Gemini API directly from frontend:

Edit `frontend/.env`:

```env
# Google Gemini API (Optional - Backend handles most AI operations)
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Note:** For security reasons, it's recommended to make all Gemini API calls from the backend.

---

## AI Quiz Correction

### How It Works

```ascii
┌─────────────┐
│   Student   │
│  Submits    │
│   Quiz      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│          Backend API                    │
│  ┌────────────────────────────────┐    │
│  │  StudentQuizController         │    │
│  │  analyzeStudentQuiz()          │    │
│  └─────────────┬──────────────────┘    │
│                │                        │
│                ▼                        │
│  ┌────────────────────────────────┐    │
│  │     GeminiService              │    │
│  │  - Build prompt                │    │
│  │  - Call Gemini API             │    │
│  │  - Parse response              │    │
│  └─────────────┬──────────────────┘    │
└────────────────┼────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  Gemini 2.5    │
        │  Flash API     │
        │  - Analyzes    │
        │  - Generates   │
        │    Feedback    │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │   Response     │
        │  - Score       │
        │  - Feedback    │
        │  - Insights    │
        └────────────────┘
```

---

### Implementation

#### Backend Service: GeminiService.php

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected $apiKey;
    protected $baseUrl;
    protected $model;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        $this->baseUrl = config('services.gemini.base_url');
        $this->model = config('services.gemini.model');
    }

    /**
     * Correct quiz answers with AI feedback
     */
    public function correctQuiz($quiz, $answers)
    {
        $prompt = $this->buildCorrectionPrompt($quiz, $answers);

        try {
            $response = Http::post("{$this->baseUrl}/models/{$this->model}:generateContent", [
                'key' => $this->apiKey,
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => config('services.gemini.temperature'),
                    'maxOutputTokens' => config('services.gemini.max_tokens'),
                ]
            ]);

            if ($response->failed()) {
                Log::error('Gemini API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Failed to get AI feedback');
            }

            return $this->parseResponse($response->json());

        } catch (\Exception $e) {
            Log::error('Gemini Service Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Build prompt for quiz correction
     */
    private function buildCorrectionPrompt($quiz, $answers)
    {
        $prompt = "You are an expert educational AI assistant. Analyze this quiz submission and provide detailed feedback.\n\n";
        $prompt .= "Quiz Title: {$quiz->title}\n";
        $prompt .= "Total Marks: {$quiz->total_marks}\n\n";

        $questions = json_decode($quiz->questions, true);

        foreach ($questions as $index => $question) {
            $studentAnswer = $answers[$index] ?? 'No answer provided';
            $correctAnswer = $question['correct_answer'] ?? '';

            $prompt .= "Question " . ($index + 1) . ":\n";
            $prompt .= "Question: {$question['question']}\n";
            $prompt .= "Correct Answer: {$correctAnswer}\n";
            $prompt .= "Student Answer: {$studentAnswer}\n";
            $prompt .= "Points: {$question['points']}\n\n";
        }

        $prompt .= "\nProvide a JSON response with the following structure:\n";
        $prompt .= "{\n";
        $prompt .= '  "total_score": 0-100,\n';
        $prompt .= '  "percentage": 0-100,\n';
        $prompt .= '  "overall_feedback": "General feedback for the student",\n';
        $prompt .= '  "questions": [\n';
        $prompt .= '    {\n';
        $prompt .= '      "question_number": 1,\n';
        $prompt .= '      "score": 0-10,\n';
        $prompt .= '      "max_score": 10,\n';
        $prompt .= '      "is_correct": true/false,\n';
        $prompt .= '      "feedback": "Specific feedback for this question"\n';
        $prompt .= '    }\n';
        $prompt .= '  ],\n';
        $prompt .= '  "strengths": ["strength 1", "strength 2"],\n';
        $prompt .= '  "areas_for_improvement": ["area 1", "area 2"],\n';
        $prompt .= '  "recommendations": ["recommendation 1", "recommendation 2"]\n';
        $prompt .= "}\n";

        return $prompt;
    }

    /**
     * Parse AI response
     */
    private function parseResponse($response)
    {
        $text = $response['candidates'][0]['content']['parts'][0]['text'] ?? '';

        // Extract JSON from response
        preg_match('/\{.*\}/s', $text, $matches);

        if (empty($matches)) {
            throw new \Exception('Failed to parse AI response');
        }

        $data = json_decode($matches[0], true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \Exception('Invalid JSON in AI response');
        }

        return $data;
    }

    /**
     * Generate quiz questions with AI
     */
    public function generateQuizQuestions($topic, $numQuestions, $difficulty, $questionTypes)
    {
        $prompt = $this->buildGenerationPrompt($topic, $numQuestions, $difficulty, $questionTypes);

        try {
            $response = Http::post("{$this->baseUrl}/models/{$this->model}:generateContent", [
                'key' => $this->apiKey,
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.8, // Higher creativity for question generation
                    'maxOutputTokens' => 4096,
                ]
            ]);

            if ($response->failed()) {
                throw new \Exception('Failed to generate quiz questions');
            }

            return $this->parseResponse($response->json());

        } catch (\Exception $e) {
            Log::error('Quiz Generation Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Build prompt for quiz generation
     */
    private function buildGenerationPrompt($topic, $numQuestions, $difficulty, $questionTypes)
    {
        $types = implode(', ', $questionTypes);

        $prompt = "You are an expert quiz creator. Generate {$numQuestions} high-quality quiz questions.\n\n";
        $prompt .= "Topic: {$topic}\n";
        $prompt .= "Difficulty: {$difficulty}\n";
        $prompt .= "Question Types: {$types}\n\n";
        $prompt .= "Requirements:\n";
        $prompt .= "- Questions should be clear and unambiguous\n";
        $prompt .= "- Provide correct answers and explanations\n";
        $prompt .= "- For multiple choice, provide 4 options\n";
        $prompt .= "- Difficulty should be appropriate for {$difficulty} level\n\n";

        $prompt .= "Return a JSON array with this structure:\n";
        $prompt .= "{\n";
        $prompt .= '  "questions": [\n';
        $prompt .= '    {\n';
        $prompt .= '      "question": "Question text",\n';
        $prompt .= '      "type": "multiple_choice|true_false|short_answer",\n';
        $prompt .= '      "options": ["option1", "option2", "option3", "option4"],\n';
        $prompt .= '      "correct_answer": "Correct answer",\n';
        $prompt .= '      "explanation": "Why this is correct",\n';
        $prompt .= '      "points": 10,\n';
        $prompt .= '      "difficulty": "easy|medium|hard"\n';
        $prompt .= '    }\n';
        $prompt .= '  ]\n';
        $prompt .= "}\n";

        return $prompt;
    }
}
```

---

### Usage Example

#### In StudentQuizController.php

```php
use App\Services\GeminiService;

public function analyzeStudentQuiz(Request $request)
{
    $geminiService = new GeminiService();

    $quiz = Quiz::findOrFail($request->quiz_id);
    $answers = $request->answers;

    try {
        // Get AI feedback
        $aiResult = $geminiService->correctQuiz($quiz, $answers);

        // Save to database
        $attempt = QuizAttempt::create([
            'student_id' => auth()->user()->student->id,
            'quiz_id' => $quiz->id,
            'score' => $aiResult['total_score'],
            'answers' => json_encode($answers),
            'ai_feedback' => json_encode($aiResult),
            'submitted_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $aiResult
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to analyze quiz',
            'error' => $e->getMessage()
        ], 500);
    }
}
```

---

## AI Quiz Generation

### Teacher Flow

```ascii
┌─────────────┐
│   Teacher   │
│  Requests   │
│ AI Quiz Gen │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Specify Parameters:            │
│  - Topic                        │
│  - Number of questions          │
│  - Difficulty level             │
│  - Question types               │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  GeminiService                  │
│  generateQuizQuestions()        │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Gemini AI Generates:           │
│  - Well-formed questions        │
│  - Multiple choice options      │
│  - Correct answers              │
│  - Explanations                 │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Teacher Reviews & Edits        │
│  (Optional)                     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Save to Database               │
│  (is_ai_generated = true)       │
└─────────────────────────────────┘
```

---

### API Endpoint

**POST** `/teachers/quizzes/generate-ai`

**Request:**
```json
{
  "course_id": 1,
  "topic": "React Hooks and State Management",
  "num_questions": 10,
  "difficulty": "medium",
  "question_types": ["multiple_choice", "true_false"]
}
```

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "question": "What is the purpose of useState hook in React?",
      "type": "multiple_choice",
      "options": [
        "To manage component state",
        "To fetch data from API",
        "To handle side effects",
        "To optimize performance"
      ],
      "correct_answer": "To manage component state",
      "explanation": "useState is a Hook that allows functional components to have state variables.",
      "points": 10,
      "difficulty": "medium"
    }
  ]
}
```

---

## Best Practices

### 1. API Key Security

✅ **DO:**
- Store API keys in `.env` file
- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate keys periodically

❌ **DON'T:**
- Commit API keys to version control
- Hardcode keys in source code
- Share keys publicly
- Use same key across all environments

---

### 2. Error Handling

```php
try {
    $aiResult = $geminiService->correctQuiz($quiz, $answers);
} catch (\Exception $e) {
    // Log error
    Log::error('Gemini API Error', [
        'quiz_id' => $quiz->id,
        'error' => $e->getMessage()
    ]);

    // Provide fallback
    return response()->json([
        'success' => false,
        'message' => 'AI service temporarily unavailable. Please try again later.',
        'fallback' => true
    ], 503);
}
```

---

### 3. Rate Limiting

Implement rate limiting to avoid API quota exhaustion:

```php
use Illuminate\Support\Facades\RateLimiter;

public function analyzeQuiz(Request $request)
{
    $key = 'ai-quiz-' . $request->user()->id;

    if (RateLimiter::tooManyAttempts($key, 10)) {
        return response()->json([
            'message' => 'Too many AI requests. Please wait.'
        ], 429);
    }

    RateLimiter::hit($key, 60); // 10 requests per minute

    // Process request...
}
```

---

### 4. Caching Results

Cache AI responses to reduce API calls:

```php
use Illuminate\Support\Facades\Cache;

$cacheKey = "quiz-template-{$topic}-{$difficulty}";

$questions = Cache::remember($cacheKey, 3600, function() use ($topic, $difficulty) {
    return $geminiService->generateQuizQuestions($topic, 10, $difficulty, ['multiple_choice']);
});
```

---

## Troubleshooting

### Issue: API Key Not Working

**Symptoms:** 401 Unauthorized error

**Solutions:**
1. Verify API key is correct in `.env`
2. Check if API key has been activated
3. Ensure no extra spaces in the key
4. Regenerate API key if necessary

```bash
# Test API key
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

---

### Issue: API Quota Exceeded

**Symptoms:** 429 Too Many Requests

**Solutions:**
1. Implement rate limiting
2. Cache responses
3. Use free tier limits wisely
4. Upgrade to paid tier if needed

**Free Tier Limits:**
- 60 requests per minute
- 1,500 requests per day

---

### Issue: Invalid JSON Response

**Symptoms:** JSON parse error

**Solutions:**
1. Improve prompt clarity
2. Add stricter format requirements
3. Implement response validation
4. Add retry logic

```php
private function parseResponse($response, $retries = 3)
{
    for ($i = 0; $i < $retries; $i++) {
        try {
            // Parse logic
            return $data;
        } catch (\Exception $e) {
            if ($i === $retries - 1) throw $e;
            // Retry with adjusted prompt
        }
    }
}
```

---

### Issue: Slow Response Time

**Symptoms:** Requests take too long

**Solutions:**
1. Reduce `max_tokens` parameter
2. Use streaming responses (if supported)
3. Implement timeout handling
4. Show loading indicators to users

```php
$response = Http::timeout(30)->post(...);
```

---

## Monitoring & Logging

### Track AI Usage

```php
// Log AI requests
Log::channel('ai')->info('Gemini Request', [
    'user_id' => auth()->id(),
    'quiz_id' => $quiz->id,
    'tokens_used' => $response['usage']['totalTokens'] ?? 0,
    'response_time' => $responseTime,
]);
```

### Create AI Metrics Table

```sql
CREATE TABLE ai_usage_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(50),
    tokens_used INT,
    response_time FLOAT,
    success BOOLEAN,
    created_at TIMESTAMP
);
```

---

## Cost Optimization

### Gemini API Pricing (as of 2025)

| Model | Free Tier | Paid Tier |
|-------|-----------|-----------|
| Gemini 2.5 Flash | 15 RPM / 1,500 RPD | $0.15 / 1M tokens (input)<br>$0.60 / 1M tokens (output) |

### Tips to Reduce Costs

1. **Cache responses** for common questions
2. **Batch requests** when possible
3. **Use appropriate model** (Flash is cheaper than Pro)
4. **Optimize prompts** to reduce token usage
5. **Implement fallbacks** for non-critical features

---

## Security Considerations

1. **Validate all inputs** before sending to AI
2. **Sanitize AI outputs** before displaying
3. **Implement content filtering** for inappropriate responses
4. **Monitor for abuse** patterns
5. **Set usage quotas** per user
6. **Log all AI interactions** for audit trails

---

## Additional Resources

- 📖 [Google Gemini Documentation](https://ai.google.dev/docs)
- 🔑 [Get API Key](https://makersuite.google.com/app/apikey)
- 💬 [Community Support](https://discuss.ai.google.dev/)
- 📊 [Pricing Information](https://ai.google.dev/pricing)

---

**Last Updated:** November 4, 2025  
**Gemini Model:** 2.5 Flash  
**Integration Version:** 1.0.0
