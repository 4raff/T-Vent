const bookmarkService = require('../services/bookmarkService');

const BookmarkController = {
  async getAll(req, res) {
    try {
      const bookmarks = await bookmarkService.listAllBookmarks();
      res.json({
        message: 'Bookmarks retrieved successfully',
        data: bookmarks
      });
    } catch (error) {
      console.error('Error in BookmarkController.getAll():', error);
      res.status(500).json({ 
        message: 'Gagal memuat bookmarks',
        error: error.message 
      });
    }
  },
  async getAllByUser(req, res) {
    try {
      const bookmarks = await bookmarkService.listBookmarksByUser(req.params.user_id);
      res.json({
        message: 'User bookmarks retrieved successfully',
        data: bookmarks
      });
    } catch (error) {
      console.error('Error in BookmarkController.getAllByUser():', error);
      res.status(500).json({ 
        message: 'Gagal memuat bookmarks',
        error: error.message 
      });
    }
  },
  async getById(req, res) {
    try {
      const bookmark = await bookmarkService.getBookmarkById(req.params.id);
      if (!bookmark) return res.status(404).json({ message: 'Bookmark not found' });
      res.json({
        message: 'Bookmark retrieved successfully',
        data: bookmark
      });
    } catch (error) {
      console.error('Error in BookmarkController.getById():', error);
      res.status(500).json({ 
        message: 'Gagal memuat bookmark',
        error: error.message 
      });
    }
  },
  async create(req, res) {
    try {
      const bookmark = await bookmarkService.createBookmark(req.body);
      res.status(201).json({
        message: 'Bookmark created successfully',
        data: bookmark
      });
    } catch (error) {
      console.error('Error in BookmarkController.create():', error);
      res.status(500).json({ 
        message: 'Gagal membuat bookmark',
        error: error.message 
      });
    }
  },
  async remove(req, res) {
    try {
      await bookmarkService.deleteBookmark(req.params.id);
      res.json({
        message: 'Bookmark deleted successfully'
      });
    } catch (error) {
      console.error('Error in BookmarkController.remove():', error);
      res.status(500).json({ 
        message: 'Gagal menghapus bookmark',
        error: error.message 
      });
    }
  }
};

module.exports = BookmarkController;
