const bankAccountRepository = require('../repositories/bankAccountRepository');

class BankAccountService {
  async getBankAccountById(id) {
    return bankAccountRepository.findById(id);
  }

  async getAllBankAccounts(activeOnly = true) {
    return bankAccountRepository.findAll(activeOnly);
  }

  async createBankAccount(data) {
    if (!data.bank_name || !data.account_number || !data.account_holder) {
      throw new Error('Bank name, account number, and account holder are required');
    }
    return bankAccountRepository.create(data);
  }

  async updateBankAccount(id, data) {
    const existing = await bankAccountRepository.findById(id);
    if (!existing) {
      throw new Error('Bank account not found');
    }
    return bankAccountRepository.update(id, data);
  }

  async deleteBankAccount(id) {
    const existing = await bankAccountRepository.findById(id);
    if (!existing) {
      throw new Error('Bank account not found');
    }
    return bankAccountRepository.delete(id);
  }

  async activateBankAccount(id) {
    return this.updateBankAccount(id, { is_active: true });
  }

  async deactivateBankAccount(id) {
    return this.updateBankAccount(id, { is_active: false });
  }
}

module.exports = new BankAccountService();
