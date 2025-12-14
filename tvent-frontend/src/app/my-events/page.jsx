"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { eventService } from "@/utils/services/eventService";
import { useToast } from "@/components/common/ToastProvider";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/common/PageHeader";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

// Helper function to check if event is expired
const isEventExpired = (eventDate) => {
  return new Date(eventDate) < new Date();
};

export default function MyEvents() {
  const router = useRouter();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    event: null,
    tickets: [],
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        setUser(userData);
        
        // Fetch all events created by user
        try {
          const allEvents = await eventService.getMyEvents();
          const userEvents = Array.isArray(allEvents) 
            ? allEvents
            : allEvents.data 
              ? allEvents.data
              : [];
          setEvents(userEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
          toast.showError("Gagal memuat event Anda");
          setEvents([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleEdit = (eventId) => {
    router.push(`/edit-event/${eventId}`);
  };

  const handleDetailClick = async (event) => {
    try {
      // Fetch tickets for this event
      const allTickets = await eventService.getTicketsByEvent(event.id);
      const tickets = Array.isArray(allTickets) ? allTickets : allTickets.data || [];
      
      setDetailModal({
        isOpen: true,
        event: event,
        tickets: tickets,
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.showError("Gagal memuat detail event");
    }
  };

  const handleDeleteClick = (event) => {
    // Check if event is approved
    if (event.status === "approved") {
      toast.showError("Event yang sudah di-approve tidak bisa dihapus");
      return;
    }

    // Check if event has sold tickets
    const ticketsSold = event.jumlah_tiket - (event.tiket_tersedia || 0);
    if (ticketsSold > 0) {
      toast.showError("Event yang sudah memiliki penjualan tiket tidak bisa dihapus");
      return;
    }

    // If checks pass, show confirmation modal
    setDeleteModal({
      isOpen: true,
      eventId: event.id,
    });
  };

  const handleConfirmDelete = async () => {
    const eventId = deleteModal.eventId;
    setDeletingId(eventId);
    
    try {
      await eventService.deleteEvent(eventId);
      toast.showSuccess("Event berhasil dihapus");
      setEvents(events.filter(e => e.id !== eventId));
      setDeleteModal({ isOpen: false, eventId: null });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.showError(error.data?.message || "Gagal menghapus event");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseDetail = () => {
    setDetailModal({
      isOpen: false,
      event: null,
      tickets: [],
    });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, eventId: null });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader title="My Events" subtitle="Loading your events..." />
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <PageHeader 
              title="My Events" 
              subtitle="Manage and organize your events" 
            />
          </div>
          <button
            onClick={() => router.push("/create-event")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Create Event
          </button>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="h-40 bg-gray-200">
                  <img
                    src={event.poster || "https://via.placeholder.com/300x200"}
                    alt={event.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{event.nama}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.deskripsi}
                  </p>
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : event.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      Rp{event.harga?.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDetailClick(event)}
                      className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-semibold"
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => handleEdit(event.id)}
                      disabled={event.status === "completed" || isEventExpired(event.tanggal)}
                      className={`flex-1 px-4 py-2 border rounded-lg transition text-sm font-semibold ${
                        event.status === "completed" || isEventExpired(event.tanggal)
                          ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50"
                          : "border-purple-600 text-purple-600 hover:bg-purple-50"
                      }`}
                      title={event.status === "completed" ? "Event yang sudah selesai tidak bisa di-edit" : isEventExpired(event.tanggal) ? "Event yang sudah expired tidak bisa di-edit" : ""}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(event)}
                      disabled={event.status === "approved" || (event.jumlah_tiket - (event.tiket_tersedia || 0) > 0) || deletingId === event.id}
                      className={`flex-1 px-4 py-2 border rounded-lg transition text-sm font-semibold ${
                        event.status === "approved" || (event.jumlah_tiket - (event.tiket_tersedia || 0) > 0)
                          ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50"
                          : "border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                      title={event.status === "approved" ? "Event yang di-approve tidak bisa dihapus" : (event.jumlah_tiket - (event.tiket_tersedia || 0) > 0) ? "Event dengan tiket terjual tidak bisa dihapus" : ""}
                    >
                      {deletingId === event.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {Math.ceil(events.length / itemsPerPage) > 1 && (
              <div className="col-span-1 md:col-span-2 flex justify-center items-center gap-2 mt-6">
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
                  {Array.from(
                    { length: Math.ceil(events.length / itemsPerPage) },
                    (_, i) => i + 1
                  ).map((page) => (
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
                  onClick={() => setCurrentPage(Math.min(Math.ceil(events.length / itemsPerPage), currentPage + 1))}
                  disabled={currentPage === Math.ceil(events.length / itemsPerPage)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === Math.ceil(events.length / itemsPerPage)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't created any events yet</p>
            <button
              onClick={() => router.push("/create-event")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Create Your First Event
            </button>
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Hapus Event"
        message="Apakah Anda yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deletingId === deleteModal.eventId}
        confirmVariant="danger"
      />

      {/* Event Detail Modal */}
      {detailModal.isOpen && detailModal.event && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{detailModal.event.nama}</h2>
                <p className="text-gray-600 text-sm mt-1">{detailModal.event.lokasi}</p>
              </div>
              <button
                onClick={handleCloseDetail}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Event Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm font-semibold">Status</p>
                  <p className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      detailModal.event.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : detailModal.event.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {detailModal.event.status?.charAt(0).toUpperCase() + detailModal.event.status?.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm font-semibold">Kategori</p>
                  <p className="mt-2 text-gray-900 font-semibold">{detailModal.event.kategori || "-"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm font-semibold">Tanggal Event</p>
                  <p className="mt-2 text-gray-900 font-semibold">
                    {new Date(detailModal.event.tanggal).toLocaleDateString("id-ID", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm font-semibold">Harga Tiket</p>
                  <p className="mt-2 text-gray-900 font-semibold">
                    Rp {detailModal.event.harga?.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Ticket Statistics */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Statistik Tiket</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-600 text-sm font-semibold">Total Tiket</p>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{detailModal.event.jumlah_tiket}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-gray-600 text-sm font-semibold">Tiket Tersedia</p>
                    <p className="mt-2 text-3xl font-bold text-green-600">{detailModal.event.tiket_tersedia || 0}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-gray-600 text-sm font-semibold">Tiket Terjual</p>
                    <p className="mt-2 text-3xl font-bold text-purple-600">
                      {detailModal.event.jumlah_tiket - (detailModal.event.tiket_tersedia || 0)}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-gray-600 text-sm font-semibold">Total Penghasilan</p>
                    <p className="mt-2 text-3xl font-bold text-orange-600">
                      Rp {(
                        (detailModal.event.jumlah_tiket - (detailModal.event.tiket_tersedia || 0)) * 
                        detailModal.event.harga
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Deskripsi</h3>
                <p className="text-gray-600">{detailModal.event.deskripsi}</p>
              </div>

              {/* Recent Tickets */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tiket Terbaru ({detailModal.tickets.filter(t => t.event_id === detailModal.event.id).length})</h3>
                {detailModal.tickets.filter(t => t.event_id === detailModal.event.id).length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {detailModal.tickets.filter(t => t.event_id === detailModal.event.id).slice(0, 5).map((ticket) => (
                      <div key={ticket.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{ticket.kode_tiket}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(ticket.created_at).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          ticket.status === "active"
                            ? "bg-green-100 text-green-800"
                            : ticket.status === "confirmed"
                            ? "bg-purple-100 text-purple-800"
                            : ticket.status === "used"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Belum ada tiket terjual</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={handleCloseDetail}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleCloseDetail();
                  handleEdit(detailModal.event.id);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Edit Event
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
