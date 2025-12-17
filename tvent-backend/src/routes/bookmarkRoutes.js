const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmarkController');

router.get('/', BookmarkController.getAll);
router.get('/user/:user_id', BookmarkController.getAllByUser);
router.get('/:id', BookmarkController.getById);
router.post('/', BookmarkController.create);
router.delete('/:id', BookmarkController.remove);

module.exports = router;
