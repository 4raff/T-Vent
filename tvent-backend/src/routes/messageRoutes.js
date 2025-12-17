const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');

// Get all messages for user (legacy)
router.get('/user/:user_id', MessageController.getAllByUser);

// Get conversations list for a user
router.get('/:user_id/conversations', MessageController.getConversations);

// Get unread count
router.get('/:user_id/unread', MessageController.getUnreadCount);

// Get conversation between two users
router.get('/:user_id/conversation/:other_user_id', MessageController.getConversation);

// Mark conversation as read
router.patch('/:user_id/conversation/:other_user_id/read', MessageController.markAsRead);

// Get single message
router.get('/:id', MessageController.getById);

// Create new message
router.post('/', MessageController.create);

module.exports = router;
