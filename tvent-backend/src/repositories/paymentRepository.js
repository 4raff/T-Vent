const knex = require('../config/database');


class PaymentRepository {
  async findById(id) {
    return knex('payments').where({ id }).first();
  }

  async create(payment) {
    // Generate temporary kode_pembayaran untuk avoid duplicate
    const tempKode = `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    payment.kode_pembayaran = tempKode;
    
    // Insert untuk dapat ID
    const [id] = await knex('payments').insert(payment);
    
    // Generate kode_pembayaran berdasarkan ID (format: PAY-006-ABC123)
    const paddedId = String(id).padStart(3, '0'); // 6 -> 006
    const randomSuffix = Math.random().toString(36).substr(2, 6).toUpperCase(); // ABC123
    const kode_pembayaran = `PAY-${paddedId}-${randomSuffix}`;
    
    // Update dengan kode_pembayaran yang benar
    await knex('payments').where({ id }).update({
      kode_pembayaran: kode_pembayaran
    });
    
    return this.findById(id);
  }

  async update(id, updates) {
    await knex('payments').where({ id }).update(updates);
    return this.findById(id);
  }

  async delete(id) {
    return knex('payments').where({ id }).del();
  }

  async list() {
    return knex('payments').select('*');
  }

  async findByTicketId(ticket_id) {
    return knex('payments').where({ ticket_id }).first();
  }
}

module.exports = new PaymentRepository();
