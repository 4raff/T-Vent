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
    },
    {
      id: 6,
      user_id: 6,
      event_id: 2
    },
    {
      id: 7,
      user_id: 7,
      event_id: 6
    },
    {
      id: 8,
      user_id: 8,
      event_id: 7
    },
    {
      id: 9,
      user_id: 9,
      event_id: 8
    },
    {
      id: 10,
      user_id: 10,
      event_id: 10
    },
    {
      id: 11,
      user_id: 11,
      event_id: 11
    },
    {
      id: 12,
      user_id: 12,
      event_id: 15
    },
    {
      id: 13,
      user_id: 13,
      event_id: 18
    },
    {
      id: 14,
      user_id: 14,
      event_id: 19
    },
    {
      id: 15,
      user_id: 15,
      event_id: 20
    },
    {
      id: 16,
      user_id: 3,
      event_id: 21
    },
    {
      id: 17,
      user_id: 4,
      event_id: 22
    },
    {
      id: 18,
      user_id: 5,
      event_id: 12
    },
    {
      id: 19,
      user_id: 6,
      event_id: 14
    },
    {
      id: 20,
      user_id: 7,
      event_id: 9
    },
    {
      id: 21,
      user_id: 8,
      event_id: 16
    },
    {
      id: 22,
      user_id: 9,
      event_id: 13
    },
    {
      id: 23,
      user_id: 10,
      event_id: 17
    },
    {
      id: 24,
      user_id: 11,
      event_id: 1
    }
  ]);
};