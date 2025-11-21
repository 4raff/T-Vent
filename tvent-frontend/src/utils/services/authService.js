import { apiClient } from '@/utils/api/client';
import { API_ENDPOINTS } from '@/config/api';

export const authService = {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      // Response format: { message: "...", data: { id, username, email, ... } }
      return response.data || response;
    } catch (error) {
      // Throw error dengan data struktur yang benar
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      // Response format: { message: "...", token: "Bearer ..." }

      if (response.token) {
        localStorage.setItem('jwtToken', response.token);
      }

      return response;
    } catch (error) {
      // Throw error dengan data struktur yang benar
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('jwtToken');
    }
    return false;
  },

  /**
   * Get stored user data
   */
  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};
