const knex = require('../config/database');


class PaymentRepository {
  async findById(id) {
    // Join with users, tickets, and events to get full information
    return knex('payments')
      .leftJoin('tickets', 'payments.ticket_id', 'tickets.id')
      .leftJoin('users', 'payments.user_id', 'users.id')
      .leftJoin('events', 'tickets.event_id', 'events.id')
      .where('payments.id', id)
      .select(
        'payments.*',
        'users.username as user_name',
        'users.email as user_email',
        'users.no_handphone as user_phone',
        'tickets.kode_tiket',
        'tickets.jumlah as quantity',
        'events.nama as event_name'
      )
      .first();
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
    // Join with users, tickets, and events for list view
    return knex('payments')
      .leftJoin('tickets', 'payments.ticket_id', 'tickets.id')
      .leftJoin('users', 'payments.user_id', 'users.id')
      .leftJoin('events', 'tickets.event_id', 'events.id')
      .select(
        'payments.id',
        'payments.ticket_id',
        'payments.jumlah',
        'payments.status',
        'payments.metode_pembayaran',
        'payments.rejection_reason',
        'payments.created_at',
        'payments.bukti_pembayaran',
        'users.username as user_name',
        'users.email as user_email',
        'users.no_handphone as user_phone',
        'tickets.kode_tiket',
        'tickets.jumlah as quantity',
        'events.nama as event_name'
      );
  }

  async findByTicketId(ticket_id) {
    return knex('payments')
      .leftJoin('tickets', 'payments.ticket_id', 'tickets.id')
      .leftJoin('users', 'payments.user_id', 'users.id')
      .leftJoin('events', 'tickets.event_id', 'events.id')
      .where('payments.ticket_id', ticket_id)
      .select(
        'payments.*',
        'users.username as user_name',
        'users.email as user_email',
        'users.no_handphone as user_phone',
        'tickets.kode_tiket',
        'tickets.jumlah as quantity',
        'events.nama as event_name'
      )
      .first();
  }
}

module.exports = new PaymentRepository();
