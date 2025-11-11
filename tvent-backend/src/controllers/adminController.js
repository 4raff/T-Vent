const adminService = require('../services/adminService');

const AdminController = {
  async addEvent(req, res) {
    try {
      const { adminId, ...eventData } = req.body;
      const event = await adminService.addEvent(adminId, eventData);
      res.status(201).json(event);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async editEvent(req, res) {
    try {
      const { eventId, updates } = req.body;
      const event = await adminService.editEvent(eventId, updates);
      res.json(event);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async confirmEvent(req, res) {
    try {
      const { eventId } = req.body;
      const event = await adminService.confirmEvent(eventId);
      res.json(event);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async cancelEvent(req, res) {
    try {
      const { eventId } = req.body;
      const event = await adminService.cancelEvent(eventId);
      res.json(event);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
};

module.exports = AdminController;
