<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Get all conversations for the authenticated admin.
     */
    public function getConversations(Request $request)
    {
        try {
            $admin = $request->user(); // Admin authentifié

            $conversations = Conversation::with(['teacher', 'messages'])
                ->where('admin_id', $admin->id)
                ->orderByDesc('last_message_at')
                ->get()
                ->map(function ($conversation) use ($admin) {
                    $lastMessage = $conversation->messages()->latest()->first();
                    $unreadCount = $conversation->messages()
                        ->where('is_read', false)
                        ->where('sender_id', '!=', $admin->id)
                        ->count();

                    return [
                        'id' => $conversation->id,
                        'teacher_id' => $conversation->teacher_id,
                        'teacher' => [
                            'id' => $conversation->teacher->id,
                            'name' => $conversation->teacher->name,
                            'email' => $conversation->teacher->email,
                        ],
                        'last_message' => $lastMessage ? [
                            'id' => $lastMessage->id,
                            'message_text' => $lastMessage->message_text,
                            'created_at' => $lastMessage->created_at,
                        ] : null,
                        'last_message_at' => $conversation->last_message_at,
                        'unread_count' => $unreadCount,
                        'created_at' => $conversation->created_at,
                        'updated_at' => $conversation->updated_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $conversations,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch conversations',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get messages for a specific conversation.
     */
    public function getMessages(Request $request, $conversationId)
    {
        try {
            $admin = $request->user();

            // Vérifier que la conversation appartient à l'admin
            $conversation = Conversation::where('id', $conversationId)
                ->where('admin_id', $admin->id)
                ->firstOrFail();

            $messages = Message::forConversation($conversationId)
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'conversation_id' => $message->conversation_id,
                        'sender_type' => $message->sender_type,
                        'sender_id' => $message->sender_id,
                        'message_text' => $message->message_text,
                        'is_read' => $message->is_read,
                        'created_at' => $message->created_at,
                    ];
                });

            // Marquer tous les messages du teacher comme lus
            Message::forConversation($conversationId)
                ->where('sender_type', 'teacher')
                ->unread()
                ->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'data' => $messages,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch messages',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send a new message.
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'message_text' => 'required|string|max:5000',
        ]);

        try {
            $admin = $request->user();

            // Vérifier que la conversation appartient à l'admin
            $conversation = Conversation::where('id', $request->conversation_id)
                ->where('admin_id', $admin->id)
                ->firstOrFail();

            DB::beginTransaction();

            // Créer le message
            $message = Message::create([
                'conversation_id' => $request->conversation_id,
                'sender_type' => 'admin',
                'sender_id' => $admin->id,
                'message_text' => $request->message_text,
                'is_read' => false,
            ]);

            // Mettre à jour last_message_at de la conversation
            $conversation->update([
                'last_message_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => [
                    'id' => $message->id,
                    'conversation_id' => $message->conversation_id,
                    'sender_type' => $message->sender_type,
                    'sender_id' => $message->sender_id,
                    'message_text' => $message->message_text,
                    'is_read' => $message->is_read,
                    'created_at' => $message->created_at,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mark messages as read.
     */
    public function markAsRead(Request $request, $conversationId)
    {
        try {
            $admin = $request->user();

            // Vérifier que la conversation appartient à l'admin
            $conversation = Conversation::where('id', $conversationId)
                ->where('admin_id', $admin->id)
                ->firstOrFail();

            // Marquer tous les messages du teacher comme lus
            $updated = Message::forConversation($conversationId)
                ->where('sender_type', 'teacher')
                ->unread()
                ->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Messages marked as read',
                'updated_count' => $updated,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark messages as read',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
