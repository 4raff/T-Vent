const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Authentication routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Profile routes
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);

// List all users (admin)
router.get('/', UserController.list);

module.exports = router;
