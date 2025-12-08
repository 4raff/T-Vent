"use client";

import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-purple-600 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md">
            Oops! The page you're looking for doesn't exist. It might have been
            deleted or moved.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Go Home
            </Link>
            <Link
              href="/events"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Browse Events
            </Link>
          </div>
        </div>

        {/* Decorative Icons */}
        <div className="mt-20 grid grid-cols-3 gap-8 text-center text-gray-300 opacity-50">
          <div className="text-6xl">🎪</div>
          <div className="text-6xl">🎭</div>
          <div className="text-6xl">🎨</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
