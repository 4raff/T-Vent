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
        console.log('Token saved to localStorage:', response.token);
      }

      // Fetch user profile setelah login berhasil
      console.log('Fetching user profile...');
      const userProfile = await this.getProfile();
      console.log('User profile fetched:', userProfile);
      
      // Return combined response dengan user profile
      return {
        ...response,
        data: userProfile
      };
    } catch (error) {
      // Throw error dengan data struktur yang benar
      throw error;
    }
  },

  /**
   * Get user profile (require authentication)
   */
  async getProfile() {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log('Getting profile with token:', token);
      
      const response = await apiClient.get(API_ENDPOINTS.USERS.GET_PROFILE);
      // Response format: { success: true, data: { id, username, email, ... } }
      const userData = response.data || response;
      
      // Simpan user data to localStorage untuk akses cepat
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User data saved to localStorage:', userData);
      
      return userData;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    console.log('User logged out. Tokens and data cleared.');
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
