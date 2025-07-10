import axios from 'axios';

// Use Netlify functions path in production, full URLs in development
const API_BASE_URL = import.meta.env.PROD
  ? '/.netlify/functions/api' // Use Netlify functions path in production
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from Clerk (async)
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get Clerk token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message || 'Request failed'));
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      window.location.href = '/login';
    }
    return Promise.reject(new Error(error.message || 'Response failed'));
  }
);

// API Service Functions

// Admin API Services
export const adminAPI = {
  // Get platform statistics
  getStats: (period = '30d') => api.get(`/admin/stats?period=${period}`),
  
  // Reader management
  getReaders: (params = {}) => api.get('/admin/readers', { params }),
  createReader: (readerData) => api.post('/admin/readers', readerData),
  updateReader: (readerId, updates) => api.patch(`/admin/readers/${readerId}`, updates),
  deleteReader: (readerId) => api.delete(`/admin/readers/${readerId}`),
  
  // User management
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUser: (userId, updates) => api.patch(`/admin/users/${userId}`, updates),
  
  // Session management
  getSessions: (params = {}) => api.get('/admin/sessions', { params }),
  
  // Financial management
  getRevenue: (period = '30d') => api.get(`/admin/revenue?period=${period}`),
  processPayouts: () => api.post('/admin/payouts/process'),

  // Product management
  syncStripeProducts: () => api.post('/admin/products/sync'),
};

// Reader API Services
export const readerAPI = {
  // Profile and settings
  updateProfile: (profileData) => api.patch('/users/profile', profileData),
  updateRates: (rates) => api.patch('/users/rates', { rates }),
  updateStatus: (isOnline) => api.patch('/users/status', { isOnline }),
  
  // Earnings and statistics
  getEarnings: (period = '30d') => api.get(`/users/earnings?period=${period}`),
  getStats: () => api.get('/users/stats'),
  
  // Session management
  getSessionHistory: (params = {}) => api.get('/sessions/history', { params }),
  acceptSession: (sessionId) => api.post(`/sessions/${sessionId}/accept`),
  declineSession: (sessionId) => api.post(`/sessions/${sessionId}/decline`),
  endSession: (sessionId) => api.post(`/sessions/${sessionId}/end`),
};

// Client API Services
export const clientAPI = {
  // Reader discovery
  getReaders: (params = {}) => api.get('/users/readers', { params }),
  getReader: (readerId) => api.get(`/users/readers/${readerId}`),
  
  // Session management
  requestSession: (sessionData) => api.post('/sessions/request', sessionData),
  getSessionHistory: (params = {}) => api.get('/sessions/history', { params }),
  reviewSession: (sessionId, reviewData) => api.post(`/sessions/${sessionId}/review`, reviewData),
  endSession: (sessionId) => api.post(`/sessions/${sessionId}/end`),
  
  // Profile and settings
  updateProfile: (profileData) => api.patch('/users/profile', profileData),
  getStats: () => api.get('/users/stats'),
  
  // Balance management (will integrate with Stripe)
  addFunds: (amount) => api.post('/stripe/add-funds', { amount }),
  getBalance: () => api.get('/users/balance'),

  // Product API calls
  getProducts: () => api.get('/products'),
  getProduct: (productId) => api.get(`/products/${productId}`),
};

// Message API Services
export const messageAPI = {
  // Get conversations list
  getConversations: () => api.get('/messages/conversations'),
  
  // Get messages in a conversation
  getConversationMessages: (conversationId) => api.get(`/messages/conversation/${conversationId}`),
  
  // Send a message
  sendMessage: (messageData) => api.post('/messages/send', messageData),
  
  // Mark messages as read
  markAsRead: (conversationId) => api.patch(`/messages/conversation/${conversationId}/read`),
};

// General API Services
export const generalAPI = {
  // Authentication (if needed beyond Clerk)
  verifyToken: () => api.get('/auth/verify'),
  
  // File uploads
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Real-time notifications
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
};

export default api;
