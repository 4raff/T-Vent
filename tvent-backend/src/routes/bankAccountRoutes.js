const express = require('express');
const router = express.Router();
const BankAccountController = require('../controllers/bankAccountController');

// Get all active bank accounts
router.get('/', BankAccountController.getAll);

// Get specific bank account
router.get('/:id', BankAccountController.getById);

// Create bank account
router.post('/', BankAccountController.create);

// Update bank account
router.put('/:id', BankAccountController.update);

// Delete bank account
router.delete('/:id', BankAccountController.delete);

// Activate bank account
router.post('/:id/activate', BankAccountController.activate);

// Deactivate bank account
router.post('/:id/deactivate', BankAccountController.deactivate);

module.exports = router;
