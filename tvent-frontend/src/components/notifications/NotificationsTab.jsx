"use client";

export default function NotificationsTab({
  notifications,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  formatTime,
  markAsRead,
  deleteNotification,
}) {
  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-5xl mb-4">📬</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Notifications
        </h3>
        <p className="text-gray-600">
          You're all caught up! Check back later for updates.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <div className="space-y-3">
      <div className="mb-4 text-sm text-gray-600">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, notifications.length)} to{" "}
        {Math.min(currentPage * itemsPerPage, notifications.length)} of{" "}
        {notifications.length} notifications
      </div>

      {notifications
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((notif) => (
          <div
            key={notif.id}
            className={`bg-white rounded-lg shadow p-4 transition cursor-pointer hover:shadow-md ${
              !notif.read ? "border-l-4 border-purple-600" : ""
            }`}
            onClick={() => markAsRead(notif.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <div className="text-2xl mr-4">{notif.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-1">{notif.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatTime(notif.timestamp)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notif.id);
                }}
                className="text-gray-400 hover:text-red-600 transition ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

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
    </div>
  );
}
