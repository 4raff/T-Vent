const knex = require('../config/database');

class EventRepository {
  async findById(id) {
    return knex('events').where({ id }).first();
  }

  async create(event) {
    return knex('events').insert(event).returning('*');
  }

  async update(id, updates) {
    return knex('events').where({ id }).update(updates).returning('*');
  }

  async delete(id) {
    return knex('events').where({ id }).del();
  }

  async list() {
    return knex('events').select('*');
  }
}

module.exports = new EventRepository();
