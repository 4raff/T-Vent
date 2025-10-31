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
}

module.exports = new PaymentService();
