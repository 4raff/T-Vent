const knex = require('../config/database');

class BankAccountRepository {
  async findById(id) {
    return knex('bank_accounts').where({ id }).first();
  }

  async findAll(activeOnly = true) {
    const query = knex('bank_accounts');
    if (activeOnly) {
      query.where({ is_active: true });
    }
    return query.orderBy('bank_name');
  }

  async create(data) {
    const [id] = await knex('bank_accounts').insert(data);
    return this.findById(id);
  }

  async update(id, data) {
    await knex('bank_accounts').where({ id }).update(data);
    return this.findById(id);
  }

  async delete(id) {
    return knex('bank_accounts').where({ id }).del();
  }

  async activate(id) {
    return this.update(id, { is_active: true });
  }

  async deactivate(id) {
    return this.update(id, { is_active: false });
  }
}

module.exports = new BankAccountRepository();
