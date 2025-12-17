/**
 * Migration untuk mengubah kolom poster dari string(255) menjadi longText
 * agar dapat menyimpan Base64 image string dengan ukuran besar
 */
exports.up = function(knex) {
  return knex.schema.alterTable('events', function(table) {
    table.longText('poster').nullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('events', function(table) {
    table.string('poster', 255).nullable().alter();
  });
};
