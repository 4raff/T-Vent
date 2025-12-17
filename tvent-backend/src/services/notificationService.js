const notificationRepository = require('../repositories/notificationRepository');

class NotificationService {
  async getNotificationById(id) {
    return notificationRepository.findById(id);
  }

  async createNotification(notificationData) {
    return notificationRepository.create(notificationData);
  }

  async listNotificationsByUser(user_id) {
    return notificationRepository.listByUser(user_id);
  }

  async markNotificationAsRead(id) {
    return notificationRepository.markAsRead(id);
  }

  async deleteNotification(id) {
    return notificationRepository.deleteById(id);
  }
}

module.exports = new NotificationService();
