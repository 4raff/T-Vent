/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('events', function(table) {
    // Ubah enum status untuk menambahkan 'cancelled'
    table.enum('status', ['pending', 'approved', 'rejected', 'cancelled', 'completed']).defaultTo('pending').alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('events', function(table) {
    // Kembalikan ke enum semula
    table.enum('status', ['pending', 'approved', 'rejected', 'completed']).defaultTo('pending').alter();
  });
};
