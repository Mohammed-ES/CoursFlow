<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'title',
        'description',
        'subject',
        'level',
        'price',
        'duration_hours',
        'max_students',
        'thumbnail',
        'status',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration_hours' => 'integer',
        'max_students' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the teacher that owns the course.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * The students enrolled in the course.
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'course_student')
                    ->withPivot('payment_status', 'amount_paid', 'payment_method', 'transaction_id', 'enrolled_at', 'payment_date', 'progress')
                    ->withTimestamps();
    }

    /**
     * Get only students who have paid for this course.
     */
    public function paidStudents(): BelongsToMany
    {
        return $this->students()->wherePivot('payment_status', 'paid');
    }

    /**
     * Get the attendances for the course.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get the quizzes for the course.
     */
    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    /**
     * Get the materials for the course.
     */
    public function materials(): HasMany
    {
        return $this->hasMany(CourseMaterial::class);
    }

    /**
     * Get the calendar events for the course.
     */
    public function calendarEvents(): HasMany
    {
        return $this->hasMany(CalendarEvent::class);
    }

    /**
     * Get notifications specific to this course.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(TeacherNotification::class);
    }

    /**
     * Get enrolled students count (paid only).
     */
    public function getEnrolledCountAttribute()
    {
        return $this->paidStudents()->count();
    }

    /**
     * Check if course is full.
     */
    public function getIsFullAttribute()
    {
        return $this->enrolled_count >= $this->max_students;
    }

    /**
     * Get average attendance rate.
     */
    public function getAverageAttendanceRateAttribute()
    {
        $totalAttendances = $this->attendances()->count();
        if ($totalAttendances === 0) {
            return 0;
        }

        $presentCount = $this->attendances()->where('status', 'present')->count();
        return round(($presentCount / $totalAttendances) * 100, 2);
    }
}
