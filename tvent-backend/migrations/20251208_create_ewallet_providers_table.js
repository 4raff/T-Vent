/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('ewallet_providers', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable(); // e.g., "GCash", "PayMaya", "Jeepney"
    table.string('code').notNullable().unique(); // e.g., "gcash", "paymaya", "jeepney"
    table.text('instructions').nullable(); // How to transfer via this ewallet
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('ewallet_providers');
};
