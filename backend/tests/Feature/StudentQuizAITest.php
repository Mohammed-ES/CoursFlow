<?php

namespace Tests\Feature;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Course;
use App\Models\Quiz;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Test Suite for Student Quiz AI Evaluation
 *
 * Tests the Gemini API integration for student quiz submissions
 */
class StudentQuizAITest extends TestCase
{
    use RefreshDatabase;

    protected Student $student;
    protected Teacher $teacher;
    protected Course $course;
    protected Quiz $quiz;

    /**
     * Set up test environment
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Create teacher
        $this->teacher = Teacher::factory()->create();

        // Create course
        $this->course = Course::factory()->create([
            'teacher_id' => $this->teacher->id,
            'title' => 'Test Course',
            'status' => 'published',
        ]);

        // Create student and enroll in course
        $this->student = Student::factory()->create();
        $this->studentUser = $this->student->user; // Get the associated User for authentication

        \DB::table('course_student')->insert([
            'course_id' => $this->course->id,
            'student_id' => $this->student->id,
            'payment_status' => 'paid',
            'enrolled_at' => now(),
        ]);

        // Create quiz with questions in JSON
        $questions = [
            [
                'id' => 1,
                'question' => 'What is 2+2?',
                'type' => 'multiple_choice',
                'options' => ['A' => '2', 'B' => '3', 'C' => 'C', 'D' => '5'],
                'correct_answer' => 'C',
                'points' => 10,
                'order' => 1,
            ],
            [
                'id' => 2,
                'question' => 'Is the sky blue?',
                'type' => 'true_false',
                'options' => ['True', 'False'],
                'correct_answer' => 'True',
                'points' => 10,
                'order' => 2,
            ],
        ];

        $this->quiz = Quiz::factory()->create([
            'course_id' => $this->course->id,
            'teacher_id' => $this->teacher->id,
            'title' => 'Test Quiz',
            'questions' => json_encode($questions),
            'total_marks' => 20,
            'passing_marks' => 12, // 60% of 20 marks
            'duration_minutes' => 30,
        ]);
    }

    /**
     * Test: Student can submit quiz for AI evaluation
     */
    public function test_student_can_submit_quiz_for_ai_evaluation()
    {
        // Mock Gemini API response
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'question_feedback' => [
                                            [
                                                'question_number' => 1,
                                                'is_correct' => true,
                                                'points_earned' => 10,
                                                'explanation' => 'Correct! 2+2 equals 4.',
                                                'improvement_tip' => 'Great job!'
                                            ],
                                            [
                                                'question_number' => 2,
                                                'is_correct' => true,
                                                'points_earned' => 10,
                                                'explanation' => 'Yes, the sky is blue.',
                                                'improvement_tip' => 'Excellent!'
                                            ]
                                        ],
                                        'overall_feedback' => 'Perfect score! Outstanding work.',
                                        'strengths' => ['Quick thinking', 'Accurate answers'],
                                        'improvements' => [],
                                        'recommendations' => ['Keep up the excellent work!']
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $questions = json_decode($this->quiz->questions, false);
        $answers = [
            $questions[0]->id => 'C',
            $questions[1]->id => 'True',
        ];

        $response = $this->actingAs($this->studentUser, 'sanctum')
            ->postJson('/api/student/analyze-quiz', [
                'quiz_id' => $this->quiz->id,
                'answers' => $answers,
                'time_spent' => 120,
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'attempt_id',
                    'score',
                    'total_marks',
                    'percentage',
                    'passed',
                    'correct_answers',
                    'total_questions',
                    'ai_feedback' => [
                        'overall_feedback',
                        'strengths',
                        'improvements',
                        'recommendations',
                    ],
                    'can_retake',
                    'attempts_remaining',
                ]
            ]);

