// Review model based on migration and class diagram
class Review {
  constructor({ id, event_id, user_id, rating, feedback, created_at, updated_at }) {
    this.id = id;
    this.event_id = event_id;
    this.user_id = user_id;
    this.rating = rating;
    this.feedback = feedback;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Review;