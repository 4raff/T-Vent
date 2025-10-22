/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('events').del();
  
  // Inserts seed entries
  await knex('events').insert([
    {
      id: 1,
      nama: 'Tech Conference 2025',
      deskripsi: 'Konferensi teknologi terbesar di Indonesia yang menghadirkan speaker internasional dan workshop interaktif',
      tanggal: new Date('2025-12-15 09:00:00'),
      lokasi: 'Jakarta Convention Center',
      harga: 500000,
      kategori: 'Technology',
      poster: 'tech-conference-2025.jpg',
      jumlah_tiket: 500,
      tiket_tersedia: 500,
      created_by: 2,
      status: 'approved'
    },
    {
      id: 2,
      nama: 'Music Festival Bandung',
      deskripsi: 'Festival musik dengan lineup band-band ternama Indonesia',
      tanggal: new Date('2025-11-20 16:00:00'),
      lokasi: 'Lapangan Gasibu, Bandung',
      harga: 250000,
      kategori: 'Music',
      poster: 'music-festival.jpg',
      jumlah_tiket: 1000,
      tiket_tersedia: 950,
      created_by: 3,
      status: 'approved'
    },
    {
      id: 3,
      nama: 'Startup Meetup',
      deskripsi: 'Pertemuan para founder startup untuk networking dan sharing experience',
      tanggal: new Date('2025-11-05 14:00:00'),
      lokasi: 'Telkom University, Bandung',
      harga: 0,
      kategori: 'Business',
      poster: 'startup-meetup.jpg',
      jumlah_tiket: 200,
      tiket_tersedia: 180,
      created_by: 4,
      status: 'approved'
    },
    {
      id: 4,
      nama: 'Workshop Photography',
      deskripsi: 'Workshop fotografi untuk pemula sampai advanced, langsung praktek di lapangan',
      tanggal: new Date('2025-11-10 08:00:00'),
      lokasi: 'Studio Foto Bandung Creative Hub',
      harga: 350000,
      kategori: 'Workshop',
      poster: 'workshop-photo.jpg',
      jumlah_tiket: 30,
      tiket_tersedia: 25,
      created_by: 5,
      status: 'approved'
    },
    {
      id: 5,
      nama: 'Charity Run 2025',
      deskripsi: 'Lari amal untuk penggalangan dana pendidikan anak-anak kurang mampu',
      tanggal: new Date('2025-12-01 06:00:00'),
      lokasi: 'Car Free Day Dago, Bandung',
      harga: 100000,
      kategori: 'Sports',
      poster: 'charity-run.jpg',
      jumlah_tiket: 800,
      tiket_tersedia: 800,
      created_by: 2,
      status: 'approved'
    }
  ]);
};