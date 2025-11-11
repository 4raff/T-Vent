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

  // tampilkanDetail: get event detail with related info
  async tampilkanDetail(id) {
    const event = await eventRepository.findById(id);
    // Optionally, fetch related tickets, reviews, etc.
    return event;
  }

  // availableTiket: get available ticket count for event
  async availableTiket(id) {
    const event = await eventRepository.findById(id);
    return event ? event.tiket_tersedia : 0;
  }
}

module.exports = new EventService();
