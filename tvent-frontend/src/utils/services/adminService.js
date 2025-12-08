import { apiClient } from '@/utils/api/client';

export const adminService = {
  // ===== Events =====
  async getAllEvents() {
    try {
      const response = await apiClient.get('/events');
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  async getPendingEvents() {
    try {
      const response = await apiClient.get('/events?status=pending');
      const events = Array.isArray(response) ? response : response.data || [];
      return events.filter(e => e.status === 'pending');
    } catch (error) {
      console.error('Error fetching pending events:', error);
      throw error;
    }
  },

  async approveEvent(eventId) {
    try {
      const response = await apiClient.put(`/events/${eventId}/approve`);
      return response.data || response;
    } catch (error) {
      console.error('Error approving event:', error);
      throw error;
    }
  },

  async rejectEvent(eventId) {
    try {
      const response = await apiClient.put(`/events/${eventId}/reject`);
      return response.data || response;
    } catch (error) {
      console.error('Error rejecting event:', error);
      throw error;
    }
  },

  async cancelEvent(eventId) {
    try {
      const response = await apiClient.put(`/events/${eventId}/cancel`);
      return response.data || response;
    } catch (error) {
      console.error('Error cancelling event:', error);
      throw error;
    }
  },

  // ===== Payments =====
  async getAllPayments() {
    try {
      const response = await apiClient.get('/payments');
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  async getPendingPayments() {
    try {
      const response = await apiClient.get('/payments?status=pending');
      const payments = Array.isArray(response) ? response : response.data || [];
      return payments.filter(p => p.status === 'pending');
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      throw error;
    }
  },

  async approvePayment(paymentId, rejectionReason = null) {
    try {
      const response = await apiClient.put(`/payments/${paymentId}/approve`, {
        rejection_reason: rejectionReason
      });
      return response.data || response;
    } catch (error) {
      console.error('Error approving payment:', error);
      throw error;
    }
  },

  async rejectPayment(paymentId, rejectionReason) {
    try {
      const response = await apiClient.put(`/payments/${paymentId}/reject`, {
        rejection_reason: rejectionReason
      });
      return response.data || response;
    } catch (error) {
      console.error('Error rejecting payment:', error);
      throw error;
    }
  },

  // ===== Users =====
  async getAllUsers() {
    try {
      const response = await apiClient.get('/users');
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // ===== Bank Accounts =====
  async getBankAccounts(activeOnly = false) {
    try {
      const response = await apiClient.get('/bank-accounts');
      const accounts = Array.isArray(response) ? response : response.data || [];
      return activeOnly ? accounts.filter(a => a.is_active) : accounts;
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      throw error;
    }
  },

  async createBankAccount(bankData) {
    try {
      const response = await apiClient.post('/bank-accounts', bankData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating bank account:', error);
      throw error;
    }
  },

  async updateBankAccount(bankId, bankData) {
    try {
      const response = await apiClient.put(`/bank-accounts/${bankId}`, bankData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating bank account:', error);
      throw error;
    }
  },

  async deleteBankAccount(bankId) {
    try {
      const response = await apiClient.delete(`/bank-accounts/${bankId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting bank account:', error);
      throw error;
    }
  },

  async activateBankAccount(bankId) {
    try {
      const response = await apiClient.post(`/bank-accounts/${bankId}/activate`);
      return response.data || response;
    } catch (error) {
      console.error('Error activating bank account:', error);
      throw error;
    }
  },

  async deactivateBankAccount(bankId) {
    try {
      const response = await apiClient.post(`/bank-accounts/${bankId}/deactivate`);
      return response.data || response;
    } catch (error) {
      console.error('Error deactivating bank account:', error);
      throw error;
    }
  },

  // ===== E-Wallet Providers =====
  async getEwalletProviders(activeOnly = false) {
    try {
      const response = await apiClient.get('/ewallet-providers');
      const providers = Array.isArray(response) ? response : response.data || [];
      return activeOnly ? providers.filter(p => p.is_active) : providers;
    } catch (error) {
      console.error('Error fetching e-wallet providers:', error);
      throw error;
    }
  },

  async createEwalletProvider(providerData) {
    try {
      const response = await apiClient.post('/ewallet-providers', providerData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating e-wallet provider:', error);
      throw error;
    }
  },

  async updateEwalletProvider(providerId, providerData) {
    try {
      const response = await apiClient.put(`/ewallet-providers/${providerId}`, providerData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating e-wallet provider:', error);
      throw error;
    }
  },

  async deleteEwalletProvider(providerId) {
    try {
      const response = await apiClient.delete(`/ewallet-providers/${providerId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting e-wallet provider:', error);
      throw error;
    }
  },

  async activateEwalletProvider(providerId) {
    try {
      const response = await apiClient.post(`/ewallet-providers/${providerId}/activate`);
      return response.data || response;
    } catch (error) {
      console.error('Error activating e-wallet provider:', error);
      throw error;
    }
  },

  async deactivateEwalletProvider(providerId) {
    try {
      const response = await apiClient.post(`/ewallet-providers/${providerId}/deactivate`);
      return response.data || response;
    } catch (error) {
      console.error('Error deactivating e-wallet provider:', error);
      throw error;
    }
  },

  // ===== Statistics =====
  async getAdminStats() {
    try {
      const [events, payments, users] = await Promise.all([
        this.getAllEvents(),
        this.getAllPayments(),
        this.getAllUsers()
      ]);

      const totalRevenue = payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + (p.jumlah || 0), 0);

      return {
        totalEvents: events.length,
        totalUsers: users.length,
        totalRevenue: totalRevenue,
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        events: {
          approved: events.filter(e => e.status === 'approved').length,
          pending: events.filter(e => e.status === 'pending').length,
          rejected: events.filter(e => e.status === 'rejected').length
        },
        payments: {
          success: payments.filter(p => p.status === 'success').length,
          pending: payments.filter(p => p.status === 'pending').length,
          rejected: payments.filter(p => p.status === 'rejected').length
        },
        users: {
          admin: users.filter(u => u.role === 'admin').length,
          regular: users.filter(u => u.role === 'user').length
        }
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }
};
