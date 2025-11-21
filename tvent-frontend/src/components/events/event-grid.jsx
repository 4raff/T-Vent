"use client";

import EventCard from "./event-card";
import { events } from "@/data/events";

export default function EventGrid({ events: passedEvents }) {
  const displayEvents = passedEvents || events;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground">Featured Events</h2>
            <p className="text-foreground/60 mt-2">Discover amazing events happening around campus</p>
          </div>
          <button className="px-6 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
