<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected $apiKey;
    protected $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    protected $model = 'gemini-2.0-flash-exp';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key') ?? env('GEMINI_API_KEY') ?? env('GOOGLE_API_KEY');

        if (!$this->apiKey) {
            throw new \Exception('Gemini API key not configured. Please set GEMINI_API_KEY or GOOGLE_API_KEY in .env');
        }
    }

    /**
     * Generate quiz questions using Gemini AI
     *
     * @param string $subject Course subject
     * @param string $topic Quiz topic
     * @param int $numQuestions Number of questions
     * @param string $difficulty Difficulty level (easy, medium, hard)
     * @param array $questionTypes Question types (multiple_choice, true_false)
     * @return array Generated quiz questions
     */
    public function generateQuiz(
        string $subject,
        string $topic,
        int $numQuestions = 10,
        string $difficulty = 'medium',
        array $questionTypes = ['multiple_choice', 'true_false']
    ): array {
        $prompt = $this->buildQuizPrompt($subject, $topic, $numQuestions, $difficulty, $questionTypes);

        try {
            $response = Http::timeout(60)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post("{$this->baseUrl}/{$this->model}:generateContent?key={$this->apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 2048,
                        'topP' => 0.8,
                        'topK' => 40,
                    ],
                    'safetySettings' => [
                        [
                            'category' => 'HARM_CATEGORY_HARASSMENT',
                            'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                        ],
                        [
                            'category' => 'HARM_CATEGORY_HATE_SPEECH',
                            'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                        ]
                    ]
                ]);

            if (!$response->successful()) {
                Log::error('Gemini API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Failed to generate quiz with Gemini AI: ' . $response->body());
            }

            $data = $response->json();

            if (!isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                Log::error('Invalid Gemini response structure', ['response' => $data]);
                throw new \Exception('Invalid response from Gemini AI');
            }

            $generatedText = $data['candidates'][0]['content']['parts'][0]['text'];

            // Parse JSON from response
            $questions = $this->parseQuizResponse($generatedText);

            return $questions;

        } catch (\Exception $e) {
            Log::error('Quiz generation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Generate content with Gemini AI (generic method)
     *
     * @param string $prompt The prompt to send
     * @return string Generated text
     */
    public function generateContent(string $prompt): string
    {
        try {
            $response = Http::timeout(30)
                ->post("{$this->baseUrl}/{$this->model}:generateContent?key={$this->apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.9,
                        'maxOutputTokens' => 1024,
                    ]
                ]);

            if (!$response->successful()) {
                throw new \Exception('Gemini API error: ' . $response->body());
            }

            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

        } catch (\Exception $e) {
            Log::error('Gemini content generation error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Build quiz generation prompt
     */
    protected function buildQuizPrompt(
        string $subject,
        string $topic,
        int $numQuestions,
        string $difficulty,
        array $questionTypes
    ): string {
        $typesStr = implode(' and ', $questionTypes);

        return <<<PROMPT
You are an expert educator creating a {$difficulty} quiz for a {$subject} course.

Topic: {$topic}
Number of questions: {$numQuestions}
Question types: {$typesStr}
Difficulty level: {$difficulty}

Generate a quiz with EXACTLY {$numQuestions} questions. For each question, provide:
1. A clear, well-formulated question
2. For multiple_choice: 4 options (A, B, C, D) with one correct answer
3. For true_false: options ["True", "False"]
4. The correct answer (must match exactly one of the options)
5. A brief explanation (1-2 sentences)
6. Points (difficulty-based: easy=1, medium=2, hard=3)

IMPORTANT: Return ONLY a valid JSON array, no markdown code blocks, no additional text.
Format:
[
  {
    "question": "Question text here?",
    "type": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option B",
    "explanation": "Brief explanation here.",
    "points": 2
  },
  {
    "question": "True or false question?",
    "type": "true_false",
    "options": ["True", "False"],
    "correct_answer": "True",
    "explanation": "Brief explanation.",
    "points": 1
  }
]

Rules:
- Return ONLY the JSON array, nothing else
- Ensure all JSON is properly formatted
- Make questions relevant to the topic
- Vary difficulty within the specified level
- Ensure correct answers are accurate
- For multiple choice, make distractors plausible but clearly wrong
PROMPT;
    }

    /**
     * Parse quiz response from Gemini
     */
    protected function parseQuizResponse(string $response): array
    {
        // Remove markdown code blocks if present
        $cleaned = preg_replace('/```json\n?/', '', $response);
        $cleaned = preg_replace('/```\n?/', '', $cleaned);
        $cleaned = trim($cleaned);

        // Try to find JSON array in the response
        if (preg_match('/\[[\s\S]*\]/', $cleaned, $matches)) {
            $cleaned = $matches[0];
        }

        $questions = json_decode($cleaned, true);

        if (!$questions || !is_array($questions)) {
            Log::error('Failed to parse quiz JSON', ['response' => $response]);
            throw new \Exception('Failed to parse quiz questions from AI response');
        }

        // Validate questions structure
        foreach ($questions as $index => $question) {
            if (!isset($question['question']) || !isset($question['type']) || !isset($question['correct_answer'])) {
                Log::warning('Invalid question structure', ['index' => $index, 'question' => $question]);
                throw new \Exception("Invalid question structure at index {$index}");
            }
        }

        return $questions;
    }

    /**
     * Test API connection
     */
    public function testConnection(): bool
    {
        try {
            $response = $this->generateContent('Say "Hello" in one word.');
            return !empty($response);
        } catch (\Exception $e) {
            Log::error('Gemini connection test failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
}
