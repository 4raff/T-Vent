import { apiClient } from "@/utils/api";

export const categoriesService = {
  /**
   * Get all unique categories from events
   */
  async getCategories() {
    try {
      const response = await apiClient.get("/events/categories");
      return response.data || response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};
