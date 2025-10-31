"use client";

import { useState, useEffect } from "react";

export default function TrendingSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const trendingEvents = [
    {
      id: 1,
      title: "Watercolor Masterclass",
      trending: true,
      attendees: "2.4K",
      color: "from-primary to-secondary",
    },
    {
      id: 2,
      title: "Digital Art Workshop",
      trending: true,
      attendees: "1.8K",
      color: "from-accent-1 to-accent-2",
    },
    {
      id: 3,
      title: "Cultural Festival 2025",
      trending: true,
      attendees: "5.2K",
      color: "from-accent-2 to-accent-3",
    },
    {
      id: 4,
      title: "Music & Arts Symposium",
      trending: true,
      attendees: "3.1K",
      color: "from-secondary to-accent-1",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % trendingEvents.length);
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
            Hottest Events This Week
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the most popular events gaining attention from the
            community
          </p>
        </div>

        {/* Main carousel display */}
        <div className="relative mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left side - Current event details */}
            <div
              className={`bg-gradient-to-br ${trendingEvents[activeIndex].color} rounded-2xl p-8 text-white slide-in-up`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Trending</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                {trendingEvents[activeIndex].title}
              </h3>
              <p className="text-white/80 mb-6">
                Join thousands of enthusiasts celebrating art and culture
              </p>
              <button className="px-6 py-3 bg-white text-primary font-bold rounded-full hover:shadow-lg transition-all">
                Get Tickets
              </button>
            </div>

            {/* Right side - Other events preview */}
            <div className="space-y-3">
              {trendingEvents.map((event, idx) => (
                <button
                  key={event.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full p-4 rounded-lg transition-all duration-300 text-left ${
                    activeIndex === idx
                      ? `bg-gradient-to-r ${event.color} text-white scale-105`
                      : "bg-white border-2 border-gray-200 hover:border-primary"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4
                        className={`font-bold ${
                          activeIndex === idx ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {event.title}
                      </h4>
                      <p
                        className={`text-sm ${
                          activeIndex === idx
                            ? "text-white/80"
                            : "text-gray-600"
                        }`}
                      >
                        {event.attendees} attending
                      </p>
                    </div>
                    {activeIndex === idx && (
                      <div className="animate-pulse">
                        <FireIcon />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() =>
                setActiveIndex(
                  (prev) =>
                    (prev - 1 + trendingEvents.length) % trendingEvents.length
                )
              }
              className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev + 1) % trendingEvents.length)
              }
              className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2">
          {trendingEvents.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === idx ? "w-8 bg-primary" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
