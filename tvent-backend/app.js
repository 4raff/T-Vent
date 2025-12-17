const express = require('express')
const cors = require('cors');
const cron = require('node-cron');
const app = express()
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const userRoutes = require('./src/routes/userRoutes');
const bookmarkRoutes = require('./src/routes/bookmarkRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const mahasiswaRoutes = require('./src/routes/mahasiswaRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const bankAccountRoutes = require('./src/routes/bankAccountRoutes');
const ewalletProviderRoutes = require('./src/routes/ewalletProviderRoutes');
const reminderRoutes = require('./src/routes/reminderRoutes');
const StatsController = require('./src/controllers/statsController');
const reminderService = require('./src/services/reminderService');

// middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Register all routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/ewallet-providers', ewalletProviderRoutes);
app.use('/api/reminders', reminderRoutes);

// Stats endpoint
app.get('/api/stats/dashboard', StatsController.getDashboardStats);

// 🚀 START REMINDER JOB - Jalankan setiap hari pukul 08:00 untuk kirim reminder 1 hari sebelumnya
// Cron expression: '0 8 * * *' = setiap hari jam 08:00
cron.schedule('0 8 * * *', async () => {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🔔 REMINDER JOB TRIGGERED - Checking events for tomorrow...');
  console.log('═══════════════════════════════════════════════════════════════');
  try {
    const result = await reminderService.sendEventReminderNotifications();
    console.log(`✅ Reminder job completed: ${result.message || result.remindersSent + ' reminders sent'}`);
  } catch (error) {
    console.error('❌ Error in reminder job:', error);
  }
  console.log('═══════════════════════════════════════════════════════════════\n');
});

console.log('⏰ Reminder job scheduled: Every day at 08:00 AM');

app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Tvent API Server is running!',
    version: '1.0.0',
    documentation: '/api'
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Tvent API Documentation',
    baseURL: 'http://localhost:3000',
    endpoints: {
      users: '/api/users',
      events: '/api/events',
      tickets: '/api/tickets',
      payments: '/api/payments',
      reviews: '/api/reviews',
      bookmarks: '/api/bookmarks',
      messages: '/api/messages',
      notifications: '/api/notifications',
      mahasiswa: '/api/mahasiswa',
      admin: '/api/admin'
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di port ${PORT}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}`);
});

module.exports = app;

