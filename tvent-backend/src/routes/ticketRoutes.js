const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/ticketController');
const { 
  validateBookTicket, 
  validateUpdateTicketStatus, 
  validateTicketId,
  handleValidationErrors 
} = require('../middlewares/validators/ticketValidator');


router.get('/', TicketController.getAll);
router.get('/:id', validateTicketId, handleValidationErrors, TicketController.getById);
router.post('/', validateBookTicket, handleValidationErrors, TicketController.create);
router.put('/:id', validateUpdateTicketStatus, handleValidationErrors, TicketController.update);
router.delete('/:id', validateTicketId, handleValidationErrors, TicketController.remove);

router.post('/konfirmasi-pembayaran', TicketController.konfirmasiPembayaran);
router.post('/batalkan-tiket', TicketController.batalkanTiket);

module.exports = router;
