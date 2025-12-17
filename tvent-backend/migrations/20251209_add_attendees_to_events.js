/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('events', function(table) {
    // Add attendees column to track confirmed attendees
    table.integer('attendees').unsigned().defaultTo(0);
    table.text('notes').nullable(); // Additional notes about the event
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('events', function(table) {
    table.dropColumn('attendees');
    table.dropColumn('notes');
  });
};
