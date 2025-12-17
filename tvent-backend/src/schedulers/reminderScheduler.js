const cron = require('node-cron');
const reminderService = require('../services/reminderService');

// Schedule reminder job to run every day at 8:00 AM
const startReminderScheduler = () => {
  console.log('⏰ Starting reminder scheduler...');
  
  // Run every day at 08:00 AM (0 8 * * *)
  cron.schedule('0 8 * * *', async () => {
    console.log('\n========================================');
    console.log('🔔 Running scheduled reminder job...');
    console.log('========================================\n');
    
    try {
      const result = await reminderService.sendEventReminderNotifications();
      console.log('✅ Reminder job completed:', result);
    } catch (error) {
      console.error('❌ Error running reminder job:', error);
    }
  });
  
  console.log('✅ Reminder scheduler started - runs daily at 08:00 AM');
};

module.exports = { startReminderScheduler };
