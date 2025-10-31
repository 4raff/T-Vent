const eventRepository = require('../repositories/eventRepository');

class EventService {
  async getEventById(id) {
    return eventRepository.findById(id);
  }

  async createEvent(eventData) {
    return eventRepository.create(eventData);
  }

  async updateEvent(id, updates) {
    return eventRepository.update(id, updates);
  }

  async deleteEvent(id) {
    return eventRepository.delete(id);
  }

  async listEvents() {
    return eventRepository.list();
  }
}

module.exports = new EventService();
