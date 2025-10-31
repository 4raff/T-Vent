const knex = require('../config/database');

class TicketRepository {
  async findById(id) {
    return knex('tickets').where({ id }).first();
  }

  async create(ticket) {
    return knex('tickets').insert(ticket).returning('*');
  }

  async update(id, updates) {
    return knex('tickets').where({ id }).update(updates).returning('*');
  }

  async delete(id) {
    return knex('tickets').where({ id }).del();
  }

  async list() {
    return knex('tickets').select('*');
  }
}

module.exports = new TicketRepository();
