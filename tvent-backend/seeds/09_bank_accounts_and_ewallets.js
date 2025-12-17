/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('bank_accounts').del();
  await knex('ewallet_providers').del();

  // Insert default bank accounts
  await knex('bank_accounts').insert([
    {
      bank_name: 'Bank Mandiri',
      account_number: '1230456789',
      account_holder: 'PT T-Vent Indonesia',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      bank_name: 'BCA',
      account_number: '9876543210',
      account_holder: 'PT T-Vent Indonesia',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      bank_name: 'BNI',
      account_number: '0192837465',
      account_holder: 'PT T-Vent Indonesia',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Insert default ewallet providers
  await knex('ewallet_providers').insert([
    {
      name: 'GCash',
      code: 'gcash',
      account_number: '09123456789',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'PayMaya',
      code: 'paymaya',
      account_number: '09987654321',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Jeepney',
      code: 'jeepney',
      account_number: '09555666777',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};
