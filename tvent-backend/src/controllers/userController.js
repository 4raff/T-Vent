// ============================================
// FILE: src/controllers/userController.js
// ============================================

const userService = require('./services/userService');

const userController = {
  // POST /api/users/register
  async register(req, res) {
    try {
      const { username, email, password, no_handphone } = req.body;

      // Validasi input
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username, email, and password are required'
        });
      }

      // Register user
      const result = await userService.register({
        username,
        email,
        password,
        no_handphone,
        role: 'user' // Default role
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role
          },
          token: result.token
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // POST /api/users/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validasi input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Login user
      const result = await userService.login(email, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role,
            no_handphone: result.user.no_handphone,
            profile_picture: result.user.profile_picture
          },
          token: result.token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /api/users/profile (need authentication)
  async getProfile(req, res) {
    try {
      // User data dari middleware authentication
      const userId = req.user.id;

      const user = await userService.getProfile(userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // PUT /api/users/profile (need authentication)
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updates = req.body;

      // Tidak boleh update password lewat endpoint ini
      delete updates.password;
      delete updates.role; // Tidak boleh ubah role sendiri

      const user = await userService.updateProfile(userId, updates);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /api/users (list all users - admin only)
  async list(req, res) {
    try {
      const users = await userService.list();

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('List users error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = userController;