"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventCard from "@/components/events/event-card";
import { eventService } from "@/utils/services/eventService";

export default function FeaturedEvents() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  const categories = [
    "All",
    "Workshop",
    "Exhibition",
    "Performance",
    "Seminar",
    "Social",
  ];

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getMostPurchasedEvents(10);
        const dataArray = response.data || response;
        // Already filtered by approved status in the endpoint
        setEvents(Array.isArray(dataArray) ? dataArray : []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents =
    filter === "All"
      ? events
      : events.filter((event) => {
          // Match by kategori field from API
          const eventCategory = event.kategori || event.category || "";
          return eventCategory.toLowerCase() === filter.toLowerCase();
        });

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleViewAll = () => {
    router.push("/events");
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">Loading events...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground">Event Unggulan</h2>
            <p className="text-foreground/60 mt-2">Discover amazing events happening around campus</p>
          </div>
          <button 
            onClick={handleViewAll}
            className="px-6 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition">
            View All →
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === cat
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-foreground border border-gray-300 hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events count info */}
        <div className="mb-6 text-foreground/60">
          <p className="text-sm">
            {filteredEvents.length === 0 
              ? "No events found" 
              : `Showing ${startIndex + 1} to ${Math.min(startIndex + itemsPerPage, filteredEvents.length)} of ${filteredEvents.length} events`}
          </p>
        </div>

        {/* Events grid */}
        {filteredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {/* Previous button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 active:scale-95"
                  }`}
                >
                  ← Previous
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        currentPage === page
                          ? "bg-primary text-white shadow-lg scale-110"
                          : "bg-gray-100 text-foreground border border-gray-300 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 active:scale-95"
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No events available in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
