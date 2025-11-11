const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

router.post('/add-event', AdminController.addEvent);
router.put('/edit-event', AdminController.editEvent);
router.post('/confirm-event', AdminController.confirmEvent);
router.post('/cancel-event', AdminController.cancelEvent);

module.exports = router;
