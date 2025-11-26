const userRepository = require('../repositories/userRepository');
const eventRepository = require('../repositories/eventRepository');
const paymentRepository = require('../repositories/paymentRepository');
const ticketRepository = require('../repositories/ticketRepository');
const db = require('../config/database');

class AdminService {
  constructor() {
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
    this.paymentRepository = paymentRepository;
    this.ticketRepository = ticketRepository;
  }

  // Event Approval Management (Admin Only)
  async approveEvent(eventId) {
    try {
      const event = await this.eventRepository.update(eventId, {
        status: 'approved',
        updated_at: new Date(),
      });
      return event;
    } catch (error) {
      throw new Error(`Gagal approve event: ${error.message}`);
    }
  }

  async rejectEvent(eventId) {
    try {
      const event = await this.eventRepository.update(eventId, {
        status: 'rejected',
        updated_at: new Date(),
      });
      return event;
    } catch (error) {
      throw new Error(`Gagal reject event: ${error.message}`);
    }
  }

  async cancelEvent(eventId) {
    try {
      const event = await this.eventRepository.update(eventId, {
        status: 'cancelled',
        updated_at: new Date(),
      });
      return event;
    } catch (error) {
      throw new Error(`Gagal cancel event: ${error.message}`);
    }
  }

  async completeEvent(eventId) {
    try {
      const event = await this.eventRepository.update(eventId, {
        status: 'completed',
        updated_at: new Date(),
      });
      return event;
    } catch (error) {
      throw new Error(`Gagal complete event: ${error.message}`);
    }
  }

  // Dashboard Stats
  async getDashboardStats() {
    try {
      const userStats = await this.userRepository.findAll({}, 1, 10000);
      const eventStats = await this.eventRepository.findAll({}, 1, 10000);
      const paymentStats = await this.paymentRepository.findByStatus('completed', 1, 10000);

      const students = userStats.users.filter((u) => u.role === 'student').length;
      const organizers = userStats.users.filter((u) => u.role === 'organizer').length;
      const admins = userStats.users.filter((u) => u.role === 'admin').length;

      const upcomingEvents = eventStats.events.filter((e) => e.status === 'upcoming').length;
      const completedEvents = eventStats.events.filter((e) => e.status === 'completed').length;

      const totalRevenue = paymentStats.payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      return {
        totalUsers: userStats.total,
        totalStudents: students,
        totalOrganizers: organizers,
        totalAdmins: admins,
        totalEvents: eventStats.total,
        upcomingEvents,
        completedEvents,
        totalRevenue,
        totalTransactions: paymentStats.total,
      };
    } catch (error) {
      throw new Error(`Gagal mendapatkan dashboard stats: ${error.message}`);
    }
  }

  // User Management
  async getAllUsers(page = 1, limit = 20, role = null, status = null) {
    try {
      const filters = {};
      if (role) filters.role = role;
      if (status === 'active') filters.is_active = true;
      if (status === 'inactive') filters.is_active = false;

      const result = await this.userRepository.findAll(filters, page, limit);
      return result;
    } catch (error) {
      throw new Error(`Gagal mendapatkan users: ${error.message}`);
    }
  }

  async getUserDetails(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) throw new Error('User tidak ditemukan');

      const userTickets = await this.ticketRepository.findByUser(userId, 1, 100);
      const userEvents = await this.eventRepository.findByOrganizerAndStatus(userId, 'approved');

