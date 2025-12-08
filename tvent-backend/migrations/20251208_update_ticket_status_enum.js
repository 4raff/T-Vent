/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('tickets', function(table) {
    table.enum('status', ['pending', 'approved', 'rejected', 'confirmed', 'cancelled', 'used']).defaultTo('pending').alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('tickets', function(table) {
    table.enum('status', ['pending', 'confirmed', 'cancelled', 'used']).defaultTo('pending').alter();
  });
};
