<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalendarEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'student_id',
        'course_id',
        'title',
        'description',
        'type',
        'location',
        'start_time',
        'end_time',
        'start_date',
        'end_date',
        'is_recurring',
        'recurring_pattern',
        'color',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_recurring' => 'boolean',
    ];

    /**
     * Get the teacher for this event.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Get the course for this event (optional).
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Scope to get events for a specific date range.
     */
    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->where(function ($q) use ($startDate, $endDate) {
            $q->whereBetween('start_time', [$startDate, $endDate])
              ->orWhereBetween('end_time', [$startDate, $endDate]);
        });
    }

    /**
     * Scope to get upcoming events.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now())
                     ->orderBy('start_time', 'asc');
    }

    /**
     * Get duration in minutes.
     */
    public function getDurationMinutesAttribute()
    {
        return $this->start_time->diffInMinutes($this->end_time);
    }
}
