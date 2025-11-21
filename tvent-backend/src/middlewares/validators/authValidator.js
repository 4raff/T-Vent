const { body, validationResult } = require('express-validator');

// Middleware untuk validasi register
const validateRegister = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username tidak boleh kosong')
    .isLength({ min: 3, max: 50 }).withMessage('Username harus antara 3-50 karakter')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username hanya boleh mengandung huruf, angka, dan underscore'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email tidak boleh kosong')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail()
    .isLength({ max: 100 }).withMessage('Email maksimal 100 karakter'),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password tidak boleh kosong')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password harus mengandung huruf besar, huruf kecil, dan angka'),
  
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Konfirmasi password tidak cocok');
      }
      return true;
    }),
  
  body('no_handphone')
    .optional()
    .trim()
    .matches(/^(\+62|62|0)[0-9]{9,12}$/).withMessage('Format nomor HP tidak valid (gunakan format Indonesia)')
];

// Middleware untuk validasi login
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email tidak boleh kosong')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password tidak boleh kosong')
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
  validateRegister,
  validateLogin,
  handleValidationErrors
};
