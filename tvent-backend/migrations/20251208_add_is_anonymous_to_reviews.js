/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('reviews', function(table) {
    table.boolean('is_anonymous').defaultTo(false).after('feedback');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('reviews', function(table) {
    table.dropColumn('is_anonymous');
  });
};
