"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { eventService } from "@/utils/services/eventService";
import { reviewService } from "@/utils/services/reviewService";
import { bookmarkService } from "@/utils/services/bookmarkService";
import { capitalizeFirstLetter, getStatusColor } from "@/utils/helpers";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useToast } from "@/components/common/ToastProvider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import LoginModal from "@/components/modals/login-modal";

export default function EventDetail() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const eventId = params?.id;

  const [event, setEvent] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [isKirimting, setIsKirimting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        let userData = null;
        if (authService.isAuthenticated()) {
          userData = authService.getUser();
          setUser(userData);
        }

        if (eventId) {
          const eventData = await eventService.getEvent(eventId);
          setEvent(eventData);
          
          // Check if user has bookmarked this event
          if (userData) {
            const bookmark = await bookmarkService.isEventBookmarked(userData.id, parseInt(eventId));
            if (bookmark) {
              setIsBookmarked(true);
              setBookmarkId(bookmark.id);
            }
          }
          
          // Fetch reviews for this event
          fetchReviews();
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const allReviews = await reviewService.getReviews();
      const reviewArray = Array.isArray(allReviews) ? allReviews : allReviews.data || [];
      // Filter reviews for this event
      const eventReviews = reviewArray.filter(r => r.event_id === parseInt(eventId));
      setReviews(eventReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleKirimReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.showError("Silakan login untuk memberi review");
      return;
    }

    setIsKirimting(true);
    try {
      await reviewService.submitReview({
        user_id: user.id,
        event_id: parseInt(eventId),
        rating: reviewRating,
        feedback: reviewFeedback,
        is_anonymous: isAnonymous,
      });
      toast.showSuccess("Review berhasil dikirim!");
      setReviewFeedback("");
      setReviewRating(5);
      setIsAnonymous(false);
      setShowReviewForm(false);
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.showError(error.data?.message || "Gagal mengirim review");
    } finally {
      setIsKirimting(false);
    }
  };

  const { setCheckout } = useCheckout();

  const handleBooking = async () => {
    if (!user) {
      toast.showWarning("Silakan login terlebih dahulu untuk booking");
      setShowLoginModal(true);
      return;
    }

    // Validasi event harus approved
    if (event.status !== "approved") {
      toast.showError("Event ini belum dapat di-booking. Status: " + capitalizeFirstLetter(event.status));
      return;
    }

    setIsKirimting(true);
    try {
      // Set checkout data in context (more secure than URL params)
      setCheckout(eventId, quantity);
      // Redirect to checkout page without exposing event ID or quantity in URL
      router.push(`/checkout`);
    } catch (error) {
      console.error("Booking error:", error);
      toast.showError(error.data?.message || "Gagal lanjut ke checkout");
    } finally {
      setIsKirimting(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.showError("Silakan login untuk bookmark event");
      return;
    }

    try {
      const result = await bookmarkService.toggleBookmark(user.id, parseInt(eventId));
      setIsBookmarked(result.isBookmarked);
      setBookmarkId(result.bookmarkId);
      
      if (result.isBookmarked) {
        toast.showSuccess("Event berhasil dibookmark");
      } else {
        toast.showSuccess("Bookmark dihapus");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.showError("Gagal mengubah bookmark");
    }
  };

  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setShowLoginModal(false);
    toast.showSuccess(`Selamat datang, ${userData.username}!`);
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
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400";
                }}
              />
            </div>

            {/* Event Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {event.nama}
                  </h1>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(event.status).bgColor} ${getStatusColor(event.status).textColor}`}>
                    {capitalizeFirstLetter(event.status)}
                  </span>
                </div>
                <button
                  onClick={handleBookmarkToggle}
                  className="text-3xl hover:opacity-70 transition"
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
                  >
                    {showReviewForm ? "Batal" : "Write a Review"}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && user && (
                <form onSubmit={handleKirimReview} className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                      <option value={4}>⭐⭐⭐⭐ Good</option>
                      <option value={3}>⭐⭐⭐ Average</option>
                      <option value={2}>⭐⭐ Poor</option>
                      <option value={1}>⭐ Terrible</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewFeedback}
                      onChange={(e) => setReviewFeedback(e.target.value)}
                      placeholder="Share your experience with this event..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      id="isAnonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <label htmlFor="isAnonymous" className="ml-2 text-sm font-medium text-gray-700">
                      Post as Anonymous
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isKirimting}
                    className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
                  >
                    {isKirimting ? "Kirimting..." : "Kirim Review"}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">Loading reviews...</p>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.is_anonymous ? "Anonymous" : review.username || "User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                        <div className="text-xl">
                          {"⭐".repeat(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.feedback}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              )}
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
                    disabled={isKirimting}
                    className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
                  >
                    {isKirimting ? "Memproses..." : "Confirm Booking"}
                  </button>

                  <button
                    onClick={() => setShowBooking(false)}
                    className="w-full py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLoginSuccess}
        />
      )}
    </div>
  );
}
