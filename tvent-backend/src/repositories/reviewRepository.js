const knex = require('../config/database');


class ReviewRepository {
  async findById(id) {
    return knex('reviews').where({ id }).first();
  }

  async create(review) {
    return knex('reviews').insert(review).returning('*');
  }

  async update(id, updates) {
    return knex('reviews').where({ id }).update(updates).returning('*');
  }

  async delete(id) {
    return knex('reviews').where({ id }).del();
  }

  async list() {
    return knex('reviews').select('*');
  }

  async findByUserAndEvent(user_id, event_id) {
    return knex('reviews').where({ user_id, event_id }).first();
  }
}

module.exports = new ReviewRepository();
