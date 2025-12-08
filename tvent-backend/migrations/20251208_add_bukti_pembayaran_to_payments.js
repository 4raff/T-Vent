/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('payments', function(table) {
    table.text('bukti_pembayaran').after('metode_pembayaran').nullable(); // Add proof column
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('payments', function(table) {
    table.dropColumn('bukti_pembayaran');
  });
};
