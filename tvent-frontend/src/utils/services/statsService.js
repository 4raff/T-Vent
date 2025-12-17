import { apiClient } from "@/utils/api";

export const statsService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      const response = await apiClient.get("/stats/dashboard");
      return response.data || response;
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  },
};
