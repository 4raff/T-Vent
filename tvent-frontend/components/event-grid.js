"use client";

import EventCard from "./event-card";
import { useState } from "react";

export default function EventGrid() {
  const [events] = useState([
    {
      id: 1,
      title: "Watercolor Art Exhibition",
      category: "Visual Arts",
      date: "Nov 15, 2025",
      time: "10:00 AM",
      location: "Telkom University Gallery",
      image: "/watercolor-art-exhibition.jpg",
      attendees: 342,
      color: "from-primary via-secondary to-accent",
    },
    {
      id: 2,
      title: "Digital Design Workshop",
      category: "Workshop",
      date: "Nov 18, 2025",
      time: "2:00 PM",
      location: "Tech Hub",
      image: "/digital-design-workshop.jpg",
      attendees: 156,
      color: "from-secondary to-accent-2",
    },
    {
      id: 3,
      title: "Live Music Performance",
      category: "Music",
      date: "Nov 20, 2025",
      time: "7:00 PM",
      location: "Main Auditorium",
      image: "/live-music-performance.jpg",
      attendees: 512,
      color: "from-accent to-accent-3",
    },
    {
      id: 4,
      title: "Photography Masterclass",
      category: "Workshop",
      date: "Nov 22, 2025",
      time: "3:30 PM",
      location: "Studio A",
      image: "/photography-masterclass.jpg",
      attendees: 89,
      color: "from-accent-2 to-accent-4",
    },
    {
      id: 5,
      title: "Contemporary Art Fair",
      category: "Visual Arts",
      date: "Nov 25, 2025",
      time: "11:00 AM",
      location: "Convention Center",
      image: "/contemporary-art-fair.jpg",
      attendees: 678,
      color: "from-primary to-accent",
    },
    {
      id: 6,
      title: "Tech Innovation Summit",
      category: "Technology",
      date: "Nov 28, 2025",
      time: "9:00 AM",
      location: "Innovation Hub",
      image: "/tech-innovation-summit.jpg",
      attendees: 423,
      color: "from-secondary via-accent-2 to-primary",
    },
  ]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground">
              Featured Events
            </h2>
            <p className="text-foreground/60 mt-2">
              Discover amazing events happening around campus
            </p>
          </div>
          <button className="px-6 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
