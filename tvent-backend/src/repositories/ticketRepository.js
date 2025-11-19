const knex = require('../config/database');

class TicketRepository {
  async findById(id) {
    return knex('tickets').where({ id }).first();
  }

  async create(ticket) {
    // Generate temporary unique kode_tiket untuk avoid duplicate error
    const tempKode = `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    ticket.kode_tiket = tempKode;
    
    // Insert untuk dapat ID
    const [id] = await knex('tickets').insert(ticket);
    
    // Generate kode_tiket dan qr_code yang benar berdasarkan ID
    const paddedId = String(id).padStart(3, '0'); // 8 -> 008
    const year = new Date().getFullYear();
    const kode_tiket = `TKT-${paddedId}-${year}`;
    const qr_code = `qr-tkt-${paddedId}.png`;
    
    // Update dengan kode_tiket dan qr_code yang benar
    await knex('tickets').where({ id }).update({
      kode_tiket: kode_tiket,
      qr_code: qr_code
    });
    
    return this.findById(id);
  }

  async update(id, updates) {
    await knex('tickets').where({ id }).update(updates);
    return this.findById(id);
  }

  async delete(id) {
    return knex('tickets').where({ id }).del();
  }

  async list() {
    return knex('tickets').select('*');
  }
}

module.exports = new TicketRepository();
