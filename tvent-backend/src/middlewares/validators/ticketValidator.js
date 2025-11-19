const { body, param, validationResult } = require('express-validator');

// Validasi untuk booking tiket
const validateBookTicket = [
  body('event_id')
    .notEmpty().withMessage('Event ID tidak boleh kosong')
    .isInt({ min: 1 }).withMessage('Event ID tidak valid'),
  
  body('user_id')
    .notEmpty().withMessage('User ID tidak boleh kosong')
    .isInt({ min: 1 }).withMessage('User ID tidak valid'),
  
  body('jumlah')
    .notEmpty().withMessage('Jumlah tiket tidak boleh kosong')
    .isInt({ min: 1, max: 10 }).withMessage('Jumlah tiket per transaksi maksimal 10 (untuk mencegah scalping)'),
  
  body('total_harga')
    .notEmpty().withMessage('Total harga tidak boleh kosong')
    .isFloat({ min: 0 }).withMessage('Total harga tidak boleh negatif')
];

// Validasi untuk update status tiket
const validateUpdateTicketStatus = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID tiket tidak valid'),
  
  body('status')
    .notEmpty().withMessage('Status tidak boleh kosong')
    .isIn(['pending', 'confirmed', 'cancelled', 'used']).withMessage('Status tidak valid')
];

// Validasi untuk ID parameter
const validateTicketId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID tiket tidak valid')
];

// Middleware untuk handle hasil validasi
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validasi gagal',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateBookTicket,
  validateUpdateTicketStatus,
  validateTicketId,
  handleValidationErrors
};
