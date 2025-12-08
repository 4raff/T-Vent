const ewalletProviderRepository = require('../repositories/ewalletProviderRepository');

class EwalletProviderService {
  async getEwalletProviderById(id) {
    return ewalletProviderRepository.findById(id);
  }

  async getAllEwalletProviders(activeOnly = true) {
    return ewalletProviderRepository.findAll(activeOnly);
  }

  async createEwalletProvider(data) {
    if (!data.name || !data.code) {
      throw new Error('Name and code are required');
    }
    return ewalletProviderRepository.create(data);
  }

  async updateEwalletProvider(id, data) {
    const existing = await ewalletProviderRepository.findById(id);
    if (!existing) {
      throw new Error('Ewallet provider not found');
    }
    return ewalletProviderRepository.update(id, data);
  }

  async deleteEwalletProvider(id) {
    const existing = await ewalletProviderRepository.findById(id);
    if (!existing) {
      throw new Error('Ewallet provider not found');
    }
    return ewalletProviderRepository.delete(id);
  }

  async activateEwalletProvider(id) {
    return this.updateEwalletProvider(id, { is_active: true });
  }

  async deactivateEwalletProvider(id) {
    return this.updateEwalletProvider(id, { is_active: false });
  }
}

module.exports = new EwalletProviderService();
