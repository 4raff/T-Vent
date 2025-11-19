const knex = require('../config/database');


class ReviewRepository {
  async findById(id) {
    return knex('reviews').where({ id }).first();
  }

  async create(review) {
    const [id] = await knex('reviews').insert(review);
    return this.findById(id);
  }

  async update(id, updates) {
    await knex('reviews').where({ id }).update(updates);
    return this.findById(id);
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
