"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[600px] overflow-hidden">
      {/* Watercolor background */}
      <div className="absolute inset-0 watercolor-gradient opacity-80"></div>

      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-accent-2 rounded-full mix-blend-multiply filter blur-3xl opacity-30 floating"></div>
      <div
        className="absolute top-40 right-20 w-40 h-40 bg-accent-1 rounded-full mix-blend-multiply filter blur-3xl opacity-30 floating"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-0 left-1/3 w-40 h-40 bg-accent-3 rounded-full mix-blend-multiply filter blur-3xl opacity-20 floating"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Content */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center min-h-[600px] ${
          isLoaded ? "slide-in-up" : "opacity-0"
        }`}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          Telkom <span className="text-accent-2">Watercolor</span> Festival
        </h1>

        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 drop-shadow-md leading-relaxed">
          Celebrate art, culture, and creativity in a vibrant gathering of
          artists, performers, and enthusiasts
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button className="px-8 py-4 bg-white text-primary font-bold rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105">
            Explore Events
          </button>
          <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full border-2 border-white hover:bg-white/30 transition-all duration-300">
            Learn More
          </button>
        </div>

        {/* Event info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {[
            { icon: "🎨", title: "Workshops", desc: "Learn from experts" },
            { icon: "🎭", title: "Performances", desc: "Live entertainment" },
            { icon: "🎪", title: "Exhibitions", desc: "Art showcases" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition-all duration-300 border border-white/20"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="text-white font-semibold mb-1">{item.title}</h3>
              <p className="text-white/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
