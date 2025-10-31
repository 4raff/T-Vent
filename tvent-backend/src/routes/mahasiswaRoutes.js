const express = require('express');
const router = express.Router();
const MahasiswaController = require('../controllers/mahasiswaController');

router.post('/signup', MahasiswaController.signUp);
router.post('/pesan-tiket', MahasiswaController.pesanTiket);
router.post('/pembayaran-tiket', MahasiswaController.pembayaranTiket);
router.post('/add-review', MahasiswaController.addReview);
router.put('/edit-review', MahasiswaController.editReview);
router.post('/request-event', MahasiswaController.requestEvent);

module.exports = router;
