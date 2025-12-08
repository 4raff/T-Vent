/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('events').del();
  
  // Inserts seed entries with real image URLs
  await knex('events').insert([
    {
      id: 1,
      nama: 'Tech Conference 2025',
      deskripsi: 'Konferensi teknologi terbesar di Indonesia yang menghadirkan speaker internasional dan workshop interaktif',
      tanggal: new Date('2025-12-15 09:00:00'),
      lokasi: 'Jakarta Convention Center',
      harga: 500000,
      kategori: 'Technology',
      poster: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
      jumlah_tiket: 500,
      tiket_tersedia: 500,
      created_by: 2,
      status: 'approved'
    },
    {
      id: 2,
      nama: 'Music Festival Bandung',
      deskripsi: 'Festival musik dengan lineup band-band ternama Indonesia yang siap menghibur Anda sepanjang hari',
      tanggal: new Date('2025-11-20 16:00:00'),
      lokasi: 'Lapangan Gasibu, Bandung',
      harga: 250000,
      kategori: 'Music',
      poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=400&fit=crop',
      jumlah_tiket: 1000,
      tiket_tersedia: 950,
      created_by: 3,
      status: 'approved'
    },
    {
      id: 3,
      nama: 'Startup Meetup',
      deskripsi: 'Pertemuan para founder startup untuk networking dan sharing experience tentang membangun bisnis dari nol',
      tanggal: new Date('2025-11-05 14:00:00'),
      lokasi: 'Telkom University, Bandung',
      harga: 0,
      kategori: 'Business',
      poster: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
      jumlah_tiket: 200,
      tiket_tersedia: 180,
      created_by: 4,
      status: 'approved'
    },
    {
      id: 4,
      nama: 'Workshop Photography',
      deskripsi: 'Workshop fotografi untuk pemula sampai advanced, langsung praktek di lapangan dengan mentor profesional',
      tanggal: new Date('2025-11-10 08:00:00'),
      lokasi: 'Studio Foto Bandung Creative Hub',
      harga: 350000,
      kategori: 'Workshop',
      poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=400&fit=crop',
      jumlah_tiket: 30,
      tiket_tersedia: 25,
      created_by: 5,
      status: 'approved'
    },
    {
      id: 5,
      nama: 'Charity Run 2025',
      deskripsi: 'Lari amal untuk penggalangan dana pendidikan anak-anak kurang mampu, ajak keluarga dan teman Anda',
      tanggal: new Date('2025-12-01 06:00:00'),
      lokasi: 'Car Free Day Dago, Bandung',
      harga: 100000,
      kategori: 'Sports',
      poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop',
      jumlah_tiket: 800,
      tiket_tersedia: 800,
      created_by: 2,
      status: 'approved'
    }
  ]);
};