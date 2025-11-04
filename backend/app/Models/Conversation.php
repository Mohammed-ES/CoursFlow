<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'teacher_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    /**
     * Get the admin that owns the conversation.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Get the teacher that owns the conversation.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the messages for the conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Get the last message of the conversation.
     */
    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Get unread messages count for a specific user.
     */
    public function unreadCount($userType, $userId)
    {
        return $this->messages()
            ->where('is_read', false)
            ->where(function ($query) use ($userType, $userId) {
                // Les messages non lus sont ceux envoyés PAR l'autre personne
                if ($userType === 'admin') {
                    $query->where('sender_type', 'teacher');
                } else {
                    $query->where('sender_type', 'admin');
                }
            })
            ->count();
    }
}
