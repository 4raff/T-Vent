const bookmarkRepository = require('../repositories/bookmarkRepository');

class BookmarkService {
  async getBookmarkById(id) {
    return bookmarkRepository.findById(id);
  }

  async createBookmark(bookmarkData) {
    return bookmarkRepository.create(bookmarkData);
  }

  async deleteBookmark(id) {
    return bookmarkRepository.delete(id);
  }

  async listBookmarksByUser(user_id) {
    return bookmarkRepository.listByUser(user_id);
  }

  async listAllBookmarks() {
    return bookmarkRepository.listAll();
  }
}

module.exports = new BookmarkService();
