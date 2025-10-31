const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');


router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.remove);

// Cari event (search events)
router.get('/search/events', UserController.cariEvent);

// Pilih event (select event for user)
router.post('/select/event', UserController.pilihEvent);

module.exports = router;
