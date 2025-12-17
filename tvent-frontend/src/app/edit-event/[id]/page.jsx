"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { eventService } from "@/utils/services/eventService";
import { useToast } from "@/components/common/ToastProvider";
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

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const eventId = params.id;
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

  const [posterPreview, setPosterPreview] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchEvent = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        setUser(userData);

        // Fetch event details
        const event = await eventService.getEvent(eventId);
        
        // Check ownership
        if (event.created_by !== userData.id) {
          toast.showError("Anda tidak bisa mengedit event orang lain");
          router.push("/my-events");
          return;
        }

        // Format tanggal untuk datetime-local input
        const tanggalObj = new Date(event.tanggal);
        const tanggalFormatted = tanggalObj.toISOString().slice(0, 16);

        setFormData({
          nama: event.nama || "",
          deskripsi: event.deskripsi || "",
          tanggal: tanggalFormatted || "",
          lokasi: event.lokasi || "",
          harga: event.harga || "",
          kategori: event.kategori || "",
          poster: event.poster || "",
          jumlah_tiket: event.jumlah_tiket || "",
        });
        setPosterPreview(event.poster);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        toast.showError("Gagal memuat data event");
        router.push("/my-events");
      }
    };

    checkAuthAndFetchEvent();
  }, [eventId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.showError("Ukuran file terlalu besar (max 5MB)");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.showError("File harus berupa gambar");
      return;
    }

    // Read and compress image
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if larger than 1000px
        if (width > 1000) {
          height = (height * 1000) / width;
          width = 1000;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Always compress to JPEG for smaller file size
        let quality = 0.85;
        let compressed = canvas.toDataURL('image/jpeg', quality);
        
        // If still too large, reduce quality further - keep under 300KB for database safety
        while (compressed.length > 300 * 1024 && quality > 0.4) { // 300KB max
          quality -= 0.1;
          compressed = canvas.toDataURL('image/jpeg', quality);
        }
        
        setFormData((prev) => ({
          ...prev,
          poster: compressed,
        }));
        setPosterPreview(compressed);
      };
      img.onerror = () => {
        toast.showError("Gagal memproses gambar. Coba dengan file lain.");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
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

    if (!formData.poster) {
      newErrors.poster = "Poster image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.showError("Silakan perbaiki error di bawah");
      return;
    }

    setIsSubmitting(true);
    try {
      await eventService.updateEvent(eventId, {
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        tanggal: formData.tanggal,
        lokasi: formData.lokasi,
        harga: parseFloat(formData.harga),
        kategori: formData.kategori,
        poster: formData.poster,
        jumlah_tiket: parseInt(formData.jumlah_tiket),
      });

      toast.showSuccess("Event berhasil diupdate!");
      router.push("/my-events");
    } catch (error) {
      console.error("Submit error:", error);
      toast.showError(error.data?.message || "Gagal mengupdate event. Coba lagi.");
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Event</h1>
          <p className="text-gray-600">
            Update your event details
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

          {/* Poster Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Poster Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                className="hidden"
                id="poster-input"
              />
              <label
                htmlFor="poster-input"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {posterPreview ? (
                  <div className="w-full">
                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      className="max-h-64 mx-auto rounded"
                    />
                    <p className="text-center text-sm text-gray-600 mt-3">
                      Click to change
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-gray-700 font-semibold">
                      Upload poster image
                    </p>
                    <p className="text-gray-500 text-sm">
                      PNG, JPG, atau GIF (max 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
            {errors.poster && (
              <p className="text-red-600 text-sm mt-1">{errors.poster}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-6 flex gap-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-gray-400"
            >
              {isSubmitting ? "Updating Event..." : "Update Event"}
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
      </main>

      <Footer />
    </div>
  );
}
