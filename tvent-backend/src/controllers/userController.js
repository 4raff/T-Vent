// ============================================
// FILE: src/controllers/userController.js
// ============================================

const userService = require('../services/userService');

const userController = {
  // GET /api/users/profile (need authentication)
  async getProfile(req, res) {
    try {
      // User data dari middleware authentication
      const userId = req.userData.id;

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
      const userId = req.userData.id;
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
  },

  // GET /api/users/:id (get user by id)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Don't send password
      delete user.password;

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get user by id error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // PUT /api/users/change-password (need authentication)
  async changePassword(req, res) {
    try {
      const userId = req.userData.id;
      const { old_password, new_password } = req.body;

      const result = await userService.changePassword(userId, old_password, new_password);

      res.json({
        success: true,
        message: 'Password berhasil diubah',
        data: result
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = userController;