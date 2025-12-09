"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { apiClient } from "@/utils/api/client";
import { useToast } from "@/components/common/ToastProvider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PaymentDetailModal from "@/components/modals/payment-detail-modal";
import EventDetailModal from "@/components/modals/event-detail-modal";
import BankAccountModal from "@/components/modals/bank-account-modal";
import EwalletProviderModal from "@/components/modals/ewallet-provider-modal";
import { formatRupiah, formatNumber } from "@/utils/formatCurrency";
import SearchFilter from "@/components/admin/SearchFilter";

export default function AdminPanel() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingEvents, setPendingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [ewalletProviders, setEwalletProviders] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedEwallet, setSelectedEwallet] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showEwalletModal, setShowEwalletModal] = useState(false);
  // Pagination states
  const [currentPageEvents, setCurrentPageEvents] = useState(1);
  const [currentPagePayments, setCurrentPagePayments] = useState(1);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageBanks, setCurrentPageBanks] = useState(1);
  const [currentPageEwallets, setCurrentPageEwallets] = useState(1);
  const itemsPerPage = 10;
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingPayments: 0
  });

  const capitalizeStatus = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
        
        // Fetch all required data
        const [statsRes, eventsRes, paymentsRes, usersRes, banksRes, ewalletsRes] = await Promise.all([
          apiClient.get(`/admin/stats`),
          apiClient.get(`/events`),
          apiClient.get(`/payments`),
          apiClient.get(`/users`),
          apiClient.get(`/bank-accounts?includeInactive=true`),
          apiClient.get(`/ewallet-providers?includeInactive=true`)
        ]);

        // Handle stats response - response is wrapped with { message: '...', data: stats }
        const statsData = statsRes.data?.data || statsRes.data || statsRes;
        const allEventsData = Array.isArray(eventsRes) ? eventsRes : eventsRes.data || [];
        const allPaymentsData = Array.isArray(paymentsRes) ? paymentsRes : paymentsRes.data || [];
        const allUsersData = Array.isArray(usersRes) ? usersRes : usersRes.data || [];
        const banksData = Array.isArray(banksRes) ? banksRes : banksRes.data || [];
        const ewalletsData = Array.isArray(ewalletsRes) ? ewalletsRes : ewalletsRes.data || [];

        setAllEvents(allEventsData);
        setPendingEvents(allEventsData.filter(e => e.status === 'pending'));
        setPayments(allPaymentsData);
        setUsers(allUsersData);
        setBankAccounts(banksData);
        setEwalletProviders(ewalletsData);

        // Set stats from backend
        setStats({
          totalEvents: statsData.totalEvents || 0,
          totalUsers: statsData.totalUsers || 0,
          totalRevenue: statsData.totalRevenue || 0,
          pendingPayments: statsData.pendingPayments || 0
        });

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        toast.showError("Gagal memuat data admin");
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, toast]);

  const handleApproveEvent = async (eventId) => {
    try {
      const response = await apiClient.put(`/admin/approve-event/${eventId}`);
      const updatedEvent = response.data || response;
      setAllEvents(allEvents.map(e => e.id === eventId ? updatedEvent : e));
      setPendingEvents(pendingEvents.filter(e => e.id !== eventId));
      toast.showSuccess("Event berhasil di-approve");
    } catch (error) {
      toast.showError(error.data?.message || "Gagal approve event");
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      const response = await apiClient.put(`/admin/reject-event/${eventId}`);
      const updatedEvent = response.data || response;
      setAllEvents(allEvents.map(e => e.id === eventId ? updatedEvent : e));
      setPendingEvents(pendingEvents.filter(e => e.id !== eventId));
      toast.showSuccess("Event berhasil di-reject");
    } catch (error) {
      toast.showError(error.data?.message || "Gagal reject event");
    }
  };

  const handleToggleBankStatus = async (bankId, isActive) => {
    try {
      const endpoint = isActive ? `/bank-accounts/${bankId}/deactivate` : `/bank-accounts/${bankId}/activate`;
      const response = await apiClient.post(endpoint);
      const updatedBank = response.data || response;
      setBankAccounts(bankAccounts.map(b => b.id === bankId ? updatedBank : b));
      // Update selectedBank jika ada
      if (selectedBank && selectedBank.id === bankId) {
        setSelectedBank(updatedBank);
      }
      toast.showSuccess(`Bank ${isActive ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      toast.showError(error.data?.message || "Gagal update bank");
    }
  };

  const handleToggleEwalletStatus = async (ewalletId, isActive) => {
    try {
      const endpoint = isActive ? `/ewallet-providers/${ewalletId}/deactivate` : `/ewallet-providers/${ewalletId}/activate`;
      const response = await apiClient.post(endpoint);
      const updatedEwallet = response.data || response;
      setEwalletProviders(ewalletProviders.map(e => e.id === ewalletId ? updatedEwallet : e));
      // Update selectedEwallet jika ada
      if (selectedEwallet && selectedEwallet.id === ewalletId) {
        setSelectedEwallet(updatedEwallet);
      }
      toast.showSuccess(`E-wallet ${isActive ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      toast.showError(error.data?.message || "Gagal update e-wallet");
    }
  };

  const handleAddBankAccount = async (bankData) => {
    try {
      const response = await apiClient.post('/bank-accounts', {
        ...bankData,
        is_active: true
      });
      const newBank = response.data || response;
      setBankAccounts([...bankAccounts, newBank]);
      setShowBankModal(false);
      toast.showSuccess("Bank account added successfully");
    } catch (error) {
      toast.showError(error.data?.message || "Gagal tambah bank account");
    }
  };

  const handleAddEwalletProvider = async (providerData) => {
    try {
      const response = await apiClient.post('/ewallet-providers', {
        ...providerData,
        is_active: true
      });
      const newProvider = response.data || response;
      setEwalletProviders([...ewalletProviders, newProvider]);
      setShowEwalletModal(false);
      toast.showSuccess("E-wallet provider added successfully");
    } catch (error) {
      toast.showError(error.data?.message || "Gagal tambah e-wallet provider");
    }
  };

  // Handle payment approval in modal
  const handlePaymentApproved = (paymentId, updatedPayment) => {
    const status = updatedPayment?.status || 'success';
    setPayments(payments.map(p => 
      p.id === paymentId ? { ...p, status } : p
    ));
    setSelectedPayment(null);
  };

  // Handle payment rejection in modal
  const handlePaymentRejected = (paymentId, updatedPayment) => {
    const status = updatedPayment?.status || 'rejected';
    setPayments(payments.map(p => 
      p.id === paymentId ? { ...p, status } : p
    ));
    setSelectedPayment(null);
  };

  // Handle payment disable/inactivate
  const handleDisablePayment = async (paymentId) => {
    try {
      const response = await apiClient.put(`/payments/${paymentId}/disable`);
      const updatedPayment = response.data || response;
      setPayments(payments.map(p => 
        p.id === paymentId ? updatedPayment : p
      ));
      toast.showSuccess("Payment disabled successfully");
    } catch (error) {
      toast.showError(error.data?.message || "Gagal disable payment");
    }
  };

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
          <p className="text-gray-600">Manage events, payments, users, and payment methods</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="bg-white rounded-lg shadow p-3 sm:p-6 h-full flex flex-col">
            <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Total Events</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2 break-words">
              {stats.totalEvents}
            </p>
            <p className="text-gray-600 text-xs mt-2">Pending: {pendingEvents.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-6 h-full flex flex-col">
            <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Total Users</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
              {stats.totalUsers}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-6 h-full flex flex-col">
            <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Total Revenue</p>
            <p className="text-lg sm:text-2xl font-bold text-green-600 mt-2 break-words line-clamp-2 overflow-hidden">
              {formatRupiah(stats.totalRevenue)}
            </p>
            <p className="text-gray-600 text-xs mt-1">From completed payments</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-6 h-full flex flex-col">
            <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Pending Payments</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-2">
              {stats.pendingPayments}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === "dashboard"
                ? "text-purple-600 border-purple-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === "events"
                ? "text-purple-600 border-purple-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Events ({allEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === "payments"
                ? "text-purple-600 border-purple-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Payments ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === "users"
                ? "text-purple-600 border-purple-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("payment-methods")}
            className={`px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === "payment-methods"
                ? "text-purple-600 border-purple-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Payment Methods
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === "reports"
                ? "text-purple-600 border-purple-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Reports
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Events */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Pending Events</h2>
              {pendingEvents.length > 0 ? (
                <div className="space-y-3">
                  {pendingEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="border rounded p-3 hover:bg-gray-50 text-sm sm:text-base">
                      <p className="font-semibold text-gray-900 truncate">{event.nama}</p>
                      <p className="text-sm text-gray-600 truncate">by {event.creator_name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No pending events</p>
              )}
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recent Payments</h2>
              {payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="border rounded p-3 hover:bg-gray-50 text-sm sm:text-base">
                      <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-gray-900">{formatRupiah(payment.jumlah)}</p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          payment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          payment.status === "success" ? "bg-green-100 text-green-800" :
                          payment.status === "rejected" || payment.status === "cancelled" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {capitalizeStatus(payment.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{payment.user_name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No payments</p>
              )}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <SearchFilter
            items={allEvents}
            searchFields={["nama", "deskripsi", "lokasi", "creator_name"]}
            filterOptions={{
              status: [
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" }
              ]
            }}
            title="Events"
            emptyMessage="No events found"
            renderItem={(filteredEvents) => {
              const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
              const startIndex = (currentPageEvents - 1) * itemsPerPage;
              const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

              return (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {Math.min(startIndex + 1, filteredEvents.length)} to {Math.min(startIndex + itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {paginatedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">
                                {event.nama}
                              </h3>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                event.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                event.status === "approved" ? "bg-green-100 text-green-800" :
                                event.status === "rejected" ? "bg-red-100 text-red-800" :
                                "bg-blue-100 text-blue-800"
                              }`}>
                                {capitalizeStatus(event.status)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {event.deskripsi}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                              <div>Creator: {event.creator_name}</div>
                              <div>Tanggal: {event.tanggal}</div>
                              <div>Lokasi: {event.lokasi}</div>
                              <div>Harga: {formatRupiah(event.harga)}</div>
                            </div>
                          </div>
                          {event.status === "pending" && (
                            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 sm:flex-shrink-0">
                              <button 
                                onClick={() => setSelectedEvent(event)}
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
                              >
                                View Detail
                              </button>
                              <button 
                                onClick={() => handleApproveEvent(event.id)}
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleRejectEvent(event.id)}
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {event.status !== "pending" && (
                            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 sm:flex-shrink-0">
                              <button 
                                onClick={() => setSelectedEvent(event)}
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
                              >
                                View Detail
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        onClick={() => setCurrentPageEvents(Math.max(1, currentPageEvents - 1))}
                        disabled={currentPageEvents === 1}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPageEvents === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                        }`}
                      >
                        ← Previous
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPageEvents(page)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                              currentPageEvents === page
                                ? "bg-purple-600 text-white shadow-lg scale-110"
                                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600 hover:text-purple-600"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPageEvents(Math.min(totalPages, currentPageEvents + 1))}
                        disabled={currentPageEvents === totalPages}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPageEvents === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                        }`}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              );
            }}
          />
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <SearchFilter
            items={payments}
            searchFields={["user_name", "user_email", "metode_pembayaran"]}
            filterOptions={{
              status: [
                { value: "pending", label: "Pending" },
                { value: "success", label: "Success" },
                { value: "rejected", label: "Rejected" },
                { value: "cancelled", label: "Cancelled" }
              ]
            }}
            title="Payments"
            emptyMessage="No payments found"
            renderItem={(filteredPayments) => {
              const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
              const startIndex = (currentPagePayments - 1) * itemsPerPage;
              const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

              return (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {Math.min(startIndex + 1, filteredPayments.length)} to {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
                  </div>

                  <div className="overflow-x-auto mb-6">
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
                        {paginatedPayments.map((payment) => (
                          <tr key={payment.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">#{payment.id}</td>
                            <td className="py-3 px-4">{payment.user_name}</td>
                            <td className="py-3 px-4 font-semibold">
                              {formatRupiah(payment.jumlah)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : payment.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "rejected" || payment.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {capitalizeStatus(payment.status)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                {(payment.status === "pending" || payment.status === "success" || payment.status === "rejected" || payment.status === "cancelled") && (
                                  <>
                                    <button 
                                      onClick={() => setSelectedPayment(payment)}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                                    >
                                      View Details
                                    </button>
                                    <button 
                                      onClick={() => handleDisablePayment(payment.id)}
                                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                                    >
                                      Disable
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        onClick={() => setCurrentPagePayments(Math.max(1, currentPagePayments - 1))}
                        disabled={currentPagePayments === 1}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPagePayments === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                        }`}
                      >
                        ← Previous
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPagePayments(page)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                              currentPagePayments === page
                                ? "bg-purple-600 text-white shadow-lg scale-110"
                                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600 hover:text-purple-600"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPagePayments(Math.min(totalPages, currentPagePayments + 1))}
                        disabled={currentPagePayments === totalPages}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPagePayments === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                        }`}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              );
            }}
          />
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <SearchFilter
            items={users}
            searchFields={["username", "email", "no_handphone"]}
            filterOptions={{
              role: [
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" }
              ]
            }}
            title="Users"
            emptyMessage="No users found"
            renderItem={(filteredUsers) => {
              const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
              const startIndex = (currentPageUsers - 1) * itemsPerPage;
              const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

              return (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {Math.min(startIndex + 1, filteredUsers.length)} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </div>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Username</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Phone</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.map((u) => (
                          <tr key={u.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">#{u.id}</td>
                            <td className="py-3 px-4 font-semibold">{u.username}</td>
                            <td className="py-3 px-4">{u.email}</td>
                            <td className="py-3 px-4">{u.no_handphone || "-"}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                u.role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                              }`}>
                                {u.role?.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        onClick={() => setCurrentPageUsers(Math.max(1, currentPageUsers - 1))}
                        disabled={currentPageUsers === 1}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPageUsers === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                        }`}
                      >
                        ← Previous
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPageUsers(page)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                              currentPageUsers === page
                                ? "bg-purple-600 text-white shadow-lg scale-110"
                                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600 hover:text-purple-600"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPageUsers(Math.min(totalPages, currentPageUsers + 1))}
                        disabled={currentPageUsers === totalPages}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPageUsers === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                        }`}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              );
            }}
          />
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payment-methods" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Bank Accounts */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Bank Accounts</h2>
                <button
                  onClick={() => setShowBankModal(true)}
                  className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm whitespace-nowrap"
                >
                  + Add Bank
                </button>
              </div>
              
              {bankAccounts.length > 0 ? (
                <>
                  <div className="mb-3 text-xs text-gray-600">
                    Showing {Math.min((currentPageBanks - 1) * itemsPerPage + 1, bankAccounts.length)} to {Math.min(currentPageBanks * itemsPerPage, bankAccounts.length)} of {bankAccounts.length} banks
                  </div>

                  <div className="space-y-3 mb-4">
                    {bankAccounts
                      .slice((currentPageBanks - 1) * itemsPerPage, currentPageBanks * itemsPerPage)
                      .map((bank) => (
                      <div key={bank.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 text-sm sm:text-base">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{bank.bank_name}</p>
                            <p className="text-sm text-gray-600 truncate">{bank.account_number}</p>
                            <p className="text-sm text-gray-600 truncate">a/n {bank.account_holder}</p>
                          </div>
                          <div className="flex gap-2 flex-wrap justify-end">
                            <button
                              onClick={() => handleToggleBankStatus(bank.id, bank.is_active)}
                              className={`px-2 sm:px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                bank.is_active
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              {bank.is_active ? "Active" : "Inactive"}
                            </button>
                            <button
                              onClick={() => setSelectedBank(bank)}
                              className="px-2 sm:px-3 py-1 rounded text-xs font-semibold whitespace-nowrap bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bank Pagination */}
                  {Math.ceil(bankAccounts.length / itemsPerPage) > 1 && (
                    <div className="flex flex-wrap justify-center gap-1 mt-4">
                      <button
                        onClick={() => setCurrentPageBanks(Math.max(1, currentPageBanks - 1))}
                        disabled={currentPageBanks === 1}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          currentPageBanks === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        Prev
                      </button>
                      {Array.from({ length: Math.ceil(bankAccounts.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPageBanks(page)}
                          className={`w-7 h-7 rounded text-xs font-semibold ${
                            currentPageBanks === page
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPageBanks(Math.min(Math.ceil(bankAccounts.length / itemsPerPage), currentPageBanks + 1))}
                        disabled={currentPageBanks === Math.ceil(bankAccounts.length / itemsPerPage)}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          currentPageBanks === Math.ceil(bankAccounts.length / itemsPerPage)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No bank accounts</p>
              )}
            </div>

            {/* E-Wallet Providers */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">E-Wallet Providers</h2>
                <button
                  onClick={() => setShowEwalletModal(true)}
                  className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm whitespace-nowrap"
                >
                  + Add Provider
                </button>
              </div>
              
              {ewalletProviders.length > 0 ? (
                <>
                  <div className="mb-3 text-xs text-gray-600">
                    Showing {Math.min((currentPageEwallets - 1) * itemsPerPage + 1, ewalletProviders.length)} to {Math.min(currentPageEwallets * itemsPerPage, ewalletProviders.length)} of {ewalletProviders.length} providers
                  </div>

                  <div className="space-y-3 mb-4">
                    {ewalletProviders
                      .slice((currentPageEwallets - 1) * itemsPerPage, currentPageEwallets * itemsPerPage)
                      .map((provider) => (
                      <div key={provider.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 text-sm sm:text-base">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{provider.name}</p>
                            <p className="text-sm text-gray-600 truncate">Code: {provider.code}</p>
                            {provider.account_number && (
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{provider.account_number}</p>
                            )}
                          </div>
                          <div className="flex gap-2 flex-wrap justify-end">
                            <button
                              onClick={() => handleToggleEwalletStatus(provider.id, provider.is_active)}
                              className={`px-2 sm:px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                provider.is_active
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              {provider.is_active ? "Active" : "Inactive"}
                            </button>
                            <button
                              onClick={() => setSelectedEwallet(provider)}
                              className="px-2 sm:px-3 py-1 rounded text-xs font-semibold whitespace-nowrap bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* E-Wallet Pagination */}
                  {Math.ceil(ewalletProviders.length / itemsPerPage) > 1 && (
                    <div className="flex flex-wrap justify-center gap-1 mt-4">
                      <button
                        onClick={() => setCurrentPageEwallets(Math.max(1, currentPageEwallets - 1))}
                        disabled={currentPageEwallets === 1}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          currentPageEwallets === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        Prev
                      </button>
                      {Array.from({ length: Math.ceil(ewalletProviders.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPageEwallets(page)}
                          className={`w-7 h-7 rounded text-xs font-semibold ${
                            currentPageEwallets === page
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPageEwallets(Math.min(Math.ceil(ewalletProviders.length / itemsPerPage), currentPageEwallets + 1))}
                        disabled={currentPageEwallets === Math.ceil(ewalletProviders.length / itemsPerPage)}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          currentPageEwallets === Math.ceil(ewalletProviders.length / itemsPerPage)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No e-wallet providers</p>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Revenue Report */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Revenue Report</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 break-words">{formatRupiah(stats.totalRevenue)}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-3">Payment Status Breakdown</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Completed Payments</span>
                      <span className="font-semibold text-green-600">
                        {payments.filter(p => p.status === 'success').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Payments</span>
                      <span className="font-semibold text-yellow-600">
                        {payments.filter(p => p.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rejected Payments</span>
                      <span className="font-semibold text-red-600">
                        {payments.filter(p => p.status === 'rejected').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancelled Payments</span>
                      <span className="font-semibold text-red-600">
                        {payments.filter(p => p.status === 'cancelled').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Statistics */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Event Statistics</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Total Events</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.totalEvents}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-3">Event Status Breakdown</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Approved Events</span>
                      <span className="font-semibold text-green-600">
                        {allEvents.filter(e => e.status === 'approved').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Events</span>
                      <span className="font-semibold text-yellow-600">
                        {allEvents.filter(e => e.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rejected Events</span>
                      <span className="font-semibold text-red-600">
                        {allEvents.filter(e => e.status === 'rejected').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Statistics */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">User Statistics</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-3">User Types</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Regular Users</span>
                      <span className="font-semibold">
                        {users.filter(u => u.role === 'user').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Admin Users</span>
                      <span className="font-semibold">
                        {users.filter(u => u.role === 'admin').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Statistics */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-3">Available Methods</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Bank Accounts</span>
                      <span className="font-semibold text-blue-600">
                        {bankAccounts.filter(b => b.is_active).length} active
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>E-Wallet Providers</span>
                      <span className="font-semibold text-green-600">
                        {ewalletProviders.filter(e => e.is_active).length} active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal 
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onApprove={handlePaymentApproved}
          onReject={handlePaymentRejected}
        />
      )}

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Bank Account Modal */}
      <BankAccountModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onAdd={handleAddBankAccount}
      />

      {/* E-Wallet Provider Modal */}
      <EwalletProviderModal
        isOpen={showEwalletModal}
        onClose={() => setShowEwalletModal(false)}
        onAdd={handleAddEwalletProvider}
      />

      {/* Bank Details Modal */}
      {selectedBank && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Bank Details</h2>
              <button
                onClick={() => setSelectedBank(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <p className="text-gray-900 font-semibold">{selectedBank.bank_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <p className="text-gray-900">{selectedBank.account_number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
                <p className="text-gray-900">{selectedBank.account_holder}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                  selectedBank.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {selectedBank.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => handleToggleBankStatus(selectedBank.id, selectedBank.is_active)}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  selectedBank.is_active
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {selectedBank.is_active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => setSelectedBank(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-Wallet Details Modal */}
      {selectedEwallet && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">E-Wallet Details</h2>
              <button
                onClick={() => setSelectedEwallet(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
                <p className="text-gray-900 font-semibold">{selectedEwallet.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Code</label>
                <p className="text-gray-900">{selectedEwallet.code}</p>
              </div>
              {selectedEwallet.account_number && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <p className="text-gray-900">{selectedEwallet.account_number}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                  selectedEwallet.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {selectedEwallet.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => handleToggleEwalletStatus(selectedEwallet.id, selectedEwallet.is_active)}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  selectedEwallet.is_active
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {selectedEwallet.is_active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => setSelectedEwallet(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

