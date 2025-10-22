/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('messages', function(table) {
    table.increments('id').primary();
    table.integer('sender_id').unsigned().notNullable();
    table.integer('receiver_id').unsigned().notNullable();
    table.text('content').notNullable();
    table.boolean('is_read').defaultTo(false);
    table.timestamps(true, true);
    
    table.foreign('sender_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('receiver_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};