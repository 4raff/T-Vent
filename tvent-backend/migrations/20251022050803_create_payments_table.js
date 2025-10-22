/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('payments', function(table) {
    table.increments('id').primary();
    table.string('kode_pembayaran', 50).notNullable().unique();
    table.integer('ticket_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.decimal('jumlah', 12, 2).notNullable();
    table.enum('metode_pembayaran', ['credit_card', 'bank_transfer', 'e-wallet', 'qris']).notNullable();
    table.enum('status', ['pending', 'success', 'failed', 'cancelled']).defaultTo('pending');
    table.dateTime('tanggal_pembayaran');
    table.timestamps(true, true);
    
    table.foreign('ticket_id').references('id').inTable('tickets').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('payments');
};