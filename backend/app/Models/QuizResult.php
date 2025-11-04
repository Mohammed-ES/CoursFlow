<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'student_id',
        'answers',
        'score',
        'percentage',
        'correct_answers',
        'wrong_answers',
        'time_taken_minutes',
        'status',
        'started_at',
        'submitted_at',
    ];

    protected $casts = [
        'answers' => 'array',
        'score' => 'integer',
        'percentage' => 'decimal:2',
        'correct_answers' => 'integer',
        'wrong_answers' => 'integer',
        'time_taken_minutes' => 'integer',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    /**
     * Get the quiz for this result.
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the student for this result.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Check if student passed.
     */
    public function getIsPassedAttribute()
    {
        return $this->score >= $this->quiz->passing_marks;
    }

    /**
     * Get grade based on percentage.
     */
    public function getGradeAttribute()
    {
        if ($this->percentage >= 90) return 'A';
        if ($this->percentage >= 80) return 'B';
        if ($this->percentage >= 70) return 'C';
        if ($this->percentage >= 60) return 'D';
        return 'F';
    }
}
