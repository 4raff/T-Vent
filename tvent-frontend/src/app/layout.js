import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "T-Vent | Event Finder",
  description: "Temukan event menarik di sekitar kamu 🎨",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#f2f1ed] text-[#1f1f1f] min-h-screen font-serif bg-[url('/watercolor-bg.png')] bg-cover bg-center">
        <nav className="backdrop-blur-md bg-white/60 shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-2xl font-bold text-[#4a6b6f]">🎟️ T-Vent</h1>
          <ul className="flex gap-10 text-[#4a6b6f]">
            <Link href="/Home">Home</Link>
            <Link href="/events">Events</Link>
            <Link href="/about">About</Link>
          </ul>
        </nav>
        <main className="px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
