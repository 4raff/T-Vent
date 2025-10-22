/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('bookmarks').del();
  
  // Inserts seed entries
  await knex('bookmarks').insert([
    {
      id: 1,
      user_id: 2,
      event_id: 1
    },
    {
      id: 2,
      user_id: 2,
      event_id: 5
    },
    {
      id: 3,
      user_id: 3,
      event_id: 4
    },
    {
      id: 4,
      user_id: 4,
      event_id: 3
    },
    {
      id: 5,
      user_id: 5,
      event_id: 1
    }
  ]);
};