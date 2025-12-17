const statsService = require('../services/statsService');

const StatsController = {
  async getDashboardStats(req, res) {
    try {
      const stats = await statsService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Error in StatsController.getDashboardStats():', error);
      res.status(500).json({ 
        message: 'Gagal memuat statistik',
        error: error.message 
      });
    }
  }
};

module.exports = StatsController;
