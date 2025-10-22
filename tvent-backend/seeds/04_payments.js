/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('payments').del();
  
  // Inserts seed entries
  await knex('payments').insert([
    {
      id: 1,
      kode_pembayaran: 'PAY-001-2025',
      ticket_id: 1,
      user_id: 3,
      jumlah: 1000000,
      metode_pembayaran: 'e-wallet',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-15 14:30:00')
    },
    {
      id: 2,
      kode_pembayaran: 'PAY-002-2025',
      ticket_id: 2,
      user_id: 4,
      jumlah: 250000,
      metode_pembayaran: 'qris',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-16 10:20:00')
    },
    {
      id: 3,
      kode_pembayaran: 'PAY-003-2025',
      ticket_id: 3,
      user_id: 5,
      jumlah: 0,
      metode_pembayaran: 'bank_transfer',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-17 09:15:00')
    },
    {
      id: 4,
      kode_pembayaran: 'PAY-004-2025',
      ticket_id: 4,
      user_id: 2,
      jumlah: 350000,
      metode_pembayaran: 'credit_card',
      status: 'pending',
      tanggal_pembayaran: null
    },
    {
      id: 5,
      kode_pembayaran: 'PAY-005-2025',
      ticket_id: 5,
      user_id: 5,
      jumlah: 750000,
      metode_pembayaran: 'e-wallet',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-18 16:45:00')
    }
  ]);
};