// ============================================
// FILE: src/services/userService.js
// ============================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class userService {
  
  // Get user profile
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Remove password
    delete user.password;

    return user;
  }

  // Update user profile
  async updateProfile(userId, updates) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const [updatedUser] = await userRepository.update(userId, updates);

    // Remove password
    delete updatedUser.password;

    return updatedUser;
  }

  // List all users
  async list() {
    const users = await userRepository.list();

    // Remove passwords
    return users.map(user => {
      delete user.password;
      return user;
    });
  }

  // Generate JWT token
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' } // Token valid for 7 days
    );
  }
}

module.exports = new userService();