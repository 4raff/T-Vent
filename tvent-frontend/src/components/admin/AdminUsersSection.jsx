"use client";

import { useState } from "react";
import SearchFilter from "@/components/admin/SearchFilter";

const itemsPerPage = 10;

export default function AdminUsersSection({ users }) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
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
        const sortedUsers = [...filteredUsers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

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
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === 1
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
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        currentPage === page
                          ? "bg-purple-600 text-white shadow-lg scale-110"
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600 hover:text-purple-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === totalPages
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
  );
}
