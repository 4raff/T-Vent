exports.up = function(knex) {
  return knex.schema.table('tickets', function(table) {
    table.text('cancellation_reason').nullable().comment('Reason for ticket cancellation');
  });
};

exports.down = function(knex) {
  return knex.schema.table('tickets', function(table) {
    table.dropColumn('cancellation_reason');
  });
};
