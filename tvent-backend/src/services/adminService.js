// AdminService.js
const eventRepository = require('../repositories/eventRepository');

class AdminService {
  // addEvent: admin creates event
  async addEvent(adminId, eventData) {
    return eventRepository.create({ ...eventData, created_by: adminId, status: 'pending' });
  }

  // editEvent: admin edits event
  async editEvent(eventId, updates) {
    return eventRepository.update(eventId, updates);
  }

  // confirmEvent: admin confirms event
  async confirmEvent(eventId) {
    return eventRepository.update(eventId, { status: 'approved' });
  }

  // cancelEvent: admin cancels event
  async cancelEvent(eventId) {
    return eventRepository.update(eventId, { status: 'cancelled' });
  }

  // rejectEvent: admin rejects event
  async rejectEvent(eventId) {
    return eventRepository.update(eventId, { status: 'rejected' });
  }
}

module.exports = new AdminService();
