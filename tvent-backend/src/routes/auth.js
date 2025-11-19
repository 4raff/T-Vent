// FILE: src/routes/auth.js
const express = require('express');
const router = express.Router();

console.log("🔥 FILE AUTH.JS SEDANG DIBACA!"); // Log baris pertama

// Controller kita matikan dulu untuk tes isolasi
// const authController = require('../controllers/authController');

router.get('/ping', (req, res) => {
    res.json({ message: "Pong! Auth route working." });
});

// router.post('/register', authController.register);
// router.post('/login', authController.login);

module.exports = router;