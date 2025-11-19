const paymentRepository = require('../repositories/paymentRepository');


class PaymentService {
  async getPaymentById(id) {
    return paymentRepository.findById(id);
  }

  async createPayment(paymentData) {
    return paymentRepository.create(paymentData);
  }

  async updatePayment(id, updates) {
    return paymentRepository.update(id, updates);
  }

  async deletePayment(id) {
    return paymentRepository.delete(id);
  }

  async listPayments() {
    return paymentRepository.list();
  }

  // prosesPembayaran: process payment (set status to pending)
  async prosesPembayaran(id) {
    return paymentRepository.update(id, { status: 'pending' });
  }

  // tolakPembayaran: reject payment
  async tolakPembayaran(id) {
    return paymentRepository.update(id, { status: 'failed' });
  }

  // terimaPembayaran: accept payment and set tanggal_pembayaran
  async terimaPembayaran(id) {
    // Format datetime untuk MySQL: YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');
    
    return paymentRepository.update(id, { 
      status: 'success',
      tanggal_pembayaran: mysqlDatetime
    });
  }

  // totalPembayaran: get total payment for user
  async totalPembayaran(user_id) {
    const payments = await paymentRepository.list();
    return payments.filter(p => p.user_id === user_id && p.status === 'success')
      .reduce((sum, p) => sum + Number(p.jumlah), 0);
  }
}

module.exports = new PaymentService();
