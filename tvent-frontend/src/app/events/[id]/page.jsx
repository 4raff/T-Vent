"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { eventService } from "@/utils/services/eventService";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function EventDetail() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;

  const [event, setEvent] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getUser();
          setUser(userData);
        }

        if (eventId) {
          const eventData = await eventService.getEvent(eventId);
          setEvent(eventData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleBooking = async () => {
    if (!user) {
      router.push("/");
      return;
    }

    setIsSubmitting(true);
    try {
      // Redirect to checkout page with event and quantity
      router.push(
        `/checkout?eventId=${eventId}&quantity=${quantity}`
      );
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to proceed to checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded w-1/2"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <p className="text-center text-gray-600">Event not found</p>
          <button
            onClick={() => router.push("/events")}
            className="mt-4 mx-auto block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 text-purple-600 hover:text-purple-700 font-semibold"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="mb-8 rounded-lg overflow-hidden bg-gray-200 h-96">
              <img
                src={event.poster || "https://via.placeholder.com/800x400"}
                alt={event.nama}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Event Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {event.nama}
                  </h1>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    {event.status || "Pending"}
                  </span>
                </div>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="text-3xl"
                >
                  {isBookmarked ? "❤️" : "🤍"}
                </button>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Date & Time</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {new Date(event.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Location</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {event.lokasi}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Category</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {event.kategori}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Available Tickets
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {event.tiket_tersedia}/{event.jumlah_tiket}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {event.deskripsi}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">No reviews yet</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-20">
              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm font-medium">Price</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">
                  Rp{event.harga?.toLocaleString("id-ID") || "0"}
                </p>
              </div>

              {/* Availability */}
              {event.tiket_tersedia > 0 ? (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold">
                    ✓ {event.tiket_tersedia} tickets available
                  </p>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold">
                    ✕ Sold Out
                  </p>
                </div>
              )}

              {/* Booking Form */}
              {!showBooking ? (
                <button
                  onClick={() => setShowBooking(true)}
                  disabled={event.tiket_tersedia === 0}
                  className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Book Now
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tickets
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {[...Array(Math.min(5, event.tiket_tersedia))].map(
                        (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">
                        Rp{(event.harga * quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="text-lg font-bold text-purple-600">
                        Rp{(event.harga * quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </button>

                  <button
                    onClick={() => setShowBooking(false)}
                    className="w-full py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
