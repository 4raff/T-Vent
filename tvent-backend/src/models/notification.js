// Notification model based on migration and class diagram
class Notification {
  constructor({ id, user_id, title, message, type, is_read, created_at, updated_at }) {
    this.id = id;
    this.user_id = user_id;
    this.title = title;
    this.message = message;
    this.type = type;
    this.is_read = is_read;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Notification;