import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Routes, Route } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import messageService from "@/services/api/messageService";
import userService from "@/services/api/userService";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";

const Messages = () => {
  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<MessageInbox />} />
        <Route path="/conversation/:id" element={<MessageThread />} />
        <Route path="/new/:userId" element={<NewMessage />} />
      </Routes>
    </div>
  );
};

const MessageInbox = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);

  const loadConversations = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await messageService.getConversations(1); // Current user ID
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
      }
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadConversations} />;
  }

  if (conversations.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold gradient-text">Messages</h1>
        </div>
        <Empty
          title="No messages yet"
          description="Start a conversation with fellow singers in the community!"
          icon="MessageCircle"
          actionLabel="Visit Community"
          action={() => navigate("/community")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold gradient-text">Messages</h1>
        <Button variant="accent" onClick={() => navigate("/community")}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold text-white">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.Id}
                  conversation={conversation}
                  isSelected={selectedConversation?.Id === conversation.Id}
                  onClick={() => setSelectedConversation(conversation)}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <MessageThreadView conversation={selectedConversation} onUpdate={loadConversations} />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <ApperIcon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const ConversationItem = ({ conversation, isSelected, onClick }) => {
  return (
    <div
      className={`p-4 cursor-pointer border-b border-gray-700/50 hover:bg-surface/30 transition-colors ${
        isSelected ? "bg-surface/50" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          {conversation.otherParticipant.avatar ? (
            <img
              src={conversation.otherParticipant.avatar}
              alt={conversation.otherParticipant.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <ApperIcon name="User" size={20} className="text-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-white truncate">
              {conversation.otherParticipant.name}
            </h3>
            {conversation.unreadCount > 0 && (
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{conversation.unreadCount}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-400 truncate mb-1">
            {conversation.lastMessage.content}
          </p>
          
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

const MessageThreadView = ({ conversation, onUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getMessages(conversation.Id);
      setMessages(data.messages);
      await messageService.markAsRead(conversation.Id, 1); // Current user ID
      onUpdate(); // Update conversation list to remove unread count
    } catch (err) {
      console.error("Error loading messages:", err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (conversation) {
      loadMessages();
    }
  }, [conversation.Id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await messageService.sendMessage(conversation.Id, 1, newMessage.trim());
      setNewMessage("");
      await loadMessages();
      onUpdate(); // Update conversation list
      toast.success("Message sent!");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          {conversation.otherParticipant.avatar ? (
            <img
              src={conversation.otherParticipant.avatar}
              alt={conversation.otherParticipant.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <ApperIcon name="User" size={18} className="text-white" />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-white">{conversation.otherParticipant.name}</h2>
          <p className="text-sm text-gray-400">{conversation.otherParticipant.voiceType}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loading variant="spinner" />
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.Id}
              message={message}
              isOwn={message.senderId === 1} // Current user ID
            />
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={sending}
          />
          <Button 
            type="submit" 
            variant="accent" 
            disabled={!newMessage.trim() || sending}
            className="flex-shrink-0"
          >
            {sending ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <ApperIcon name="Send" size={16} />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
        {!isOwn && (
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ApperIcon name="User" size={12} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-300">{message.sender.name}</span>
          </div>
        )}
        
        <div className={`p-3 rounded-lg ${
          isOwn 
            ? "bg-gradient-to-r from-primary to-secondary text-white" 
            : "bg-surface border border-gray-600 text-gray-100"
        }`}>
          <p className="text-sm">{message.content}</p>
        </div>
        
        <p className={`text-xs text-gray-500 mt-1 ${isOwn ? "text-right" : "text-left"}`}>
          {format(new Date(message.timestamp), "MMM d, h:mm a")}
        </p>
      </div>
    </div>
  );
};

const MessageThread = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadConversation = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await messageService.getMessages(parseInt(id));
      setConversation(data);
    } catch (err) {
      console.error("Error loading conversation:", err);
      setError("Failed to load conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadConversation();
    }
  }, [id]);

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadConversation} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate("/messages")}>
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Messages
        </Button>
      </div>
      
      {conversation && (
        <MessageThreadView 
          conversation={conversation} 
          onUpdate={() => {}} 
        />
      )}
    </div>
  );
};

const NewMessage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadRecipient = async () => {
      try {
        const user = await userService.getById(parseInt(userId));
        setRecipient(user);
      } catch (err) {
        console.error("Error loading user:", err);
        toast.error("User not found");
        navigate("/messages");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadRecipient();
    }
  }, [userId, navigate]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      const newConversation = await messageService.createConversation([1, parseInt(userId)], message.trim());
      toast.success("Message sent!");
      navigate(`/messages/conversation/${newConversation.Id}`);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate("/community")}>
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Community
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-display font-bold gradient-text mb-6">New Message</h1>
          
          {recipient && (
            <div className="flex items-center space-x-3 p-4 bg-surface/50 rounded-lg mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                {recipient.avatar ? (
                  <img
                    src={recipient.avatar}
                    alt={recipient.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <ApperIcon name="User" size={20} className="text-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{recipient.name}</h3>
                <p className="text-sm text-gray-400">{recipient.voiceType} • {recipient.level}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Start a conversation..."
                rows={6}
                className="w-full bg-surface border border-gray-600 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none resize-none"
                disabled={sending}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate("/community")}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="accent" 
                disabled={!message.trim() || sending}
              >
                {sending ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" size={16} className="mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Messages;