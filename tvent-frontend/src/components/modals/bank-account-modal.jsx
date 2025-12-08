import { useState } from 'react';

export default function BankAccountModal({ isOpen, onTutup, onTambah }) {
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_holder: ''
  });
  const [isKirimting, setIsKirimting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKirim = async (e) => {
    e.preventDefault();
    if (!formData.bank_name || !formData.account_number || !formData.account_holder) {
      alert('Please fill all fields');
      return;
    }
    setIsKirimting(true);
    await onTambah(formData);
    setIsKirimting(false);
    setFormData({ bank_name: '', account_number: '', account_holder: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tambah Bank Account</h2>
        
        <form onKirim={handleKirim} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              placeholder="e.g., Bank Mandiri"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="e.g., 1230456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder
            </label>
            <input
              type="text"
              name="account_holder"
              value={formData.account_holder}
              onChange={handleChange}
              placeholder="e.g., PT T-Vent Indonesia"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onTutup}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isKirimting}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
            >
              {isKirimting ? 'Tambahing...' : 'Tambah Bank'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
