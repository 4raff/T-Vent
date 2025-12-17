import { apiClient } from "@/utils/api/client";

export const ticketService = {
  /**
   * Get all tickets for user
   */
  async getUserTickets(user_id) {
    try {
      const response = await apiClient.get(`/tickets`);
      const allTickets = Array.isArray(response) ? response : response.data || [];
      return allTickets.filter(t => t.user_id === user_id);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      throw error;
    }
  },

  /**
   * Get ticket by ID
   */
  async getTicket(ticketId) {
    try {
      const response = await apiClient.get(`/tickets/${ticketId}`);
      return response.data || response;
    } catch (error) {
      console.error("Error fetching ticket:", error);
      throw error;
    }
  },

  /**
   * Cancel/batalkan tiket
   */
  async cancelTicket(ticketId, cancellation_reason = null) {
    try {
      const response = await apiClient.post(`/tickets/batalkan-tiket`, {
        ticketId,
        cancellation_reason
      });
      return response.data || response;
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      throw error;
    }
  },

  /**
   * Confirm/konfirmasi pembayaran tiket
   */
  async confirmPayment(ticketId) {
    try {
      const response = await apiClient.post(`/tickets/konfirmasi-pembayaran`, {
        ticketId
      });
      return response.data || response;
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw error;
    }
  }
};
