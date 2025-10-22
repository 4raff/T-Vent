// setup-database.js
// Script untuk setup database secara otomatis

const knex = require('./src/config/database'); // sesuaikan dengan path database config Anda

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    // Step 1: Rollback all migrations (optional - hati-hati ini akan menghapus semua data!)
    console.log('⏮️  Rolling back all migrations...');
    await knex.migrate.rollback(null, true);
    console.log('✅ Rollback completed\n');

    // Step 2: Run all migrations
    console.log('📦 Running migrations...');
    await knex.migrate.latest();
    console.log('✅ All migrations completed\n');

    // Step 3: Run all seeds
    console.log('🌱 Running seeds...');
    await knex.seed.run();
    console.log('✅ All seeds completed\n');

    console.log('🎉 Database setup completed successfully!');
    console.log('\nDatabase Tables Created:');
    console.log('  ✓ users (5 entries)');
    console.log('  ✓ events (5 entries)');
    console.log('  ✓ tickets (5 entries)');
    console.log('  ✓ payments (5 entries)');
    console.log('  ✓ reviews (5 entries)');
    console.log('  ✓ bookmarks (5 entries)');
    console.log('  ✓ messages (5 entries)');
    console.log('  ✓ notifications (5 entries)');
    console.log('\n📝 Default login credentials:');
    console.log('  Admin: admin@tvent.com / password123');
    console.log('  User: dzakhwan@student.telkomuniversity.ac.id / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database setup:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();