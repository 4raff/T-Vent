// config/config.js
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'secret-key-super-rahasia',
  jwtExpiresIn: '1h', // Token kedaluwarsa dalam 1 jam
};