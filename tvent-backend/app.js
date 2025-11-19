const express = require('express')
const cors = require('cors');
const app = express()
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

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
// EXPORT app agar bisa dipakai di index.js
module.exports = app;

