const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');

router.get('/user/:user_id', MessageController.getAllByUser);
router.get('/:id', MessageController.getById);
router.post('/', MessageController.create);

module.exports = router;
