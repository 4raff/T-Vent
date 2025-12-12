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
    return knex('notifications')
      .where({ user_id })
      .select('*')
      .orderBy('created_at', 'desc');
  }

  async markAsRead(id) {
    return knex('notifications').where({ id }).update({ is_read: true });
  }

  async markMultipleAsRead(userIds) {
    return knex('notifications').whereIn('user_id', userIds).update({ is_read: true });
  }

  async findUnreadByUser(user_id) {
    return knex('notifications')
      .where({ user_id, is_read: false })
      .select('*')
      .orderBy('created_at', 'desc');
  }

  async deleteByType(type) {
    return knex('notifications').where({ type }).delete();
  }

  async findByType(type) {
    return knex('notifications').where({ type }).select('*');
  }
}

module.exports = new NotificationRepository();
