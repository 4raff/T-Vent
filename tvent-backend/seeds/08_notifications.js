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
    },
    {
      id: 6,
      user_id: 6,
      title: 'Pembayaran Pending',
      message: 'Pembayaran tiket Food Fest Bandung masih pending. Silakan selesaikan dalam 24 jam.',
      type: 'payment',
      is_read: true
    },
    {
      id: 7,
      user_id: 7,
      title: 'Tiket Dikonfirmasi',
      message: 'Tiket untuk Art Exhibition telah dikonfirmasi. Silakan datang ke lokasi acara.',
      type: 'ticket',
      is_read: true
    },
    {
      id: 8,
      user_id: 8,
      title: 'Event Terbatal',
      message: 'Maaf, event Fashion Show harus dibatalkan karena ketentuan venue. Uang tiket akan dikembalikan.',
      type: 'event',
      is_read: true
    },
    {
      id: 9,
      user_id: 9,
      title: 'Reminder Event Hari Ini',
      message: 'Gaming Tournament dimulai dalam 2 jam! Pastikan sudah siap dengan setup gaming Anda.',
      type: 'event',
      is_read: false
    },
    {
      id: 10,
      user_id: 10,
      title: 'Review Terima Kasih',
      message: 'Terima kasih telah memberikan review untuk Educational Summit. Masukan Anda sangat berharga!',
      type: 'review',
      is_read: false
    },
    {
      id: 11,
      user_id: 11,
      title: 'Promosi Spesial',
      message: 'Dapatkan diskon 20% untuk Fitness Bootcamp dengan kode promo: FITX2025',
      type: 'promotion',
      is_read: false
    },
    {
      id: 12,
      user_id: 12,
      title: 'Tiket Berhasil Dipesan',
      message: 'Tiket untuk Film Screening sudah berhasil dipesan. Detail tiket sudah dikirim ke email.',
      type: 'ticket',
      is_read: true
    },
    {
      id: 13,
      user_id: 13,
      title: 'Pembayaran Gagal',
      message: 'Transaksi pembayaran untuk Jazz Night gagal. Silakan coba lagi atau gunakan metode pembayaran lain.',
      type: 'payment',
      is_read: true
    },
    {
      id: 14,
      user_id: 14,
      title: 'Event Favorit Tersedia',
      message: 'Event Coding Bootcamp yang Anda simpan sudah membuka pendaftaran! Jangan sampai kehabisan.',
      type: 'event',
      is_read: false
    },
    {
      id: 15,
      user_id: 15,
      title: 'Undangan Event Eksklusif',
      message: 'Anda diundang untuk menghadiri exclusive pre-event Community Cleanup. RSVP di sini.',
      type: 'event',
      is_read: false
    },
    {
      id: 16,
      user_id: 3,
      title: 'Pembayaran Terima Kasih',
      message: 'Pembayaran untuk Webinar Digital Marketing telah diterima. Link akses akan dikirim 1 jam sebelum event.',
      type: 'payment',
      is_read: true
    },
    {
      id: 17,
      user_id: 4,
      title: 'Review dari Peserta',
      message: 'Peserta lain memberikan review positif untuk event Anda. Baca detail reviewnya.',
      type: 'review',
      is_read: true
    },
    {
      id: 18,
      user_id: 5,
      title: 'Event Reminder 1 Hari',
      message: 'Stand Up Comedy oleh Deddy Corbuzier dimulai besok! Jangan lewatkan comedy show terbaik tahun ini.',
      type: 'event',
      is_read: false
    },
    {
      id: 19,
      user_id: 6,
      title: 'Tiket QR Code Ready',
      message: 'QR Code tiket Anda untuk Yoga Retreat sudah siap. Scan saat check-in di lokasi event.',
      type: 'ticket',
      is_read: true
    },
    {
      id: 20,
      user_id: 7,
      title: 'Pembayaran Otomatis',
      message: 'Pembayaran cicilan pertama untuk Book Club Meeting telah berhasil diproses otomatis.',
      type: 'payment',
      is_read: true
    },
    {
      id: 21,
      user_id: 8,
      title: 'Event Update',
      message: 'Drone Racing event lokasi dipindahkan ke Lapangan Banteng. Lihat detail lokasi terbaru.',
      type: 'event',
      is_read: false
    },
    {
      id: 22,
      user_id: 9,
      title: 'Terima Kasih Feedback',
      message: 'Terima kasih atas feedback untuk Language Exchange event. Kami terus improve berdasarkan masukan Anda.',
      type: 'review',
      is_read: true
    },
    {
      id: 23,
      user_id: 10,
      title: 'Refund Berhasil',
      message: 'Refund untuk tiket yang dibatalkan sudah masuk ke rekening Anda. Periksa laporan pembayaran Anda.',
      type: 'payment',
      is_read: true
    },
    {
      id: 24,
      user_id: 11,
      title: 'Event Sukses Berlalu',
      message: 'Terima kasih telah menghadiri Fitness Bootcamp kami! Sertifikat kehadiran sudah kami kirim.',
      type: 'event',
      is_read: false
    }
  ]);
};