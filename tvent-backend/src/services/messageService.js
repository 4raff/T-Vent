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
}

module.exports = new MessageService();
