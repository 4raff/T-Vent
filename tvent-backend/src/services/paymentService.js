const paymentRepository = require('../repositories/paymentRepository');
const ticketRepository = require('../repositories/ticketRepository');
const eventRepository = require('../repositories/eventRepository');
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

  // tolakPembayaran: reject payment - restore tiket_tersedia
  async tolakPembayaran(id, reason = null) {
    const payment = await paymentRepository.findById(id);
    
    if (!payment) {
      throw new Error('Pembayaran tidak ditemukan');
    }

    // Get ticket info to restore tiket_tersedia
    const ticket = await ticketRepository.findById(payment.ticket_id);
    
    // Update payment status
    const updatedPayment = await paymentRepository.update(id, { 
      status: 'rejected',
      rejection_reason: reason
    });
    
    // Update ticket status to cancelled
    if (ticket) {
      await ticketRepository.update(payment.ticket_id, { status: 'cancelled' });
      
      // Restore tiket_tersedia for the event
      if (ticket.event_id) {
        const event = await eventRepository.findById(ticket.event_id);
        if (event) {
          const newTicketTersedia = event.tiket_tersedia + ticket.jumlah;
          await eventRepository.update(ticket.event_id, { 
            tiket_tersedia: newTicketTersedia 
          });
        }
      }
    }
    
    return updatedPayment;
  }

  // terimaPembayaran: accept payment - update tiket_tersedia dan attendees
  async terimaPembayaran(id) {
    const payment = await paymentRepository.findById(id);
    
    if (!payment) {
      throw new Error('Pembayaran tidak ditemukan');
    }

    // Get ticket info
    const ticket = await ticketRepository.findById(payment.ticket_id);
    
    // Format datetime untuk MySQL: YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');
    
    // Update payment status to success
    const updatedPayment = await paymentRepository.update(id, { 
      status: 'success',
      tanggal_pembayaran: mysqlDatetime
    });
    
    // Update ticket status to confirmed
    if (ticket) {
      await ticketRepository.update(payment.ticket_id, { status: 'confirmed' });
      
      // Update event's tiket_tersedia and attendees
      if (ticket.event_id) {
        const event = await eventRepository.findById(ticket.event_id);
        if (event) {
          // Decrease available tickets by the quantity in this ticket
          const newTicketTersedia = Math.max(0, event.tiket_tersedia - ticket.jumlah);
          
          // Increase attendees count by the quantity in this ticket
          const newAttendees = (event.attendees || 0) + ticket.jumlah;
          
          await eventRepository.update(ticket.event_id, { 
            tiket_tersedia: newTicketTersedia,
            attendees: newAttendees
          });
        }
      }
    }
    
    // Create notification for user
    if (updatedPayment && payment.user_id) {
      await notificationRepository.create({
        user_id: payment.user_id,
        type: 'payment_confirmed',
        title: 'Pembayaran Dikonfirmasi',
        message: 'Pembayaran Anda telah berhasil diverifikasi oleh admin. Tiket Anda sudah terkonfirmasi!',
        data: JSON.stringify({ payment_id: updatedPayment.id }),
        is_read: false
      });
    }
    
    return updatedPayment;
  }

  // totalPembayaran: get total payment for user
  async totalPembayaran(user_id) {
    const payments = await paymentRepository.list();
    return payments.filter(p => p.user_id === user_id && p.status === 'success')
      .reduce((sum, p) => sum + Number(p.jumlah), 0);
  }
}

module.exports = new PaymentService();
