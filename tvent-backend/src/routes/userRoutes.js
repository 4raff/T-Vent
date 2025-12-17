const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const checkAuth = require('../middlewares/checkAuth');
const { 
  validateRegister, 
  validateLogin, 
  handleValidationErrors 
} = require('../middlewares/validators/authValidator');
const { 
  validateUpdateProfile,
  validateChangePassword 
} = require('../middlewares/validators/userValidator');

// Profile routes (require authentication)
router.get('/profile', checkAuth, UserController.getProfile);
router.put('/profile', checkAuth, validateUpdateProfile, handleValidationErrors, UserController.updateProfile);
router.put('/change-password', checkAuth, validateChangePassword, handleValidationErrors, UserController.changePassword);

// List all users (admin)
router.get('/', UserController.list);

// Get user by id
router.get('/:id', UserController.getById);

module.exports = router;
