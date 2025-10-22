/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tickets', function(table) {
    table.increments('id').primary();
    table.string('kode_tiket', 50).notNullable().unique();
    table.integer('event_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.integer('jumlah').unsigned().defaultTo(1);
    table.decimal('total_harga', 12, 2).notNullable();
    table.enum('status', ['pending', 'confirmed', 'cancelled', 'used']).defaultTo('pending');
    table.string('qr_code', 255);
    table.timestamps(true, true);
    
    table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tickets');
};