const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/ticketController');


router.get('/', TicketController.getAll);
router.get('/:id', TicketController.getById);
router.post('/', TicketController.create);
router.put('/:id', TicketController.update);
router.delete('/:id', TicketController.remove);

router.post('/konfirmasi-pembayaran', TicketController.konfirmasiPembayaran);
router.post('/batalkan-tiket', TicketController.batalkanTiket);

module.exports = router;
