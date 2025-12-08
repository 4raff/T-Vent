const knex = require('../config/database');

class StatsService {
  async getDashboardStats() {
    try {
      // Total events with approved status
      const totalEvents = await knex('events')
        .where({ status: 'approved' })
        .count('* as count')
        .first();

      // Total users
      const totalUsers = await knex('users')
        .count('* as count')
        .first();

      // Total attendees (sum of tickets sold via payments)
      const totalAttendees = await knex('payments')
        .where({ status: 'completed' })
        .count('* as count')
        .first();

      return {
        totalEvents: totalEvents?.count || 0,
        totalUsers: totalUsers?.count || 0,
        totalAttendees: totalAttendees?.count || 0,
      };
    } catch (error) {
      console.error('Error in StatsService.getDashboardStats():', error.message);
      throw error;
    }
  }
}

module.exports = new StatsService();
