<?php

namespace Database\Factories;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'subject' => $this->faker->randomElement(['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'French']),
            'bio' => $this->faker->paragraph(),
            'phone' => $this->faker->phoneNumber(),
            'profile_image' => null,
            'specialization' => $this->faker->randomElement(['Bachelor', 'Master', 'PhD']),
            'years_of_experience' => $this->faker->numberBetween(1, 20),
            'status' => 'active',
        ];
    }
}
