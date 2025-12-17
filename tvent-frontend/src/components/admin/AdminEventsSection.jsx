"use client";

import { useState, useEffect } from "react";
import EventDetailModal from "@/components/modals/event-detail-modal";
import SearchFilter from "@/components/admin/SearchFilter";
import { formatRupiah } from "@/utils/formatCurrency";
import { formatDateTime } from "@/utils/formatDate";
import { eventService } from "@/utils/services/eventService";

const itemsPerPage = 10;

// Helper function to check if event is expired
const isEventExpired = (eventDate) => {
  return new Date(eventDate) < new Date();
};

export default function AdminEventsSection({ 
  allEvents, 
  onApproveEvent, 
  onRejectEvent, 
  capitalizeStatus 
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventTickets, setSelectedEventTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch tickets when event is selected
  useEffect(() => {
    if (selectedEvent) {
      eventService.getTicketsByEvent(selectedEvent.id)
        .then(response => {
          setSelectedEventTickets(response.data || []);
        })
        .catch(error => {
          console.error('Error fetching tickets:', error);
          setSelectedEventTickets([]);
        });
    }
  }, [selectedEvent]);

  return (
    <>
      <SearchFilter
        items={allEvents}
        searchFields={["nama", "deskripsi", "lokasi", "creator_name"]}
        filterOptions={{
          status: [
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" }
          ]
        }}
        title="Events"
        emptyMessage="No events found"
        renderItem={(filteredEvents) => {
          // Sort events by created_at (newest first)
          const sortedEvents = [...filteredEvents].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          
          const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedEvents = sortedEvents.slice(startIndex, startIndex + itemsPerPage);

          return (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {Math.min(startIndex + 1, sortedEvents.length)} to {Math.min(startIndex + itemsPerPage, sortedEvents.length)} of {sortedEvents.length} events
              </div>
              
              <div className="space-y-4 mb-6">
                {paginatedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-gray-900">
                            {event.nama}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            event.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            event.status === "approved" ? "bg-green-100 text-green-800" :
                            event.status === "rejected" ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {capitalizeStatus(event.status)}
                          </span>
                          {isEventExpired(event.tanggal) && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-300 text-gray-800">
                              🔒 Expired
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {event.deskripsi}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                          <div>Creator: {event.creator_name}</div>
                          <div>Tanggal: {formatDateTime(event.tanggal)}</div>
                          <div>Lokasi: {event.lokasi}</div>
                          <div>Harga: {formatRupiah(event.harga)}</div>
                        </div>
                      </div>
                      {event.status === "pending" && (
                        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 sm:flex-shrink-0">
                          <button 
                            onClick={() => setSelectedEvent(event)}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
                          >
                            View Detail
                          </button>
                          <button 
                            onClick={() => onApproveEvent(event.id)}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => onRejectEvent(event.id)}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {event.status !== "pending" && (
                        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 sm:flex-shrink-0">
                          <button 
                            onClick={() => setSelectedEvent(event)}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
                          >
                            View Detail
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={!!selectedEvent}
        event={selectedEvent}
        tickets={selectedEventTickets}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}