      return {
        user,
        stats: {
          totalTickets: userTickets.total,
          totalEventsCreated: userEvents.length,
        },
      };
    } catch (error) {
      throw new Error(`Gagal mendapatkan user details: ${error.message}`);
    }
  }

  async suspendUser(userId) {
    try {
      const user = await this.userRepository.update(userId, {
        is_active: false,
        updated_at: new Date(),
      });
      return user;
    } catch (error) {
      throw new Error(`Gagal suspend user: ${error.message}`);
    }
  }

  async activateUser(userId) {
    try {
      const user = await this.userRepository.update(userId, {
        is_active: true,
        updated_at: new Date(),
      });
      return user;
    } catch (error) {
      throw new Error(`Gagal activate user: ${error.message}`);
    }
  }

  async changeUserRole(userId, role) {
    try {
      if (!['student', 'organizer', 'admin'].includes(role)) {
        throw new Error('Role tidak valid');
      }

      const user = await this.userRepository.update(userId, {
        role,
        updated_at: new Date(),
      });
      return user;
    } catch (error) {
      throw new Error(`Gagal mengubah role: ${error.message}`);
    }
  }

  // Event Moderation
  async getAllEvents(page = 1, limit = 20, status = null) {
    try {
      const filters = status ? { status } : {};
      const result = await this.eventRepository.findAll(filters, page, limit);
      return result;
    } catch (error) {
      throw new Error(`Gagal mendapatkan events: ${error.message}`);
    }
  }

  // Payment Reports
  async getPaymentReport(page = 1, limit = 20, status = 'completed') {
    try {
      const result = await this.paymentRepository.findByStatus(status, page, limit);
      
      const totalRevenue = result.payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      return {
        ...result,
        totalRevenue,
      };
    } catch (error) {
      throw new Error(`Gagal mendapatkan payment report: ${error.message}`);
    }
  }

  // Reports Export
  async getEventReport() {
    try {
      const eventStats = await this.eventRepository.findAll({}, 1, 10000);
      
      return eventStats.events.map((event) => ({
        id: event.id,
        judul: event.judul,
        penyelenggara: event.penyelenggara_nama,
        tanggal_mulai: event.tanggal_mulai,
        status: event.status,
        kuota: event.kuota,
        harga: event.harga,
        rating: event.rating_rata,
      }));
    } catch (error) {
      throw new Error(`Gagal mendapatkan event report: ${error.message}`);
    }
  }

  async getUserReport() {
    try {
      const userStats = await this.userRepository.findAll({}, 1, 10000);
      
      return userStats.users.map((user) => ({
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        npm: user.npm,
        jurusan: user.jurusan,
        is_active: user.is_active,
        is_verified: user.is_verified,
        created_at: user.created_at,
      }));
    } catch (error) {
      throw new Error(`Gagal mendapatkan user report: ${error.message}`);
    }
  }

  async exportData(type) {
    try {
      let csv = '';

      if (type === 'users') {
        const userStats = await this.userRepository.findAll({}, 1, 10000);
        const users = userStats.users;

        csv = 'ID,Nama,Email,Role,NPM,Jurusan,Status\n';
        users.forEach((user) => {
          csv += `${user.id},"${user.nama}","${user.email}",${user.role},"${user.npm || ''}","${user.jurusan || ''}",${user.is_active ? 'Active' : 'Inactive'}\n`;
        });
      } else if (type === 'events') {
        const eventStats = await this.eventRepository.findAll({}, 1, 10000);
        const events = eventStats.events;

        csv = 'ID,Judul,Penyelenggara,Tanggal,Status,Kuota,Harga\n';
        events.forEach((event) => {
          csv += `${event.id},"${event.judul}","${event.penyelenggara_nama}",${event.tanggal_mulai},${event.status},${event.kuota},${event.harga}\n`;
        });
      } else if (type === 'payments') {
        const paymentStats = await this.paymentRepository.findByStatus('completed', 1, 10000);
        const payments = paymentStats.payments;

        csv = 'ID,Amount,Method,Status,Tanggal,User Email\n';
        payments.forEach((payment) => {
          csv += `${payment.id},${payment.amount},${payment.metode},${payment.status},${payment.created_at},"${payment.email}"\n`;
        });
      }

      return csv;
    } catch (error) {
      throw new Error(`Gagal export data: ${error.message}`);
    }
  }
}

module.exports = new AdminService();
