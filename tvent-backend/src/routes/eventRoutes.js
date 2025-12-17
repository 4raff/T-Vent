const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const checkAuth = require('../middlewares/checkAuth');
const { 
  validateCreateEvent, 
  validateUpdateEvent, 
  validateEventId,
  handleValidationErrors 
} = require('../middlewares/validators/eventValidator');


router.get('/', EventController.getAll);
router.get('/admin/all', checkAuth, EventController.getAllForAdmin);
router.get('/my-events', checkAuth, EventController.getMyEvents);
router.get('/categories', EventController.getCategories);
router.get('/featured/most-purchased', EventController.getMostPurchasedEvents);
router.get('/featured/single', EventController.getFeaturedEvent);
router.get('/:id', validateEventId, handleValidationErrors, EventController.getById);
router.post('/',checkAuth, validateCreateEvent, handleValidationErrors, EventController.create);
router.put('/:id',checkAuth, validateUpdateEvent, handleValidationErrors, EventController.update);
router.delete('/:id',checkAuth, validateEventId, handleValidationErrors, EventController.remove);

router.get('/:id/detail', validateEventId, handleValidationErrors, EventController.tampilkanDetail);
router.get('/:id/available-tiket', validateEventId, handleValidationErrors, EventController.availableTiket);

module.exports = router;
