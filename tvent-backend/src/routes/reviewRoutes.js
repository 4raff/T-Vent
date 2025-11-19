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
router.get('/:id', validateReviewId, handleValidationErrors, ReviewController.getById);
router.post('/', validateCreateReview, handleValidationErrors, ReviewController.create);
router.put('/:id', validateUpdateReview, handleValidationErrors, ReviewController.update);
router.delete('/:id', validateReviewId, handleValidationErrors, ReviewController.remove);

router.post('/submit', validateCreateReview, handleValidationErrors, ReviewController.submitReview);

module.exports = router;
