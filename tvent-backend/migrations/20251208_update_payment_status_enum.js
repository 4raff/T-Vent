/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('payments', function(table) {
    table.enum('status', ['pending', 'success', 'rejected', 'cancelled']).defaultTo('pending').alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('payments', function(table) {
    table.enum('status', ['pending', 'success', 'failed', 'cancelled']).defaultTo('pending').alter();
  });
};
