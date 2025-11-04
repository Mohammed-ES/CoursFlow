<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'teacher_id',
        'title',
        'description',
        'file_type',
        'file_path',
        'file_name',
        'file_size',
        'downloads_count',
        'is_public',
        'order',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'downloads_count' => 'integer',
        'is_public' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the course for this material.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the teacher who uploaded this material.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Increment downloads count.
     */
    public function incrementDownloads()
    {
        $this->increment('downloads_count');
    }

    /**
     * Get file size in human readable format.
     */
    public function getFileSizeHumanAttribute()
    {
        $size = $this->file_size;

        if ($size >= 1073741824) {
            return number_format($size / 1073741824, 2) . ' GB';
        }
        if ($size >= 1048576) {
            return number_format($size / 1048576, 2) . ' MB';
        }
        if ($size >= 1024) {
            return number_format($size / 1024, 2) . ' KB';
        }

        return $size . ' bytes';
    }

    /**
     * Get file icon based on type.
     */
    public function getFileIconAttribute()
    {
        return match($this->file_type) {
            'pdf' => '📄',
            'image' => '🖼️',
            'video' => '🎥',
            default => '📎',
        };
    }
}
