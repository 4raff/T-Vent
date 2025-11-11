// Example repository for User entity using Knex.js
const knex = require('../config/database');

class UserRepository {
  async findById(id) {
    return knex('users').where({ id }).first();
  }

  async findByUsername(username) {
    return knex('users').where({ username }).first();
  }

  async create(user) {
    return knex('users').insert(user).returning('*');
  }

  async update(id, updates) {
    return knex('users').where({ id }).update(updates).returning('*');
  }

  async delete(id) {
    return knex('users').where({ id }).del();
  }

  async list() {
    return knex('users').select('*');
  }
}

module.exports = new UserRepository();
