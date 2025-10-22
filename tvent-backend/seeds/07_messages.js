/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('messages').del();
  
  // Inserts seed entries
  await knex('messages').insert([
    {
      id: 1,
      sender_id: 3,
      receiver_id: 2,
      content: 'Halo, saya mau tanya tentang Tech Conference. Apakah ada sesi workshop?',
      is_read: true
    },
    {
      id: 2,
      sender_id: 2,
      receiver_id: 3,
      content: 'Halo! Ya, ada beberapa workshop yang bisa diikuti. Silakan cek jadwalnya di deskripsi event.',
      is_read: true
    },
    {
      id: 3,
      sender_id: 4,
      receiver_id: 3,
      content: 'Apakah untuk Music Festival ada diskon untuk mahasiswa?',
      is_read: false
    },
    {
      id: 4,
      sender_id: 5,
      receiver_id: 4,
      content: 'Info dong untuk Workshop Photography, materinya apa aja?',
      is_read: true
    },
    {
      id: 5,
      sender_id: 2,
      receiver_id: 5,
      content: 'Terima kasih sudah mendaftar Charity Run! Jangan lupa datang tepat waktu ya.',
      is_read: true
    }
  ]);
};