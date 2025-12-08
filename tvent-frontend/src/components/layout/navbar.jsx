"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { apiClient } from "@/utils/api/client";

export default function Navbar({
  onLoginClick,
  onSignupClick,
  onCreateEventClick,
  isLoggedIn: propsIsLoggedIn,
  user: propsUser,
  onLogout: propsOnLogout,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Update state whenever props change (from parent Home page)
  useEffect(() => {
    if (propsIsLoggedIn && propsUser) {
      setIsLoggedIn(true);
      setUser(propsUser);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [propsIsLoggedIn, propsUser]);

  // Also check auth from localStorage/authService on mount and route change
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const userData = authService.getUser();
        setIsLoggedIn(true);
        setUser(userData);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();

    // Listen untuk user profile updates
    const handleProfileUpdate = (event) => {
      const updatedUser = event.detail;
      setUser(updatedUser);
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, [pathname]);

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isLoggedIn && user?.id) {
        try {
          const response = await apiClient.get(`/notifications/user/${user.id}`);
          const notifications = Array.isArray(response) ? response : response.data || [];
          const unreadNotifications = notifications.filter(n => !n.is_read);
          setUnreadCount(unreadNotifications.length);
        } catch (error) {
          console.error("Error fetching notifications:", error);
          setUnreadCount(0);
        }
      }
    };

    // Fetch immediately
    fetchUnreadCount();

    // Set up interval to check every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    // Listen for notification updates from other pages
    const handleNotificationUpdate = () => {
      fetchUnreadCount();
    };
    window.addEventListener('notificationUpdated', handleNotificationUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
    };
  }, [isLoggedIn, user?.id]);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    if (propsOnLogout) {
      propsOnLogout();
    }
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Events", href: "/events" },
    { name: "Dashboard", href: "/dashboard", requiresAuth: true },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold">✦</span>
            </div>
            <span className="text-gray-900">T-Vent</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(
              (link) =>
                (!link.requiresAuth || isLoggedIn) && (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition font-medium ${
                      pathname === link.href
                        ? "text-purple-600"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell with Badge */}
                <Link
                  href="/notifications"
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition"
                  title="Notifications"
                >
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {/* Badge */}
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.username || "User"
                      )}&background=6366f1&color=fff`}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-900 font-medium">
                      {user.username || "User"}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-600 transition ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-semibold text-gray-900">
                          {user.username}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.role === "admin" && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                        >
                          👤 Profile
                        </Link>
                        <Link
                          href="/my-tickets"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                        >
                          🎫 My Tickets
                        </Link>
                        <Link
                          href="/my-events"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                        >
                          📅 My Events
                        </Link>
                        <Link
                          href="/bookmarks"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                        >
                          ❤️ Bookmarks
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition font-semibold text-red-600"
                          >
                            ⚙️ Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-semibold"
                          >
                            🚪 Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Create Event Button */}
                <Link
                  href="/create-event"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  + Create Event
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
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
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {navLinks.map(
              (link) =>
                (!link.requiresAuth || isLoggedIn) && (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    {link.name}
                  </Link>
                )
            )}
            {isLoggedIn && user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  👤 Profile
                </Link>
                <Link
                  href="/my-tickets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  🎫 My Tickets
                </Link>
                <Link
                  href="/my-events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  📅 My Events
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  ❤️ Bookmarks
                </Link>
                <Link
                  href="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  🔔 Notifications
                  {unreadCount > 0 && (
                    <span className="inline-block ml-2 px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/create-event"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold"
                >
                  + Create Event
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onSignupClick();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
