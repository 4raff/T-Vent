const notificationService = require('../services/notificationService');

const NotificationController = {
  async getAllByUser(req, res) {
    const notifications = await notificationService.listNotificationsByUser(req.params.user_id);
    res.json(notifications);
  },
  async getById(req, res) {
    const notification = await notificationService.getNotificationById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  },
  async create(req, res) {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json(notification);
  },
  async markAsRead(req, res) {
    await notificationService.markNotificationAsRead(req.params.id);
    res.status(204).end();
  },
  async delete(req, res) {
    await notificationService.deleteNotification(req.params.id);
    res.status(204).end();
  }
};

module.exports = NotificationController;
