const ticketRepository = require('../repositories/ticketRepository');

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
}

module.exports = new TicketService();
