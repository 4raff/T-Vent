const userService = require('../services/userService');


const UserController = {
  async getAll(req, res) {
    const users = await userService.listUsers();
    res.json(users);
  },
  async getById(req, res) {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  },
  async create(req, res) {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  },
  async update(req, res) {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  },
  async remove(req, res) {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
  },

  // Cari event
  async cariEvent(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter q is required' });
    const events = await userService.cariEvent(q);
    res.json(events);
  },

  // Pilih event
  async pilihEvent(req, res) {
    const { userId, eventId } = req.body;
    if (!userId || !eventId) return res.status(400).json({ message: 'userId and eventId are required' });
    const ticket = await userService.pilihEvent(userId, eventId);
    res.status(201).json(ticket);
  }
};

module.exports = UserController;
