const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

// Admin Dashboard Statistics
router.get('/stats', AdminController.getStats);

// Event Status Management (Admin Only)
router.put('/approve-event/:id', AdminController.approveEvent);
router.put('/reject-event/:id', AdminController.rejectEvent);
router.put('/cancel-event/:id', AdminController.cancelEvent);
router.put('/complete-event/:id', AdminController.completeEvent);

module.exports = router;
