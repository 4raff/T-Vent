const express = require('express');
const router = express.Router();
const EwalletProviderController = require('../controllers/ewalletProviderController');

// Get all active ewallet providers
router.get('/', EwalletProviderController.getAll);

// Get specific ewallet provider
router.get('/:id', EwalletProviderController.getById);

// Create ewallet provider
router.post('/', EwalletProviderController.create);

// Update ewallet provider
router.put('/:id', EwalletProviderController.update);

// Delete ewallet provider
router.delete('/:id', EwalletProviderController.delete);

// Activate ewallet provider
router.post('/:id/activate', EwalletProviderController.activate);

// Deactivate ewallet provider
router.post('/:id/deactivate', EwalletProviderController.deactivate);

module.exports = router;
