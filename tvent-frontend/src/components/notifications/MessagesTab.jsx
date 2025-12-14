"use client";

import ConversationsList from "./ConversationsList";
import ChatInterface from "./ChatInterface";
import StartConversationModal from "./StartConversationModal";

export default function MessagesTab({
  conversations,
  selectedConversation,
  conversationMessages,
  messageInput,
  sendingMessage,
  otherUserInfo,
  user,
  showStartConversation,
  searchQuery,
  searchResults,
  searchingUsers,
  formatTime,
  onSelectConversation,
  onSendMessage,
  onMessageInputChange,
  onCloseChat,
  onNewConversation,
  onSearchChange,
  onStartConversation,
  onCloseModal,
  messagesContainerRef,
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Conversations</h3>
            <button
              onClick={onNewConversation}
              className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition"
            >
              + New
            </button>
          </div>
          <ConversationsList
            conversations={conversations}
            selectedConversation={selectedConversation}
            formatTime={formatTime}
            onSelectConversation={onSelectConversation}
            onNewConversation={onNewConversation}
          />
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <ChatInterface
            selectedConversation={selectedConversation}
            conversationMessages={conversationMessages}
            messageInput={messageInput}
            sendingMessage={sendingMessage}
            otherUserInfo={otherUserInfo}
            user={user}
            formatTime={formatTime}
            onSendMessage={onSendMessage}
            onMessageInputChange={onMessageInputChange}
            onClose={onCloseChat}
            messagesContainerRef={messagesContainerRef}
          />
        </div>
      </div>

      {/* Start Conversation Modal */}
      <StartConversationModal
        isOpen={showStartConversation}
        searchQuery={searchQuery}
        searchResults={searchResults}
        searchingUsers={searchingUsers}
        onSearchChange={onSearchChange}
        onStartConversation={onStartConversation}
        onClose={onCloseModal}
      />
    </>
  );
}
