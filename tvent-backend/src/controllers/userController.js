// ============================================
// FILE: src/controllers/userController.js
// ============================================

const userService = require('../services/userService');

const userController = {
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