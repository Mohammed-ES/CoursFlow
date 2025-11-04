<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TeacherNotification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'teacher_id',
        'course_id',
        'title',
        'content',
        'type',
        'priority',
        'published_at',
        'expires_at',
        'is_published',
        'send_to_admin',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'send_to_admin' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the teacher who created this notification.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Get the course this notification is for (optional).
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the students who should receive this notification.
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'notification_student', 'notification_id', 'student_id')
                    ->withPivot('read_at')
                    ->withTimestamps();
    }

    /**
     * Scope to get published notifications.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
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
              ->orWhereNull('course_id'); // Include general notifications
        });
    }

    /**
     * Check if notification is active.
     */
    public function getIsActiveAttribute()
    {
        if (!$this->is_published) {
            return false;
        }

        if ($this->published_at && now()->lt($this->published_at)) {
            return false;
        }

        if ($this->expires_at && now()->gt($this->expires_at)) {
            return false;
        }

        return true;
    }
}
