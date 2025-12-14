const knex = require('../config/database');

class MessageRepository {
  async findById(id) {
    return knex('messages').where({ id }).first();
  }

  async create(message) {
    const [id] = await knex('messages').insert(message);
    return this.findById(id);
  }

  async listByUser(user_id) {
    return knex('messages')
      .where({ receiver_id: user_id })
      .orWhere({ sender_id: user_id })
      .select('*');
  }

  // Get conversations for a user (unique participants)
  async getConversations(user_id) {
    // Convert user_id to number for comparison
    user_id = parseInt(user_id, 10);
    
    const conversations = await knex('messages')
      .where((builder) => {
        builder.where({ sender_id: user_id }).orWhere({ receiver_id: user_id });
      })
      .select('messages.*')
      .orderBy('messages.created_at', 'desc');

    // Group by conversation (other_user_id) and get the other user's info
    const conversationMap = new Map();

    for (const msg of conversations) {
      const otherId = msg.sender_id === user_id ? msg.receiver_id : msg.sender_id;
      
      if (!conversationMap.has(otherId)) {
        // Fetch the other user's info
        const otherUser = await knex('users').where({ id: otherId }).first();
        
        conversationMap.set(otherId, {
          other_user_id: otherId,
          other_username: otherUser?.username || `User #${otherId}`,
          last_message: msg.content,
          last_message_at: msg.created_at,
          last_sender_id: msg.sender_id,
          unread_count: msg.sender_id !== user_id && !msg.is_read ? 1 : 0
        });
      } else {
        const existing = conversationMap.get(otherId);
        if (msg.sender_id !== user_id && !msg.is_read) {
          existing.unread_count++;
        }
      }
    }

    return Array.from(conversationMap.values());
  }

  // Get messages between two users
  async getConversation(user_id, other_user_id) {
    // Convert to numbers for comparison
    user_id = parseInt(user_id, 10);
    other_user_id = parseInt(other_user_id, 10);
    
    return knex('messages')
      .where((builder) => {
        builder
          .where({ sender_id: user_id, receiver_id: other_user_id })
          .orWhere({ sender_id: other_user_id, receiver_id: user_id });
      })
      .select('*')
      .orderBy('created_at', 'asc');
  }

  // Mark messages as read
  async markAsRead(user_id, other_user_id) {
    // Convert to numbers
    user_id = parseInt(user_id, 10);
    other_user_id = parseInt(other_user_id, 10);
    
    return knex('messages')
      .where({ receiver_id: user_id, sender_id: other_user_id })
      .update({ is_read: true });
  }

  // Get unread count for a user
  async getUnreadCount(user_id) {
    user_id = parseInt(user_id, 10);
    
    const result = await knex('messages')
      .where({ receiver_id: user_id, is_read: false })
      .count('* as count')
      .first();
    
    return result.count || 0;
  }
}

module.exports = new MessageRepository();
