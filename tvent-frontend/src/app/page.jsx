"use client";

import { useState, useEffect } from "react"; 
import { authService } from "@/utils/services/authService"; 
import { eventService } from "@/utils/services/eventService";
import { useToast } from "@/components/common/ToastProvider";
import { INFO_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";

import Navbar from "@/components/layout/navbar";
import HeroUnique from "@/components/sections/hero-unique";
import SearchSection from "@/components/sections/search-section";
import EventGrid from "@/components/events/event-grid";
import CategoriesBar from "@/components/sections/categories-bar";
import Footer from "@/components/layout/footer";
import LoginModal from "@/components/modals/login-modal";
import CreateEventModal from "@/components/modals/create-event-modal";

export default function Home() {
    const toast = useToast();
    const [showLogin, setShowLogin] = useState(false);
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getEvents(); 
            // Response bisa dalam format { data: [...] } atau langsung [...]
            const dataArray = response.data || response;
            setEvents(Array.isArray(dataArray) ? dataArray : []); 
            setError(null);
        } catch (err) {
            console.error("Failed to fetch events:", err);
            console.error("Error details:", err.message, err.data);
            setError(err.data?.message || ERROR_MESSAGES.FETCH_EVENTS_FAILED);
            toast.showError(err.data?.message || "Gagal memuat events. Cek connection mu.");
        } finally {
            setLoading(false);
        }
    };

    const handleAuthSuccess = (token, userData) => {
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        setIsLoggedIn(true);
        setShowLogin(false);
        toast.showSuccess(`Selamat datang, ${userData.username}!`);
        
        // Re-fetch events setelah login (now dengan bearer token)
        setTimeout(() => {
            fetchEvents();
        }, 500);
    };

    const handleLogout = () => {
        authService.logout(); 
        setUser(null);
        setIsLoggedIn(false);
        toast.showSuccess("Berhasil logout!");
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser && storedUser !== 'null' && storedUser !== 'undefined') {
            try {
                setIsLoggedIn(true);
                setUser(JSON.parse(storedUser));
            } catch (e) {
                // Clear storage if data is corrupted
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('user');
            }
        }
        
        fetchEvents();

        // Listen untuk user profile updates dari profile page
        const handleProfileUpdate = (event) => {
            const updatedUser = event.detail;
            setUser(updatedUser);
        };

        window.addEventListener('userProfileUpdated', handleProfileUpdate);

        return () => {
            window.removeEventListener('userProfileUpdated', handleProfileUpdate);
        };
    }, []); 

    const handleLoginClick = () => {
        setIsSignupMode(false);
        setShowLogin(true);
    };

    const handleSignupClick = () => {
        setIsSignupMode(true);
        setShowLogin(true);
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
            <HeroUnique featuredEvent={events.length > 0 ? events[0] : null} />
            <SearchSection />
            <CategoriesBar events={events} />
            
            {loading && <p className="text-center text-xl p-8">{INFO_MESSAGES.LOADING_EVENTS}</p>}
            {error && <p className="text-center text-red-500 text-xl p-8">Error: {error}</p>}
            
            {!loading && !error && events && events.length > 0 && <EventGrid events={events} />}
            {!loading && !error && events && events.length === 0 && <p className="text-center text-xl p-8">{INFO_MESSAGES.NO_EVENTS}</p>}
            
            <Footer />

            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onLogin={handleAuthSuccess} 
                    isSignupMode={isSignupMode}
                />
            )}

            {showCreateEvent && (
                <CreateEventModal
                    onClose={() => setShowCreateEvent(false)}
                    isLoggedIn={isLoggedIn}
                    user={user}
                />
            )}
        </main>
    );
}