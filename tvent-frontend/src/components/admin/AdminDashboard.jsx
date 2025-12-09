"use client";

import { formatRupiah } from "@/utils/formatCurrency";

export default function AdminDashboard({ 
  pendingEvents, 
  payments, 
  capitalizeStatus 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Pending Events</h2>
        {pendingEvents.length > 0 ? (
          <div className="space-y-3">
            {pendingEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="border rounded p-3 hover:bg-gray-50 text-sm sm:text-base">
                <p className="font-semibold text-gray-900 truncate">{event.nama}</p>
                <p className="text-sm text-gray-600 truncate">by {event.creator_name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No pending events</p>
        )}
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recent Payments</h2>
        {payments.length > 0 ? (
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="border rounded p-3 hover:bg-gray-50 text-sm sm:text-base">
                <div className="flex justify-between items-start gap-2">
                  <p className="font-semibold text-gray-900">{formatRupiah(payment.jumlah)}</p>
                  <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                    payment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    payment.status === "success" ? "bg-green-100 text-green-800" :
                    payment.status === "rejected" || payment.status === "cancelled" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {capitalizeStatus(payment.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{payment.user_name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No payments</p>
        )}
      </div>
    </div>
  );
}
