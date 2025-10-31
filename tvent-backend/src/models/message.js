// Message model based on migration and class diagram
class Message {
  constructor({ id, sender_id, receiver_id, content, is_read, created_at, updated_at }) {
    this.id = id;
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.content = content;
    this.is_read = is_read;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Message;