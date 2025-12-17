"use client";

import { formatRupiah } from "@/utils/formatCurrency";

export default function AdminStats({ stats, pendingEventsCount, paymentsCounts }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
      <div className="bg-white rounded-lg shadow p-3 sm:p-6 h-full flex flex-col">
        <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Total Events</p>
        <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2 break-words">
          {stats.totalEvents}
        </p>
        <p className="text-gray-600 text-xs mt-2">Pending: {pendingEventsCount}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-3 sm:p-6 h-full flex flex-col">
        <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Total Users</p>
        <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
          {stats.totalUsers}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-3 sm:p-6 h-full flex flex-col">
        <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Total Revenue</p>
        <p className="text-lg sm:text-2xl font-bold text-green-600 mt-2 break-words line-clamp-2 overflow-hidden">
          {formatRupiah(stats.totalRevenue)}
        </p>
        <p className="text-gray-600 text-xs mt-1">From completed payments</p>
      </div>
      <div className="bg-white rounded-lg shadow p-3 sm:p-6 h-full flex flex-col">
        <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Pending Payments</p>
        <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-2">
          {stats.pendingPayments}
        </p>
      </div>
    </div>
  );
}
