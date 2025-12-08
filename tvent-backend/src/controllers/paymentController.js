
const paymentService = require('../services/paymentService');

const PaymentController = {
  async getAll(req, res) {
    const payments = await paymentService.listPayments();
    res.json(payments);
  },
  async getById(req, res) {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  },
  async create(req, res) {
    try {
      const payment = await paymentService.createPayment(req.body);
      res.status(201).json({ 
        message: 'Pembayaran berhasil dibuat', 
        data: payment 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Gagal membuat pembayaran', 
        error: error.message 
      });
    }
  },
  async update(req, res) {
    try {
      const payment = await paymentService.updatePayment(req.params.id, req.body);
      if (!payment) {
        return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
      }
      res.json({ 
        message: 'Pembayaran berhasil diperbarui', 
        data: payment 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Gagal memperbarui pembayaran', 
        error: error.message 
      });
    }
  },
  async remove(req, res) {
    await paymentService.deletePayment(req.params.id);
    res.status(204).end();
  },

  async prosesPembayaran(req, res) {
    try {
      const { id } = req.body;
      const payment = await paymentService.prosesPembayaran(id);
      res.json({ 
        message: 'Pembayaran sedang diproses', 
        data: payment 
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async tolakPembayaran(req, res) {
    try {
      const { id, reason } = req.body;
      const payment = await paymentService.tolakPembayaran(id, reason);
      res.json({ 
        message: 'Pembayaran berhasil ditolak', 
        data: payment 
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async terimaPembayaran(req, res) {
    try {
      const { id } = req.body;
      const payment = await paymentService.terimaPembayaran(id);
      res.json({ 
        message: 'Pembayaran berhasil diterima', 
        data: payment 
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  async totalPembayaran(req, res) {
    try {
      const { user_id } = req.query;
      const total = await paymentService.totalPembayaran(Number(user_id));
      res.json({ total });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
};

module.exports = PaymentController;
