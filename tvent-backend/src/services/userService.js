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

    const updatedUser = await userRepository.update(userId, updates);

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

  // Get user by id
  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Remove password
    delete user.password;

    return user;
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

  // Change password
  async changePassword(userId, oldPassword, newPassword) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Verify old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw new Error('Password lama tidak sesuai');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    const updatedUser = await userRepository.update(userId, {
      password: hashedNewPassword
    });

    // Remove password from response
    delete updatedUser.password;

    return {
      message: 'Password berhasil diubah',
      user: updatedUser
    };
  }
}

module.exports = new userService();