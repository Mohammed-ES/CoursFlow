import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Circle,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { messagingAPI } from '../../services/apiService';

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  message_text: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: number;
  teacher_id: number;
  teacher_name: string;
  teacher_email: string;
  teacher_avatar?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Admin user ID (from localStorage)
  const adminId = 1; // In production, get from auth context

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      const response = await messagingAPI.getConversations();
      
      // Transform API data to match component interface
      const transformedConversations: Conversation[] = response.data.map((conv: any) => ({
        id: conv.id,
        teacher_id: conv.teacher_id,
        teacher_name: conv.teacher?.name || 'Unknown',
        teacher_email: conv.teacher?.email || '',
        teacher_avatar: conv.teacher?.avatar,
        last_message: conv.last_message?.message_text || 'No messages yet',
        last_message_at: conv.last_message?.created_at || conv.created_at,
        unread_count: conv.unread_count || 0,
      }));

      setConversations(transformedConversations);
      
      // Select first conversation by default
      if (transformedConversations.length > 0) {
        setSelectedConversation(transformedConversations[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const response = await messagingAPI.getMessages(conversationId);
      
      // Transform API data to match component interface
      const transformedMessages: Message[] = response.data.map((msg: any) => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_id: msg.sender_id,
        message_text: msg.message_text,
        is_read: msg.is_read,
        created_at: msg.created_at,
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await messagingAPI.sendMessage(
        selectedConversation.id,
        newMessage
      );
      
      // Add the new message to the list
      const newMsg: Message = {
        id: response.data.id,
        conversation_id: response.data.conversation_id,
        sender_id: response.data.sender_id,
        message_text: response.data.message_text,
        is_read: true,
        created_at: response.data.created_at,
      };

      setMessages([...messages, newMsg]);
      setNewMessage('');

      // Update conversation's last message
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, last_message: newMessage, last_message_at: new Date().toISOString() }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.teacher_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-main"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-secondary-main dark:text-white mb-2">
          Messages
        </h1>
        <p className="text-neutral-gray">
          Communiquez avec les enseignants
        </p>
      </div>

      <Card className="h-[calc(100vh-250px)] overflow-hidden">
        <div className="grid grid-cols-12 h-full">
          {/* Conversations List */}
          <div className="col-span-12 md:col-span-4 border-r border-neutral-lightGray dark:border-secondary-main h-full flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-neutral-lightGray dark:border-secondary-main">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                <input
                  type="text"
                  placeholder="Rechercher un enseignant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-offWhite dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: 'rgba(0, 59, 115, 0.05)' }}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer border-b border-neutral-lightGray dark:border-secondary-main transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary-main/10 dark:bg-primary-main/20'
                      : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-main to-accent-cyan flex items-center justify-center text-white font-bold flex-shrink-0">
                      {getInitials(conversation.teacher_name)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-secondary-main dark:text-white truncate">
                          {conversation.teacher_name}
                        </h3>
                        <span className="text-xs text-neutral-gray flex-shrink-0 ml-2">
                          {formatMessageTime(conversation.last_message_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-gray truncate flex-1">
                          {conversation.last_message}
                        </p>
                        {conversation.unread_count > 0 && (
                          <span className="ml-2 w-5 h-5 bg-accent-cyan text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="col-span-12 md:col-span-8 h-full flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-neutral-lightGray dark:border-secondary-main flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-main to-accent-cyan flex items-center justify-center text-white font-bold">
                      {getInitials(selectedConversation.teacher_name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-main dark:text-white">
                        {selectedConversation.teacher_name}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-green-500">
                        <Circle className="w-2 h-2 fill-current" />
                        <span>En ligne</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-neutral-lightGray dark:hover:bg-secondary-light rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-neutral-gray" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isAdmin = message.sender_id === adminId;
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isAdmin
                              ? 'bg-primary-main text-white rounded-br-none'
                              : 'bg-neutral-lightGray dark:bg-secondary-light text-secondary-main dark:text-white rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{message.message_text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isAdmin ? 'text-white/70' : 'text-neutral-gray'
                            }`}
                          >
                            {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-neutral-lightGray dark:border-secondary-main">
                  <div className="flex items-end space-x-2">
                    <button className="p-2 hover:bg-neutral-lightGray dark:hover:bg-secondary-light rounded-lg transition-colors flex-shrink-0">
                      <Paperclip className="w-5 h-5 text-neutral-gray" />
                    </button>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Écrivez votre message..."
                      rows={1}
                      className="flex-1 px-4 py-2 bg-neutral-offWhite dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-12 h-12 text-primary-main" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-main dark:text-white mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-neutral-gray">
                    Choisissez un enseignant pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default Messages;
