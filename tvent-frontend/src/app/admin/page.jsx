"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { apiClient } from "@/utils/api/client";
import { useToast } from "@/components/common/ToastProvider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AdminStats from "@/components/admin/AdminStats";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminEventsSection from "@/components/admin/AdminEventsSection";
import AdminPaymentsSection from "@/components/admin/AdminPaymentsSection";
import AdminUsersSection from "@/components/admin/AdminUsersSection";
import AdminPaymentMethodsSection from "@/components/admin/AdminPaymentMethodsSection";
import AdminReportsSection from "@/components/admin/AdminReportsSection";

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
          apiClient.get(`/events/admin/all`),
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
  };

  // Handle payment rejection in modal
  const handlePaymentRejected = (paymentId, updatedPayment) => {
    const status = updatedPayment?.status || 'rejected';
    setPayments(payments.map(p => 
      p.id === paymentId ? { ...p, status } : p
    ));
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
        <AdminStats 
          stats={stats} 
          pendingEventsCount={pendingEvents.length}
          paymentsCounts={payments.length}
        />

        {/* Tabs */}
        <AdminTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          counts={{
            events: allEvents.length,
            payments: payments.length,
            users: users.length
          }}
        />

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <AdminDashboard 
            pendingEvents={pendingEvents}
            payments={payments}
            capitalizeStatus={capitalizeStatus}
          />
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <AdminEventsSection 
            allEvents={allEvents}
            onApproveEvent={handleApproveEvent}
            onRejectEvent={handleRejectEvent}
            capitalizeStatus={capitalizeStatus}
          />
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <AdminPaymentsSection 
            payments={payments}
            onPaymentApproved={handlePaymentApproved}
            onPaymentRejected={handlePaymentRejected}
            capitalizeStatus={capitalizeStatus}
          />
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <AdminUsersSection 
            users={users}
          />
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payment-methods" && (
          <AdminPaymentMethodsSection 
            bankAccounts={bankAccounts}
            ewalletProviders={ewalletProviders}
            onToggleBankStatus={handleToggleBankStatus}
            onToggleEwalletStatus={handleToggleEwalletStatus}
            onAddBankAccount={handleAddBankAccount}
            onAddEwalletProvider={handleAddEwalletProvider}
          />
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <AdminReportsSection 
            stats={stats}
            allEvents={allEvents}
            payments={payments}
            users={users}
            bankAccounts={bankAccounts}
            ewalletProviders={ewalletProviders}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

