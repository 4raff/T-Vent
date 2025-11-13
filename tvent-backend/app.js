const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// app.post('/', (req, res) => {
//   res.send('Hello World!')
// })

// 404 handler - Kalau endpoint tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.url}`,
    availableEndpoints: '/api'
  });
});

// Error handler - Kalau ada error di server
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// EXPORT app agar bisa dipakai di index.js
module.exports = app;

