/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('events', function(table) {
    table.increments('id').primary();
    table.string('nama', 200).notNullable();
    table.text('deskripsi').notNullable();
    table.dateTime('tanggal').notNullable();
    table.string('lokasi', 255).notNullable();
    table.decimal('harga', 12, 2).notNullable();
    table.string('kategori', 100);
    table.string('poster', 255);
    table.integer('jumlah_tiket').unsigned().notNullable();
    table.integer('tiket_tersedia').unsigned().notNullable();
    table.integer('created_by').unsigned().notNullable();
    table.enum('status', ['pending', 'approved', 'rejected', 'completed']).defaultTo('pending');
    table.timestamps(true, true);
    
    table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('events');
};