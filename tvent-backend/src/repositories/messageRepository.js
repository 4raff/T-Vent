const knex = require('../config/database');

class MessageRepository {
  async findById(id) {
    return knex('messages').where({ id }).first();
  }

  async create(message) {
    return knex('messages').insert(message).returning('*');
  }

  async listByUser(user_id) {
    return knex('messages').where({ receiver_id: user_id }).orWhere({ sender_id: user_id }).select('*');
  }
}

module.exports = new MessageRepository();
