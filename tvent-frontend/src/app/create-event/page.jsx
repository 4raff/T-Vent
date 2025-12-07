"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { eventService } from "@/utils/services/eventService";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const CATEGORIES = [
  "Technology",
  "Music",
  "Sports",
  "Art",
  "Business",
  "Education",
  "Food",
  "Entertainment",
];

export default function CreateEventPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    tanggal: "",
    lokasi: "",
    harga: "",
    kategori: "",
    poster: "",
    jumlah_tiket: "",
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
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Event name is required";
    } else if (formData.nama.length < 5) {
      newErrors.nama = "Event name must be at least 5 characters";
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = "Description is required";
    } else if (formData.deskripsi.length < 20) {
      newErrors.deskripsi = "Description must be at least 20 characters";
    }

    if (!formData.tanggal) {
      newErrors.tanggal = "Date and time is required";
    } else if (new Date(formData.tanggal) <= new Date()) {
      newErrors.tanggal = "Event date must be in the future";
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = "Location is required";
    }

    if (!formData.harga || isNaN(formData.harga) || formData.harga <= 0) {
      newErrors.harga = "Price must be a positive number";
    }

    if (!formData.kategori) {
      newErrors.kategori = "Category is required";
    }

    if (!formData.jumlah_tiket || isNaN(formData.jumlah_tiket) || formData.jumlah_tiket <= 0) {
      newErrors.jumlah_tiket = "Number of tickets must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);
    try {
      await eventService.createEvent({
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        tanggal: formData.tanggal,
        lokasi: formData.lokasi,
        harga: parseFloat(formData.harga),
        kategori: formData.kategori,
        poster: formData.poster,
        jumlah_tiket: parseInt(formData.jumlah_tiket),
      });

      alert("Event created successfully! Waiting for admin approval.");
      router.push("/my-events");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-300 rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-300 rounded"></div>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Event</h1>
          <p className="text-gray-600">
            Create and submit your event for approval
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              placeholder="e.g., Tech Conference 2025"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                errors.nama
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-200 focus:border-purple-600"
              }`}
            />
            {errors.nama && (
              <p className="text-red-600 text-sm mt-1">{errors.nama}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              placeholder="Describe your event in detail..."
              rows={5}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition resize-none ${
                errors.deskripsi
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-200 focus:border-purple-600"
              }`}
            />
            {errors.deskripsi && (
              <p className="text-red-600 text-sm mt-1">{errors.deskripsi}</p>
            )}
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                errors.tanggal
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-200 focus:border-purple-600"
              }`}
            />
            {errors.tanggal && (
              <p className="text-red-600 text-sm mt-1">{errors.tanggal}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleInputChange}
              placeholder="e.g., Jakarta Convention Center"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                errors.lokasi
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-200 focus:border-purple-600"
              }`}
            />
            {errors.lokasi && (
              <p className="text-red-600 text-sm mt-1">{errors.lokasi}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                errors.kategori
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-200 focus:border-purple-600"
              }`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.kategori && (
              <p className="text-red-600 text-sm mt-1">{errors.kategori}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price (Rp) *
            </label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleInputChange}
              placeholder="e.g., 150000"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                errors.harga
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-200 focus:border-purple-600"
              }`}
            />
            {errors.harga && (
              <p className="text-red-600 text-sm mt-1">{errors.harga}</p>
            )}
          </div>

          {/* Number of Tickets */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Tickets *
            </label>
            <input
              type="number"
              name="jumlah_tiket"
              value={formData.jumlah_tiket}
              onChange={handleInputChange}
              placeholder="e.g., 500"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                errors.jumlah_tiket
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-200 focus:border-purple-600"
              }`}
            />
            {errors.jumlah_tiket && (
              <p className="text-red-600 text-sm mt-1">{errors.jumlah_tiket}</p>
            )}
          </div>

          {/* Poster URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Poster Image URL
            </label>
            <input
              type="url"
              name="poster"
              value={formData.poster}
              onChange={handleInputChange}
              placeholder="e.g., https://example.com/poster.jpg"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 transition"
            />
            <p className="text-gray-500 text-xs mt-1">
              Leave empty to use a default image
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-6 flex gap-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-gray-400"
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Important</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>
              • Your event will be submitted for admin approval after creation
            </li>
            <li>• It may take up to 24 hours for approval</li>
            <li>• You'll receive a notification once it's approved or rejected</li>
            <li>• Make sure all information is accurate before submitting</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
