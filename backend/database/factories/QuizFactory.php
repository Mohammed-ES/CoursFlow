<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quiz>
 */
class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'teacher_id' => fn (array $attributes) =>
                Course::find($attributes['course_id'])->teacher_id ?? Teacher::factory(),
            'title' => $this->faker->sentence(3) . ' Quiz',
            'description' => $this->faker->paragraph(),
            'questions' => json_encode([]),  // Empty array by default, tests will populate
            'duration_minutes' => $this->faker->numberBetween(15, 120),
            'total_marks' => 100,
            'passing_marks' => $this->faker->numberBetween(50, 80),
            'max_attempts' => $this->faker->randomElement([null, 1, 3, 5]), // null = unlimited
            'difficulty' => $this->faker->randomElement(['easy', 'medium', 'hard']),
            'is_ai_generated' => false,
            'status' => 'published',
            'available_from' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'available_until' => $this->faker->dateTimeBetween('+1 month', '+3 months'),
        ];
    }
}
