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

      // Total attendees: sum all confirmed tickets' jumlah (quantity of attendees)
      // Because a ticket can represent multiple people (jumlah field)
      const totalAttendeesResult = await knex('tickets')
        .where({ status: 'confirmed' })
        .sum('jumlah as total')
        .first();

      const totalAttendees = totalAttendeesResult?.total || 0;

      return {
        totalEvents: totalEvents?.count || 0,
        totalUsers: totalUsers?.count || 0,
        totalAttendees: totalAttendees,
      };
    } catch (error) {
      console.error('Error in StatsService.getDashboardStats():', error.message);
      throw error;
    }
  }
}

module.exports = new StatsService();
