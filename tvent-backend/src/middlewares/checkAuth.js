// src/middlewares/checkAuth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  try {
    // Ambil token dari header: "Bearer <token>"
    const token = req.headers.authorization.split(' ')[1];
    
    // Verifikasi token
    const decodedToken = jwt.verify(token, config.jwtSecret);
    
    // Simpan data user ke 'req' untuk digunakan di controller lain
    req.userData = decodedToken; 
    
    next(); // Lanjutkan ke rute
  } catch (error) {
    return res.status(401).json({
      message: 'Autentikasi gagal. Silakan login.',
    });
  }
};