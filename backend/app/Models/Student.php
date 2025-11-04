<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\TeacherNotification;
use App\Models\QuizAttempt;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'student_code',
        'phone',
        'address',
        'location',
        'date_of_birth',
        'profile_image',
        'status',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get the user that owns the student profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The courses that the student is enrolled in.
     */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_student')
                    ->withPivot('payment_status', 'amount_paid', 'payment_method', 'transaction_id', 'enrolled_at', 'payment_date', 'progress')
                    ->withTimestamps();
    }

    /**
     * Get only paid courses.
     */
    public function paidCourses(): BelongsToMany
    {
        return $this->courses()->wherePivot('payment_status', 'paid');
    }

    /**
     * Get the attendances for the student.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get the quiz results for the student.
     */
    public function quizResults(): HasMany
    {
        return $this->hasMany(QuizResult::class);
    }

    /**
     * Get the quiz attempts for the student.
     */
    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Get all teachers of this student (through paid courses).
     */
    public function teachers()
    {
        return Teacher::whereHas('courses.students', function ($query) {
            $query->where('students.id', $this->id)
                  ->where('course_student.payment_status', 'paid');
        })->get();
    }

    /**
     * Get attendance rate for a specific course.
     */
    public function getAttendanceRateForCourse($courseId)
    {
        $totalClasses = $this->attendances()->where('course_id', $courseId)->count();
        if ($totalClasses === 0) {
            return 0;
        }

        $presentCount = $this->attendances()
                             ->where('course_id', $courseId)
                             ->where('status', 'present')
                             ->count();

        return round(($presentCount / $totalClasses) * 100, 2);
    }

    /**
     * Get overall attendance rate.
     */
    public function getOverallAttendanceRateAttribute()
    {
        $totalClasses = $this->attendances()->count();
        if ($totalClasses === 0) {
            return 0;
        }

        $presentCount = $this->attendances()->where('status', 'present')->count();
        return round(($presentCount / $totalClasses) * 100, 2);
    }

    /**
     * Get average quiz score.
     */
    public function getAverageQuizScoreAttribute()
    {
        return $this->quizResults()->avg('percentage') ?? 0;
    }

    /**
     * Get notifications for the student (through their courses).
     * Returns published notifications from teachers of courses the student is enrolled in.
     */
    public function notifications()
    {
        return $this->belongsToMany(Notification::class, 'notification_student')
            ->withPivot('read_at')
            ->withTimestamps();
    }

    /**
     * Get all enrolled courses with payment status.
     */
    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'course_student')
            ->where('course_student.payment_status', 'paid')
            ->withPivot('payment_status', 'amount_paid', 'enrolled_at', 'progress')
            ->withTimestamps();
    }

    /**
     * Check if student has paid for a specific course.
     */
    public function hasPaidForCourse($courseId)
    {
        return $this->paidCourses()->where('courses.id', $courseId)->exists();
    }
}

