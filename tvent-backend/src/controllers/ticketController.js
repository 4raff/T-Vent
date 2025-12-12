
const ticketService = require('../services/ticketService');
const eventService = require('../services/eventService');

const TicketController = {
  async getAll(req, res) {
    try {
      const tickets = await ticketService.listTickets();
      res.json(tickets);
    } catch (error) {
      console.error('Error in TicketController.getAll():', error);
      res.status(500).json({ 
        message: 'Gagal memuat tickets',
        error: error.message 
      });
    }
  },
  async getById(req, res) {
    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  },
  async create(req, res) {
    try {
      const { event_id } = req.body;
      
      // 🔒 Validasi: Event harus approved sebelum booking
      if (!event_id) {
        return res.status(400).json({ 
          message: 'Event ID tidak boleh kosong' 
        });
      }

      const event = await eventService.getEventById(event_id);
      if (!event) {
        return res.status(404).json({ 
          message: 'Event tidak ditemukan' 
        });
      }

      if (event.status !== 'approved') {
        return res.status(403).json({ 
          message: `Event belum dapat di-booking. Status: ${event.status}`,
          currentStatus: event.status
        });
      }

      // 🔒 Validasi: Event belum expired (tanggal masih di masa depan)
      const eventDate = new Date(event.tanggal);
      const now = new Date();
      if (eventDate < now) {
        return res.status(403).json({ 
          message: 'Event sudah terlewat dan tidak dapat di-booking lagi',
          eventDate: event.tanggal
        });
      }

      const ticket = await ticketService.createTicket(req.body);
      res.status(201).json({ 
        message: 'Tiket berhasil dibuat', 
        data: ticket 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Gagal membuat tiket', 
        error: error.message 
      });
    }
  },
  async update(req, res) {
    try {
      const ticket = await ticketService.updateTicket(req.params.id, req.body);
      if (!ticket) {
        return res.status(404).json({ message: 'Tiket tidak ditemukan' });
      }
      res.json({ 
        message: 'Tiket berhasil diperbarui', 
        data: ticket 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Gagal memperbarui tiket', 
        error: error.message 
      });
    }
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
      const { ticketId, cancellation_reason } = req.body;
      
      // 🔒 Validasi: Tiket harus dalam status pending atau confirmed untuk di-cancel
      if (!ticketId) {
        return res.status(400).json({ 
          message: 'Ticket ID tidak boleh kosong' 
        });
      }

      const ticket = await ticketService.getTicketById(ticketId);
      if (!ticket) {
        return res.status(404).json({ 
          message: 'Tiket tidak ditemukan' 
        });
      }

      // Check status sebelum cancel
      if (ticket.status !== 'pending' && ticket.status !== 'confirmed') {
        return res.status(403).json({ 
          message: `Tiket tidak dapat dibatalkan. Status saat ini: ${ticket.status}`,
          currentStatus: ticket.status
        });
      }

      const cancelledTicket = await ticketService.batalkanTiket(ticketId, cancellation_reason);
      res.json({
        message: 'Tiket berhasil dibatalkan',
        data: cancelledTicket
      });
    } catch (e) {
      console.error('Error batalkan tiket:', e);
      res.status(500).json({ 
        message: 'Gagal membatalkan tiket',
        error: e.message 
      });
    }
  }
};

module.exports = TicketController;
