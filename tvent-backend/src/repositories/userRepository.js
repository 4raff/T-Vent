// ============================================
// FILE: src/repositories/userRepository.js
// ============================================

const knex = require('../../knexfile');
const db = require('knex')(knex[process.env.NODE_ENV || 'development']);

class userRepository {
  async findById(id) {
    return db('users').where({ id }).first();
  }

  async findByUsername(username) {
    return db('users').where({ username }).first();
  }

  async findByEmail(email) {
    return db('users').where({ email }).first();
  }

  async create(user) {
    const [id] = await db('users').insert(user);
    return this.findById(id);
  }

  async update(id, updates) {
    await db('users').where({ id }).update(updates);
    return this.findById(id);
  }

  async delete(id) {
    return db('users').where({ id }).del();
  }

  async list() {
    return db('users').select('*');
  }
}

module.exports = new userRepository();