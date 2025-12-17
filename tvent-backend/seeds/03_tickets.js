/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tickets').del();
  
  // Inserts seed entries
  // Strategy: Make Event 2 (Music Festival) the most popular (featured)
  // Then Event 6 (Food Fest) and Event 15 (Jazz Night) as second and third
  await knex('tickets').insert([
    // ===== EVENT 2: MUSIC FESTIVAL (Most Sold - Featured) =====
    {
      id: 1,
      kode_tiket: 'TKT-001-2025',
      event_id: 2,
      user_id: 3,
      jumlah: 2,
      total_harga: 500000,
      status: 'confirmed',
      qr_code: 'qr-tkt-001.png'
    },
    {
      id: 2,
      kode_tiket: 'TKT-002-2025',
      event_id: 2,
      user_id: 4,
      jumlah: 3,
      total_harga: 750000,
      status: 'confirmed',
      qr_code: 'qr-tkt-002.png'
    },
    {
      id: 3,
      kode_tiket: 'TKT-003-2025',
      event_id: 2,
      user_id: 5,
      jumlah: 1,
      total_harga: 250000,
      status: 'confirmed',
      qr_code: 'qr-tkt-003.png'
    },
    {
      id: 4,
      kode_tiket: 'TKT-004-2025',
      event_id: 2,
      user_id: 6,
      jumlah: 2,
      total_harga: 500000,
      status: 'confirmed',
      qr_code: 'qr-tkt-004.png'
    },
    {
      id: 5,
      kode_tiket: 'TKT-005-2025',
      event_id: 2,
      user_id: 7,
      jumlah: 4,
      total_harga: 1000000,
      status: 'confirmed',
      qr_code: 'qr-tkt-005.png'
    },
    {
      id: 6,
      kode_tiket: 'TKT-006-2025',
      event_id: 2,
      user_id: 8,
      jumlah: 2,
      total_harga: 500000,
      status: 'confirmed',
      qr_code: 'qr-tkt-006.png'
    },
    {
      id: 7,
      kode_tiket: 'TKT-007-2025',
      event_id: 2,
      user_id: 9,
      jumlah: 3,
      total_harga: 750000,
      status: 'confirmed',
      qr_code: 'qr-tkt-007.png'
    },
    // ===== EVENT 6: FOOD FEST (Second Most Sold) =====
    {
      id: 8,
      kode_tiket: 'TKT-008-2025',
      event_id: 6,
      user_id: 10,
      jumlah: 2,
      total_harga: 100000,
      status: 'confirmed',
      qr_code: 'qr-tkt-008.png'
    },
    {
      id: 9,
      kode_tiket: 'TKT-009-2025',
      event_id: 6,
      user_id: 11,
      jumlah: 3,
      total_harga: 150000,
      status: 'confirmed',
      qr_code: 'qr-tkt-009.png'
    },
    {
      id: 10,
      kode_tiket: 'TKT-010-2025',
      event_id: 6,
      user_id: 12,
      jumlah: 2,
      total_harga: 100000,
      status: 'confirmed',
      qr_code: 'qr-tkt-010.png'
    },
    {
      id: 11,
      kode_tiket: 'TKT-011-2025',
      event_id: 6,
      user_id: 13,
      jumlah: 1,
      total_harga: 50000,
      status: 'confirmed',
      qr_code: 'qr-tkt-011.png'
    },
    {
      id: 12,
      kode_tiket: 'TKT-012-2025',
      event_id: 6,
      user_id: 14,
      jumlah: 2,
      total_harga: 100000,
      status: 'pending',
      qr_code: null
    },
    // ===== EVENT 15: JAZZ NIGHT (Third Most Sold) =====
    {
      id: 13,
      kode_tiket: 'TKT-013-2025',
      event_id: 15,
      user_id: 15,
      jumlah: 1,
      total_harga: 200000,
      status: 'confirmed',
      qr_code: 'qr-tkt-013.png'
    },
    {
      id: 14,
      kode_tiket: 'TKT-014-2025',
      event_id: 15,
      user_id: 3,
      jumlah: 2,
      total_harga: 400000,
      status: 'confirmed',
      qr_code: 'qr-tkt-014.png'
    },
    {
      id: 15,
      kode_tiket: 'TKT-015-2025',
      event_id: 15,
      user_id: 4,
      jumlah: 1,
      total_harga: 200000,
      status: 'confirmed',
      qr_code: 'qr-tkt-015.png'
    },
    {
      id: 16,
      kode_tiket: 'TKT-016-2025',
      event_id: 15,
      user_id: 5,
      jumlah: 2,
      total_harga: 400000,
      status: 'confirmed',
      qr_code: 'qr-tkt-016.png'
    },
    // ===== OTHER EVENTS (Less Popular) =====
    {
      id: 17,
      kode_tiket: 'TKT-017-2025',
      event_id: 1,
      user_id: 6,
      jumlah: 1,
      total_harga: 500000,
      status: 'confirmed',
      qr_code: 'qr-tkt-017.png'
    },
    {
      id: 18,
      kode_tiket: 'TKT-018-2025',
      event_id: 7,
      user_id: 7,
      jumlah: 1,
      total_harga: 75000,
      status: 'confirmed',
      qr_code: 'qr-tkt-018.png'
    },
    {
      id: 19,
      kode_tiket: 'TKT-019-2025',
      event_id: 8,
      user_id: 8,
      jumlah: 1,
      total_harga: 200000,
      status: 'pending',
      qr_code: null
    },
    {
      id: 20,
      kode_tiket: 'TKT-020-2025',
      event_id: 10,
      user_id: 11,
      jumlah: 1,
      total_harga: 100000,
      status: 'confirmed',
      qr_code: 'qr-tkt-020.png'
    },
    {
      id: 21,
      kode_tiket: 'TKT-021-2025',
      event_id: 11,
      user_id: 12,
      jumlah: 1,
      total_harga: 250000,
      status: 'confirmed',
      qr_code: 'qr-tkt-021.png'
    },
    {
      id: 22,
      kode_tiket: 'TKT-022-2025',
      event_id: 12,
      user_id: 14,
      jumlah: 2,
      total_harga: 150000,
      status: 'confirmed',
      qr_code: 'qr-tkt-022.png'
    },
    {
      id: 23,
      kode_tiket: 'TKT-023-2025',
      event_id: 18,
      user_id: 15,
      jumlah: 1,
      total_harga: 150000,
      status: 'confirmed',
      qr_code: 'qr-tkt-023.png'
    },
    {
      id: 24,
      kode_tiket: 'TKT-024-2025',
      event_id: 19,
      user_id: 6,
      jumlah: 1,
      total_harga: 2000000,
      status: 'confirmed',
      qr_code: 'qr-tkt-024.png'
    }
  ]);
};