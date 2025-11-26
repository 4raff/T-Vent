"use client";

import { useState } from "react";
import Image from "next/image";

export default function EventCard({ event }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <Image
          src={event.image || "/images/placeholder.svg"}
          alt={event.title || "Event image" }
          width={400}
          height={300}
          className={`w-full h-full object-cover transition duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold bg-black/50 backdrop-blur-sm`}
        >
          {event.category}
        </div>

        {/* Attendees Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r from-primary to-secondary">
          {event.attendees} going
        </div>
      </div>

      {/* Content */}
      <div className="p-5 bg-white">
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <span>📅</span>
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <span>🕐</span>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <span>📍</span>
            <span>{event.location}</span>
          </div>
        </div>

        {/* Button */}
        <button
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
