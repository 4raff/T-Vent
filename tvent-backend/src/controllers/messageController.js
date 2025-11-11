const messageService = require('../services/messageService');

const MessageController = {
  async getAllByUser(req, res) {
    const messages = await messageService.listMessagesByUser(req.params.user_id);
    res.json(messages);
  },
  async getById(req, res) {
    const message = await messageService.getMessageById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  },
  async create(req, res) {
    const message = await messageService.createMessage(req.body);
    res.status(201).json(message);
  }
};

module.exports = MessageController;
