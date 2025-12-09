"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { QRCodeCanvas } from 'qrcode.react';
import { authService } from "@/utils/services/authService";
import { ticketService } from "@/utils/services/ticketService";
import { apiClient } from "@/utils/api/client";
import { useToast } from "@/components/common/ToastProvider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CancelTicketModal from "@/components/modals/cancel-ticket-modal";

export default function TicketDetail() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const qrRef = useRef();
  const [ticket, setTicket] = useState(null);
  const [event, setEvent] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedTicketForCancel, setSelectedTicketForCancel] = useState(null);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  const capitalizeStatus = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelClick = () => {
    setSelectedTicketForCancel(ticket);
  };

  const handleConfirmCancel = async (ticketId, reason) => {
    setIsProcessingCancel(true);
    try {
      await ticketService.cancelTicket(ticketId, reason);
      toast.showSuccess("Tiket berhasil dibatalkan");
      setSelectedTicketForCancel(null);
      
      // Reload ticket data
      if (params.id) {
        const updatedTicket = await ticketService.getTicket(params.id);
        setTicket(updatedTicket);
      }
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      const errorMsg = error.data?.message || "Gagal membatalkan tiket";
      toast.showError(errorMsg);
    } finally {
      setIsProcessingCancel(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        setUser(userData);
        
        // Fetch ticket details
        const ticketResponse = await apiClient.get(`/tickets/${params.id}`);
        const ticketData = ticketResponse.data || ticketResponse;
        
        // Verify ownership
        if (ticketData.user_id !== userData.id) {
          toast.showError("Unauthorized");
          router.push("/my-tickets");
          return;
        }
        
        setTicket(ticketData);
        
        // Fetch event details
        const eventsResponse = await apiClient.get(`/events`);
        const allEvents = Array.isArray(eventsResponse) ? eventsResponse : eventsResponse.data || [];
        const eventData = allEvents.find(e => e.id === ticketData.event_id);
        if (eventData) {
          setEvent(eventData);
        }

        // Fetch payment details by ticket_id to get rejection reason
        try {
          const paymentsResponse = await apiClient.get(`/payments`);
          const allPayments = Array.isArray(paymentsResponse) ? paymentsResponse : paymentsResponse.data || [];
          const paymentData = allPayments.find(p => p.ticket_id === ticketData.id);
          if (paymentData) {
            setPayment(paymentData);
          }
        } catch (error) {
          console.error("Error fetching payment:", error);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        toast.showError("Gagal memuat detail tiket");
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, toast, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-300 rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 text-lg">Tiket tidak ditemukan</p>
          <button
            onClick={() => router.push("/my-tickets")}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Kembali ke Tiket Saya
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.push("/my-tickets")}
          className="mb-6 text-purple-600 hover:text-purple-700 font-semibold"
        >
          ← Kembali ke Tiket Saya
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Ticket Information */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Detail Tiket
              </h1>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Nomor Tiket</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {ticket.kode_tiket}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-medium">Event</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {event?.judul || `Event #${ticket.event_id}`}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-medium">Jumlah Tiket</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {ticket.jumlah} tiket
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Harga</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Rp {parseFloat(ticket.total_harga).toLocaleString('id-ID')}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-medium">Tanggal Pembelian</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(ticket.created_at).toLocaleDateString("id-ID", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-medium">Status</p>
                  <span className={`inline-block mt-1 px-4 py-2 rounded-full font-semibold ${getStatusColor(ticket.status)}`}>
                    {capitalizeStatus(ticket.status)}
                  </span>
                </div>

                {ticket.status === 'rejected' && payment?.rejection_reason && (
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Alasan Penolakan</p>
                    <p className="text-red-600 font-semibold mt-1">{payment.rejection_reason}</p>
                  </div>
                )}

                {ticket.status === 'cancelled' && ticket.cancellation_reason && (
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Alasan Pembatalan</p>
                    <p className="text-orange-600 font-semibold mt-1">{ticket.cancellation_reason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code and Event Details */}
            <div>
              {ticket && (
                <div className="mb-8">
                  <p className="text-gray-600 text-sm font-medium mb-4">QR Code Tiket</p>
                  <div className="bg-gray-100 p-6 rounded-lg flex justify-center">
                    <div className="bg-white p-4 rounded" ref={qrRef}>
                      <QRCodeCanvas 
                        value={ticket.kode_tiket || `TICKET-${ticket.id}`}
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3 mb-4">
                    Tunjukkan QR code ini saat check-in event
                  </p>
                  <button
                    onClick={() => {
                      if (qrRef.current) {
                        // Get canvas from QRCodeCanvas ref
                        const canvas = qrRef.current.querySelector('canvas');
                        if (canvas) {
                          const link = document.createElement('a');
                          link.href = canvas.toDataURL('image/png');
                          link.download = `tiket-${ticket.kode_tiket}.png`;
                          link.click();
                        }
                      }
                    }}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm"
                  >
                    Download QR Code
                  </button>
                </div>
              )}

              {event && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Event</h3>
                  
                  {event.gambar && (
                    <img
                      src={event.gambar}
                      alt={event.judul}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Tanggal Event</p>
                      <p className="text-gray-900">
                        {event.tanggal ? new Date(event.tanggal).toLocaleDateString("id-ID") : "Invalid Date"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 font-medium">Lokasi</p>
                      <p className="text-gray-900">{event.lokasi || "-"}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 font-medium">Harga Tiket</p>
                      <p className="text-gray-900">
                        Rp {event.harga ? parseFloat(event.harga).toLocaleString('id-ID') : "0"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t">
            {(ticket.status === "pending" || ticket.status === "confirmed") && (
              <button 
                onClick={handleCancelClick}
                className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold">
                Batalkan Tiket
              </button>
            )}
            <button
              onClick={() => router.push("/my-tickets")}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      </main>

      {/* Cancel Ticket Modal */}
      {selectedTicketForCancel && (
        <CancelTicketModal
          ticket={selectedTicketForCancel}
          onCancel={() => setSelectedTicketForCancel(null)}
          onConfirm={handleConfirmCancel}
          isLoading={isProcessingCancel}
        />
      )}

      <Footer />
    </div>
  );
}
