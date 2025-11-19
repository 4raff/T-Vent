// src/middlewares/checkAuth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Autentikasi gagal. Format token tidak valid (Harus: Bearer <token>).',
    });
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.jwtSecret);
    req.userData = decodedToken; 
    
    next(); 
  } catch (error) {
    return res.status(401).json({
      message: 'Autentikasi gagal. Silakan login.',
    });
  }
};