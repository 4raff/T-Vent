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
}

module.exports = new ReviewService();
