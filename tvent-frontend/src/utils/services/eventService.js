import { apiClient } from '@/utils/api/client';
import { API_ENDPOINTS } from '@/config/api';

export const eventService = {
  /**
   * Get all events
   */
  async getEvents(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const endpoint = `${API_ENDPOINTS.EVENTS.LIST}${params ? `?${params}` : ''}`;
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      console.error('eventService.getEvents error:', error.message, error.data);
      throw error;
    }
  },

  /**
   * Get single event by ID
   */
  async getEvent(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EVENTS.GET(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new event
   */
  async createEvent(eventData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.EVENTS.CREATE, eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update event
   */
  async updateEvent(id, eventData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.EVENTS.UPDATE(id), eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Hapus event
   */
  async deleteEvent(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.EVENTS.DELETE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
