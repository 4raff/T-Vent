"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { apiClient } from "@/utils/api/client";
import { messageService } from "@/utils/services/messageService";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotificationsTab from "@/components/notifications/NotificationsTab";
import MessagesTab from "@/components/notifications/MessagesTab";

export default function NotificationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("notifications");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [otherUserInfo, setOtherUserInfo] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showStartConversation, setShowStartConversation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const conversationLoadedRef = useRef(false);
  const contactInitializedRef = useRef(false);

  // Auto-scroll messages to bottom (only within container)
  const scrollToBottom = () => {
    if (conversationLoadedRef.current && messagesContainerRef.current) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  useEffect(() => {
    if (conversationMessages.length > 0) {
      conversationLoadedRef.current = true;
      scrollToBottom();
    }
  }, [conversationMessages]);

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
        if (!user) return;

        // Fetch notifications from API
        const notificationsResponse = await apiClient.get(`/notifications/user/${user.id}`);
        const notificationsData = Array.isArray(notificationsResponse)
          ? notificationsResponse
          : notificationsResponse.data || [];

        // Format notifications with icons
        const formattedNotifications = notificationsData.map((notif) => ({
          ...notif,
          icon: getIconForType(notif.type),
          timestamp: new Date(notif.created_at),
          read: notif.is_read,
        }));

        setNotifications(formattedNotifications);

        // Fetch conversations
        const convsResponse = await messageService.getConversations(user.id);
        setConversations(Array.isArray(convsResponse) ? convsResponse : []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotifications([]);
        setConversations([]);
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Handle query parameters for deep linking (contact creator feature)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const contactUserIdParam = searchParams.get("contact");

    // Only handle once per session (avoid re-triggering)
    if (!contactInitializedRef.current && tabParam === "messages" && contactUserIdParam && user) {
      contactInitializedRef.current = true;
      setActiveTab("messages");

      const contactUserId = parseInt(contactUserIdParam, 10);
      
      // Jika conversations sudah di-load, cari conversation yang sesuai
      if (conversations.length > 0) {
        const targetConversation = conversations.find(
          (conv) => parseInt(conv.other_user_id, 10) === contactUserId
        );

        if (targetConversation) {
          console.log("Found existing conversation, opening...");
          handleSelectConversation(targetConversation);
        } else {
          // Jika user tidak ditemukan di list conversations, buat baru
          console.log("Conversation not found, creating new...");
          const newConversation = {
            other_user_id: contactUserId,
            last_message: "Start a new conversation",
            unread_count: 0
          };
          handleSelectConversation(newConversation);
        }
      } else {
        // Jika belum ada conversations, buat object conversation baru dengan creator
        console.log("No conversations loaded yet, creating new conversation...");
        const newConversation = {
          other_user_id: contactUserId,
          last_message: "Start a new conversation",
          unread_count: 0
        };
        handleSelectConversation(newConversation);
      }
      
      // Hapus query parameter dari URL untuk cleaner appearance
      window.history.replaceState({}, "", "/notifications");
    }
  }, [searchParams, conversations, user]);

  const getIconForType = (type) => {
    const icons = {
      event_approved: "✅",
      ticket_purchased: "🎫",
      payment_submitted: "💳",
      payment_confirmed: "✔️",
      event_reminder: "⏰",
      review_request: "⭐",
      message: "💬",
    };
    return icons[type] || "📬";
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      window.dispatchEvent(new Event("notificationUpdated"));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
      window.dispatchEvent(new Event("notificationUpdated"));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleSelectConversation = async (conversation) => {
    try {
      conversationLoadedRef.current = false;
      
      // Fetch other user info terlebih dahulu untuk mendapatkan username lengkap
      let otherUserData = null;
      try {
        const userResponse = await apiClient.get(
          `/users/${conversation.other_user_id}`
        );
        otherUserData = userResponse.data?.data || userResponse.data || userResponse;
        setOtherUserInfo(otherUserData);
      } catch (error) {
        console.error("Error fetching user info:", error);
        otherUserData = {
          id: conversation.other_user_id,
          username: `User #${conversation.other_user_id}`,
        };
        setOtherUserInfo(otherUserData);
      }

      // Buat conversation object yang lengkap dengan other_username dan last_message_at
      const completeConversation = {
        ...conversation,
        other_username: otherUserData?.username || conversation.other_username,
        last_message_at: conversation.last_message_at || new Date().toISOString(),
        unread_count: 0, // Set unread_count to 0 saat membuka
      };

      // Set conversation terlebih dahulu agar chat interface langsung terbuka
      setSelectedConversation(completeConversation);
      setMessageInput("");

      // Tambahkan conversation ke list jika belum ada (untuk contact creator feature)
      // Gunakan functional update untuk ensure data consistency
      setConversations((prev) => {
        const existingIndex = prev.findIndex(
          (conv) => parseInt(conv.other_user_id, 10) === parseInt(completeConversation.other_user_id, 10)
        );
        
        if (existingIndex === -1) {
          // Conversation belum ada, tambahkan ke awal list
          return [completeConversation, ...prev];
        } else {
          // Conversation sudah ada, update dengan data lengkap dan unread_count = 0
          const updated = [...prev];
          updated[existingIndex] = completeConversation;
          return updated;
        }
      });

      // Fetch existing messages (bisa kosong jika conversation baru)
      try {
        const messages = await messageService.getConversation(
          user.id,
          conversation.other_user_id
        );
        setConversationMessages(Array.isArray(messages) ? messages : []);
      } catch (error) {
        // Jika conversation belum ada di backend, set messages kosong (conversation baru)
        console.error("No conversation history found, starting new conversation:", error);
        setConversationMessages([]);
      }

      // Mark messages as read di backend
      try {
        await messageService.markAsRead(user.id, conversation.other_user_id);
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    } catch (error) {
      console.error("Error selecting conversation:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    setSendingMessage(true);
    const messageContent = messageInput;

    try {
      const newMessage = await messageService.sendMessage(
        user.id,
        selectedConversation.other_user_id,
        messageContent
      );

      setConversationMessages([...conversationMessages, newMessage]);
      setMessageInput("");

      // Update conversations list - tambahkan jika belum ada, atau update jika sudah ada
      setConversations((prev) => {
        const existingIndex = prev.findIndex(
          (conv) => parseInt(conv.other_user_id, 10) === parseInt(selectedConversation.other_user_id, 10)
        );

        const updatedConversation = {
          ...selectedConversation,
          last_message: newMessage.content,
          last_message_at: newMessage.created_at,
          last_sender_id: newMessage.sender_id,
        };

        if (existingIndex === -1) {
          // Conversation belum ada di list, tambahkan ke awal
          return [updatedConversation, ...prev];
        } else {
          // Conversation sudah ada, update di posisinya
          const updated = [...prev];
          updated[existingIndex] = updatedConversation;
          return updated;
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSearchUsers = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchingUsers(true);
    try {
      const response = await apiClient.get(`/users`);
      const allUsers = Array.isArray(response) ? response : response.data || [];

      const filtered = allUsers
        .filter(
          (u) =>
            u.id !== user.id &&
            (u.username?.toLowerCase().includes(query.toLowerCase()) ||
              u.email?.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 10);

      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setSearchingUsers(false);
    }
  };

  const handleStartConversation = async (targetUser) => {
    try {
      const firstMessage = await messageService.sendMessage(
        user.id,
        targetUser.id,
        "Hello!"
      );

      const convsResponse = await messageService.getConversations(user.id);
      const updatedConversations = Array.isArray(convsResponse) ? convsResponse : [];
      setConversations(updatedConversations);

      const newConv = updatedConversations.find(
        (conv) => conv.other_user_id === targetUser.id
      );

      if (newConv) {
        handleSelectConversation(newConv);
      } else {
        handleSelectConversation({
          other_user_id: targetUser.id,
          last_message: "Hello!",
          last_message_at: new Date(),
          other_username: targetUser.username,
        });
      }

      setShowStartConversation(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error starting conversation:", error);
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
          <NotificationsTab
            notifications={notifications}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            formatTime={formatTime}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <MessagesTab
            conversations={conversations}
            selectedConversation={selectedConversation}
            conversationMessages={conversationMessages}
            messageInput={messageInput}
            sendingMessage={sendingMessage}
            otherUserInfo={otherUserInfo}
            user={user}
            showStartConversation={showStartConversation}
            searchQuery={searchQuery}
            searchResults={searchResults}
            searchingUsers={searchingUsers}
            formatTime={formatTime}
            onSelectConversation={handleSelectConversation}
            onSendMessage={handleSendMessage}
            onMessageInputChange={setMessageInput}
            onCloseChat={() => {
              setSelectedConversation(null);
              setConversationMessages([]);
            }}
            onNewConversation={() => {
              setShowStartConversation(true);
              setSearchQuery("");
              setSearchResults([]);
            }}
            onSearchChange={handleSearchUsers}
            onStartConversation={handleStartConversation}
            onCloseModal={() => {
              setShowStartConversation(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
            messagesContainerRef={messagesContainerRef}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
