
const reviewService = require('../services/reviewService');

const ReviewController = {
  async getAll(req, res) {
    const reviews = await reviewService.listReviews();
    res.json(reviews);
  },
  async getById(req, res) {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  },
  async create(req, res) {
    const review = await reviewService.createReview(req.body);
    res.status(201).json(review);
  },
  async update(req, res) {
    const review = await reviewService.updateReview(req.params.id, req.body);
    res.json(review);
  },
  async remove(req, res) {
    await reviewService.deleteReview(req.params.id);
    res.status(204).end();
  },

  async submitReview(req, res) {
    try {
      const { user_id, event_id, rating, feedback } = req.body;
      const review = await reviewService.submitReview(user_id, event_id, rating, feedback);
      res.status(201).json(review);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
};

module.exports = ReviewController;
