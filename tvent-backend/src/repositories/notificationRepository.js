const knex = require('../config/database');

class NotificationRepository {
  async findById(id) {
    return knex('notifications').where({ id }).first();
  }

  async create(notification) {
    return knex('notifications').insert(notification).returning('*');
  }

  async listByUser(user_id) {
    return knex('notifications').where({ user_id }).select('*');
  }

  async markAsRead(id) {
    return knex('notifications').where({ id }).update({ is_read: true });
  }
}

module.exports = new NotificationRepository();
