const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { 
  validateRegister, 
  validateLogin, 
  handleValidationErrors 
} = require('../middlewares/validators/authValidator');
const { 
  validateUpdateProfile,
  validateChangePassword 
} = require('../middlewares/validators/userValidator');

// Profile routes
router.get('/profile', UserController.getProfile);
router.put('/profile', validateUpdateProfile, handleValidationErrors, UserController.updateProfile);

// List all users (admin)
router.get('/', UserController.list);

module.exports = router;
