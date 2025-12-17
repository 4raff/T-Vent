const reminderService = require('../services/reminderService');

const ReminderController = {
  // Manual trigger untuk testing reminder notifications
  async sendReminders(req, res) {
    try {
      const result = await reminderService.sendEventReminderNotifications();
      res.json({
        message: 'Reminder job executed',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        message: 'Gagal menjalankan reminder job',
        error: error.message
      });
    }
  }
};

module.exports = ReminderController;
