"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { ticketService } from "@/utils/services/ticketService";
import { apiClient } from "@/utils/api/client";
import { useToast } from "@/components/common/ToastProvider";
import { capitalizeStatus, getStatusColor } from "@/utils/helpers";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/common/PageHeader";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import CancelTicketModal from "@/components/modals/cancel-ticket-modal";

export default function MyTickets() {
  const router = useRouter();
  const toast = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cancellingTicketId, setCancellingTicketId] = useState(null);
  const [selectedTicketForCancel, setSelectedTicketForCancel] = useState(null);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  const handleCancelClick = (ticket) => {
    setSelectedTicketForCancel(ticket);
  };

  const handleConfirmCancel = async (ticketId, reason) => {
    setIsProcessingCancel(true);
    try {
      await ticketService.cancelTicket(ticketId, reason);
      toast.showSuccess("Tiket berhasil dibatalkan");
      setSelectedTicketForCancel(null);
      
      // Refresh tickets
      if (user) {
        await fetchTickets(user);
      }
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      const errorMsg = error.data?.message || "Gagal membatalkan tiket";
      toast.showError(errorMsg);
    } finally {
      setIsProcessingCancel(false);
    }
  };

  const fetchTickets = async (userData) => {
    try {
      // Fetch tickets
      const ticketsResponse = await apiClient.get(`/tickets`);
      const allTickets = Array.isArray(ticketsResponse) ? ticketsResponse : ticketsResponse.data || [];
      const userTickets = allTickets.filter(t => t.user_id === userData.id);
      
      // Fetch payments to get rejection reason
      try {
        const paymentsResponse = await apiClient.get(`/payments`);
        const allPayments = Array.isArray(paymentsResponse) ? paymentsResponse : paymentsResponse.data || [];
        
        // Enrich tickets with payment rejection reason
        const enrichedTickets = userTickets.map(ticket => {
          const payment = allPayments.find(p => p.ticket_id === ticket.id);
          return {
            ...ticket,
            rejection_reason: payment?.rejection_reason || null
          };
        });
        
        setTickets(enrichedTickets);
      } catch (paymentError) {
        console.error("Error fetching payments:", paymentError);
        // Still show tickets even if payment fetch fails
        setTickets(userTickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.showError("Gagal memuat tiket");
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
        
        // Fetch user's tickets from API
        await fetchTickets(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        toast.showError("Gagal memuat tiket");
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, toast]);

  // Poll for ticket updates every 5 seconds to catch admin approvals/rejections
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchTickets(user);
    }, 5000);

    return () => clearInterval(interval);
  }, [user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader title="My Tickets" subtitle="Loading your tickets..." />
          <LoadingSkeleton count={3} variant="list" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader 
          title="My Tickets" 
          subtitle="View and manage your event tickets" 
        />

        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Ticket #{ticket.kode_tiket}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Event ID: {ticket.event_id}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Purchased: {new Date(ticket.created_at).toLocaleDateString("id-ID")}
                    </p>
                    {ticket.status === 'rejected' && ticket.rejection_reason && (
                      <p className="text-red-600 text-sm font-semibold mt-2">
                        Alasan Penolakan: {ticket.rejection_reason}
                      </p>
                    )}
                    {ticket.status === 'cancelled' && ticket.cancellation_reason && (
                      <p className="text-orange-600 text-sm font-semibold mt-2">
                        Alasan Pembatalan: {ticket.cancellation_reason}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {(() => {
                      const colors = getStatusColor(ticket.status);
                      return (
                        <span className={`inline-block px-4 py-2 rounded-full font-semibold ${colors.bgColor} ${colors.textColor}`}>
                          {capitalizeStatus(ticket.status)}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button 
                    onClick={() => router.push(`/my-tickets/${ticket.id}`)}
                    className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition">
                    View Details
                  </button>
                  {(ticket.status === "pending" || ticket.status === "confirmed") && (
                    <button 
                      onClick={() => handleCancelClick(ticket)}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition">
                      Cancel Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You haven't purchased any tickets yet
            </p>
            <button
              onClick={() => router.push("/events")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Browse Events
            </button>
          </div>
        )}
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
