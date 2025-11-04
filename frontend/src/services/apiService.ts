import axios, { AxiosInstance, AxiosError } from 'axios';

// Base URL de l'API Laravel
const BASE_URL = 'http://localhost:8000/api';

// Configuration d'Axios
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Pour les cookies CORS
});

// Intercepteur pour ajouter le token aux requêtes
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token invalide ou expiré
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Types TypeScript
export interface Conversation {
    id: number;
    admin_id: number;
    teacher_id: number;
    teacher: {
        id: number;
        teacher_id: string;
        first_name: string;
        last_name: string;
        email: string;
        avatar: string | null;
        subject: string;
    };
    last_message: {
        id: number;
        message_text: string;
        sender_type: 'admin' | 'teacher';
        created_at: string;
    } | null;
    last_message_at: string;
    unread_count: number;
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_type: 'admin' | 'teacher';
    sender_id: number;
    message_text: string;
    is_read: boolean;
    created_at: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    admin: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        avatar: string | null;
        full_name: string;
    };
    token: string;
}

// Authentication API
export const authAPI = {
    /**
     * Login admin
     */
    login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        try {
            const response = await apiClient.post('/admin/login', credentials);
            
            // Sauvegarder le token
            if (response.data.success && response.data.data.token) {
                localStorage.setItem('authToken', response.data.data.token);
            }
            
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Logout admin
     */
    logout: async (): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.post('/admin/logout');
            localStorage.removeItem('authToken');
            return response.data;
        } catch (error) {
            localStorage.removeItem('authToken');
            throw error;
        }
    },

    /**
     * Get current admin info
     */
    me: async (): Promise<ApiResponse<LoginResponse['admin']>> => {
        try {
            const response = await apiClient.get('/admin/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

// Messaging API
export const messagingAPI = {
    /**
     * Get all conversations for authenticated admin
     */
    getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
        try {
            const response = await apiClient.get('/admin/conversations');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all messages for a specific conversation
     */
    getMessages: async (conversationId: number): Promise<ApiResponse<Message[]>> => {
        try {
            const response = await apiClient.get(`/admin/conversations/${conversationId}/messages`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Send a new message
     */
    sendMessage: async (conversationId: number, messageText: string): Promise<ApiResponse<Message>> => {
        try {
            const response = await apiClient.post('/admin/messages', {
                conversation_id: conversationId,
                message_text: messageText,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mark all messages in a conversation as read
     */
    markAsRead: async (conversationId: number): Promise<ApiResponse<{ updated_count: number }>> => {
        try {
            const response = await apiClient.put(`/admin/conversations/${conversationId}/read`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

// Export helper functions
export const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

export default apiClient;
