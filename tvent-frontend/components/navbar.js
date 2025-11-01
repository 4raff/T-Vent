"use client";

import { useState } from "react";

export default function Navbar({
  onLoginClick,
  onCreateEventClick,
  isLoggedIn,
  user,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-accent/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              T-Event
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-foreground/70 hover:text-foreground transition font-medium"
            >
              Explore
            </a>
            <a
              href="#"
              className="text-foreground/70 hover:text-foreground transition font-medium"
            >
              Browse Events
            </a>
            <a
              href="#"
              className="text-foreground/70 hover:text-foreground transition font-medium"
            >
              Categories
            </a>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-foreground/60 text-xs">{user.email}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition"
              >
                Login
              </button>
            )}
            <button
              onClick={onCreateEventClick}
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition"
            >
              + Create Event
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-accent/20 py-4 space-y-3">
            <a
              href="#"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              Explore
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              Browse Events
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              Categories
            </a>
            <button
              onClick={onLoginClick}
              className="w-full px-4 py-2 text-left text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              Login
            </button>
            <button
              onClick={onCreateEventClick}
              className="w-full px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium"
            >
              + Create Event
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
