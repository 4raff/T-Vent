"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");
  const [pendingEvents, setPendingEvents] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        if (userData?.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        setUser(userData);
        
        // TODO: Fetch pending events and payments
        setPendingEvents([]);
        setPayments([]);
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
              {[...Array(6)].map((_, i) => (
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage events, payments, and users</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Pending Events</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {pendingEvents.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {payments.filter((p) => p.status === "pending").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">Rp0</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === "events"
                ? "text-purple-600 border-purple-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Event Approvals
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === "payments"
                ? "text-purple-600 border-purple-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Payments
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="bg-white rounded-lg shadow p-6">
            {pendingEvents.length > 0 ? (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {event.nama}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {event.deskripsi}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Creator: {event.creator_name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm">
                          Approve
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No pending events
              </p>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-lg shadow p-6">
            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Payment ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#{payment.id}</td>
                        <td className="py-3 px-4">{payment.user_name}</td>
                        <td className="py-3 px-4 font-semibold">
                          Rp{payment.jumlah?.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : payment.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {payment.status === "pending" && (
                            <button className="text-blue-600 hover:underline text-sm font-semibold">
                              Review
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No payments to review
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
