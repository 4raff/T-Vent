const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const { 
  validateCreateEvent, 
  validateUpdateEvent, 
  validateEventId,
  handleValidationErrors 
} = require('../middlewares/validators/eventValidator');


router.get('/', EventController.getAll);
router.get('/:id', validateEventId, handleValidationErrors, EventController.getById);
router.post('/', validateCreateEvent, handleValidationErrors, EventController.create);
router.put('/:id', validateUpdateEvent, handleValidationErrors, EventController.update);
router.delete('/:id', validateEventId, handleValidationErrors, EventController.remove);

router.get('/:id/detail', validateEventId, handleValidationErrors, EventController.tampilkanDetail);
router.get('/:id/available-tiket', validateEventId, handleValidationErrors, EventController.availableTiket);

module.exports = router;
