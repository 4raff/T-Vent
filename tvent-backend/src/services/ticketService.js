const ticketRepository = require('../repositories/ticketRepository');


const paymentRepository = require('../repositories/paymentRepository');

class TicketService {
  async getTicketById(id) {
    return ticketRepository.findById(id);
  }

  async createTicket(ticketData) {
    return ticketRepository.create(ticketData);
  }

  async updateTicket(id, updates) {
    return ticketRepository.update(id, updates);
  }

  async deleteTicket(id) {
    return ticketRepository.delete(id);
  }

  async listTickets() {
    return ticketRepository.list();
  }

  // konfirmasiPembayaran: confirm payment for ticket
  async konfirmasiPembayaran(ticketId) {
    await ticketRepository.update(ticketId, { status: 'confirmed' });
    // Optionally, update payment status as well
    const payment = await paymentRepository.findByTicketId(ticketId);
    if (payment) await paymentRepository.update(payment.id, { status: 'success' });
    return this.getTicketById(ticketId);
  }

  // batalkanTiket: cancel ticket
  async batalkanTiket(ticketId) {
    await ticketRepository.update(ticketId, { status: 'cancelled' });
    // Optionally, update payment status as well
    const payment = await paymentRepository.findByTicketId(ticketId);
    if (payment) await paymentRepository.update(payment.id, { status: 'cancelled' });
    return this.getTicketById(ticketId);
  }
}

module.exports = new TicketService();
