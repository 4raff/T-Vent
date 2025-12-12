const knex = require('../config/database');


class EventRepository {
  async findById(id) {
    return knex('events').where({ id }).first();
  }

  async create(event) {
    // Set tiket_tersedia sama dengan jumlah_tiket saat pertama kali dibuat
    if (!event.tiket_tersedia && event.jumlah_tiket) {
      event.tiket_tersedia = event.jumlah_tiket;
    }
    
    const [id] = await knex('events').insert(event);
    return this.findById(id);
  }

  async update(id, updates) {
    await knex('events').where({ id }).update(updates);
    return this.findById(id);
  }

  async delete(id) {
    return knex('events').where({ id }).del();
  }

  async list(userRole = null) {
    try {
      let query = knex('events')
        .leftJoin('users', 'events.created_by', 'users.id')
        .select(
          'events.*',
          'users.username as creator_name'
        );
      
      // Filter untuk regular users: hanya approved events yang belum expired
      if (userRole !== 'admin') {
        const now = knex.raw('NOW()');
        query = query
          .where('events.status', 'approved')
          .where('events.tanggal', '>=', now);
      }
      
      return await query;
    } catch (error) {
      console.error('Error in EventRepository.list():', error.message);
      throw error;
    }
  }

  // Search events by name or description
  async search(query) {
    return knex('events')
      .where('nama', 'like', `%${query}%`)
      .orWhere('deskripsi', 'like', `%${query}%`)
      .select('*');
  }

  // Get unique categories from events
  async getUniqueCategories() {
    try {
      const result = await knex('events')
        .select('kategori')
        .distinct()
        .whereNotNull('kategori')
        .orderBy('kategori', 'asc');
      
      // Return array of category strings instead of objects
      return result.map(row => row.kategori).filter(cat => cat);
    } catch (error) {
      console.error('Error in EventRepository.getUniqueCategories():', error.message);
      throw error;
    }
  }

  // Get featured event (most purchased/sold)
  async getFeaturedEvent() {
    try {
      const now = knex.raw('NOW()');
      const result = await knex('events')
        .leftJoin('tickets', 'events.id', 'tickets.event_id')
        .select('events.*')
        .count('tickets.id as ticket_sales')
        .where('events.status', 'approved')
        .where('events.tanggal', '>=', now)
        .groupBy('events.id')
        .orderBy('ticket_sales', 'desc')
        .first();
      
      return result || null;
    } catch (error) {
      console.error('Error in EventRepository.getFeaturedEvent():', error.message);
      throw error;
    }
  }

  // Get most purchased events (limit N)
  async getMostPurchasedEvents(limit = 10) {
    try {
      const now = knex.raw('NOW()');
      const result = await knex('events')
        .leftJoin('tickets', 'events.id', 'tickets.event_id')
        .leftJoin('users', 'events.created_by', 'users.id')
        .select(
          'events.*',
          'users.username as creator_name',
          knex.raw('COUNT(tickets.id) as ticket_sales')
        )
        .where('events.status', 'approved')
        .where('events.tanggal', '>=', now)
        .groupBy('events.id')
        .orderBy('ticket_sales', 'desc')
        .limit(limit);
      
      return result || [];
    } catch (error) {
      console.error('Error in EventRepository.getMostPurchasedEvents():', error.message);
      throw error;
    }
  }

  // Get all events created by a specific user (regardless of status)
  async findByCreator(userId) {
    try {
      return await knex('events')
        .leftJoin('users', 'events.created_by', 'users.id')
        .select(
          'events.*',
          'users.username as creator_name'
        )
        .where('events.created_by', userId)
        .orderBy('events.created_at', 'desc');
    } catch (error) {
      console.error('Error in EventRepository.findByCreator():', error.message);
      throw error;
    }
  }
}

module.exports = new EventRepository();
