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
  },

  async getConversations(req, res) {
    const { user_id } = req.params;
    const conversations = await messageService.getConversations(user_id);
    res.json(conversations);
  },

  async getConversation(req, res) {
    const { user_id, other_user_id } = req.params;
    const messages = await messageService.getConversation(user_id, other_user_id);
    res.json(messages);
  },

  async markAsRead(req, res) {
    const { user_id, other_user_id } = req.params;
    await messageService.markAsRead(user_id, other_user_id);
    res.status(204).end();
  },

  async getUnreadCount(req, res) {
    const { user_id } = req.params;
    const count = await messageService.getUnreadCount(user_id);
    res.json({ unread_count: count });
  }
};

module.exports = MessageController;
