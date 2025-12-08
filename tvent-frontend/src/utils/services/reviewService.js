import { apiClient } from '@/utils/api/client';
import { API_ENDPOINTS } from '@/config/api';

export const reviewService = {
  /**
   * Get all reviews
   */
  async getReviews() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.LIST);
      const data = response.data || response;
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('reviewService.getReviews error:', error.message, error.data);
      throw error;
    }
  },

  /**
   * Get single review by ID
   */
  async getReview(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.GET(id));
      return response.data || response;
    } catch (error) {
      console.error('reviewService.getReview error:', error.message, error.data);
      throw error;
    }
  },

  /**
   * Kirim review for event
   */
  async submitReview(data) {
    try {
      // Ensure is_anonymous defaults to false if not provided
      const reviewData = {
        ...data,
        is_anonymous: data.is_anonymous || false
      };
      const response = await apiClient.post(API_ENDPOINTS.REVIEWS.SUBMIT, reviewData);
      return response.data || response;
    } catch (error) {
      console.error('reviewService.submitReview error:', error.message, error.data);
      throw error;
    }
  },

  /**
   * Create review
   */
  async createReview(reviewData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, reviewData);
      return response.data || response;
    } catch (error) {
      console.error('reviewService.createReview error:', error.message, error.data);
      throw error;
    }
  },

  /**
   * Update review
   */
  async updateReview(id, reviewData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.REVIEWS.UPDATE(id), reviewData);
      return response.data || response;
    } catch (error) {
      console.error('reviewService.updateReview error:', error.message, error.data);
      throw error;
    }
  },

  /**
   * Hapus review
   */
  async deleteReview(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
      return response.data || response;
    } catch (error) {
      console.error('reviewService.deleteReview error:', error.message, error.data);
      throw error;
    }
  },
};
