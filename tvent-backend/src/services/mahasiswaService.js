// MahasiswaService.js
const userService = require('./userService');
const ticketRepository = require('../repositories/ticketRepository');
const paymentRepository = require('../repositories/paymentRepository');
const reviewRepository = require('../repositories/reviewRepository');
const eventRepository = require('../repositories/eventRepository');

class MahasiswaService {
  // signUp: register as user (reuse userService)
  async signUp(userData) {
    return userService.registerUser({ ...userData, role: 'user' });
  }

  // pesanTiket: order ticket for event
  async pesanTiket(userId, eventId, jumlah = 1) {
    const event = await eventRepository.findById(eventId);
    if (!event || event.tiket_tersedia < jumlah) throw new Error('Tiket tidak cukup');
    // Kurangi tiket tersedia
    await eventRepository.update(eventId, { tiket_tersedia: event.tiket_tersedia - jumlah });
    return ticketRepository.create({
      user_id: userId,
      event_id: eventId,
      jumlah,
      total_harga: event.harga * jumlah,
      status: 'pending',
    });
  }

  // pembayaranTiket: create payment for ticket
  async pembayaranTiket(userId, ticketId, metode_pembayaran) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket || ticket.user_id !== userId) throw new Error('Tiket tidak valid');
    return paymentRepository.create({
      ticket_id: ticketId,
      user_id: userId,
      jumlah: ticket.total_harga,
      metode_pembayaran,
      status: 'pending',
    });
  }

  // addReview: add review for event
  async addReview(userId, eventId, rating, feedback) {
    // Satu user satu review per event
    const existing = await reviewRepository.findByUserAndEvent(userId, eventId);
    if (existing) throw new Error('Sudah review event ini');
    return reviewRepository.create({
      user_id: userId,
      event_id: eventId,
      rating,
      feedback,
    });
  }

  // editReview: edit review for event
  async editReview(userId, eventId, rating, feedback) {
    const review = await reviewRepository.findByUserAndEvent(userId, eventId);
    if (!review) throw new Error('Review tidak ditemukan');
    return reviewRepository.update(review.id, { rating, feedback });
  }

  // requestEvent: request new event (could be a table or just send to admin)
  async requestEvent(userId, nama, deskripsi, tanggal, lokasi, harga) {
    // For now, just create event with status 'pending' and created_by user
    return eventRepository.create({
      nama,
      deskripsi,
      tanggal,
      lokasi,
      harga,
      created_by: userId,
      status: 'pending',
      jumlah_tiket: 0,
      tiket_tersedia: 0,
    });
  }
}

module.exports = new MahasiswaService();
