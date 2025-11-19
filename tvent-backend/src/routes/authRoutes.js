// FILE: src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
    validateRegister, 
    validateLogin, 
    handleValidationErrors 
} = require('../middlewares/validators/authValidator');

router.post(
    '/register', 
    validateRegister,          
    handleValidationErrors,   
    authController.register   
);

router.post(
    '/login', 
    validateLogin,             
    handleValidationErrors,    
    authController.login       
);

module.exports = router;