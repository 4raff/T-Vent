
const eventService = require('../services/eventService');
const EventController = {
  async getAll(req, res) {
    try {
      // Extract user role from JWT (null jika tidak login)
      const userRole = req.userData?.role || null;
      const events = await eventService.listEvents(userRole);
      res.json(events);
    } catch (error) {
      console.error('Error in EventController.getAll():', error);
      res.status(500).json({ 
        message: 'Gagal memuat events',
        error: error.message 
      });
    }
  },
  async getAllForAdmin(req, res) {
    try {
      // Endpoint khusus admin: tampilkan SEMUA event termasuk yang expired
      const events = await eventService.listEvents('admin');
      res.json(events);
    } catch (error) {
      console.error('Error in EventController.getAllForAdmin():', error);
      res.status(500).json({ 
        message: 'Gagal memuat events',
        error: error.message 
      });
    }
  },
  async getById(req, res) {
    const event = await eventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  },
  async create(req, res) {
        try {
            // ✅ INJEKSI USER ID DARI JWT
            if (!req.userData || !req.userData.id) {
                return res.status(401).json({ message: 'Otorisasi gagal: User ID tidak ditemukan.' });
            }
            const created_by = req.userData.id;

            const eventData = {
                ...req.body,
                created_by: created_by,
                status: 'pending' // Default status
            };
            
            const newEvent = await eventService.createEvent(eventData);
            
            res.status(201).json({ 
                message: 'Event berhasil diajukan', 
                data: newEvent 
            });
        } catch (error) {
            console.error('Error create:', error);
            res.status(500).json({ 
                message: 'Gagal membuat event', 
                error: error.message 
            });
        }
    },

  async update(req, res) {
        try {
            const eventId = req.params.id;
            const userId = req.userData.id; 
            
            // 🛑 Cek Otorisasi
            const existingEvent = await eventService.getEventById(eventId);
            if (!existingEvent) return res.status(404).json({ message: 'Event tidak ditemukan' });

            if (existingEvent.created_by !== userId) {
                return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik event.' });
            }
            
            const updatedEvent = await eventService.updateEvent(eventId, req.body);
            
            res.status(200).json({ 
                message: 'Event berhasil diperbarui', 
                data: updatedEvent 
            });
        } catch (error) {
            console.error('Error update:', error);
            res.status(500).json({ 
                message: 'Gagal memperbarui event', 
                error: error.message 
            });
        }
    },

  async remove(req, res) {
    try {
        const eventId = req.params.id;
        const userId = req.userData.id; 
        const userRole = req.userData.role; 
        const existingEvent = await eventService.getEventById(eventId);
        if (!existingEvent) return res.status(404).json({ message: 'Event tidak ditemukan' });
        const isOwner = existingEvent.created_by === userId;
        const isAdmin = userRole === 'admin'; 
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik atau administrator event.' });
        }
        const deleted = await eventService.deleteEvent(eventId);
        
        if (deleted === 0) return res.status(500).json({ message: 'Gagal menghapus event (Error Database).' });

        res.status(204).end(); 
    } catch (error) {
        console.error('Error remove:', error);
        res.status(500).json({ message: 'Gagal menghapus event' });
    }
},

  async tampilkanDetail(req, res) {
    try {
      const event = await eventService.tampilkanDetail(req.params.id);
      res.json(event);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  async availableTiket(req, res) {
    try {
      const available = await eventService.availableTiket(req.params.id);
      res.json({ available });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  async getCategories(req, res) {
    try {
      const categories = await eventService.getUniqueCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error in EventController.getCategories():', error);
      res.status(500).json({ 
        message: 'Gagal memuat kategori',
        error: error.message 
      });
    }
  },

  async getFeaturedEvent(req, res) {
    try {
      const event = await eventService.getFeaturedEvent();
      res.json(event);
    } catch (error) {
      console.error('Error in EventController.getFeaturedEvent():', error);
      res.status(500).json({ 
        message: 'Gagal memuat featured event',
        error: error.message 
      });
    }
  },

  async getMostPurchasedEvents(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const events = await eventService.getMostPurchasedEvents(limit);
      res.json(events);
    } catch (error) {
      console.error('Error in EventController.getMostPurchasedEvents():', error);
      res.status(500).json({ 
        message: 'Gagal memuat most purchased events',
        error: error.message 
      });
    }
  }
};

module.exports = EventController;
