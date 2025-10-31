const mahasiswaService = require('../services/mahasiswaService');

const MahasiswaController = {
  async signUp(req, res) {
    try {
      const user = await mahasiswaService.signUp(req.body);
      res.status(201).json(user);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async pesanTiket(req, res) {
    try {
      const { userId, eventId, jumlah } = req.body;
      const ticket = await mahasiswaService.pesanTiket(userId, eventId, jumlah);
      res.status(201).json(ticket);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async pembayaranTiket(req, res) {
    try {
      const { userId, ticketId, metode_pembayaran } = req.body;
      const payment = await mahasiswaService.pembayaranTiket(userId, ticketId, metode_pembayaran);
      res.status(201).json(payment);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async addReview(req, res) {
    try {
      const { userId, eventId, rating, feedback } = req.body;
      const review = await mahasiswaService.addReview(userId, eventId, rating, feedback);
      res.status(201).json(review);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async editReview(req, res) {
    try {
      const { userId, eventId, rating, feedback } = req.body;
      const review = await mahasiswaService.editReview(userId, eventId, rating, feedback);
      res.json(review);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async requestEvent(req, res) {
    try {
      const { userId, nama, deskripsi, tanggal, lokasi, harga } = req.body;
      const event = await mahasiswaService.requestEvent(userId, nama, deskripsi, tanggal, lokasi, harga);
      res.status(201).json(event);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
};

module.exports = MahasiswaController;
