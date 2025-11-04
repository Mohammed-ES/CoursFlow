<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'student_id',
        'answers',
        'ai_feedback',
        'score',
        'correct_answers',
        'total_questions',
        'started_at',
        'submitted_at',
        'time_spent_seconds',
    ];

    protected $casts = [
        'answers' => 'array',
        'ai_feedback' => 'array',
        'score' => 'decimal:2',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    /**
     * Get the quiz for this attempt.
     */
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the student who made this attempt.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Check if the attempt is completed.
     */
    public function isCompleted(): bool
    {
        return !is_null($this->submitted_at);
    }

    /**
     * Get pass/fail status.
     */
    public function hasPassed(): bool
    {
        return $this->score >= ($this->quiz->passing_score ?? 50);
    }

    /**
     * Calculate time spent in minutes.
     */
    public function getTimeSpentInMinutes(): int
    {
        return $this->time_spent_seconds ? (int) ceil($this->time_spent_seconds / 60) : 0;
    }
}
