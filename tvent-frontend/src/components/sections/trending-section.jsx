"use client";

import { useState, useEffect } from "react";
import { TRENDING_EVENTS } from "@/constants/categories";

export default function TrendingSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TRENDING_EVENTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const ChevronIcon = ({ direction }) => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );

  const FireIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
    </svg>
  );

  return (
    <section className="py-16 bg-gradient-to-b from-background to-accent-2/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <FireIcon />
            <span className="text-sm font-bold text-accent-1 uppercase tracking-widest">
              Trending Now
            </span>
            <FireIcon />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Event Terpopuler Minggu Ini
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan event paling populer yang mendapat perhatian dari
            community
          </p>
        </div>

        {/* Main carousel display */}
        <div className="relative mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left side - Current event details */}
            <div
              className={`bg-gradient-to-br ${TRENDING_EVENTS[activeIndex].color} rounded-2xl p-8 text-white`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Trending</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                {TRENDING_EVENTS[activeIndex].title}
              </h3>
              <p className="text-white/90 mb-6">
                Join {TRENDING_EVENTS[activeIndex].attendees} peserta di acara ini
                acara luar biasa. Tempat terbatas!
              </p>
              <button className="px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:shadow-lg transition">
                View Event
              </button>
            </div>

            {/* Right side - Carousel thumbnails */}
            <div className="space-y-3">
              {TRENDING_EVENTS.map((event, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full p-4 rounded-lg transition-all ${
                    activeIndex === idx
                      ? `bg-gradient-to-r ${event.color} text-white shadow-lg scale-105`
                      : "bg-white text-foreground border-2 border-border hover:border-primary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{event.title}</span>
                    <span className="text-sm">{event.attendees}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev === 0 ? TRENDING_EVENTS.length - 1 : prev - 1
              )
            }
            className="p-3 rounded-full border-2 border-foreground/20 hover:border-primary hover:text-primary transition"
          >
            ← Previous
          </button>
          <button
            onClick={() =>
              setActiveIndex((prev) => (prev + 1) % TRENDING_EVENTS.length)
            }
            className="p-3 rounded-full border-2 border-foreground/20 hover:border-primary hover:text-primary transition"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
