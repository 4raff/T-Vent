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
    },
    {
      id: 6,
      sender_id: 6,
      receiver_id: 2,
      content: 'Apakah masih ada slot untuk Food Fest? Saya ingin mengajak teman-teman.',
      is_read: false
    },
    {
      id: 7,
      sender_id: 2,
      receiver_id: 6,
      content: 'Masih ada! Silakan segera daftar sebelum kuota penuh.',
      is_read: false
    },
    {
      id: 8,
      sender_id: 7,
      receiver_id: 3,
      content: 'Saya sudah daftar Art Exhibition. Kapan pembayaran harus selesai?',
      is_read: true
    },
    {
      id: 9,
      sender_id: 8,
      receiver_id: 4,
      content: 'Untuk Business Seminar, apakah materi akan diberikan dalam bentuk e-book?',
      is_read: true
    },
    {
      id: 10,
      sender_id: 4,
      receiver_id: 8,
      content: 'Ya, semua peserta akan mendapatkan e-book materi dan sertifikat digitale.',
      is_read: true
    },
    {
      id: 11,
      sender_id: 9,
      receiver_id: 5,
      content: 'Apakah Gaming Tournament bisa diikuti oleh tim dari luar kota?',
      is_read: false
    },
    {
      id: 12,
      sender_id: 10,
      receiver_id: 6,
      content: 'Saya tertarik dengan Educational Summit. Bisa minta kurikulum lengkapnya?',
      is_read: true
    },
    {
      id: 13,
      sender_id: 11,
      receiver_id: 2,
      content: 'Apakah ada pembayaran cicilan untuk Fitness Bootcamp?',
      is_read: false
    },
    {
      id: 14,
      sender_id: 2,
      receiver_id: 11,
      content: 'Ada, kami menyediakan opsi cicilan 3 kali. Hubungi admin untuk detailnya.',
      is_read: false
    },
    {
      id: 15,
      sender_id: 12,
      receiver_id: 3,
      content: 'Saya mau bertanya tentang jadwal putar film untuk Film Screening.',
      is_read: true
    },
    {
      id: 16,
      sender_id: 13,
      receiver_id: 4,
      content: 'Apakah peserta Fashion Show perlu membawa apa-apa?',
      is_read: true
    },
    {
      id: 17,
      sender_id: 14,
      receiver_id: 5,
      content: 'Coding Bootcamp terlihat bagus. Apa syarat pendaftarannya?',
      is_read: false
    },
    {
      id: 18,
      sender_id: 5,
      receiver_id: 14,
      content: 'Syaratnya hanya kemampuan basic programming. Kita akan ajarkan dari dasar.',
      is_read: false
    },
    {
      id: 19,
      sender_id: 15,
      receiver_id: 2,
      content: 'Saya sudah membeli tiket Jazz Night. Apakah ada meet and greet dengan musisi?',
      is_read: true
    },
    {
      id: 20,
      sender_id: 2,
      receiver_id: 15,
      content: 'Ya! Ada meet and greet eksklusif untuk early birds yang membeli tiket.',
      is_read: true
    },
    {
      id: 21,
      sender_id: 3,
      receiver_id: 6,
      content: 'Community Cleanup event terlihat menarik. Dari jam berapa sampai jam berapa?',
      is_read: false
    },
    {
      id: 22,
      sender_id: 6,
      receiver_id: 3,
      content: 'Dari jam 7 pagi sampai jam 11 siang. Peserta dapat free merchandise.',
      is_read: false
    },
    {
      id: 23,
      sender_id: 4,
      receiver_id: 7,
      content: 'Apakah Digital Marketing webinar bisa disaksikan offline atau online saja?',
      is_read: true
    },
    {
      id: 24,
      sender_id: 7,
      receiver_id: 4,
      content: 'Hanya online via Zoom untuk kali ini, tapi akan ada recording untuk yang ketinggalan.',
      is_read: true
    }
  ]);
};