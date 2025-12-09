"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { apiClient } from "@/utils/api/client";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { useToast } from "@/components/common/ToastProvider";
import { useCheckout } from "@/contexts/CheckoutContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { formatRupiah } from "@/utils/formatCurrency";

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const { checkoutData } = useCheckout();

  // Get event ID and quantity from context, not URL
  const eventId = checkoutData?.eventId;
  const quantity = checkoutData?.quantity || 1;

  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [ewalletProviders, setEwalletProviders] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [selectedEwalletId, setSelectedEwalletId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Validate checkout data on mount
  useEffect(() => {
    if (!eventId) {
      toast.showError("Data checkout tidak valid. Silakan pilih event terlebih dahulu.");
      router.push("/events");
    }
  }, [eventId, router, toast]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventId) {
          router.push("/events");
          return;
        }

        // Call actual API to get event
        const eventData = await apiClient.get(`/events/${eventId}`);
        const event = eventData.data || eventData;
        
        // 🔒 Validasi: Event harus approved
        if (!event || event.status !== 'approved') {
          const status = event?.status || 'tidak ditemukan';
          toast.showError(`Event tidak dapat di-booking. Status: ${capitalizeFirstLetter(status)}`);
          router.push("/events");
          return;
        }

        setEvent(event);
        
        // Fetch bank accounts and ewallet providers
        const banksResponse = await apiClient.get('/bank-accounts');
        const banks = Array.isArray(banksResponse) ? banksResponse : banksResponse.data || [];
        setBankAccounts(banks);
        if (banks.length > 0) {
          setSelectedBankId(banks[0].id);
        }

        const ewalletsResponse = await apiClient.get('/ewallet-providers');
        const ewallets = Array.isArray(ewalletsResponse) ? ewalletsResponse : ewalletsResponse.data || [];
        setEwalletProviders(ewallets);
        if (ewallets.length > 0) {
          setSelectedEwalletId(ewallets[0].id);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.showError("Gagal memuat event. Coba lagi.");
        router.push("/events");
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.showWarning("Ukuran file terlalu besar. Maksimal 5MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.showWarning("File harus berupa gambar");
        return;
      }

      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if larger than 1000px
          if (width > 1000) {
            height = (height * 1000) / width;
            width = 1000;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Always compress to JPEG for smaller file size and wider compatibility
          // PNG will be converted to JPEG to ensure it's not corrupted
          let quality = 0.85;
          let compressed = canvas.toDataURL('image/jpeg', quality);
          
          // If still too large, reduce quality further - keep under 300KB for database safety
          while (compressed.length > 300 * 1024 && quality > 0.4) { // 300KB max
            quality -= 0.1;
            compressed = canvas.toDataURL('image/jpeg', quality);
          }
          
          setProofPreview(compressed);
        };
        img.onerror = () => {
          toast.showError("Gagal memproses gambar. Coba dengan file lain.");
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!proofFile && paymentMethod !== "card") {
      toast.showWarning("Silakan upload bukti pembayaran");
      return;
    }

    if (!agreedToTerms) {
      toast.showWarning("Anda harus setuju dengan syarat dan ketentuan");
      return;
    }

    setIsProcessing(true);
    let ticketId = null;
    try {
      // Map payment method to backend expected values
      const methodMapping = {
        'transfer': 'bank_transfer',
        'ewallet': 'e-wallet'
      };

      // Step 1: Create payment FIRST (before ticket)
      const paymentData = {
        user_id: parseInt(user.id),
        jumlah: parseFloat(event.harga * quantity),
        metode_pembayaran: methodMapping[paymentMethod] || paymentMethod,
        bukti_pembayaran: proofPreview || null // Include proof image as base64
      };

      const paymentResponse = await apiClient.post("/payments", paymentData);
      const paymentId = paymentResponse.data?.id || paymentResponse.id;

      if (!paymentId) {
        throw new Error("Gagal membuat pembayaran");
      }

      // Step 2: Create ticket AFTER successful payment
      const ticketResponse = await apiClient.post("/tickets", {
        event_id: parseInt(eventId),
        user_id: parseInt(user.id),
        jumlah: parseInt(quantity),
        total_harga: parseFloat(event.harga * quantity)
      });

      ticketId = ticketResponse.data?.id || ticketResponse.id;
      
      if (!ticketId) {
        throw new Error("Gagal membuat tiket");
      }

      // Step 3: Update payment with ticket_id
      await apiClient.put(`/payments/${paymentId}`, {
        ticket_id: parseInt(ticketId)
      });

      toast.showSuccess("Pembayaran berhasil dikirim! Tunggu verifikasi admin.");
      router.push("/my-tickets");
    } catch (error) {
      console.error("Payment error:", error);
      toast.showError(error.data?.message || error.message || "Gagal proses pembayaran. Coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <p className="text-red-600">Event not found</p>
        </div>
      </div>
    );
  }

  const subtotal = event.harga * quantity;
  const taxAmount = Math.round(subtotal * 0.1);
  const total = subtotal + taxAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your ticket purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
              {/* Order Summary */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>{event.nama}</span>
                    <span className="font-semibold">{event.kategori}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{quantity} tickets × {formatRupiah(event.harga)}</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {/* Bank Transfer */}
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-600 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={paymentMethod === "transfer"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Bank Transfer</p>
                      <p className="text-sm text-gray-600">
                        Transfer ke salah satu rekening bank kami
                      </p>
                    </div>
                  </label>

                  {/* E-Wallet */}
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-600 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="ewallet"
                      checked={paymentMethod === "ewallet"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">E-Wallet</p>
                      <p className="text-sm text-gray-600">
                        Transfer via dompet digital
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Proof Upload */}
              {(paymentMethod === "transfer" || paymentMethod === "ewallet") && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Upload Payment Proof
                  </h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="proof-input"
                    />
                    <label
                      htmlFor="proof-input"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      {proofPreview ? (
                        <div className="w-full">
                          <img
                            src={proofPreview}
                            alt="Payment proof"
                            className="max-h-64 mx-auto rounded cursor-pointer hover:opacity-80 transition"
                            onClick={() => setFullscreenImage(proofPreview)}
                          />
                          <p className="text-center text-sm text-gray-600 mt-3">
                            Click to view fullscreen
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg
                            className="w-16 h-16 text-gray-400 mx-auto mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <p className="text-gray-700 font-semibold">
                            Upload payment receipt
                          </p>
                          <p className="text-gray-500 text-sm">
                            PNG, JPG, atau GIF (max 5MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 mt-1 rounded text-purple-600"
                />
                <label htmlFor="terms" className="ml-3 text-gray-700">
                  Saya setuju dengan syarat dan ketentuan serta kebijakan privasi T-Vent
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !agreedToTerms}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Complete Payment"}
              </button>
            </form>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Order Total
              </h3>

              <div className="space-y-3 border-b pb-4 mb-4 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatRupiah(taxAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-purple-600">
                  {formatRupiah(total)}
                </span>
              </div>

              {/* Bank Details */}
              {paymentMethod === "transfer" && bankAccounts.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-3">
                    Bank Account Details
                  </p>
                  <div className="space-y-2 text-sm text-blue-800">
                    {bankAccounts.map((bank) => (
                      <div
                        key={bank.id}
                        className={`p-3 rounded cursor-pointer transition ${
                          selectedBankId === bank.id
                            ? "bg-blue-100 border-2 border-blue-600"
                            : "bg-white border border-blue-300 hover:bg-blue-50"
                        }`}
                        onClick={() => setSelectedBankId(bank.id)}
                      >
                        <p className="font-semibold">{bank.bank_name}</p>
                        <p>{bank.account_number}</p>
                        <p className="text-xs mt-1">a/n {bank.account_holder}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* E-Wallet Instructions */}
              {paymentMethod === "ewallet" && ewalletProviders.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-3">
                    Select E-Wallet Provider
                  </p>
                  <div className="space-y-2 text-sm text-green-800">
                    {ewalletProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className={`p-3 rounded cursor-pointer transition ${
                          selectedEwalletId === provider.id
                            ? "bg-green-100 border-2 border-green-600"
                            : "bg-white border border-green-300 hover:bg-green-50"
                        }`}
                        onClick={() => setSelectedEwalletId(provider.id)}
                      >
                        <p className="font-semibold">{provider.name}</p>
                        {provider.account_number && (
                          <p className="text-xs mt-1 text-gray-600">
                            {provider.account_number}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ticket Details */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">Event Details</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Event</p>
                    <p className="font-semibold text-gray-900">{event.nama}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{event.lokasi}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tickets</p>
                    <p className="font-semibold text-gray-900">{quantity} tickets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
            <img
              src={fullscreenImage}
              alt="Fullscreen preview"
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-6 right-6 bg-white rounded-full p-3 hover:bg-gray-200 transition shadow-lg"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
