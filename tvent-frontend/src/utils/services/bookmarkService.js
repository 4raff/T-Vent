import { apiClient } from "@/utils/api/client";

export const bookmarkService = {
  /**
   * Tambah a bookmark for the user
   */
  async addBookmark(user_id, event_id) {
    try {
      const response = await apiClient.post("/bookmarks", {
        user_id,
        event_id,
      });
      return response.data || response;
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    }
  },

  /**
   * Remove a bookmark by ID
   */
  async removeBookmark(bookmarkId) {
    try {
      await apiClient.delete(`/bookmarks/${bookmarkId}`);
      return true;
    } catch (error) {
      console.error("Error removing bookmark:", error);
      throw error;
    }
  },

  /**
   * Get all bookmarks for a user
   */
  async getUserBookmarks(user_id) {
    try {
      const response = await apiClient.get(`/bookmarks/user/${user_id}`);
      const data = response.data || response;
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error("Error fetching user bookmarks:", error);
      return [];
    }
  },

  /**
   * Check if an event is bookmarked by the user
   */
  async isEventBookmarked(user_id, event_id) {
    try {
      const bookmarks = await this.getUserBookmarks(user_id);
      return bookmarks.find((b) => b.event_id === event_id) || null;
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      return null;
    }
  },

  /**
   * Toggle bookmark status - add if not bookmarked, remove if bookmarked
   */
  async toggleBookmark(user_id, event_id) {
    try {
      const existingBookmark = await this.isEventBookmarked(user_id, event_id);

      if (existingBookmark) {
        // Remove bookmark
        await this.removeBookmark(existingBookmark.id);
        return { isBookmarked: false, bookmarkId: null };
      } else {
        // Tambah bookmark
        const newBookmark = await this.addBookmark(user_id, event_id);
        return {
          isBookmarked: true,
          bookmarkId: newBookmark.id || newBookmark.data?.id,
        };
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw error;
    }
  },

  /**
   * Get all bookmarks (with event details) for a user
   */
  async getBookmarksWithDetails(user_id) {
    try {
      const bookmarks = await this.getUserBookmarks(user_id);
      return bookmarks;
    } catch (error) {
      console.error("Error fetching bookmarks with details:", error);
      return [];
    }
  },
};
