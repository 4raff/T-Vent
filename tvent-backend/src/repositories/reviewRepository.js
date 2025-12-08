const knex = require('../config/database');


class ReviewRepository {
  async findById(id) {
    return knex('reviews')
      .leftJoin('users', 'reviews.user_id', 'users.id')
      .select(
        'reviews.id',
        'reviews.event_id',
        'reviews.user_id',
        'reviews.rating',
        'reviews.feedback',
        'reviews.created_at',
        'reviews.updated_at',
        knex.raw('COALESCE(reviews.is_anonymous, 0) as is_anonymous'),
        'users.username',
        'users.email'
      )
      .where({ 'reviews.id': id })
      .first();
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
    return knex('reviews')
      .leftJoin('users', 'reviews.user_id', 'users.id')
      .select(
        'reviews.id',
        'reviews.event_id',
        'reviews.user_id',
        'reviews.rating',
        'reviews.feedback',
        'reviews.created_at',
        'reviews.updated_at',
        knex.raw('COALESCE(reviews.is_anonymous, 0) as is_anonymous'),
        'users.username',
        'users.email'
      )
      .orderBy('reviews.created_at', 'desc');
  }

  async findByUserAndEvent(user_id, event_id) {
    return knex('reviews')
      .leftJoin('users', 'reviews.user_id', 'users.id')
      .select(
        'reviews.id',
        'reviews.event_id',
        'reviews.user_id',
        'reviews.rating',
        'reviews.feedback',
        'reviews.created_at',
        'reviews.updated_at',
        knex.raw('COALESCE(reviews.is_anonymous, 0) as is_anonymous'),
        'users.username',
        'users.email'
      )
      .where({ 'reviews.user_id': user_id, 'reviews.event_id': event_id })
      .first();
  }
}

module.exports = new ReviewRepository();
