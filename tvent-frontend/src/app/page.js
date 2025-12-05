"use client";

import Navbar from "@/components/navbar";
import HeroUnique from "@/components/hero-unique";
import SearchSection from "@/components/search-section";
import EventGrid from "@/components/event-grid";
import CategoriesBar from "../../components/categories-bar";
import Footer from "@/components/footer";
import LoginModal from "@/components/login-modal";
import CreateEventModal from "@/components/create-event-modal";
import { useState } from "react";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (payload) => {
    // payload can be email (string) or a user object from signup
    if (typeof payload === "string") {
      setUser({ email: payload, name: payload.split("@")[0] });
    } else if (payload && typeof payload === "object") {
      setUser({ email: payload.email, name: payload.username || payload.email.split("@")[0], phone: payload.phone });
    }
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onCreateEventClick={() => setShowCreateEvent(true)}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />
      <HeroUnique />
      <SearchSection />
      <CategoriesBar />
      <EventGrid />
      <Footer />

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}

      {showCreateEvent && (
        <CreateEventModal
          onClose={() => setShowCreateEvent(false)}
          isLoggedIn={isLoggedIn}
        />
      )}
    </main>
  );
}
