<?php

namespace Database\Factories;

use App\Models\QuizQuestion;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizQuestion>
 */
class QuizQuestionFactory extends Factory
{
    protected $model = QuizQuestion::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['multiple_choice', 'true_false', 'short_answer']);

        $options = null;
        $correctAnswer = null;

        if ($type === 'multiple_choice') {
            $options = [
                'A' => $this->faker->sentence(3),
                'B' => $this->faker->sentence(3),
                'C' => $this->faker->sentence(3),
                'D' => $this->faker->sentence(3),
            ];
            $correctAnswer = $this->faker->randomElement(['A', 'B', 'C', 'D']);
        } elseif ($type === 'true_false') {
            $options = ['True', 'False'];
            $correctAnswer = $this->faker->randomElement(['True', 'False']);
        } else {
            $correctAnswer = $this->faker->sentence(5);
        }

        return [
            'quiz_id' => Quiz::factory(),
            'question' => $this->faker->sentence(8) . '?',
            'type' => $type,
            'options' => $options,
            'correct_answer' => $correctAnswer,
            'points' => $this->faker->numberBetween(1, 10),
            'order' => $this->faker->numberBetween(1, 10),
        ];
    }
}
