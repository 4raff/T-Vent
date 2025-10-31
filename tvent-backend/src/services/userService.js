const userRepository = require('../repositories/userRepository');


const eventRepository = require('../repositories/eventRepository');
const ticketRepository = require('../repositories/ticketRepository');

class UserService {
  async getUserById(id) {
    return userRepository.findById(id);
  }

  async registerUser(userData) {
    // Add password hashing and validation as needed
    return userRepository.create(userData);
  }

  async updateUser(id, updates) {
    return userRepository.update(id, updates);
  }

  async deleteUser(id) {
    return userRepository.delete(id);
  }

  async listUsers() {
    return userRepository.list();
  }

  // Cari event berdasarkan nama/deskripsi
  async cariEvent(query) {
    return eventRepository.search(query);
  }

  // Pilih event (misal: simpan ke tiket/bookmark)
  async pilihEvent(userId, eventId) {
    // Contoh: otomatis buat tiket status 'pending' untuk user & event
    return ticketRepository.create({
      user_id: userId,
      event_id: eventId,
      jumlah: 1,
      total_harga: 0,
      status: 'pending',
    });
  }
}

module.exports = new UserService();
