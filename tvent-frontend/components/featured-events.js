"use client";

import { useState } from "react";
import EventCard from "./event-card";

const events = [
  {
    id: 1,
    title: "Watercolor Painting Masterclass",
    category: "Workshop",
    date: "December 15, 2024",
    time: "10:00 AM - 2:00 PM",
    location: "Main Hall",
    image: "/watercolor-painting-workshop-art.jpg",
    color: "from-accent-1 to-accent-2",
    attendees: 350,
  },
  {
    id: 2,
    title: "Contemporary Art Exhibition",
    category: "Exhibition",
    date: "December 15-20, 2024",
    time: "All Day",
    location: "Gallery Space",
    image: "/modern-contemporary-art-gallery-colorful.jpg",
    color: "from-primary to-secondary",
    attendees: 1200,
  },
  {
    id: 3,
    title: "Live Musical Performance",
    category: "Performance",
    date: "December 16, 2024",
    time: "7:00 PM - 9:00 PM",
    location: "Auditorium",
    image: "/live-music-concert-performance-stage-lights.jpg",
    color: "from-accent-3 to-accent-4",
    attendees: 800,
  },
  {
    id: 4,
    title: "Digital Art & Animation",
    category: "Workshop",
    date: "December 17, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Studio Lab",
    image: "/digital-art-animation-colorful-vibrant.jpg",
    color: "from-secondary to-accent-1",
    attendees: 280,
  },
  {
    id: 5,
    title: "Photography Symposium",
    category: "Seminar",
    date: "December 18, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "Conference Hall",
    image: "/photography-exhibition-colorful-subjects-artistic.jpg",
    color: "from-accent-2 to-accent-3",
    attendees: 450,
  },
  {
    id: 6,
    title: "Creative Networking Dinner",
    category: "Social",
    date: "December 19, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Grand Ballroom",
    image: "/dinner-event-gathering-colorful-decoration-ambianc.jpg",
    color: "from-accent-4 to-primary",
    attendees: 200,
  },
];

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
        <div className="text-center mb-16 slide-in-up">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent-1 bg-clip-text text-transparent mb-4">
            Featured Events
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Discover a curated selection of events celebrating art, culture, and
            creativity
          </p>
        </div>

        {/* Filter buttons */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-12 slide-in-up"
          style={{ animationDelay: "0.2s" }}
        >
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
          {filteredEvents.map((event, idx) => (
            <EventCard key={event.id} event={event} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
