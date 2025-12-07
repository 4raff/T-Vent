"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { apiClient } from "@/utils/api/client";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const quantity = parseInt(searchParams.get("quantity")) || 1;

  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

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

        // TODO: Replace with actual API call
        const mockEvent = {
          id: eventId,
          nama: "Tech Conference 2025",
          harga: 150000,
          kategori: "Technology",
          lokasi: "Jakarta Convention Center",
        };

        setEvent(mockEvent);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
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
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!proofFile && paymentMethod !== "card") {
      alert("Please upload payment proof");
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement actual payment processing
      // For now, create a mock payment record
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("jumlah_tiket", quantity);
      formData.append("harga_total", subtotal);
      formData.append("status", "pending");
      formData.append("metode_pembayaran", paymentMethod);

      if (proofFile) {
        formData.append("bukti_pembayaran", proofFile);
      }

      // Mock successful payment
      alert("Payment submitted successfully! Waiting for admin verification.");
      router.push("/my-tickets");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment. Please try again.");
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
                    <span>{quantity} tickets × Rp{event.harga.toLocaleString("id-ID")}</span>
                    <span>Rp{subtotal.toLocaleString("id-ID")}</span>
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
                        Transfer ke rekening T-Vent untuk konfirmasi pembayaran
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
                        GCash, PayMaya, atau dompet digital lainnya
                      </p>
                    </div>
                  </label>

                  {/* Credit Card */}
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-600 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Credit Card</p>
                      <p className="text-sm text-gray-600">
                        Visa, Mastercard, atau American Express
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Proof Upload */}
              {paymentMethod !== "card" && (
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
                            className="max-h-64 mx-auto rounded"
                          />
                          <p className="text-center text-sm text-gray-600 mt-3">
                            Click to change
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
                  className="w-5 h-5 mt-1 rounded text-purple-600"
                  defaultChecked
                />
                <label htmlFor="terms" className="ml-3 text-gray-700">
                  Saya setuju dengan syarat dan ketentuan serta kebijakan privasi T-Vent
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-gray-400"
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
                  <span>Rp{subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-purple-600">
                  Rp{total.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Bank Details */}
              {paymentMethod === "transfer" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-3">
                    Bank Account Details
                  </p>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div>
                      <p className="font-semibold">Bank Mandiri</p>
                      <p>1230456789</p>
                      <p>a/n PT T-Vent Indonesia</p>
                    </div>
                    <hr className="border-blue-200 my-2" />
                    <p className="text-xs">
                      Gunakan format referensi: ORDER-{Date.now()}
                    </p>
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

      <Footer />
    </div>
  );
}
