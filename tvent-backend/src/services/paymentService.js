const paymentRepository = require('../repositories/paymentRepository');
const notificationRepository = require('../repositories/notificationRepository');

class PaymentService {
  async getPaymentById(id) {
    return paymentRepository.findById(id);
  }

  async createPayment(paymentData) {
    const payment = await paymentRepository.create(paymentData);
    
    // Create notification for user
    if (payment && paymentData.user_id) {
      await notificationRepository.create({
        user_id: paymentData.user_id,
        type: 'payment_submitted',
        title: 'Pembayaran Terkirim',
        message: 'Pembayaran Anda telah diterima dan sedang menunggu verifikasi dari admin.',
        data: JSON.stringify({ payment_id: payment.id }),
        is_read: false
      });
    }
    
    return payment;
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
  async tolakPembayaran(id, reason = null) {
    const payment = await paymentRepository.update(id, { 
      status: 'rejected',
      rejection_reason: reason
    });
    
    // Update ticket status to rejected if it exists
    if (payment && payment.ticket_id) {
      const ticketRepository = require('../repositories/ticketRepository');
      await ticketRepository.update(payment.ticket_id, { status: 'rejected' });
    }
    
    return payment;
  }

  // terimaPembayaran: accept payment and set tanggal_pembayaran
  async terimaPembayaran(id) {
    // Format datetime untuk MySQL: YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');
    
    const payment = await paymentRepository.update(id, { 
      status: 'success',
      tanggal_pembayaran: mysqlDatetime
    });
    
    // Update ticket status to approved if it exists
    if (payment && payment.ticket_id) {
      const ticketRepository = require('../repositories/ticketRepository');
      await ticketRepository.update(payment.ticket_id, { status: 'approved' });
    }
    
    // Create notification for user
    if (payment && payment.user_id) {
      await notificationRepository.create({
        user_id: payment.user_id,
        type: 'payment_confirmed',
        title: 'Pembayaran Dikonfirmasi',
        message: 'Pembayaran Anda telah berhasil diverifikasi oleh admin.',
        data: JSON.stringify({ payment_id: payment.id }),
        is_read: false
      });
    }
    
    return payment;
  }

  // totalPembayaran: get total payment for user
  async totalPembayaran(user_id) {
    const payments = await paymentRepository.list();
    return payments.filter(p => p.user_id === user_id && p.status === 'success')
      .reduce((sum, p) => sum + Number(p.jumlah), 0);
  }
}

module.exports = new PaymentService();
