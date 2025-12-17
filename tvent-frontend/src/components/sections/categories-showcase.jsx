"use client";

export default function CategoriesShowcase() {
  const categories = [
    {
      name: "Workshops",
      count: "24 events",
      emoji: "🎨",
      color: "from-primary/20 to-secondary/20",
      borderColor: "border-primary/30",
    },
    {
      name: "Concerts",
      count: "18 events",
      emoji: "🎵",
      color: "from-accent-1/20 to-accent-2/20",
      borderColor: "border-accent-1/30",
    },
    {
      name: "Exhibitions",
      count: "32 events",
      emoji: "🖼️",
      color: "from-accent-2/20 to-accent-3/20",
      borderColor: "border-accent-2/30",
    },
    {
      name: "Festivals",
      count: "12 events",
      emoji: "🎭",
      color: "from-secondary/20 to-primary/20",
      borderColor: "border-secondary/30",
    },
    {
      name: "Seminars",
      count: "15 events",
      emoji: "📚",
      color: "from-accent-3/20 to-accent-1/20",
      borderColor: "border-accent-3/30",
    },
    {
      name: "Markets",
      count: "20 events",
      emoji: "🛍️",
      color: "from-primary/20 to-accent-1/20",
      borderColor: "border-primary/30",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find events that match your interests and passions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`group p-8 rounded-2xl border-2 ${cat.borderColor} bg-gradient-to-br ${cat.color} hover:scale-105 hover:shadow-xl transition-all duration-300 overflow-hidden relative`}
            >
              {/* Animated background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse" />
              </div>

              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {cat.emoji}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {cat.name}
                </h3>
                <p className="text-gray-600 font-semibold text-sm">
                  {cat.count}
                </p>
                <div className="mt-4 pt-4 border-t-2 border-gray-200/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-bold text-primary">
                    Browse →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
