"use client";

import { useState } from "react";

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Events", icon: "◆" },
    { id: "art", name: "Art", icon: "🎨" },
    { id: "music", name: "Music", icon: "♪" },
    { id: "tech", name: "Technology", icon: "⚡" },
    { id: "workshop", name: "Workshop", icon: "⚒" },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-background/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Search Bar */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
            <div className="relative bg-white rounded-2xl shadow-lg">
              <div className="flex items-center px-6 py-4 gap-4">
                <span className="text-xl opacity-40">🔍</span>
                <input
                  type="text"
                  placeholder="Search events, artists, workshops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-lg text-foreground placeholder-foreground/50"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          <p className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
            Filter by category
          </p>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30"
                    : "bg-white border-2 border-foreground/10 text-foreground hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
