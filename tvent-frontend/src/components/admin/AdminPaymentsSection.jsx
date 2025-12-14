"use client";

import { useState } from "react";
import PaymentDetailModal from "@/components/modals/payment-detail-modal";
import SearchFilter from "@/components/admin/SearchFilter";
import { formatRupiah } from "@/utils/formatCurrency";

const itemsPerPage = 10;

export default function AdminPaymentsSection({ 
  payments, 
  onPaymentApproved, 
  onPaymentRejected, 
  capitalizeStatus 
}) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <SearchFilter
        items={payments}
        searchFields={["user_name", "user_email", "metode_pembayaran"]}
        filterOptions={{
          status: [
            { value: "pending", label: "Pending" },
            { value: "success", label: "Success" },
            { value: "rejected", label: "Rejected" },
            { value: "cancelled", label: "Cancelled" }
          ]
        }}
        title="Payments"
        emptyMessage="No payments found"
        renderItem={(filteredPayments) => {
          // Sort payments by created_at (newest first)
          const sortedPayments = [...filteredPayments].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          
          const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedPayments = sortedPayments.slice(startIndex, startIndex + itemsPerPage);

          return (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {Math.min(startIndex + 1, sortedPayments.length)} to {Math.min(startIndex + itemsPerPage, sortedPayments.length)} of {sortedPayments.length} payments
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Payment ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{payment.kode_pembayaran || `#${payment.id}`}</td>
                        <td className="py-3 px-4">{payment.user_name}</td>
                        <td className="py-3 px-4 font-semibold">
                          {formatRupiah(payment.jumlah)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : payment.status === "success"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "rejected" || payment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {capitalizeStatus(payment.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => setSelectedPayment(payment)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                    }`}
                  >
                    ← Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? "bg-purple-600 text-white shadow-lg scale-110"
                            : "bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600 hover:text-purple-600"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          );
        }}
      />

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal 
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onApprove={onPaymentApproved}
          onReject={onPaymentRejected}
        />
      )}
    </>
  );
}
