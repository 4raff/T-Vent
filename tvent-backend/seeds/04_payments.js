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
    },
    {
      id: 6,
      kode_pembayaran: 'PAY-006-2025',
      ticket_id: 6,
      user_id: 6,
      jumlah: 500000,
      metode_pembayaran: 'bank_transfer',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-19 11:30:00')
    },
    {
      id: 7,
      kode_pembayaran: 'PAY-007-2025',
      ticket_id: 7,
      user_id: 7,
      jumlah: 100000,
      metode_pembayaran: 'qris',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-20 13:15:00')
    },
    {
      id: 8,
      kode_pembayaran: 'PAY-008-2025',
      ticket_id: 8,
      user_id: 8,
      jumlah: 75000,
      metode_pembayaran: 'e-wallet',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-21 15:45:00')
    },
    {
      id: 9,
      kode_pembayaran: 'PAY-009-2025',
      ticket_id: 9,
      user_id: 9,
      jumlah: 200000,
      metode_pembayaran: 'credit_card',
      status: 'pending',
      tanggal_pembayaran: null
    },
    {
      id: 10,
      kode_pembayaran: 'PAY-010-2025',
      ticket_id: 10,
      user_id: 10,
      jumlah: 300000,
      metode_pembayaran: 'bank_transfer',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-22 09:00:00')
    },
    {
      id: 11,
      kode_pembayaran: 'PAY-011-2025',
      ticket_id: 11,
      user_id: 11,
      jumlah: 100000,
      metode_pembayaran: 'qris',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-23 14:20:00')
    },
    {
      id: 12,
      kode_pembayaran: 'PAY-012-2025',
      ticket_id: 12,
      user_id: 12,
      jumlah: 250000,
      metode_pembayaran: 'e-wallet',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-24 10:30:00')
    },
    {
      id: 13,
      kode_pembayaran: 'PAY-013-2025',
      ticket_id: 13,
      user_id: 13,
      jumlah: 100000,
      metode_pembayaran: 'credit_card',
      status: 'pending',
      tanggal_pembayaran: null
    },
    {
      id: 14,
      kode_pembayaran: 'PAY-014-2025',
      ticket_id: 14,
      user_id: 14,
      jumlah: 150000,
      metode_pembayaran: 'bank_transfer',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-25 12:15:00')
    },
    {
      id: 15,
      kode_pembayaran: 'PAY-015-2025',
      ticket_id: 15,
      user_id: 15,
      jumlah: 200000,
      metode_pembayaran: 'qris',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-26 16:00:00')
    },
    {
      id: 16,
      kode_pembayaran: 'PAY-016-2025',
      ticket_id: 16,
      user_id: 3,
      jumlah: 5000000,
      metode_pembayaran: 'bank_transfer',
      status: 'pending',
      tanggal_pembayaran: null
    },
    {
      id: 17,
      kode_pembayaran: 'PAY-017-2025',
      ticket_id: 17,
      user_id: 4,
      jumlah: 150000,
      metode_pembayaran: 'e-wallet',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-27 18:30:00')
    },
    {
      id: 18,
      kode_pembayaran: 'PAY-018-2025',
      ticket_id: 18,
      user_id: 5,
      jumlah: 2000000,
      metode_pembayaran: 'credit_card',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-28 11:45:00')
    },
    {
      id: 19,
      kode_pembayaran: 'PAY-019-2025',
      ticket_id: 19,
      user_id: 6,
      jumlah: 50000,
      metode_pembayaran: 'qris',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-29 13:20:00')
    },
    {
      id: 20,
      kode_pembayaran: 'PAY-020-2025',
      ticket_id: 20,
      user_id: 7,
      jumlah: 100000,
      metode_pembayaran: 'bank_transfer',
      status: 'pending',
      tanggal_pembayaran: null
    },
    {
      id: 21,
      kode_pembayaran: 'PAY-021-2025',
      ticket_id: 21,
      user_id: 8,
      jumlah: 0,
      metode_pembayaran: 'e-wallet',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-30 10:00:00')
    },
    {
      id: 22,
      kode_pembayaran: 'PAY-022-2025',
      ticket_id: 22,
      user_id: 9,
      jumlah: 1000000,
      metode_pembayaran: 'credit_card',
      status: 'success',
      tanggal_pembayaran: new Date('2025-10-31 15:30:00')
    },
    {
      id: 23,
      kode_pembayaran: 'PAY-023-2025',
      ticket_id: 23,
      user_id: 10,
      jumlah: 50000,
      metode_pembayaran: 'qris',
      status: 'cancelled',
      tanggal_pembayaran: null
    },
    {
      id: 24,
      kode_pembayaran: 'PAY-024-2025',
      ticket_id: 24,
      user_id: 11,
      jumlah: 600000,
      metode_pembayaran: 'bank_transfer',
      status: 'success',
      tanggal_pembayaran: new Date('2025-11-01 09:45:00')
    }
  ]);
};