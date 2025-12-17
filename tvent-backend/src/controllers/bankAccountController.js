const bankAccountService = require('../services/bankAccountService');

const BankAccountController = {
  async getAll(req, res) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const bankAccounts = await bankAccountService.getAllBankAccounts(!includeInactive);
      res.json({
        message: 'Bank accounts retrieved successfully',
        data: bankAccounts
      });
    } catch (error) {
      console.error('Error in BankAccountController.getAll():', error);
      res.status(500).json({
        message: 'Gagal memuat rekening bank',
        error: error.message
      });
    }
  },

  async getById(req, res) {
    try {
      const account = await bankAccountService.getBankAccountById(req.params.id);
      if (!account) {
        return res.status(404).json({ message: 'Bank account not found' });
      }
      res.json({
        message: 'Bank account retrieved successfully',
        data: account
      });
    } catch (error) {
      console.error('Error in BankAccountController.getById():', error);
      res.status(500).json({
        message: 'Gagal memuat rekening bank',
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const { bank_name, account_number, account_holder } = req.body;
      const account = await bankAccountService.createBankAccount({
        bank_name,
        account_number,
        account_holder,
        is_active: true
      });
      res.status(201).json({
        message: 'Bank account created successfully',
        data: account
      });
    } catch (error) {
      console.error('Error in BankAccountController.create():', error);
      res.status(400).json({
        message: error.message || 'Gagal membuat rekening bank',
        error: error.message
      });
    }
  },

  async update(req, res) {
    try {
      const { bank_name, account_number, account_holder, is_active } = req.body;
      const account = await bankAccountService.updateBankAccount(req.params.id, {
        bank_name,
        account_number,
        account_holder,
        is_active
      });
      res.json({
        message: 'Bank account updated successfully',
        data: account
      });
    } catch (error) {
      console.error('Error in BankAccountController.update():', error);
      res.status(400).json({
        message: error.message || 'Gagal mengubah rekening bank',
        error: error.message
      });
    }
  },

  async delete(req, res) {
    try {
      await bankAccountService.deleteBankAccount(req.params.id);
      res.json({
        message: 'Bank account deleted successfully'
      });
    } catch (error) {
      console.error('Error in BankAccountController.delete():', error);
      res.status(400).json({
        message: error.message || 'Gagal menghapus rekening bank',
        error: error.message
      });
    }
  },

  async activate(req, res) {
    try {
      const account = await bankAccountService.activateBankAccount(req.params.id);
      res.json({
        message: 'Bank account activated successfully',
        data: account
      });
    } catch (error) {
      console.error('Error in BankAccountController.activate():', error);
      res.status(400).json({
        message: error.message || 'Gagal mengaktifkan rekening bank',
        error: error.message
      });
    }
  },

  async deactivate(req, res) {
    try {
      const account = await bankAccountService.deactivateBankAccount(req.params.id);
      res.json({
        message: 'Bank account deactivated successfully',
        data: account
      });
    } catch (error) {
      console.error('Error in BankAccountController.deactivate():', error);
      res.status(400).json({
        message: error.message || 'Gagal menonaktifkan rekening bank',
        error: error.message
      });
    }
  }
};

module.exports = BankAccountController;
