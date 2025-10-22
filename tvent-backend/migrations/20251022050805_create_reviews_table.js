/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('reviews', function(table) {
    table.increments('id').primary();
    table.integer('event_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.integer('rating').unsigned().notNullable().checkBetween([1, 5]);
    table.text('feedback');
    table.timestamps(true, true);
    
    table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Satu user hanya bisa review 1x per event
    table.unique(['event_id', 'user_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('reviews');
};