        $this->assertEquals(true, $response->json('success'));
        $this->assertEquals(20, $response->json('data.score'));
        $this->assertTrue($response->json('data.passed'));
    }

    /**
     * Test: Validation fails with invalid input
     */
    public function test_validation_fails_with_invalid_input()
    {
        $response = $this->actingAs($this->studentUser, 'sanctum')
            ->postJson('/api/student/analyze-quiz', [
                'quiz_id' => 'invalid',
                'answers' => 'not-an-array',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['quiz_id', 'answers']);
    }

    /**
     * Test: Student cannot access quiz from non-enrolled course
     */
    public function test_student_cannot_access_non_enrolled_course_quiz()
    {
        // Create another course without enrollment
        $otherCourse = Course::factory()->create([
            'teacher_id' => $this->teacher->id,
        ]);

        $otherQuiz = Quiz::factory()->create([
            'course_id' => $otherCourse->id,
            'teacher_id' => $this->teacher->id,
            'questions' => json_encode([['id' => 1, 'question' => 'Test?', 'correct_answer' => 'A']]),
        ]);

        $response = $this->actingAs($this->studentUser, 'sanctum')
            ->postJson('/api/student/analyze-quiz', [
                'quiz_id' => $otherQuiz->id,
                'answers' => [1 => 'A'], // Valid answer format
                'time_spent' => 60,
            ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You do not have access to this quiz. Please enroll in the course first.',
            ]);
    }

    /**
     * Test: Student cannot exceed max attempts
     */
    public function test_student_cannot_exceed_max_attempts()
    {
        // Create 3 attempts (max allowed)
        for ($i = 0; $i < 3; $i++) {
            \App\Models\QuizAttempt::create([
                'quiz_id' => $this->quiz->id,
                'student_id' => $this->student->id,
                'score' => 10,
                'answers' => [],
                'ai_feedback' => [],
                'submitted_at' => now(),
            ]);
        }

        $response = $this->actingAs($this->studentUser, 'sanctum')
            ->postJson('/api/student/analyze-quiz', [
                'quiz_id' => $this->quiz->id,
                'answers' => [],
            ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You have reached the maximum number of attempts for this quiz.',
            ]);
    }

    /**
     * Test: Fallback feedback works when API fails
     */
    public function test_fallback_feedback_works_when_api_fails()
    {
        // Mock API failure
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(null, 500)
        ]);

        $questions = json_decode($this->quiz->questions, false);
        $answers = [
            $questions[0]->id => 'C',
            $questions[1]->id => 'True',
        ];

        $response = $this->actingAs($this->studentUser, 'sanctum')
            ->postJson('/api/student/analyze-quiz', [
                'quiz_id' => $this->quiz->id,
                'answers' => $answers,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // Should still get feedback, even if not AI-generated
        $this->assertArrayHasKey('ai_feedback', $response->json('data'));
        $this->assertEquals(false, $response->json('data.ai_feedback.ai_generated'));
    }

    /**
     * Test: Student can retrieve quiz attempts history
     */
    public function test_student_can_retrieve_quiz_attempts_history()
    {
        // Create some attempts
        \App\Models\QuizAttempt::create([
            'quiz_id' => $this->quiz->id,
            'student_id' => $this->student->id,
            'score' => 15,
            'answers' => [],
            'ai_feedback' => [],
            'submitted_at' => now()->subDays(2),
        ]);

        \App\Models\QuizAttempt::create([
            'quiz_id' => $this->quiz->id,
            'student_id' => $this->student->id,
            'score' => 18,
            'answers' => [],
            'ai_feedback' => [],
            'submitted_at' => now()->subDay(),
        ]);

        $response = $this->actingAs($this->studentUser, 'sanctum')
            ->getJson('/api/student/quiz-attempts?quiz_id=' . $this->quiz->id);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'quiz_id',
                        'score',
                        'submitted_at',
                    ]
                ]
            ]);

        $this->assertCount(2, $response->json('data'));
    }

    /**
     * Test: Unauthenticated user cannot access quiz API
     */
    public function test_unauthenticated_user_cannot_access_quiz_api()
    {
        $response = $this->postJson('/api/student/analyze-quiz', [
            'quiz_id' => $this->quiz->id,
            'answers' => [],
        ]);

        $response->assertStatus(401);
    }
}
