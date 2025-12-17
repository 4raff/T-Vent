"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { statsService } from "@/utils/services/statsService";

export default function HeroUnique({ featuredEvent = null }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalAttendees: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const data = await statsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Keep default values on error
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-b from-background via-background to-white">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{
            background: "linear-gradient(135deg, #6B46C1 0%, #EC4899 100%)",
            animation: "float 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 -left-32 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #FBBF24 100%)",
            animation: "float 20s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{
            background: "linear-gradient(135deg, #84CC16 0%, #EC4899 100%)",
            animation: "float 25s ease-in-out infinite 4s",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary">
                ✨ Event Unggulan
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {featuredEvent ? (
                <span className="text-foreground">{featuredEvent.nama}</span>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Discover
                  </span>
                  <br />
                  <span className="text-foreground">Event Luar Biasa</span>
                </>
              )}
            </h1>

            <p className="text-lg text-foreground/70 leading-relaxed max-w-lg">
              {featuredEvent
                ? featuredEvent.deskripsi
                : "Jelajahi koleksi seni pameran, workshop, dan acara budaya yang hidup. Terhubung dengan pikiran kreatif dan rasakan momen tak terlupakan."}
            </p>

            {featuredEvent && (
              <div className="space-y-3 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/70">Tanggal:</span>
                  <span className="font-semibold text-foreground">{formatDate(featuredEvent.tanggal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/70">Lokasi:</span>
                  <span className="font-semibold text-foreground">{featuredEvent.lokasi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/70">Harga:</span>
                  <span className="font-semibold text-primary">{formatPrice(featuredEvent.harga)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/70">Tiket Tersedia:</span>
                  <span className="font-semibold text-foreground">{featuredEvent.tiket_tersedia}/{featuredEvent.jumlah_tiket}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {featuredEvent ? (
                <>
                  <button
                    onClick={() => router.push(`/events/${featuredEvent.id}`)}
                    className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/40 transition transform hover:scale-105"
                  >
                    Lihat Detail Event
                  </button>
                  <button
                    onClick={() => router.push("/events")}
                    className="px-8 py-3 rounded-lg font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition"
                  >
                    Jelajahi Semua Event
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/events")}
                    className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/40 transition transform hover:scale-105"
                  >
                    Jelajahi Event
                  </button>
                  <button className="px-8 py-3 rounded-lg font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition">
                    Learn More
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalEvents || 0}+
                </p>
                <p className="text-sm text-foreground/60">Event Diselenggarakan</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">
                  {stats.totalUsers > 999
                    ? (stats.totalUsers / 1000).toFixed(1) + "K"
                    : stats.totalUsers}
                  +
                </p>
                <p className="text-sm text-foreground/60">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">
                  {stats.totalAttendees > 999
                    ? (stats.totalAttendees / 1000).toFixed(1) + "K"
                    : stats.totalAttendees}
                  +
                </p>
                <p className="text-sm text-foreground/60">Attendees</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 lg:h-full min-h-96">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              {featuredEvent && featuredEvent.poster ? (
                <Image
                  src={featuredEvent.poster}
                  alt={featuredEvent.nama}
                  className="w-full h-full object-cover"
                  width={600}
                  height={600}
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-foreground/40">No image available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
