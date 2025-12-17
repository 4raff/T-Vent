const { body, param, validationResult } = require('express-validator');

// Validasi untuk membuat event
const validateCreateEvent = [
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama event tidak boleh kosong')
    .isLength({ min: 3, max: 200 }).withMessage('Nama event harus antara 3-200 karakter'),
  
  body('deskripsi')
    .trim()
    .notEmpty().withMessage('Deskripsi event tidak boleh kosong')
    .isLength({ min: 20 }).withMessage('Deskripsi minimal 20 karakter'),
  
  body('kategori')
    .trim()
    .notEmpty().withMessage('Kategori tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Kategori maksimal 100 karakter'),
  
  body('lokasi')
    .trim()
    .notEmpty().withMessage('Lokasi tidak boleh kosong')
    .isLength({ min: 3, max: 255 }).withMessage('Lokasi harus antara 3-255 karakter'),
  
  body('tanggal')
    .notEmpty().withMessage('Tanggal event tidak boleh kosong')
    .isISO8601().withMessage('Format tanggal tidak valid')
    .custom((value) => {
      const eventDate = new Date(value);
      const now = new Date();
      if (eventDate <= now) {
        throw new Error('Tanggal event harus di masa depan');
      }
      return true;
    }),
  
  body('jumlah_tiket')
    .notEmpty().withMessage('Jumlah tiket tidak boleh kosong')
    .isInt({ min: 1 }).withMessage('Jumlah tiket minimal 1'),
  
  body('harga')
    .notEmpty().withMessage('Harga tidak boleh kosong')
    .isFloat({ min: 0 }).withMessage('Harga tidak boleh negatif'),
  
  body('poster')
    .notEmpty().withMessage('Poster tidak boleh kosong')
    .custom((value) => {
      // Accept both URLs and Base64 strings
      if (typeof value !== 'string') {
        throw new Error('Format poster tidak valid');
      }
      // Check if it's a valid URL or Base64
      const isUrl = /^https?:\/\//.test(value);
      const isBase64 = /^data:image\/(png|jpg|jpeg|gif);base64,/.test(value);
      if (!isUrl && !isBase64) {
        throw new Error('Poster harus berupa URL atau Base64 image');
      }
      return true;
    }),

];

// Validasi untuk update event
const validateUpdateEvent = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID event tidak valid'),
  
  body('nama')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Nama event harus antara 3-200 karakter'),
  
  body('deskripsi')
    .optional()
    .trim()
    .isLength({ min: 20 }).withMessage('Deskripsi minimal 20 karakter'),
  
  body('kategori')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Kategori maksimal 100 karakter'),
  
  body('lokasi')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Lokasi harus antara 3-255 karakter'),
  
  body('tanggal')
    .optional()
    .isISO8601().withMessage('Format tanggal tidak valid')
    .custom((value) => {
      const eventDate = new Date(value);
      const now = new Date();
      if (eventDate <= now) {
        throw new Error('Tanggal event harus di masa depan');
      }
      return true;
    }),
  
  body('jumlah_tiket')
    .optional()
    .isInt({ min: 1 }).withMessage('Jumlah tiket minimal 1'),
  
  body('harga')
    .optional()
    .isFloat({ min: 0 }).withMessage('Harga tidak boleh negatif'),
  
  body('poster')
    .optional()
    .custom((value) => {
      // Accept both URLs and Base64 strings
      if (typeof value !== 'string') {
        throw new Error('Format poster tidak valid');
      }
      // Check if it's a valid URL or Base64
      const isUrl = /^https?:\/\//.test(value);
      const isBase64 = /^data:image\/(png|jpg|jpeg|gif);base64,/.test(value);
      if (!isUrl && !isBase64) {
        throw new Error('Poster harus berupa URL atau Base64 image');
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'completed']).withMessage('Status tidak valid')
];

// Validasi untuk ID parameter
const validateEventId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID event tidak valid')
];

// Middleware untuk handle hasil validasi
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validasi gagal',
      errors: errors.array().map(err => ({
        field: err.param || err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateCreateEvent,
  validateUpdateEvent,
  validateEventId,
  handleValidationErrors
};
