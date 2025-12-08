const knex = require('../config/database');

class BookmarkRepository {
  async findById(id) {
    return knex('bookmarks')
      .leftJoin('events', 'bookmarks.event_id', 'events.id')
      .select(
        'bookmarks.id',
        'bookmarks.user_id',
        'bookmarks.event_id',
        'bookmarks.created_at',
        'bookmarks.updated_at',
        'events.nama',
        'events.deskripsi',
        'events.poster',
        'events.harga',
        'events.tanggal',
        'events.lokasi',
        'events.kategori',
        'events.jumlah_tiket',
        'events.tiket_tersedia',
        'events.status'
      )
      .where({ 'bookmarks.id': id })
      .first();
  }

  async create(bookmark) {
    const [id] = await knex('bookmarks').insert(bookmark);
    return this.findById(id);
  }

  async delete(id) {
    return knex('bookmarks').where({ id }).del();
  }

  async listByUser(user_id) {
    return knex('bookmarks')
      .leftJoin('events', 'bookmarks.event_id', 'events.id')
      .select(
        'bookmarks.id',
        'bookmarks.user_id',
        'bookmarks.event_id',
        'bookmarks.created_at',
        'bookmarks.updated_at',
        'events.nama',
        'events.deskripsi',
        'events.poster',
        'events.harga',
        'events.tanggal',
        'events.lokasi',
        'events.kategori',
        'events.jumlah_tiket',
        'events.tiket_tersedia',
        'events.status'
      )
      .where({ 'bookmarks.user_id': user_id })
      .orderBy('bookmarks.created_at', 'desc');
  }

  async listAll() {
    return knex('bookmarks')
      .leftJoin('events', 'bookmarks.event_id', 'events.id')
      .select(
        'bookmarks.id',
        'bookmarks.user_id',
        'bookmarks.event_id',
        'bookmarks.created_at',
        'bookmarks.updated_at',
        'events.nama',
        'events.deskripsi',
        'events.poster',
        'events.harga',
        'events.tanggal',
        'events.lokasi',
        'events.kategori',
        'events.jumlah_tiket',
        'events.tiket_tersedia',
        'events.status'
      )
      .orderBy('bookmarks.created_at', 'desc');
  }
}

module.exports = new BookmarkRepository();
