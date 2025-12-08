"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_EMOJI = {
  Technology: "⚡",
  Music: "♪",
  Workshop: "⚒",
  Art: "🎨",
  Sport: "⚽",
  Education: "📚",
  Business: "💼",
  Health: "🏥",
};

const CATEGORY_COLOR = {
  Technology: "from-blue-500 to-blue-600",
  Music: "from-pink-500 to-rose-600",
  Workshop: "from-orange-500 to-red-600",
  Art: "from-purple-500 to-indigo-600",
  Sport: "from-green-500 to-emerald-600",
  Education: "from-yellow-500 to-amber-600",
  Business: "from-gray-500 to-slate-600",
  Health: "from-red-500 to-pink-600",
};

export default function CategoriesBar({ events = [] }) {
  const router = useRouter();

  // Calculate event counts per category dynamically
  const categoryCounts = useMemo(() => {
    const counts = {};
    
    // Count events per category
    events.forEach(event => {
      if (event.kategori) {
        counts[event.kategori] = (counts[event.kategori] || 0) + 1;
      }
    });
    
    return counts;
  }, [events]);

  // Get categories from events
  const categories = useMemo(() => {
    return Object.entries(categoryCounts)
      .map(([key, count]) => ({
        id: key.toLowerCase(),
        name: key,
        color: CATEGORY_COLOR[key] || "from-slate-500 to-slate-600",
        emoji: CATEGORY_EMOJI[key] || "📍",
        count: count,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [categoryCounts]);

  if (categories.length === 0) {
    return null; // Don't show section if no categories
  }

  const handleCategoryClick = (categoryName) => {
    router.push(`/events?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer h-32 bg-gradient-to-br ${cat.color} p-6 shadow-lg hover:shadow-2xl transition transform hover:scale-105`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="text-3xl">{cat.emoji}</div>
                <div>
                  <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                  <p className="text-white/80 text-sm font-medium">
                    {cat.count} {cat.count === 1 ? "event" : "events"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
