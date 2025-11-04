<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminNotification extends Model
{
    use HasFactory;

    protected $table = 'admin_notifications';

    protected $fillable = [
        'admin_id',
        'title',
        'content',
        'type',
        'priority',
        'target_audience',
        'is_published',
        'published_at',
        'expires_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the admin who created this notification
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Get all teachers who received this notification
     */
    public function teachers()
    {
        return $this->belongsToMany(
            Teacher::class,
            'admin_notification_teacher',
            'admin_notification_id',
            'teacher_id'
        )
        ->withPivot('read_at')
        ->withTimestamps();
    }

    /**
     * Get all students who received this notification
     */
    public function students()
    {
        return $this->belongsToMany(
            Student::class,
            'admin_notification_student',
            'admin_notification_id',
            'student_id'
        )
        ->withPivot('read_at')
        ->withTimestamps();
    }

    /**
     * Check if the notification is active (published and not expired)
     */
    public function getIsActiveAttribute()
    {
        if (!$this->is_published || !$this->published_at) {
            return false;
        }

        $now = now();

        if ($this->published_at > $now) {
            return false;
        }

        if ($this->expires_at && $this->expires_at < $now) {
            return false;
        }

        return true;
    }

    /**
     * Scope to get only published notifications
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    /**
     * Scope to get only active notifications (published and not expired)
     */
    public function scopeActive($query)
    {
        return $query->published()
                     ->where(function ($q) {
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now());
                     });
    }

    /**
     * Scope to filter by target audience
     */
    public function scopeForAudience($query, $audience)
    {
        return $query->where(function ($q) use ($audience) {
            $q->where('target_audience', $audience)
              ->orWhere('target_audience', 'both');
        });
    }
}
