const knex = require('../config/database');

class EwalletProviderRepository {
  async findById(id) {
    return knex('ewallet_providers').where({ id }).first();
  }

  async findAll(activeOnly = true) {
    const query = knex('ewallet_providers');
    if (activeOnly) {
      query.where({ is_active: true });
    }
    return query.orderBy('name');
  }

  async create(data) {
    const [id] = await knex('ewallet_providers').insert(data);
    return this.findById(id);
  }

  async update(id, data) {
    await knex('ewallet_providers').where({ id }).update(data);
    return this.findById(id);
  }

  async delete(id) {
    return knex('ewallet_providers').where({ id }).del();
  }

  async activate(id) {
    return this.update(id, { is_active: true });
  }

  async deactivate(id) {
    return this.update(id, { is_active: false });
  }
}

module.exports = new EwalletProviderRepository();
