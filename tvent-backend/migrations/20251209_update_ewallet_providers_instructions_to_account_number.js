/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('ewallet_providers', function(table) {
    table.dropColumn('instructions');
    table.string('account_number').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('ewallet_providers', function(table) {
    table.dropColumn('account_number');
    table.text('instructions').nullable();
  });
};
