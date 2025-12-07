"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function Bookmarks() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        setUser(userData);
        
        // TODO: Fetch user's bookmarks from API
        setBookmarks([]);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bookmarks</h1>
          <p className="text-gray-600">Your saved and bookmarked events</p>
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
                onClick={() => router.push(`/events/${bookmark.event_id}`)}
              >
                <div className="h-48 bg-gray-200">
                  <img
                    src={bookmark.event?.poster || "https://via.placeholder.com/300x200"}
                    alt={bookmark.event?.nama}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {bookmark.event?.nama}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {bookmark.event?.deskripsi}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-purple-600">
                      Rp{bookmark.event?.harga?.toLocaleString("id-ID")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Remove bookmark
                      }}
                      className="text-2xl hover:opacity-70"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You haven't bookmarked any events yet
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

      <Footer />
    </div>
  );
}
