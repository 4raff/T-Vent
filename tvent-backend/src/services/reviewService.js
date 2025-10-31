const reviewRepository = require('../repositories/reviewRepository');


class ReviewService {
  async getReviewById(id) {
    return reviewRepository.findById(id);
  }

  async createReview(reviewData) {
    return reviewRepository.create(reviewData);
  }

  async updateReview(id, updates) {
    return reviewRepository.update(id, updates);
  }

  async deleteReview(id) {
    return reviewRepository.delete(id);
  }

  async listReviews() {
    return reviewRepository.list();
  }

  // submitReview: user submits review for event
  async submitReview(user_id, event_id, rating, feedback) {
    // Satu user satu review per event
    const existing = await reviewRepository.findByUserAndEvent(user_id, event_id);
    if (existing) throw new Error('Sudah review event ini');
    return reviewRepository.create({
      user_id,
      event_id,
      rating,
      feedback,
    });
  }
}

module.exports = new ReviewService();
