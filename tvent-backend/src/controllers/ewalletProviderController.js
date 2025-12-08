const ewalletProviderService = require('../services/ewalletProviderService');

const EwalletProviderController = {
  async getAll(req, res) {
    try {
      const providers = await ewalletProviderService.getAllEwalletProviders(true);
      res.json({
        message: 'Ewallet providers retrieved successfully',
        data: providers
      });
    } catch (error) {
      console.error('Error in EwalletProviderController.getAll():', error);
      res.status(500).json({
        message: 'Gagal memuat provider ewallet',
        error: error.message
      });
    }
  },

  async getById(req, res) {
    try {
      const provider = await ewalletProviderService.getEwalletProviderById(req.params.id);
      if (!provider) {
        return res.status(404).json({ message: 'Ewallet provider not found' });
      }
      res.json({
        message: 'Ewallet provider retrieved successfully',
        data: provider
      });
    } catch (error) {
      console.error('Error in EwalletProviderController.getById():', error);
      res.status(500).json({
        message: 'Gagal memuat provider ewallet',
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const { name, code, instructions } = req.body;
      const provider = await ewalletProviderService.createEwalletProvider({
        name,
        code,
        instructions,
        is_active: true
      });
      res.status(201).json({
        message: 'Ewallet provider created successfully',
        data: provider
      });
    } catch (error) {
      console.error('Error in EwalletProviderController.create():', error);
      res.status(400).json({
        message: error.message || 'Gagal membuat provider ewallet',
        error: error.message
      });
    }
  },

  async update(req, res) {
    try {
      const { name, code, instructions, is_active } = req.body;
      const provider = await ewalletProviderService.updateEwalletProvider(req.params.id, {
        name,
        code,
        instructions,
        is_active
      });
      res.json({
        message: 'Ewallet provider updated successfully',
        data: provider
      });
    } catch (error) {
      console.error('Error in EwalletProviderController.update():', error);
      res.status(400).json({
        message: error.message || 'Gagal mengubah provider ewallet',
        error: error.message
      });
    }
  },

  async delete(req, res) {
    try {
      await ewalletProviderService.deleteEwalletProvider(req.params.id);
      res.json({
        message: 'Ewallet provider deleted successfully'
      });
    } catch (error) {
      console.error('Error in EwalletProviderController.delete():', error);
      res.status(400).json({
        message: error.message || 'Gagal menghapus provider ewallet',
        error: error.message
      });
    }
  },

  async activate(req, res) {
    try {
      const provider = await ewalletProviderService.activateEwalletProvider(req.params.id);
      res.json({
        message: 'Ewallet provider activated successfully',
        data: provider
      });
    } catch (error) {
      console.error('Error in EwalletProviderController.activate():', error);
      res.status(400).json({
        message: error.message || 'Gagal mengaktifkan provider ewallet',
        error: error.message
      });
    }
  },

  async deactivate(req, res) {
    try {
      const provider = await ewalletProviderService.deactivateEwalletProvider(req.params.id);
      res.json({
        message: 'Ewallet provider deactivated successfully',
        data: provider
      });
    } catch (error) {
      console.error('Error in EwalletProviderController.deactivate():', error);
      res.status(400).json({
        message: error.message || 'Gagal menonaktifkan provider ewallet',
        error: error.message
      });
    }
  }
};

module.exports = EwalletProviderController;
