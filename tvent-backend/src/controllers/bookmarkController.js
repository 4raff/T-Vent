const bookmarkService = require('../services/bookmarkService');

const BookmarkController = {
  async getAllByUser(req, res) {
    const bookmarks = await bookmarkService.listBookmarksByUser(req.params.user_id);
    res.json(bookmarks);
  },
  async getById(req, res) {
    const bookmark = await bookmarkService.getBookmarkById(req.params.id);
    if (!bookmark) return res.status(404).json({ message: 'Bookmark not found' });
    res.json(bookmark);
  },
  async create(req, res) {
    const bookmark = await bookmarkService.createBookmark(req.body);
    res.status(201).json(bookmark);
  },
  async remove(req, res) {
    await bookmarkService.deleteBookmark(req.params.id);
    res.status(204).end();
  }
};

module.exports = BookmarkController;
