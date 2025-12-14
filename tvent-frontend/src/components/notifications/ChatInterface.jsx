"use client";

import { useRef, useEffect } from "react";

export default function ChatInterface({
  selectedConversation,
  conversationMessages,
  messageInput,
  sendingMessage,
  otherUserInfo,
  user,
  formatTime,
  onSendMessage,
  onMessageInputChange,
  onClose,
  messagesContainerRef,
}) {
  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-5xl mb-4">💬</div>
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {otherUserInfo?.username || `User #${selectedConversation.other_user_id}`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        ref={messagesContainerRef}
      >
        {conversationMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {[...conversationMessages]
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender_id === user.id
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender_id === user.id
                          ? "text-purple-100"
                          : "text-gray-600"
                      }`}
                    >
                      {formatTime(new Date(msg.created_at))}
                    </p>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={onSendMessage} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => onMessageInputChange(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            disabled={sendingMessage}
          />
          <button
            type="submit"
            disabled={sendingMessage || !messageInput.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition font-semibold"
          >
            {sendingMessage ? "..." : "Send"}
          </button>
        </div>
      </form>
    </>
  );
}
