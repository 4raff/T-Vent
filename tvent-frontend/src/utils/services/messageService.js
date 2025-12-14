import { apiClient } from '@/utils/api/client';

export const messageService = {
  /**
   * Get conversations for a user
   */
  async getConversations(userId) {
    try {
      const response = await apiClient.get(`/messages/${userId}/conversations`);
      return response.data || response || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  /**
   * Get messages between two users
   */
  async getConversation(userId, otherUserId) {
    try {
      const response = await apiClient.get(`/messages/${userId}/conversation/${otherUserId}`);
      return response.data || response || [];
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  /**
   * Send a message
   */
  async sendMessage(senderId, receiverId, content) {
    try {
      const response = await apiClient.post('/messages', {
        sender_id: senderId,
        receiver_id: receiverId,
        content: content
      });
      return response.data || response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Mark conversation as read
   */
  async markAsRead(userId, otherUserId) {
    try {
      const response = await apiClient.patch(`/messages/${userId}/conversation/${otherUserId}/read`);
      return response;
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  },

  /**
   * Get unread message count
   */
  async getUnreadCount(userId) {
    try {
      const response = await apiClient.get(`/messages/${userId}/unread`);
      return response.data?.unread_count || response?.unread_count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }
};
