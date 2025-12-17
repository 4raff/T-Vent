"use client";

import { useState } from "react";
import { apiClient } from "@/utils/api/client";
import { useToast } from "@/components/common/ToastProvider";

export default function PaymentDetailModal({ payment, onClose, onApprove, onReject }) {
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);

  if (!payment) return null;

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      const response = await apiClient.post("/payments/terima", { id: payment.id });
      const updatedPayment = response.data?.data || response.data || response;
      toast.showSuccess("Pembayaran berhasil disetujui");
      onApprove?.(payment.id, updatedPayment);
      onClose();
    } catch (error) {
      console.error("Approve error:", error);
      toast.showError(error.data?.message || "Gagal menyetujui pembayaran");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.showWarning("Silakan masukkan alasan penolakan");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await apiClient.post("/payments/tolak", { 
        id: payment.id,
        reason: rejectionReason 
      });
      const updatedPayment = response.data?.data || response.data || response;
      toast.showSuccess("Pembayaran berhasil ditolak");
      onReject?.(payment.id, updatedPayment);
      onClose();
    } catch (error) {
      console.error("Reject error:", error);
      toast.showError(error.data?.message || "Gagal menolak pembayaran");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(price);
  };

  const capitalizeStatus = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 sm:p-6 flex justify-between items-start sm:items-center gap-4 flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-lg sm:text-2xl font-bold">Payment Detail</h2>
            <p className="text-white/80 text-xs sm:text-base">ID: #{payment.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-xl sm:text-2xl font-bold hover:bg-white/20 p-2 rounded transition flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Status Badge */}
          <div>
            <span className={`inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
              payment.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : payment.status === "success"
                ? "bg-green-100 text-green-800"
                : payment.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}>
              {capitalizeStatus(payment.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column - Payment & User Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* User Information */}
              <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">User Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="font-semibold text-gray-900">{payment.user_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{payment.user_email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{payment.user_phone || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Payment Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-bold text-lg text-primary">
                      {formatPrice(payment.jumlah)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Method</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {payment.metode_pembayaran?.replace("_", " ") || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>
                  {payment.tanggal_pembayaran && (
                    <div>
                      <p className="text-sm text-gray-600">Approved Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(payment.tanggal_pembayaran)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Proof & Event Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* Payment Proof */}
              {payment.bukti_pembayaran ? (
                <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Payment Proof</h3>
                  <img
                    src={payment.bukti_pembayaran}
                    alt="Payment proof"
                    className="w-full h-48 sm:h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={() => setFullscreenImage(payment.bukti_pembayaran)}
                  />
                  <p className="text-center text-xs text-gray-500 mt-2">Click to view fullscreen</p>
                </div>
              ) : (
                <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Payment Proof</h3>
                  <div className="w-full h-48 sm:h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600 text-sm">No proof uploaded yet</p>
                  </div>
                </div>
              )}

              {/* Event Information */}
              {payment.event_name && (
                <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Event Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Event Name</p>
                      <p className="font-semibold text-gray-900">{payment.event_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold text-gray-900">{payment.quantity || 1} ticket(s)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ticket Code</p>
                      <p className="font-mono text-sm text-gray-900 break-all">
                        {payment.kode_tiket || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Cancellation Info */}
              {(payment.ticket_status === 'cancelled' || payment.status === 'cancelled') && payment.cancellation_reason && (
                <div className="border rounded-lg p-3 sm:p-4 bg-orange-50 border-orange-200">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">
                    ⚠️ Ticket Cancellation
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-orange-600">Cancelled</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cancellation Reason</p>
                      <p className="text-orange-900 text-sm">{payment.cancellation_reason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Reason Section */}
          {showReasonInput && (
            <div className="border-t pt-3 sm:pt-4">
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                Reason for Rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this payment is being rejected..."
                className="w-full border-2 border-gray-300 rounded-lg p-2 sm:p-3 text-xs sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500"
                rows="3"
              />
            </div>
          )}

          {/* Action Buttons */}
          {payment.status === "pending" && (
            <div className="border-t pt-4 sm:pt-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-semibold text-sm sm:text-base"
              >
                {isProcessing ? "Processing..." : "✓ Approve Payment"}
              </button>
              {!showReasonInput ? (
                <button
                  onClick={() => setShowReasonInput(true)}
                  className="flex-1 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base"
                >
                  ✕ Reject Payment
                </button>
              ) : (
                <>
                  <button
                    onClick={handleReject}
                    disabled={isProcessing || !rejectionReason.trim()}
                    className="flex-1 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-semibold text-sm sm:text-base"
                  >
                    {isProcessing ? "Processing..." : "Confirm Rejection"}
                  </button>
                  <button
                    onClick={() => {
                      setShowReasonInput(false);
                      setRejectionReason("");
                    }}
                    className="flex-1 py-2 sm:py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}

          {/* Close Button for Non-Pending Status */}
          {payment.status !== "pending" && (
            <div className="border-t pt-4 sm:pt-6">
              <button
                onClick={onClose}
                className="w-full py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          )}

          {/* Close Button for Non-Pending Status */}
          {payment.status !== "pending" && (
            <div className="border-t pt-4 sm:pt-6">
              <button
                onClick={onClose}
                className="w-full py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
            <img
              src={fullscreenImage}
              alt="Fullscreen proof"
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-6 right-6 bg-white rounded-full p-3 hover:bg-gray-200 transition shadow-lg"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
