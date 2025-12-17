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
    },
    {
      id: 7,
      username: 'budi',
      email: 'budi@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567896',
      role: 'user',
      profile_picture: 'budi.jpg'
    },
    {
      id: 8,
      username: 'citra',
      email: 'citra@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567897',
      role: 'user',
      profile_picture: 'citra.jpg'
    },
    {
      id: 9,
      username: 'doni',
      email: 'doni@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567898',
      role: 'user',
      profile_picture: 'doni.jpg'
    },
    {
      id: 10,
      username: 'eka',
      email: 'eka@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567899',
      role: 'user',
      profile_picture: 'eka.jpg'
    },
    {
      id: 11,
      username: 'farah',
      email: 'farah@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567800',
      role: 'user',
      profile_picture: 'farah.jpg'
    },
    {
      id: 12,
      username: 'gina',
      email: 'gina@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567801',
      role: 'user',
      profile_picture: 'gina.jpg'
    },
    {
      id: 13,
      username: 'hendra',
      email: 'hendra@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567802',
      role: 'user',
      profile_picture: 'hendra.jpg'
    },
    {
      id: 14,
      username: 'irene',
      email: 'irene@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567803',
      role: 'user',
      profile_picture: 'irene.jpg'
    },
    {
      id: 15,
      username: 'joko',
      email: 'joko@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567804',
      role: 'user',
      profile_picture: 'joko.jpg'
    },
    {
      id: 16,
      username: 'karina',
      email: 'karina@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567805',
      role: 'user',
      profile_picture: 'karina.jpg'
    },
    {
      id: 17,
      username: 'lala',
      email: 'lala@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567806',
      role: 'user',
      profile_picture: 'lala.jpg'
    },
    {
      id: 18,
      username: 'miko',
      email: 'miko@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567807',
      role: 'user',
      profile_picture: 'miko.jpg'
    },
    {
      id: 19,
      username: 'nana',
      email: 'nana@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567808',
      role: 'user',
      profile_picture: 'nana.jpg'
    },
    {
      id: 20,
      username: 'oka',
      email: 'oka@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567809',
      role: 'user',
      profile_picture: 'oka.jpg'
    },
    {
      id: 21,
      username: 'pita',
      email: 'pita@student.telkomuniversity.ac.id',
      password: password,
      no_handphone: '081234567810',
      role: 'user',
      profile_picture: 'pita.jpg'
    }
  ]);
};