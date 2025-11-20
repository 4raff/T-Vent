const adminService = require('../services/adminService');

const AdminController = {
  async approveEvent(req, res) {
    try {
      const eventId = req.params.id;
      const event = await adminService.approveEvent(eventId);
      res.json({ 
        message: 'Event berhasil di-approve', 
        data: event 
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  
  async rejectEvent(req, res) {
    try {
      const eventId = req.params.id;
      const event = await adminService.rejectEvent(eventId);
      res.json({ 
        message: 'Event berhasil di-reject', 
        data: event 
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  
  async cancelEvent(req, res) {
    try {
      const eventId = req.params.id;
      const event = await adminService.cancelEvent(eventId);
      res.json({ 
        message: 'Event berhasil dibatalkan', 
        data: event 
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  
  async completeEvent(req, res) {
    try {
      const eventId = req.params.id;
      const event = await adminService.completeEvent(eventId);
      res.json({ 
        message: 'Event berhasil diselesaikan', 
        data: event 
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
};

module.exports = AdminController;
