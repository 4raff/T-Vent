"use client";

import { CATEGORIES } from "@/constants/categories";

export default function CategoriesBar() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer h-32 bg-gradient-to-br ${cat.color} p-6 shadow-lg hover:shadow-2xl transition transform hover:scale-105`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                <p className="text-white/80 text-sm font-medium">
                  {cat.count} events
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
