<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    protected $model = Course::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'teacher_id' => Teacher::factory(),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'subject' => $this->faker->randomElement(['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'French']),
            'level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
            'price' => $this->faker->randomFloat(2, 100, 1000),
            'duration_hours' => $this->faker->numberBetween(10, 100),
            'max_students' => $this->faker->numberBetween(10, 50),
            'thumbnail' => null,
            'status' => 'published',
            'start_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'end_date' => $this->faker->dateTimeBetween('+2 months', '+6 months'),
        ];
    }
}
