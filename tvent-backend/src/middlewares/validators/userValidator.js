const { body, param, validationResult } = require('express-validator');

// Validasi untuk update profil user
const validateUpdateProfile = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Username harus antara 3-50 karakter')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username hanya boleh mengandung huruf, angka, dan underscore'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail()
    .isLength({ max: 100 }).withMessage('Email maksimal 100 karakter'),
  
  body('no_handphone')
    .optional()
    .trim()
    .matches(/^(\+62|62|0)[0-9]{9,12}$/).withMessage('Format nomor HP tidak valid (gunakan format Indonesia)'),
  
  body('profile_picture')
    .optional()
    .isURL().withMessage('Format URL gambar profil tidak valid')
];

// Validasi untuk ganti password
const validateChangePassword = [
  body('old_password')
    .notEmpty().withMessage('Password lama tidak boleh kosong'),
  
  body('new_password')
    .notEmpty().withMessage('Password baru tidak boleh kosong')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password harus mengandung huruf besar, huruf kecil, dan angka')
    .custom((value, { req }) => {
      if (value === req.body.old_password) {
        throw new Error('Password baru tidak boleh sama dengan password lama');
      }
      return true;
    }),
  
  body('confirm_password')
    .notEmpty().withMessage('Konfirmasi password tidak boleh kosong')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Konfirmasi password tidak cocok');
      }
      return true;
    })
];

// Validasi untuk ID parameter
const validateUserId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID user tidak valid')
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
  validateUpdateProfile,
  validateChangePassword,
  validateUserId,
  handleValidationErrors
};
