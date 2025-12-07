"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { apiClient } from "@/utils/api/client";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("notifications");
  const [loading, setLoading] = useState(true);

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
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API calls
        const mockNotifications = [
          {
            id: 1,
            type: "event_approved",
            title: "Event Approved",
            message: "Your event 'Tech Conference 2025' has been approved and is now live!",
            timestamp: new Date(Date.now() - 3600000),
            read: false,
            icon: "✅",
          },
          {
            id: 2,
            type: "ticket_purchased",
            title: "Ticket Purchased",
            message: "Your ticket for 'Annual Music Fest' has been confirmed.",
            timestamp: new Date(Date.now() - 7200000),
            read: false,
            icon: "🎫",
          },
          {
            id: 3,
            type: "payment_confirmed",
            title: "Payment Confirmed",
            message: "Your payment of Rp150,000 for 'Tech Conference 2025' has been verified.",
            timestamp: new Date(Date.now() - 86400000),
            read: true,
            icon: "💳",
          },
          {
            id: 4,
            type: "event_reminder",
            title: "Event Starting Soon",
            message: "Your event 'Web Development Workshop' starts in 2 days!",
            timestamp: new Date(Date.now() - 172800000),
            read: true,
            icon: "⏰",
          },
          {
            id: 5,
            type: "review_request",
            title: "Leave a Review",
            message: "How was your experience at 'Digital Marketing Conference'? Leave a review now!",
            timestamp: new Date(Date.now() - 259200000),
            read: true,
            icon: "⭐",
          },
        ];

        const mockMessages = [
          {
            id: 1,
            from: "Tech Conference 2025",
            fromId: "event_1",
            type: "event",
            lastMessage: "Thank you for registering! We're excited to see you there.",
            timestamp: new Date(Date.now() - 3600000),
            unread: 0,
            avatar: "https://ui-avatars.com/api/?name=Tech+Conference",
          },
          {
            id: 2,
            from: "Admin Support",
            fromId: "admin",
            type: "admin",
            lastMessage: "Your event is pending approval. Please check your email for details.",
            timestamp: new Date(Date.now() - 7200000),
            unread: 1,
            avatar: "https://ui-avatars.com/api/?name=Admin+Support",
          },
          {
            id: 3,
            from: "Annual Music Fest",
            fromId: "event_2",
            type: "event",
            lastMessage: "Don't miss the opening performance tomorrow at 8 PM!",
            timestamp: new Date(Date.now() - 86400000),
            unread: 0,
            avatar: "https://ui-avatars.com/api/?name=Music+Fest",
          },
        ];

        setNotifications(mockNotifications);
        setMessages(mockMessages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      // TODO: API call to mark notification as read
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // TODO: API call to delete notification
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadMessages = messages.filter((m) => m.unread > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Notifications & Messages
          </h1>
          <p className="text-gray-600">Stay updated with your activities</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === "notifications"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === "messages"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Messages
            {unreadMessages > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadMessages}
              </span>
            )}
          </button>
        </div>

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-5xl mb-4">📬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Notifications
                </h3>
                <p className="text-gray-600">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
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
              ))
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Messages
                </h3>
                <p className="text-gray-600">
                  Start a conversation by booking or creating an event!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`bg-white rounded-lg shadow p-4 transition cursor-pointer hover:shadow-md flex items-center justify-between ${
                    message.unread > 0 ? "border-l-4 border-purple-600" : ""
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <img
                      src={message.avatar}
                      alt={message.from}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {message.from}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {message.type === "event" ? "🎫 Event" : "👤 Admin"}
                        </span>
                        {message.unread > 0 && (
                          <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                        {message.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition font-semibold">
                    Reply
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
