const userRepository = require('../repositories/userRepository');

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
}

module.exports = new UserService();
