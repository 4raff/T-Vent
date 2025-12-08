const knex = require('../config/database');

class NotificationRepository {
  async findById(id) {
    return knex('notifications').where({ id }).first();
  }

  async create(notification) {
    const [id] = await knex('notifications').insert(notification);
    return this.findById(id);
  }

  async listByUser(user_id) {
    return knex('notifications').where({ user_id }).select('*');
  }

  async markAsRead(id) {
    return knex('notifications').where({ id }).update({ is_read: true });
  }
}

module.exports = new NotificationRepository();
