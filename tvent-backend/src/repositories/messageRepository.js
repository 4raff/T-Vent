const knex = require('../config/database');

class MessageRepository {
  async findById(id) {
    return knex('messages').where({ id }).first();
  }

  async create(message) {
    const [id] = await knex('messages').insert(message);
    return this.findById(id);
  }

  async listByUser(user_id) {
    return knex('messages').where({ receiver_id: user_id }).orWhere({ sender_id: user_id }).select('*');
  }
}

module.exports = new MessageRepository();
