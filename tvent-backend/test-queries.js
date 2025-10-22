// test-queries.js
// Script untuk testing query database T-Vent

const knex = require('./src/config/database'); // sesuaikan dengan path database config Anda

async function testQueries() {
  try {
    console.log('🧪 Testing Database Queries...\n');

    // Test 1: Get all users
    console.log('1️⃣ GET ALL USERS:');
    const users = await knex('users').select('id', 'username', 'email', 'role');
    console.table(users);

    // Test 2: Get all approved events with creator info
    console.log('\n2️⃣ GET APPROVED EVENTS WITH CREATOR:');
    const events = await knex('events')
      .join('users', 'events.created_by', 'users.id')
      .where('events.status', 'approved')
      .select(
        'events.id',
        'events.nama',
        'events.kategori',
        'events.harga',
        'events.tiket_tersedia',
        'users.username as creator'
      );
    console.table(events);

    // Test 3: Get tickets with event and user info
    console.log('\n3️⃣ GET TICKETS WITH EVENT & USER INFO:');
    const tickets = await knex('tickets')
      .join('events', 'tickets.event_id', 'events.id')
      .join('users', 'tickets.user_id', 'users.id')
      .select(
        'tickets.kode_tiket',
        'events.nama as event_name',
        'users.username',
        'tickets.jumlah',
        'tickets.total_harga',
        'tickets.status'
      );
    console.table(tickets);

    // Test 4: Get payments with status success
    console.log('\n4️⃣ GET SUCCESSFUL PAYMENTS:');
    const payments = await knex('payments')
      .join('tickets', 'payments.ticket_id', 'tickets.id')
      .join('users', 'payments.user_id', 'users.id')
      .where('payments.status', 'success')
      .select(
        'payments.kode_pembayaran',
        'users.username',
        'tickets.kode_tiket',
        'payments.jumlah',
        'payments.metode_pembayaran',
        'payments.tanggal_pembayaran'
      );
    console.table(payments);

    // Test 5: Get event reviews with user info
    console.log('\n5️⃣ GET EVENT REVIEWS:');
    const reviews = await knex('reviews')
      .join('events', 'reviews.event_id', 'events.id')
      .join('users', 'reviews.user_id', 'users.id')
      .select(
        'events.nama as event_name',
        'users.username',
        'reviews.rating',
        'reviews.feedback'
      );
    console.table(reviews);

    // Test 6: Get user bookmarks
    console.log('\n6️⃣ GET USER BOOKMARKS:');
    const bookmarks = await knex('bookmarks')
      .join('users', 'bookmarks.user_id', 'users.id')
      .join('events', 'bookmarks.event_id', 'events.id')
      .select(
        'users.username',
        'events.nama as event_name',
        'events.tanggal',
        'bookmarks.created_at'
      );
    console.table(bookmarks);

    // Test 7: Get messages between users
    console.log('\n7️⃣ GET MESSAGES:');
    const messages = await knex('messages')
      .join('users as sender', 'messages.sender_id', 'sender.id')
      .join('users as receiver', 'messages.receiver_id', 'receiver.id')
      .select(
        'sender.username as from',
        'receiver.username as to',
        'messages.content',
        'messages.is_read',
        'messages.created_at'
      )
      .orderBy('messages.created_at', 'desc');
    console.table(messages);

    // Test 8: Get unread notifications
    console.log('\n8️⃣ GET UNREAD NOTIFICATIONS:');
    const notifications = await knex('notifications')
      .join('users', 'notifications.user_id', 'users.id')
      .where('notifications.is_read', false)
      .select(
        'users.username',
        'notifications.title',
        'notifications.message',
        'notifications.type',
        'notifications.created_at'
      );
    console.table(notifications);

    // Test 9: Get event statistics
    console.log('\n9️⃣ EVENT STATISTICS:');
    const eventStats = await knex('events')
      .leftJoin('tickets', 'events.id', 'tickets.event_id')
      .leftJoin('reviews', 'events.id', 'reviews.event_id')
      .groupBy('events.id')
      .select(
        'events.nama',
        knex.raw('COUNT(DISTINCT tickets.id) as total_tickets_sold'),
        knex.raw('COALESCE(AVG(reviews.rating), 0) as avg_rating'),
        knex.raw('COUNT(DISTINCT reviews.id) as total_reviews')
      );
    console.table(eventStats);

    // Test 10: Get user transaction history
    console.log('\n🔟 USER TRANSACTION HISTORY (user_id = 5):');
    const userTransactions = await knex('payments')
      .join('tickets', 'payments.ticket_id', 'tickets.id')
      .join('events', 'tickets.event_id', 'events.id')
      .where('payments.user_id', 5)
      .select(
        'payments.kode_pembayaran',
        'events.nama as event_name',
        'payments.jumlah',
        'payments.status',
        'payments.tanggal_pembayaran'
      )
      .orderBy('payments.created_at', 'desc');
    console.table(userTransactions);

    console.log('\n✅ All queries executed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during query testing:', error);
    process.exit(1);
  }
}

// Run the tests
testQueries();