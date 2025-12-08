"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EventCard({ event }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    router.push(`/events/${event.id}`);
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <Image
          src={event.poster || "/images/placeholder.svg"}
          alt={event.nama || "Event image" }
          width={400}
          height={300}
          className={`w-full h-full object-cover transition duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold ${
            event.status === 'approved' ? 'bg-green-500' :
            event.status === 'pending' ? 'bg-yellow-500' :
            'bg-red-500'
          } backdrop-blur-sm`}
        >
          {event.status || 'pending'}
        </div>

        {/* Capacity Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r from-primary to-secondary">
          {event.tiket_tersedia || 0} left
        </div>
      </div>

      {/* Content */}
      <div className="p-5 bg-white">
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
          {event.nama}
        </h3>

        {/* Description */}
        <p className="text-sm text-foreground/60 mb-3 line-clamp-2">
          {event.deskripsi}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <span>📅</span>
            <span>{event.tanggal ? new Date(event.tanggal).toLocaleDateString('id-ID') : 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <span>📍</span>
            <span>{event.lokasi}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <span>💰</span>
            <span>Rp {event.harga ? parseFloat(event.harga).toLocaleString('id-ID') : '0'}</span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleViewDetails}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            isHovered
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
              : "bg-muted text-foreground hover:bg-primary/5"
          }`}
        >
          {isHovered ? "Get Tickets →" : "View Details"}
        </button>
      </div>
    </div>
  );
}
