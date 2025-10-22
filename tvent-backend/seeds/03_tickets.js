/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tickets').del();
  
  // Inserts seed entries
  await knex('tickets').insert([
    {
      id: 1,
      kode_tiket: 'TKT-001-2025',
      event_id: 1,
      user_id: 3,
      jumlah: 2,
      total_harga: 1000000,
      status: 'confirmed',
      qr_code: 'qr-tkt-001.png'
    },
    {
      id: 2,
      kode_tiket: 'TKT-002-2025',
      event_id: 2,
      user_id: 4,
      jumlah: 1,
      total_harga: 250000,
      status: 'confirmed',
      qr_code: 'qr-tkt-002.png'
    },
    {
      id: 3,
      kode_tiket: 'TKT-003-2025',
      event_id: 3,
      user_id: 5,
      jumlah: 1,
      total_harga: 0,
      status: 'confirmed',
      qr_code: 'qr-tkt-003.png'
    },
    {
      id: 4,
      kode_tiket: 'TKT-004-2025',
      event_id: 4,
      user_id: 2,
      jumlah: 1,
      total_harga: 350000,
      status: 'pending',
      qr_code: null
    },
    {
      id: 5,
      kode_tiket: 'TKT-005-2025',
      event_id: 2,
      user_id: 5,
      jumlah: 3,
      total_harga: 750000,
      status: 'confirmed',
      qr_code: 'qr-tkt-005.png'
    }
  ]);
};