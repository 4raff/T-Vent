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

export default function MyEvents() {
  const router = useRouter();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        setUser(userData);
        
        // Fetch all events and filter by user's created_by
        try {
          const allEvents = await eventService.getEvents();
          const userEvents = Array.isArray(allEvents) 
            ? allEvents.filter(e => e.created_by === userData.id)
            : allEvents.data 
              ? allEvents.data.filter(e => e.created_by === userData.id)
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
            {events.map((event) => (
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
                      {event.status}
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      Rp{event.harga?.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(event.id)}
                      className="flex-1 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition text-sm font-semibold"
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

      <Footer />
    </div>
  );
}
