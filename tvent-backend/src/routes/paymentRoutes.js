const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');


router.get('/', PaymentController.getAll);
router.get('/:id', PaymentController.getById);
router.post('/', PaymentController.create);
router.put('/:id', PaymentController.update);
router.delete('/:id', PaymentController.remove);

router.post('/proses', PaymentController.prosesPembayaran);
router.post('/tolak', PaymentController.tolakPembayaran);
router.post('/terima', PaymentController.terimaPembayaran);
router.get('/total', PaymentController.totalPembayaran);

module.exports = router;
