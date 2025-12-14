"use client";

export default function ConversationsList({
  conversations,
  selectedConversation,
  formatTime,
  onSelectConversation,
  onNewConversation,
}) {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No conversations yet</p>
        <button
          onClick={onNewConversation}
          className="mt-4 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition"
        >
          Start One
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <button
          key={conv.other_user_id}
          onClick={() => onSelectConversation(conv)}
          className={`w-full text-left p-4 border-b hover:bg-gray-50 transition ${
            selectedConversation?.other_user_id === conv.other_user_id
              ? "bg-purple-50 border-l-4 border-l-purple-600"
              : ""
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">
                {conv.other_username || `User #${conv.other_user_id}`}
              </p>
              <p className="text-gray-600 text-xs mt-1 truncate">
                {conv.last_message}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {formatTime(new Date(conv.last_message_at))}
              </p>
            </div>
            {conv.unread_count > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                {conv.unread_count}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
