const knex = require('../config/database');

class PaymentRepository {
  async findById(id) {
    return knex('payments').where({ id }).first();
  }

  async create(payment) {
    return knex('payments').insert(payment).returning('*');
  }

  async update(id, updates) {
    return knex('payments').where({ id }).update(updates).returning('*');
  }

  async delete(id) {
    return knex('payments').where({ id }).del();
  }

  async list() {
    return knex('payments').select('*');
  }
}

module.exports = new PaymentRepository();
