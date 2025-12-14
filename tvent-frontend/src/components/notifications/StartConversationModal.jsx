"use client";

export default function StartConversationModal({
  isOpen,
  searchQuery,
  searchResults,
  searchingUsers,
  onSearchChange,
  onStartConversation,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Start Conversation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users by username or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            autoFocus
          />
        </div>

        {searchingUsers && (
          <div className="text-center text-gray-500 py-4">
            <p>Searching...</p>
          </div>
        )}

        {!searchingUsers && searchQuery && searchResults.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <p>No users found</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((targetUser) => (
              <button
                key={targetUser.id}
                onClick={() => onStartConversation(targetUser)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-200"
              >
                <p className="font-semibold text-gray-900">{targetUser.username}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
