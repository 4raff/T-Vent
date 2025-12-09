"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { bookmarkService } from "@/utils/services/bookmarkService";
import { eventService } from "@/utils/services/eventService";
import { useToast } from "@/components/common/ToastProvider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/common/PageHeader";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import EventCard from "@/components/events/event-card";

export default function Bookmarks() {
  const router = useRouter();
  const toast = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        setUser(userData);
        
        // Fetch user's bookmarks from API
        const userBookmarks = await bookmarkService.getUserBookmarks(userData.id);
        
        // Fetch event details for each bookmark
        const bookmarksWithEvents = await Promise.all(
          userBookmarks.map(async (bookmark) => {
            try {
              const event = await eventService.getEvent(bookmark.event_id);
              return { ...bookmark, event };
            } catch (error) {
              console.error(`Error fetching event ${bookmark.event_id}:`, error);
              return bookmark;
            }
          })
        );
        
        setBookmarks(bookmarksWithEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        toast.showError("Gagal memuat bookmarks");
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [router, toast]);

  const handleRemoveBookmark = async (bookmarkId, e) => {
    e.stopPropagation();
    try {
      await bookmarkService.removeBookmark(bookmarkId);
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
      toast.showSuccess("Bookmark dihapus");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.showError("Gagal menghapus bookmark");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader title="Bookmarks" subtitle="Loading your saved events..." />
          <LoadingSkeleton count={6} variant="card" />
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
          title="Bookmarks" 
          subtitle="Your saved and bookmarked events" 
        />

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="relative">
                {bookmark.event && (
                  <>
                    <EventCard event={bookmark.event} />
                    {/* Bookmark heart overlay */}
                    <button
                      onClick={(e) => handleRemoveBookmark(bookmark.id, e)}
                      className="absolute top-4 right-4 text-3xl hover:opacity-70 transition bg-white/80 rounded-full p-2 z-10"
                    >
                      ❤️
                    </button>
                  </>
                )}
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
