const { body, param, validationResult } = require('express-validator');

// Validasi untuk membuat review
const validateCreateReview = [
  body('event_id')
    .notEmpty().withMessage('Event ID tidak boleh kosong')
    .isInt({ min: 1 }).withMessage('Event ID tidak valid'),
  
  body('user_id')
    .notEmpty().withMessage('User ID tidak boleh kosong')
    .isInt({ min: 1 }).withMessage('User ID tidak valid'),
  
  body('rating')
    .notEmpty().withMessage('Rating tidak boleh kosong')
    .isInt({ min: 1, max: 5 }).withMessage('Rating harus antara 1-5'),
  
  body('feedback')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Feedback harus antara 10-1000 karakter')
];

// Validasi untuk update review
const validateUpdateReview = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID review tidak valid'),
  
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating harus antara 1-5'),
  
  body('feedback')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Feedback harus antara 10-1000 karakter')
];

// Validasi untuk ID parameter
const validateReviewId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID review tidak valid')
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
  validateCreateReview,
  validateUpdateReview,
  validateReviewId,
  handleValidationErrors
};
