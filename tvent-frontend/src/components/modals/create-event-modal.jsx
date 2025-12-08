"use client";

import { useState } from "react";
import { eventService } from "@/utils/services/eventService";
import { useToast } from "@/components/common/ToastProvider";

export default function CreateEventModal({ onClose, isLoggedIn }) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "art",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await eventService.createEvent({
        nama: formData.title,
        kategori: formData.category,
        lokasi: formData.location,
        deskripsi: formData.description,
        // Format: YYYY-MM-DD HH:mm
        tanggal: `${formData.date} ${formData.time}`,
      });
      toast.showSuccess("Event berhasil dibuat! Tunggu persetujuan admin.");
      onClose();
    } catch (error) {
      console.error("Create event error:", error);
      toast.showError(error.data?.message || "Gagal membuat event. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 text-center animate-in zoom-in-95 duration-300">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Login Required
          </h2>
          <p className="text-foreground/60 mb-6">
            Please login first to create an event
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-accent/20 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-foreground">Create Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Summer Art Workshop"
              required
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted"
            >
              <option value="art">Visual Arts</option>
              <option value="music">Music</option>
              <option value="tech">Technology</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Main Hall, Building A"
              required
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell people about your event..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-foreground/20 text-foreground rounded-lg font-semibold hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
