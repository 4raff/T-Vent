
const eventService = require('../services/eventService');

const EventController = {
  async getAll(req, res) {
    const events = await eventService.listEvents();
    res.json(events);
  },
  async getById(req, res) {
    const event = await eventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  },
  async create(req, res) {
    const event = await eventService.createEvent(req.body);
    res.status(201).json(event);
  },
  async update(req, res) {
    const event = await eventService.updateEvent(req.params.id, req.body);
    res.json(event);
  },
  async remove(req, res) {
    await eventService.deleteEvent(req.params.id);
    res.status(204).end();
  },

  async tampilkanDetail(req, res) {
    try {
      const event = await eventService.tampilkanDetail(req.params.id);
      res.json(event);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  async availableTiket(req, res) {
    try {
      const available = await eventService.availableTiket(req.params.id);
      res.json({ available });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
};

module.exports = EventController;
