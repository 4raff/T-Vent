"use client";

import { useState } from "react";
import BankAccountModal from "@/components/modals/bank-account-modal";
import EwalletProviderModal from "@/components/modals/ewallet-provider-modal";

const itemsPerPage = 10;

export default function AdminPaymentMethodsSection({ 
  bankAccounts, 
  ewalletProviders,
  onToggleBankStatus,
  onToggleEwalletStatus,
  onAddBankAccount,
  onAddEwalletProvider
}) {
  const [showBankModal, setShowBankModal] = useState(false);
  const [showEwalletModal, setShowEwalletModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedEwallet, setSelectedEwallet] = useState(null);
  const [currentPageBanks, setCurrentPageBanks] = useState(1);
  const [currentPageEwallets, setCurrentPageEwallets] = useState(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Bank Accounts */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Bank Accounts</h2>
          <button
            onClick={() => setShowBankModal(true)}
            className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm whitespace-nowrap"
          >
            + Add Bank
          </button>
        </div>
        
        {bankAccounts.length > 0 ? (
          <>
            <div className="mb-3 text-xs text-gray-600">
              Showing {Math.min((currentPageBanks - 1) * itemsPerPage + 1, bankAccounts.length)} to {Math.min(currentPageBanks * itemsPerPage, bankAccounts.length)} of {bankAccounts.length} banks
            </div>

            <div className="space-y-3 mb-4">
              {bankAccounts
                .slice((currentPageBanks - 1) * itemsPerPage, currentPageBanks * itemsPerPage)
                .map((bank) => (
                <div key={bank.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 text-sm sm:text-base">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{bank.bank_name}</p>
                      <p className="text-sm text-gray-600 truncate">{bank.account_number}</p>
                      <p className="text-sm text-gray-600 truncate">a/n {bank.account_holder}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => onToggleBankStatus(bank.id, bank.is_active)}
                        className={`px-2 sm:px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          bank.is_active
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {bank.is_active ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => setSelectedBank(bank)}
                        className="px-2 sm:px-3 py-1 rounded text-xs font-semibold whitespace-nowrap bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bank Pagination */}
            {Math.ceil(bankAccounts.length / itemsPerPage) > 1 && (
              <div className="flex flex-wrap justify-center gap-1 mt-4">
                <button
                  onClick={() => setCurrentPageBanks(Math.max(1, currentPageBanks - 1))}
                  disabled={currentPageBanks === 1}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    currentPageBanks === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Prev
                </button>
                {Array.from({ length: Math.ceil(bankAccounts.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPageBanks(page)}
                    className={`w-7 h-7 rounded text-xs font-semibold ${
                      currentPageBanks === page
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPageBanks(Math.min(Math.ceil(bankAccounts.length / itemsPerPage), currentPageBanks + 1))}
                  disabled={currentPageBanks === Math.ceil(bankAccounts.length / itemsPerPage)}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    currentPageBanks === Math.ceil(bankAccounts.length / itemsPerPage)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No bank accounts</p>
        )}
      </div>

      {/* E-Wallet Providers */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">E-Wallet Providers</h2>
          <button
            onClick={() => setShowEwalletModal(true)}
            className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm whitespace-nowrap"
          >
            + Add Provider
          </button>
        </div>
        
        {ewalletProviders.length > 0 ? (
          <>
            <div className="mb-3 text-xs text-gray-600">
              Showing {Math.min((currentPageEwallets - 1) * itemsPerPage + 1, ewalletProviders.length)} to {Math.min(currentPageEwallets * itemsPerPage, ewalletProviders.length)} of {ewalletProviders.length} providers
            </div>

            <div className="space-y-3 mb-4">
              {ewalletProviders
                .slice((currentPageEwallets - 1) * itemsPerPage, currentPageEwallets * itemsPerPage)
                .map((provider) => (
                <div key={provider.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 text-sm sm:text-base">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{provider.name}</p>
                      <p className="text-sm text-gray-600 truncate">Code: {provider.code}</p>
                      {provider.account_number && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{provider.account_number}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => onToggleEwalletStatus(provider.id, provider.is_active)}
                        className={`px-2 sm:px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          provider.is_active
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {provider.is_active ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => setSelectedEwallet(provider)}
                        className="px-2 sm:px-3 py-1 rounded text-xs font-semibold whitespace-nowrap bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* E-Wallet Pagination */}
            {Math.ceil(ewalletProviders.length / itemsPerPage) > 1 && (
              <div className="flex flex-wrap justify-center gap-1 mt-4">
                <button
                  onClick={() => setCurrentPageEwallets(Math.max(1, currentPageEwallets - 1))}
                  disabled={currentPageEwallets === 1}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    currentPageEwallets === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Prev
                </button>
                {Array.from({ length: Math.ceil(ewalletProviders.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPageEwallets(page)}
                    className={`w-7 h-7 rounded text-xs font-semibold ${
                      currentPageEwallets === page
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPageEwallets(Math.min(Math.ceil(ewalletProviders.length / itemsPerPage), currentPageEwallets + 1))}
                  disabled={currentPageEwallets === Math.ceil(ewalletProviders.length / itemsPerPage)}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    currentPageEwallets === Math.ceil(ewalletProviders.length / itemsPerPage)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No e-wallet providers</p>
        )}
      </div>

      {/* Bank Details Modal */}
      {selectedBank && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Bank Details</h2>
              <button
                onClick={() => setSelectedBank(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <p className="text-gray-900 font-semibold">{selectedBank.bank_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <p className="text-gray-900">{selectedBank.account_number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
                <p className="text-gray-900">{selectedBank.account_holder}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                  selectedBank.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {selectedBank.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  onToggleBankStatus(selectedBank.id, selectedBank.is_active);
                  setSelectedBank(null);
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  selectedBank.is_active
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {selectedBank.is_active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => setSelectedBank(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-Wallet Details Modal */}
      {selectedEwallet && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">E-Wallet Details</h2>
              <button
                onClick={() => setSelectedEwallet(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
                <p className="text-gray-900 font-semibold">{selectedEwallet.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Code</label>
                <p className="text-gray-900">{selectedEwallet.code}</p>
              </div>
              {selectedEwallet.account_number && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <p className="text-gray-900">{selectedEwallet.account_number}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                  selectedEwallet.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {selectedEwallet.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  onToggleEwalletStatus(selectedEwallet.id, selectedEwallet.is_active);
                  setSelectedEwallet(null);
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  selectedEwallet.is_active
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {selectedEwallet.is_active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => setSelectedEwallet(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Account Modal */}
      <BankAccountModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onAdd={onAddBankAccount}
      />

      {/* E-Wallet Provider Modal */}
      <EwalletProviderModal
        isOpen={showEwalletModal}
        onClose={() => setShowEwalletModal(false)}
        onAdd={onAddEwalletProvider}
      />
    </div>
  );
}
