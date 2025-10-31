
const ticketService = require('../services/ticketService');

const TicketController = {
  async getAll(req, res) {
    const tickets = await ticketService.listTickets();
    res.json(tickets);
  },
  async getById(req, res) {
    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  },
  async create(req, res) {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
  },
  async update(req, res) {
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    res.json(ticket);
  },
  async remove(req, res) {
    await ticketService.deleteTicket(req.params.id);
    res.status(204).end();
  },

  async konfirmasiPembayaran(req, res) {
    try {
      const { ticketId } = req.body;
      const ticket = await ticketService.konfirmasiPembayaran(ticketId);
      res.json(ticket);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  async batalkanTiket(req, res) {
    try {
      const { ticketId } = req.body;
      const ticket = await ticketService.batalkanTiket(ticketId);
      res.json(ticket);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
};

module.exports = TicketController;
