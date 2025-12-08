/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('bank_accounts', function(table) {
    table.increments('id').primary();
    table.string('bank_name').notNullable(); // e.g., "Bank Mandiri", "BCA", "BNI"
    table.string('account_number').notNullable().unique();
    table.string('account_holder').notNullable(); // e.g., "PT T-Vent Indonesia"
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('bank_accounts');
};
