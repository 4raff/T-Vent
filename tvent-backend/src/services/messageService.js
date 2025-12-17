const messageRepository = require('../repositories/messageRepository');

class MessageService {
  async getMessageById(id) {
    return messageRepository.findById(id);
  }

  async createMessage(messageData) {
    return messageRepository.create(messageData);
  }

  async listMessagesByUser(user_id) {
    return messageRepository.listByUser(user_id);
  }

  async getConversations(user_id) {
    return messageRepository.getConversations(user_id);
  }

  async getConversation(user_id, other_user_id) {
    return messageRepository.getConversation(user_id, other_user_id);
  }

  async markAsRead(user_id, other_user_id) {
    return messageRepository.markAsRead(user_id, other_user_id);
  }

  async getUnreadCount(user_id) {
    return messageRepository.getUnreadCount(user_id);
  }
}

module.exports = new MessageService();
