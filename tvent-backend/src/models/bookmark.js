// Bookmark model based on migration and class diagram
class Bookmark {
  constructor({ id, user_id, event_id, created_at, updated_at }) {
    this.id = id;
    this.user_id = user_id;
    this.event_id = event_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Bookmark;