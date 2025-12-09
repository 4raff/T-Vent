"use client";

import { formatRupiah } from "@/utils/formatCurrency";

export default function AdminReportsSection({ 
  stats, 
  allEvents, 
  payments, 
  users, 
  bankAccounts, 
  ewalletProviders 
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Revenue Report */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Revenue Report</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 break-words">{formatRupiah(stats.totalRevenue)}</p>
          </div>
          <div className="border-t pt-4">
            <p className="text-gray-600 text-sm mb-3">Payment Status Breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Completed Payments</span>
                <span className="font-semibold text-green-600">
                  {payments.filter(p => p.status === 'success').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending Payments</span>
                <span className="font-semibold text-yellow-600">
                  {payments.filter(p => p.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rejected Payments</span>
                <span className="font-semibold text-red-600">
                  {payments.filter(p => p.status === 'rejected').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cancelled Payments</span>
                <span className="font-semibold text-red-600">
                  {payments.filter(p => p.status === 'cancelled').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Statistics */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Event Statistics</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm">Total Events</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.totalEvents}</p>
          </div>
          <div className="border-t pt-4">
            <p className="text-gray-600 text-sm mb-3">Event Status Breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Approved Events</span>
                <span className="font-semibold text-green-600">
                  {allEvents.filter(e => e.status === 'approved').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending Events</span>
                <span className="font-semibold text-yellow-600">
                  {allEvents.filter(e => e.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rejected Events</span>
                <span className="font-semibold text-red-600">
                  {allEvents.filter(e => e.status === 'rejected').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">User Statistics</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="border-t pt-4">
            <p className="text-gray-600 text-sm mb-3">User Types</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Regular Users</span>
                <span className="font-semibold">
                  {users.filter(u => u.role === 'user').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Admin Users</span>
                <span className="font-semibold">
                  {users.filter(u => u.role === 'admin').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Statistics */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm mb-3">Available Methods</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Bank Accounts</span>
                <span className="font-semibold text-blue-600">
                  {bankAccounts.filter(b => b.is_active).length} active
                </span>
              </div>
              <div className="flex justify-between">
                <span>E-Wallet Providers</span>
                <span className="font-semibold text-green-600">
                  {ewalletProviders.filter(e => e.is_active).length} active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
