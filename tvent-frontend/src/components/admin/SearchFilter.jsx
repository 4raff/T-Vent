"use client";

import { useState, useMemo } from "react";

export default function SearchFilter({ 
  items = [], 
  searchFields = [],
  filterOptions = {},
  renderItem,
  emptyMessage = "No items found",
  title = "Items"
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});

  // Filter items based on search term and selected filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      if (searchTerm.trim()) {
        const matchesSearch = searchFields.some(field => {
          const value = item[field];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
        if (!matchesSearch) return false;
      }

      // Category filters
      for (const [filterKey, filterValue] of Object.entries(selectedFilters)) {
        if (filterValue && filterValue !== "all") {
          if (item[filterKey] !== filterValue) return false;
        }
      }

      return true;
    });
  }, [items, searchTerm, selectedFilters, searchFields]);

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedFilters({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
          />
          {(searchTerm || Object.values(selectedFilters).some(v => v && v !== "all")) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold text-sm whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter Options */}
      {Object.keys(filterOptions).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {Object.entries(filterOptions).map(([filterKey, options]) => (
            <div key={filterKey} className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {filterKey.replace(/_/g, ' ')}:
              </label>
              <select
                value={selectedFilters[filterKey] || "all"}
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
              >
                <option value="all">All</option>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredItems.length} of {items.length} {title.toLowerCase()}
      </div>

      {/* Items Display */}
      {filteredItems.length > 0 ? (
        renderItem(filteredItems)
      ) : (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
