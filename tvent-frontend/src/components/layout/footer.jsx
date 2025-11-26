"use client";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-2 to-accent-3 flex items-center justify-center">
                <span className="text-foreground font-bold text-lg">✦</span>
              </div>
              <span className="font-bold text-lg text-background">
                TelkomEvent
              </span>
            </div>
            <p className="text-background/70 text-sm">
              Discover and create amazing events at Telkom University. Connect
              with your community and celebrate creativity together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-background mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="#" className="hover:text-background transition">
                  Browse Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition">
                  Create Event
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition">
                  My Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition">
                  Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-background mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="#" className="hover:text-background transition">
                  Visual Arts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition">
                  Music
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition">
                  Technology
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition">
                  Workshops
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-background mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Email: info@telkomevent.id</li>
              <li>Phone: +62 821-1234-5678</li>
              <li>Location: Telkom University</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-background/70">
            © 2025 TelkomEvent. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition"
            >
              f
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition"
            >
              𝕏
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition"
            >
              in
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition"
            >
              ◉
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
