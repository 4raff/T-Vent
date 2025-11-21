const { body, param, validationResult } = require('express-validator');

// Validasi untuk membuat payment
const validateCreatePayment = [
  body('ticket_id')
    .notEmpty().withMessage('Ticket ID tidak boleh kosong')
    .isInt({ min: 1 }).withMessage('Ticket ID tidak valid'),
  
  body('user_id')
    .notEmpty().withMessage('User ID tidak boleh kosong')
    .isInt({ min: 1 }).withMessage('User ID tidak valid'),
  
  body('jumlah')
    .notEmpty().withMessage('Jumlah pembayaran tidak boleh kosong')
    .isFloat({ min: 0 }).withMessage('Jumlah pembayaran tidak valid'),
  
  body('metode_pembayaran')
    .trim()
    .notEmpty().withMessage('Metode pembayaran tidak boleh kosong')
    .isIn(['credit_card', 'bank_transfer', 'e-wallet', 'qris']).withMessage('Metode pembayaran tidak valid')
];

// Validasi untuk update status payment
const validateUpdatePaymentStatus = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID pembayaran tidak valid'),
  
  body('status')
    .notEmpty().withMessage('Status tidak boleh kosong')
    .isIn(['pending', 'success', 'failed', 'cancelled']).withMessage('Status tidak valid')
];

// Validasi untuk ID parameter
const validatePaymentId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID pembayaran tidak valid')
];

// Validasi untuk payment approval (terima/tolak/proses)
const validatePaymentApproval = [
  body('id')
    .notEmpty().withMessage('ID pembayaran tidak boleh kosong')
    .isInt({ min: 1 }).withMessage('ID pembayaran tidak valid')
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
  validateCreatePayment,
  validateUpdatePaymentStatus,
  validatePaymentId,
  validatePaymentApproval,
  handleValidationErrors
};
