<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'teacher_id',
        'title',
        'description',
        'questions',
        'duration_minutes',
        'total_marks',
        'passing_marks',
        'difficulty',
        'is_ai_generated',
        'status',
        'available_from',
        'available_until',
    ];

    protected $casts = [
        'questions' => 'array',
        'duration_minutes' => 'integer',
        'total_marks' => 'integer',
        'passing_marks' => 'integer',
        'is_ai_generated' => 'boolean',
        'available_from' => 'datetime',
        'available_until' => 'datetime',
    ];

    /**
     * Get the course for this quiz.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the teacher who created this quiz.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Get the results for this quiz.
     */
    public function results(): HasMany
    {
        return $this->hasMany(QuizResult::class);
    }

    /**
     * Check if quiz is available.
     */
    public function getIsAvailableAttribute()
    {
        $now = now();

        if ($this->status !== 'published') {
            return false;
        }

        if ($this->available_from && $now->lt($this->available_from)) {
            return false;
        }

        if ($this->available_until && $now->gt($this->available_until)) {
            return false;
        }

        return true;
    }

    /**
     * Get average score for this quiz.
     */
    public function getAverageScoreAttribute()
    {
        return $this->results()->avg('percentage') ?? 0;
    }

    /**
     * Get completion rate.
     */
    public function getCompletionRateAttribute()
    {
        // Check if quiz has a course
        if (!$this->course) {
            return 0;
        }

        $totalStudents = $this->course->paidStudents()->count();
        if ($totalStudents === 0) {
            return 0;
        }

        $completedCount = $this->results()->where('status', 'completed')->count();
        return round(($completedCount / $totalStudents) * 100, 2);
    }
}
