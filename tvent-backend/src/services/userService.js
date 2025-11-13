// ============================================
// FILE: src/services/userService.js
// ============================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('./repositories/userRepository');

class userService {
  // Register new user
  async register(userData) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Check if username already exists
    const existingUsername = await userRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const newUser = await userRepository.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      no_handphone: userData.no_handphone || null,
      role: userData.role || 'user',
      profile_picture: userData.profile_picture || 'default.jpg'
    });

    // Generate token
    const token = this.generateToken(newUser);

    return {
      user: newUser,
      token
    };
  }

  // Login user
  async login(email, password) {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    delete user.password;

    return {
      user,
      token
    };
  }

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