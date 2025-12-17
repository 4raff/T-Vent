const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');

// Manual trigger untuk testing
router.post('/trigger', reminderController.sendReminders);

module.exports = router;
