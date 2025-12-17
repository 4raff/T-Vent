const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

router.get('/user/:user_id', NotificationController.getAllByUser);
router.get('/:id', NotificationController.getById);
router.post('/', NotificationController.create);
router.patch('/:id/read', NotificationController.markAsRead);
router.delete('/:id', NotificationController.delete);

module.exports = router;
