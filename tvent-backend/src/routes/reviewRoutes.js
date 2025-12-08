const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { 
  validateCreateReview, 
  validateUpdateReview, 
  validateReviewId,
  handleValidationErrors 
} = require('../middlewares/validators/reviewValidator');


router.get('/', ReviewController.getAll);
router.post('/submit', validateCreateReview, handleValidationErrors, ReviewController.submitReview);
router.get('/:id', validateReviewId, handleValidationErrors, ReviewController.getById);
router.post('/', validateCreateReview, handleValidationErrors, ReviewController.create);
router.put('/:id', validateUpdateReview, handleValidationErrors, ReviewController.update);
router.delete('/:id', validateReviewId, handleValidationErrors, ReviewController.remove);

module.exports = router;
