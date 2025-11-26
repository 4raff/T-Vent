"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import HeroUnique from "@/components/hero-unique";
import SearchSection from "@/components/search-section";
import EventGrid from "@/components/event-grid";
import CategoriesBar from "../../components/categories-bar";
import Footer from "@/components/footer";
import LoginModal from "@/components/login-modal";
import CreateEventModal from "@/components/create-event-modal";
import { authService } from "@/src/app/services/authService"; // ✅ Import service

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const handleLogin = async (formData) => {
    // Bongkar isi formData agar fleksibel
    const { email, username, phone, number, password } = formData;

    // Handle variasi nama variabel (jika LoginModal mengirim 'number' atau 'phone')
    const phoneNumber = phone || number;

    setLoading(true);

    try {
      let response;

      if (isSignupMode) {
        // ✅ Call Register API
        // Validasi sederhana sebelum kirim
        if (!username || !phoneNumber || !password) {
          throw new Error("Mohon lengkapi semua data registrasi.");
        }

        response = await authService.register({
          email,
          username,
          no_handphone: phoneNumber, // Pastikan key sesuai dengan backend (biasanya 'phone')
          password,
        });

        alert("Account created successfully! Please login.");
        setIsSignupMode(false);
      } else {
        // ✅ Call Login API
        response = await authService.login({
          email,
          password,
        });

        // Set user data logic...
        setUser({
          email: response.user?.email || email,
          name:
            response.user?.username ||
            response.user?.name ||
            email.split("@")[0],
          phone: response.user?.phone,
        });
        setIsLoggedIn(true);
        setShowLogin(false);

        alert("Login successful!");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      // Tampilkan pesan error spesifik dari backend jika ada
      alert(error.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    setIsSignupMode(false);
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setIsSignupMode(true);
    setShowLogin(true);
  };

  const handleLogout = () => {
    authService.logout(); // ✅ Clear token
    setUser(null);
    setIsLoggedIn(false);
    alert("Logged out successfully!");
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
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
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          isSignupMode={isSignupMode}
          loading={loading} // ✅ Pass loading state
        />
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
