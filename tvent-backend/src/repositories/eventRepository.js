const knex = require('../config/database');


class EventRepository {
  async findById(id) {
    return knex('events').where({ id }).first();
  }

  async create(event) {
    // Set tiket_tersedia sama dengan jumlah_tiket saat pertama kali dibuat
    if (!event.tiket_tersedia && event.jumlah_tiket) {
      event.tiket_tersedia = event.jumlah_tiket;
    }
    
    const [id] = await knex('events').insert(event);
    return this.findById(id);
  }

  async update(id, updates) {
    await knex('events').where({ id }).update(updates);
    return this.findById(id);
  }

  async delete(id) {
    return knex('events').where({ id }).del();
  }

  async list() {
    return knex('events').select('*');
  }

  // Search events by name or description
  async search(query) {
    return knex('events')
      .where('nama', 'like', `%${query}%`)
      .orWhere('deskripsi', 'like', `%${query}%`)
      .select('*');
  }
}

module.exports = new EventRepository();
