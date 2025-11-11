const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');


router.get('/', ReviewController.getAll);
router.get('/:id', ReviewController.getById);
router.post('/', ReviewController.create);
router.put('/:id', ReviewController.update);
router.delete('/:id', ReviewController.remove);

router.post('/submit', ReviewController.submitReview);

module.exports = router;
