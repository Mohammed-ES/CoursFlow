<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'course_id',
        'type',
        'title',
        'content',
        'priority',
        'published_at',
        'expires_at',
        'is_published',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_published' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the teacher that created the notification.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Get the course related to the notification.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the students that received this notification.
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'notification_student')
            ->withPivot('read_at')
            ->withTimestamps();
    }

    /**
     * Scope to get published notifications.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Scope to get notifications for a specific course.
     */
    public function scopeForCourse($query, $courseId)
    {
        return $query->where(function ($q) use ($courseId) {
            $q->where('course_id', $courseId)
                ->orWhereNull('course_id');
        });
    }
}
