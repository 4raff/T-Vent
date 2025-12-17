"use client";

import { useState } from "react";

export default function CancelTicketModal({ ticket, onCancel, onConfirm, isLoading }) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(ticket.id, reason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancel Ticket</h2>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Ticket Code:</strong> {ticket.kode_tiket}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Event ID:</strong> {ticket.event_id}
          </p>
          <p className="text-sm text-red-600 font-semibold mt-3">
            ⚠️ Action ini tidak dapat dibatalkan. Tiket akan dibatalkan dan pembayaran dapat dirujuk.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alasan Pembatalan (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Jelaskan alasan Anda membatalkan tiket ini..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            rows="4"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Keep Ticket
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {isLoading ? "Cancelling..." : "Cancel Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}
