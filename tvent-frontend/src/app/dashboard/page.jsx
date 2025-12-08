"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { apiClient } from "@/utils/api/client";
import { useToast } from "@/components/common/ToastProvider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function Dashboard() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    tickets: 0,
    events: 0,
    bookmarks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        setUser(userData);

        // Fetch stats from APIs
        const ticketsResponse = await apiClient.get(`/tickets`);
        const eventsResponse = await apiClient.get(`/events`);
        const bookmarksResponse = await apiClient.get(`/bookmarks`);

        const allTickets = Array.isArray(ticketsResponse) ? ticketsResponse : ticketsResponse.data || [];
        const allEvents = Array.isArray(eventsResponse) ? eventsResponse : eventsResponse.data || [];
        const allBookmarks = Array.isArray(bookmarksResponse) ? bookmarksResponse : bookmarksResponse.data || [];

        // Filter milik user
        const userTickets = allTickets.filter(t => t.user_id === userData.id);
        const userEvents = allEvents.filter(e => e.user_id === userData.id);
        const userBookmarks = allBookmarks.filter(b => b.user_id === userData.id);

        setStats({
          tickets: userTickets.length,
          events: userEvents.length,
          bookmarks: userBookmarks.length,
        });
        setLoading(false);
      } catch (error) {
        console.error("Dashboard error:", error);
        console.error("Error details:", error.message, error.data);
        toast.showError(error.data?.message || "Gagal memuat dashboard");
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your events, tickets, and bookmarks all in one place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Tickets Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Tickets</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.tickets}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎫</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/my-tickets")}
              className="mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View All →
            </button>
          </div>

          {/* Events Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.events}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/my-events")}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              View All →
            </button>
          </div>

          {/* Bookmarks Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Bookmarks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.bookmarks}
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/bookmarks")}
              className="mt-4 text-pink-600 hover:text-pink-700 font-semibold text-sm"
            >
              View All →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/events")}
              className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-left"
            >
              <p className="font-semibold text-gray-900">Browse Events</p>
              <p className="text-sm text-gray-600">Find and book new events</p>
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-left"
            >
              <p className="font-semibold text-gray-900">Edit Profile</p>
              <p className="text-sm text-gray-600">Update your account information</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-500">No recent activity yet</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
