"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { eventService } from "@/utils/services/eventService";
import { authService } from "@/utils/services/authService";
import { useToast } from "@/components/common/ToastProvider";
import { categoriesService } from "@/utils/services/categoriesService";
import { capitalizeFirstLetter, getStatusColor } from "@/utils/helpers";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/common/PageHeader";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import EventCard from "@/components/events/event-card";

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  useEffect(() => {
    // Get initial values from URL params
    const searchFromUrl = searchParams.get("search") || "";
    const categoryFromUrl = searchParams.get("category") || "All";
    
    setSearchTerm(searchFromUrl);
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        setUser(authService.getUser());
      }
    };

    const fetchEvents = async () => {
      try {
        setError(null);
        
        // Fetch events
        const eventData = await eventService.getEvents();
        const eventsArray = eventData.data || eventData;
        setEvents(eventsArray || []);
        setFilteredEvents(eventsArray || []);
        setLoading(false);

        // Fetch categories
        const categoriesData = await categoriesService.getCategories();
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
        setCategories(["All", ...categoriesArray]);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching:", error);
        const errorMsg = error.data?.message || "Gagal memuat data. Coba lagi.";
        setError(errorMsg);
        toast.showError(errorMsg);
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    checkAuth();
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by approved status only
    filtered = filtered.filter((event) => event.status === "approved");

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (event) => event.kategori === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.lokasi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by creation date (newest created first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  }, [searchTerm, selectedCategory, events]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <PageHeader 
          title="Discover Events" 
          subtitle="Find and book your next amazing event" 
        />

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Categories */}
        <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <LoadingSkeleton count={6} variant="card" />
        ) : filteredEvents.length > 0 ? (
          <>
            {/* Results info */}
            <div className="mb-6 text-gray-600">
              <p className="text-sm">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredEvents.length)} to {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
              </p>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredEvents
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((event) => (
                  <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination Controls */}
            {Math.ceil(filteredEvents.length / itemsPerPage) > 1 && (
              <div className="flex justify-center items-center gap-2 mb-12">
                {/* Previous button */}
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

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.ceil(filteredEvents.length / itemsPerPage) },
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

                {/* Next button */}
                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(
                        Math.ceil(filteredEvents.length / itemsPerPage),
                        currentPage + 1
                      )
                    )
                  }
                  disabled={currentPage === Math.ceil(filteredEvents.length / itemsPerPage)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === Math.ceil(filteredEvents.length / itemsPerPage)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No events found matching your criteria
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
