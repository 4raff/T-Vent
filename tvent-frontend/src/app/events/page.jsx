"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { eventService } from "@/utils/services/eventService";
import { authService } from "@/utils/services/authService";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState(null);

  const categories = [
    "All",
    "Technology",
    "Music",
    "Sports",
    "Art",
    "Business",
    "Education",
  ];

  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        setUser(authService.getUser());
      }
    };

    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents();
        const eventsArray = data.data || data;
        setEvents(eventsArray || []);
        setFilteredEvents(eventsArray || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    checkAuth();
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

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
          event.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Discover Events
          </h1>
          <p className="text-gray-600">
            Find and book your next amazing event
          </p>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => router.push(`/events/${event.id}`)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                {/* Image */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={event.poster || "https://via.placeholder.com/300x200"}
                    alt={event.nama}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-2">
                      {event.nama}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {event.deskripsi}
                  </p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>
                        {new Date(event.tanggal).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="line-clamp-1">{event.lokasi}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                      {event.kategori}
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      Rp{event.harga?.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
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
