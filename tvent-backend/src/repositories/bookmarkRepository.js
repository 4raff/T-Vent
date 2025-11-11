const knex = require('../config/database');

class BookmarkRepository {
  async findById(id) {
    return knex('bookmarks').where({ id }).first();
  }

  async create(bookmark) {
    return knex('bookmarks').insert(bookmark).returning('*');
  }

  async delete(id) {
    return knex('bookmarks').where({ id }).del();
  }

  async listByUser(user_id) {
    return knex('bookmarks').where({ user_id }).select('*');
  }
}

module.exports = new BookmarkRepository();
