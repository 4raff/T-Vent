const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { 
  validateCreatePayment, 
  validateUpdatePaymentStatus, 
  validatePaymentId,
  handleValidationErrors 
} = require('../middlewares/validators/paymentValidator');


router.get('/', PaymentController.getAll);
router.get('/:id', validatePaymentId, handleValidationErrors, PaymentController.getById);
router.post('/', validateCreatePayment, handleValidationErrors, PaymentController.create);
router.put('/:id', validateUpdatePaymentStatus, handleValidationErrors, PaymentController.update);
router.delete('/:id', validatePaymentId, handleValidationErrors, PaymentController.remove);

router.post('/proses', PaymentController.prosesPembayaran);
router.post('/tolak', PaymentController.tolakPembayaran);
router.post('/terima', PaymentController.terimaPembayaran);
router.get('/total', PaymentController.totalPembayaran);

module.exports = router;
