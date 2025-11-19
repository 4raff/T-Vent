// FILE: src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  validateRegister, 
  validateLogin, 
  handleValidationErrors 
} = require('../middlewares/validators/authValidator');

// Cek apakah Controller berhasil dimuat?
if (!authController) {
  console.error("❌ FATAL ERROR: authController gagal di-load di authRoutes.js");
} else {
  console.log("✅ authController berhasil di-load:", authController);
}

// Definisi Route dengan Validasi
// Kita pastikan controllernya ada sebelum memasangnya
if (authController && authController.register) {
    router.post('/register', validateRegister, handleValidationErrors, authController.register);
} else {
    console.error("❌ Method 'register' tidak ditemukan di authController");
}

if (authController && authController.login) {
    router.post('/login', validateLogin, handleValidationErrors, authController.login);
} else {
    console.error("❌ Method 'login' tidak ditemukan di authController");
}

// EKSPOR ROUTER (Ini yang paling penting!)
module.exports = router;