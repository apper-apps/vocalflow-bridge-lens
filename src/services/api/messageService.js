import messagesData from "@/services/mockData/messages.json";
import userService from "./userService.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MessageService {
  constructor() {
    this.messages = [...messagesData];
  }

  async getConversations(userId = 1) {
    await delay(300);
    // Get all conversations where user is participant
    const userConversations = this.messages.filter(conv => 
      conv.participants.includes(userId)
    );
    
    // Add participant details and sort by last message time
    const conversationsWithDetails = await Promise.all(
      userConversations.map(async (conv) => {
        const otherParticipantId = conv.participants.find(id => id !== userId);
        const otherUser = await userService.getById(otherParticipantId);
        const lastMessage = conv.messages[conv.messages.length - 1];
        
        return {
          ...conv,
          otherParticipant: otherUser,
          lastMessage,
          unreadCount: conv.messages.filter(msg => 
            msg.senderId !== userId && !msg.read
          ).length
        };
      })
    );
    
    return conversationsWithDetails.sort((a, b) => 
      new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    );
  }

  async getMessages(conversationId) {
    await delay(200);
    const conversation = this.messages.find(conv => conv.Id === parseInt(conversationId));
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    
    // Add sender details to messages
    const messagesWithDetails = await Promise.all(
      conversation.messages.map(async (msg) => {
        const sender = await userService.getById(msg.senderId);
        return {
          ...msg,
          sender
        };
      })
    );
    
    return {
      ...conversation,
      messages: messagesWithDetails
    };
  }

  async sendMessage(conversationId, senderId, content) {
    await delay(250);
    
    if (conversationId) {
      // Reply to existing conversation
      const conversation = this.messages.find(conv => conv.Id === parseInt(conversationId));
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      
      const newMessage = {
        Id: Math.max(...conversation.messages.map(m => m.Id), 0) + 1,
        senderId: parseInt(senderId),
        content,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      conversation.messages.push(newMessage);
      conversation.updatedAt = new Date().toISOString();
      
      return newMessage;
    } else {
      // Create new conversation (for future implementation)
      throw new Error("Creating new conversations not yet implemented");
    }
  }

  async markAsRead(conversationId, userId) {
    await delay(150);
    const conversation = this.messages.find(conv => conv.Id === parseInt(conversationId));
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    
    // Mark all messages from other participants as read
    conversation.messages.forEach(msg => {
      if (msg.senderId !== parseInt(userId)) {
        msg.read = true;
      }
    });
    
    return true;
  }

  async createConversation(participantIds, initialMessage) {
    await delay(300);
    
    const newConversation = {
      Id: Math.max(...this.messages.map(c => c.Id), 0) + 1,
      participants: participantIds.map(id => parseInt(id)),
      messages: [{
        Id: 1,
        senderId: parseInt(participantIds[0]),
        content: initialMessage,
        timestamp: new Date().toISOString(),
        read: false
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.messages.push(newConversation);
    return newConversation;
  }
}

export default new MessageService();