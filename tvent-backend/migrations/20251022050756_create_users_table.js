/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('username', 100).notNullable().unique();
    table.string('email', 150).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('no_handphone', 20);
    table.enum('role', ['user', 'admin']).defaultTo('user');
    table.string('profile_picture', 255);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};