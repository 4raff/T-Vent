const eventRepository = require('../repositories/eventRepository');
const ticketRepository = require('../repositories/ticketRepository');
const notificationRepository = require('../repositories/notificationRepository');
const db = require('../config/database');

class ReminderService {
  /**
   * Kirim reminder 1 hari sebelum event untuk pembeli tiket yang sudah approved
   */
  async sendEventReminderNotifications() {
    try {
      console.log('⏰ [REMINDER JOB] Checking for events that need reminders...');
      
      // Hitung tanggal besok
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];
      
      console.log(`📅 Looking for events on: ${tomorrowDate}`);
      
      // Query events yang tanggalnya besok dan status approved
      const upcomingEvents = await db('events')
        .where({ status: 'approved' })
        .whereRaw(`DATE(tanggal) = ?`, [tomorrowDate])
        .select('*');
      
      if (upcomingEvents.length === 0) {
        console.log('✅ Tidak ada event yang perlu reminder hari ini');
        return { success: true, remindersSent: 0 };
      }
      
      console.log(`📢 Found ${upcomingEvents.length} events for reminder`);
      
      let totalReminders = 0;
      
      // Untuk setiap event, cari pembeli tiket yang sudah confirmed
      for (const event of upcomingEvents) {
        console.log(`\n🎉 Processing event: ${event.nama_event} (ID: ${event.id})`);
        
        // Cari semua tiket yang confirmed untuk event ini
        const confirmedTickets = await db('tickets')
          .where({ 
            event_id: event.id, 
            status: 'confirmed'
          })
          .select('*');
        
        console.log(`🎫 Found ${confirmedTickets.length} confirmed tickets`);
        
        // Untuk setiap tiket, kirim notifikasi reminder ke user
        for (const ticket of confirmedTickets) {
          // Cek apakah user sudah menerima reminder untuk event ini
          const existingReminder = await db('notifications')
            .where({ 
              user_id: ticket.user_id, 
              type: 'event_reminder',
              message: `Event "${event.nama_event}" akan dimulai besok!`
            })
            .first();
          
          if (!existingReminder) {
            // Buat notifikasi reminder
            await notificationRepository.create({
              user_id: ticket.user_id,
              title: '⏰ Pengingat Event',
              message: `Event "${event.nama_event}" akan dimulai besok pada pukul ${event.jam_mulai}!`,
              type: 'event_reminder',
              is_read: false
            });
            
            console.log(`✉️  Reminder sent to user ${ticket.user_id}`);
            totalReminders++;
          }
        }
      }
      
      console.log(`\n✅ Total reminders sent: ${totalReminders}`);
      return { 
        success: true, 
        remindersSent: totalReminders,
        message: `Reminder notifikasi terkirim untuk ${totalReminders} pembeli tiket`
      };
      
    } catch (error) {
      console.error('❌ Error in sendEventReminderNotifications:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Kirim notifikasi event confirmed/approved
   */
  async sendEventApprovedNotification(eventId) {
    try {
      const event = await eventRepository.findById(eventId);
      
      if (!event) {
        throw new Error('Event tidak ditemukan');
      }
      
      // Kirim notifikasi ke organizer (pembuat event)
      await notificationRepository.create({
        user_id: event.created_by,
        title: '✅ Event Disetujui',
        message: `Event "${event.nama_event}" Anda telah disetujui oleh admin dan sekarang bisa dibeli oleh pembeli!`,
        type: 'event_approved',
        is_read: false
      });
      
      console.log(`✅ Event approved notification sent to organizer ${event.created_by}`);
      return { 
        success: true, 
        message: 'Notifikasi event approved berhasil dikirim ke organizer' 
      };
      
    } catch (error) {
      console.error('❌ Error in sendEventApprovedNotification:', error);
      throw error;
    }
  }

  /**
   * Kirim notifikasi event completed
   */
  async sendEventCompletedNotification(eventId) {
    try {
      const event = await eventRepository.findById(eventId);
      
      if (!event) {
        throw new Error('Event tidak ditemukan');
      }
      
      // Cari semua pembeli tiket yang confirmed
      const confirmedTickets = await db('tickets')
        .where({ 
          event_id: eventId, 
          status: 'confirmed'
        })
        .select('*');
      
      console.log(`📢 Sending event completed notification to ${confirmedTickets.length} users`);
      
      // Kirim notifikasi ke semua pembeli tiket
      for (const ticket of confirmedTickets) {
        await notificationRepository.create({
          user_id: ticket.user_id,
          title: '🎉 Event Selesai',
          message: `Event "${event.nama_event}" telah selesai! Terima kasih telah menghadiri. Yuk tinggalkan review untuk acara ini!`,
          type: 'event_completed',
          is_read: false
        });
      }
      
      // Kirim notifikasi ke organizer
      await notificationRepository.create({
        user_id: event.created_by,
        title: '🎉 Event Anda Selesai',
        message: `Event "${event.nama_event}" telah selesai! Terima kasih kepada ${confirmedTickets.length} peserta yang hadir.`,
        type: 'event_completed',
        is_read: false
      });
      
      console.log(`✅ Event completed notifications sent`);
      return { 
        success: true, 
        notificationsSent: confirmedTickets.length + 1
      };
      
    } catch (error) {
      console.error('❌ Error in sendEventCompletedNotification:', error);
      throw error;
    }
  }
}

module.exports = new ReminderService();
