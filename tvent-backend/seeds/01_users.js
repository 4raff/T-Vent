const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  const password = await bcrypt.hash('password123', 10);
  
  // Inserts seed entries
  await knex('users').insert([
    {
      id: 1,
      username: 'admin',
      email: 'admin@tvent.com',
      password: password,
      no_handphone: '081234567890',
      role: 'admin',
      profile_picture: 'admin.jpg'
    },
    {
      id: 2,
      username: 'dzakhwan',
      email: 'dzakhwan@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567891',
      role: 'user',
      profile_picture: 'dzakhwan.jpg'
    },
    {
      id: 3,
      username: 'azigha',
      email: 'azigha@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567892',
      role: 'user',
      profile_picture: 'azigha.jpg'
    },
    {
      id: 4,
      username: 'tegar',
      email: 'tegar@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567893',
      role: 'user',
      profile_picture: 'tegar.jpg'
    },
    {
      id: 5,
      username: 'raffi',
      email: 'raffi@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567894',
      role: 'user',
      profile_picture: 'raffi.jpg'
    },
     {
      id: 6,
      username: 'axel',
      email: 'axel@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567895',
      role: 'user',
      profile_picture: 'axel.jpg'
    }
  ]);
};