"use client";

import { useState } from "react";
import { formatRupiah } from "@/utils/formatCurrency";

export default function EventDetailModal({ isOpen, event, tickets = [], onClose }) {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  if (!isOpen || !event) return null;

  // Calculate tickets sold and revenue based on event data (same as my-events)
  const ticketsSold = event.jumlah_tiket - (event.tiket_tersedia || 0);
  const totalRevenue = ticketsSold * event.harga;

  const capitalizeStatus = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg max-w-2xl sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{event.nama}</h2>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(event.status)}`}>
              {capitalizeStatus(event.status)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Event Image */}
          {event.poster && (
            <div className="rounded-lg overflow-hidden bg-gray-200 h-48 sm:h-64 cursor-pointer group">
              <img
                src={event.poster}
                alt={event.nama}
                className="w-full h-full object-cover group-hover:opacity-75 transition"
                onClick={() => setFullscreenImage(event.poster)}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x300";
                }}
              />
            </div>
          )}

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600">Deskripsi</label>
                <p className="text-gray-900 mt-1 text-sm sm:text-base break-words">{event.deskripsi}</p>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600">Kategori</label>
                <p className="text-gray-900 mt-1 text-sm sm:text-base">{event.kategori}</p>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600">Pembuat Event</label>
                <p className="text-gray-900 mt-1 text-sm sm:text-base break-words">{event.creator_name || 'Unknown'}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600">Tanggal & Waktu</label>
                <p className="text-gray-900 mt-1 text-sm sm:text-base break-words">
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
                <label className="text-xs sm:text-sm font-semibold text-gray-600">Lokasi</label>
                <p className="text-gray-900 mt-1 text-sm sm:text-base break-words">{event.lokasi}</p>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600">Harga</label>
                <p className="text-gray-900 mt-1 text-base sm:text-lg font-bold text-purple-600">
                  {formatRupiah(event.harga)}
                </p>
              </div>
            </div>
          </div>

          {/* Tickets Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Tiket</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{event.jumlah_tiket}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Tiket Tersedia</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{event.tiket_tersedia}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Tiket Terjual</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">{ticketsSold}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Pendapatan</p>
                <p className="text-xl sm:text-2xl font-bold text-green-700 mt-1">{formatRupiah(totalRevenue)}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-gray-500 pt-4 sm:pt-6 border-t space-y-1">
            <p className="break-words">Created: {new Date(event.created_at).toLocaleString("id-ID")}</p>
            <p className="break-words">Updated: {new Date(event.updated_at).toLocaleString("id-ID")}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 sm:p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm sm:text-base"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={fullscreenImage}
              alt="Event poster fullscreen"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
