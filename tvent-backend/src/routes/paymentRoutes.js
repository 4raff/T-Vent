const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { 
  validateCreatePayment, 
  validateUpdatePaymentStatus, 
  validatePaymentId,
  validatePaymentApproval,
  handleValidationErrors 
} = require('../middlewares/validators/paymentValidator');


router.get('/', PaymentController.getAll);
router.get('/total', PaymentController.totalPembayaran); // ← Harus sebelum /:id
router.get('/:id', validatePaymentId, handleValidationErrors, PaymentController.getById);
router.post('/', validateCreatePayment, handleValidationErrors, PaymentController.create);
router.put('/:id', validateUpdatePaymentStatus, handleValidationErrors, PaymentController.update);
router.delete('/:id', validatePaymentId, handleValidationErrors, PaymentController.remove);

// Payment approval routes with validation
router.post('/proses', validatePaymentApproval, handleValidationErrors, PaymentController.prosesPembayaran);
router.post('/tolak', validatePaymentApproval, handleValidationErrors, PaymentController.tolakPembayaran);
router.post('/terima', validatePaymentApproval, handleValidationErrors, PaymentController.terimaPembayaran);

module.exports = router;
