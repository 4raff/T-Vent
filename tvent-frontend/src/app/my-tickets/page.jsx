"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function MyTickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        setUser(userData);
        
        // TODO: Fetch user's tickets from API
        setTickets([]);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-300 rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">View and manage your event tickets</p>
        </div>

        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Ticket #{ticket.nomor_tiket}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Event ID: {ticket.event_id}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Purchased: {new Date(ticket.tanggal_pembelian).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-2 rounded-full font-semibold ${
                      ticket.status === "active"
                        ? "bg-green-100 text-green-800"
                        : ticket.status === "used"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition">
                    View Details
                  </button>
                  {ticket.status === "active" && (
                    <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition">
                      Cancel Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You haven't purchased any tickets yet
            </p>
            <button
              onClick={() => router.push("/events")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Browse Events
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
