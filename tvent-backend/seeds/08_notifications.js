/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('notifications').del();
  
  // Inserts seed entries
  await knex('notifications').insert([
    {
      id: 1,
      user_id: 3,
      title: 'Pembayaran Berhasil',
      message: 'Pembayaran tiket Tech Conference 2025 sebesar Rp 1.000.000 telah berhasil diproses.',
      type: 'payment',
      is_read: true
    },
    {
      id: 2,
      user_id: 4,
      title: 'Event Baru Tersedia',
      message: 'Event Music Festival Bandung telah dibuka! Dapatkan tiketmu sekarang.',
      type: 'event',
      is_read: true
    },
    {
      id: 3,
      user_id: 5,
      title: 'Reminder Event',
      message: 'Startup Meetup akan dimulai besok pukul 14:00 WIB. Jangan lupa hadir!',
      type: 'event',
      is_read: false
    },
    {
      id: 4,
      user_id: 2,
      title: 'Review Baru',
      message: 'Event Tech Conference 2025 mendapat review baru dari peserta.',
      type: 'review',
      is_read: false
    },
    {
      id: 5,
      user_id: 3,
      title: 'Pembaruan Sistem',
      message: 'Sistem T-Vent telah diperbarui dengan fitur-fitur baru. Cek sekarang!',
      type: 'system',
      is_read: false
    }
  ]);
};