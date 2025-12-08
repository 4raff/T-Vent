"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categoriesService } from "@/utils/services/categoriesService";

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await categoriesService.getCategories();
        // data is an array of strings like ["Technology", "Music", "Workshop"]
        const categoryArray = Array.isArray(data) ? data : [];
        setCategories(categoryArray);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }
    if (selectedCategory !== "all") {
      params.append("category", selectedCategory);
    }
    router.push(`/events?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const categoryList = [
    { id: "all", name: "Semua Event", emoji: "◆" },
    ...categories.map((cat) => ({
      id: cat,
      name: cat,
      emoji: "📍", // default emoji, can be customized per category
    })),
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-background/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Search Bar */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg sm:rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
            <div className="relative bg-white rounded-lg sm:rounded-2xl shadow-lg">
              <div className="flex flex-col sm:flex-row items-center px-4 sm:px-6 py-3 sm:py-4 gap-3 sm:gap-4">
                <span className="hidden sm:inline text-xl opacity-40">🔍</span>
                <input
                  type="text"
                  placeholder="Cari event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full sm:flex-1 bg-transparent outline-none text-sm sm:text-lg text-foreground placeholder-foreground/50"
                />
                <button
                  onClick={handleSearch}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-sm sm:text-base hover:shadow-lg hover:shadow-primary/30 transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          <p className="text-xs sm:text-sm font-medium text-foreground/60 uppercase tracking-wide">
            Filter berdasarkan kategori
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {loadingCategories ? (
              <p className="text-foreground/50 text-sm">Loading categories...</p>
            ) : (
              categoryList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    // Navigate immediately on category select
                    const params = new URLSearchParams();
                    if (searchQuery.trim()) {
                      params.append("search", searchQuery.trim());
                    }
                    if (cat.id !== "all") {
                      params.append("category", cat.id);
                    }
                    router.push(`/events?${params.toString()}`);
                  }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-base font-medium transition ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30"
                      : "bg-white border-2 border-foreground/10 text-foreground hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
