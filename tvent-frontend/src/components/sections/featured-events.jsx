"use client";

import { useState } from "react";
import EventCard from "@/components/events/event-card";
import { events } from "@/data/events";

export default function FeaturedEvents() {
  const [filter, setFilter] = useState("All");

  const categories = [
    "All",
    "Workshop",
    "Exhibition",
    "Performance",
    "Seminar",
    "Social",
  ];

  const filteredEvents =
    filter === "All"
      ? events
      : events.filter((event) => event.category === filter);

  return (
    <section
      id="events"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative"
    >
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-accent-2 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-20 w-64 h-64 bg-accent-1 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent-1 bg-clip-text text-transparent mb-4">
            Featured Events
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Discover a curated selection of events celebrating art, culture, and
            creativity
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                filter === cat
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-card text-foreground border-2 border-border hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            // Normalize image path
            let img = event.image || "";
            if (img) {
              if (img.startsWith("/")) {
                if (!img.startsWith("/images/")) img = `/images${img}`;
              } else {
                img = `/images/${img}`;
              }
            } else {
              img = "/images/placeholder.svg";
            }

            return (
              <EventCard key={event.id} event={{ ...event, image: img }} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
