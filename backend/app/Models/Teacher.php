<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Teacher extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'user_id',
        'teacher_id',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'address',
        'location',
        'subject',
        'specialization',
        'avatar',
        'status',
        'experience_years',
        'years_of_experience',
        'join_date',
        'is_deleted',
        'bio',
        'profile_image',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'join_date' => 'date',
        'is_deleted' => 'boolean',
    ];

    /**
     * Get the user that owns the teacher profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the conversations for the teacher.
     */
    public function conversations()
    {
        return $this->hasMany(Conversation::class);
    }

    /**
     * Get the courses for the teacher.
     */
    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    /**
     * Get the attendances marked by the teacher.
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get the quizzes created by the teacher.
     */
    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    /**
     * Get the notifications created by the teacher.
     */
    public function teacherNotifications()
    {
        return $this->hasMany(TeacherNotification::class, 'teacher_id');
    }

    /**
     * Get the calendar events for the teacher.
     */
    public function calendarEvents()
    {
        return $this->hasMany(CalendarEvent::class);
    }

    /**
     * Get the course materials uploaded by the teacher.
     */
    public function courseMaterials()
    {
        return $this->hasMany(CourseMaterial::class);
    }

    /**
     * Get all students enrolled in this teacher's courses with paid status.
     */
    public function getEnrolledStudentsAttribute()
    {
        return Student::whereHas('courses', function ($query) {
            $query->where('teacher_id', $this->id)
                  ->where('course_student.payment_status', 'paid');
        })->get();
    }

    /**
     * Get full name attribute.
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
