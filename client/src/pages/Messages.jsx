import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { messageAPI } from '../utils/api';

const Messages = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  console.log('[Messages] User:', user);
  console.log('[Messages] User role:', user?.role);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await messageAPI.getConversations();
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversationId) {
        return;
      }

      try {
        setLoadingMessages(true);
        const response = await messageAPI.getConversationMessages(activeConversationId);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error(`Failed to fetch messages for ${activeConversationId}:`, error);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeConversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversationId) {
      return;
    }

    const activeConversation = conversations.find(c => c.conversationId === activeConversationId);
    if (!activeConversation) {
      return;
    }

    const receiverId = activeConversation.otherParticipant.id;

    try {
      const response = await messageAPI.sendMessage({
        receiverId,
        content: newMessage.trim(),
      });

      setMessages(prevMessages => [...prevMessages, response.data.message]);
      setNewMessage('');

      // Optimistically update the conversation list
      setConversations(prev => prev.map(conversation =>
        conversation.conversationId === activeConversationId
          ? { ...conversation, lastMessage: { content: newMessage.trim(), createdAt: new Date().toISOString(), isFromMe: true } }
          : conversation
      ));

    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleStartReading = (readerId) => {
    navigate(`/reading/new?readerId=${readerId}`);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-alex-brush text-5xl text-mystical-pink mb-4">
            Messages
          </h1>
          <p className="font-playfair text-gray-300 text-lg">
            Connect with your readers and SoulSeer support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          {/* Conversations List */}
          <div className="card-mystical">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-alex-brush text-2xl text-mystical-pink">Conversations</h2>
              <button
                className="text-mystical-pink hover:text-pink-400 transition-colors"
                onClick={() => navigate('/readers')}
              >
                + New Chat
              </button>
            </div>
            
            {loading ? <LoadingSpinner text="Loading conversations..." /> : (
              <div className="space-y-3 overflow-y-auto max-h-[600px]">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.conversationId}
                    onClick={() => setActiveConversationId(conversation.conversationId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveConversationId(conversation.conversationId);
                      }
                    }}
                    className={`p-4 rounded-lg cursor-pointer transition-all w-full text-left ${
                      activeConversationId === conversation.conversationId
                        ? 'bg-mystical-pink bg-opacity-20 border border-mystical-pink'
                        : 'bg-gray-800 bg-opacity-50 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="text-2xl">{conversation.otherParticipant.avatar || '👤'}</div>
                        {conversation.otherParticipant.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-playfair text-white font-semibold truncate">
                            {conversation.otherParticipant.name}
                          </h3>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-mystical-pink text-white rounded-full px-2 py-1 text-xs">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="font-playfair text-gray-300 text-sm truncate">
                          {conversation.lastMessage.isFromMe && "You: "}{conversation.lastMessage.content}
                        </p>
                        <p className="font-playfair text-gray-400 text-xs">
                          {formatTime(conversation.lastMessage.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2 card-mystical flex flex-col">
            {activeConversationId ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">
                      {conversations.find(c => c.conversationId === activeConversationId)?.otherParticipant.avatar || '👤'}
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl text-white font-semibold">
                        {conversations.find(c => c.conversationId === activeConversationId)?.otherParticipant.name}
                      </h3>
                      <p className="font-playfair text-gray-300 text-sm">
                        {conversations.find(c => c.conversationId === activeConversationId)?.otherParticipant.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  
                  {conversations.find(c => c.conversationId === activeConversationId)?.otherParticipant.role === 'reader' && (
                    <button
                      className="btn-mystical"
                      onClick={() => handleStartReading(conversations.find(c => c.conversationId === activeConversationId)?.otherParticipant.id)}
                    >
                      Start Reading
                    </button>
                  )}
                </div>

                {/* Messages */}
                {loadingMessages ? <LoadingSpinner text="Loading messages..." /> : (
                  <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[450px]">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user._id
                              ? 'bg-mystical-pink text-white'
                              : 'bg-gray-700 text-white'
                          }`}
                        >
                          <p className="font-playfair">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === user._id ? 'text-pink-100' : 'text-gray-400'
                          }`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Input */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="input-mystical flex-1"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="btn-mystical px-6"
                    >
                      Send
                    </button>
                  </div>
                  
                  <div className="mt-3 text-center">
                    <p className="font-playfair text-gray-400 text-sm">
                      Messages with readers are free to send.{' '}
                      <span className="text-mystical-pink">Readers may choose to charge for responses.</span>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="font-alex-brush text-3xl text-mystical-pink mb-4">
                    Select a Conversation
                  </h3>
                  <p className="font-playfair text-gray-300 mb-6">
                    Choose a conversation from the left to start messaging
                  </p>
                  <button
                    className="btn-mystical"
                    onClick={() => navigate('/readers')}
                  >
                    Find a Reader to Chat With
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messaging Guidelines */}
        <div className="card-mystical mt-8">
          <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Messaging Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-playfair text-xl text-white font-semibold mb-4">For Clients</h3>
              <ul className="space-y-3 font-playfair text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-mystical-pink mt-1">•</span>
                  <span>Sending messages to readers is always free</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-mystical-pink mt-1">•</span>
                  <span>Readers may choose to charge for detailed responses</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-mystical-pink mt-1">•</span>
                  <span>Be respectful and patient with response times</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-mystical-pink mt-1">•</span>
                  <span>For urgent matters, book a live reading session</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-playfair text-xl text-white font-semibold mb-4">Community Rules</h3>
              <ul className="space-y-3 font-playfair text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-mystical-gold mt-1">•</span>
                  <span>Keep conversations respectful and professional</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-mystical-gold mt-1">•</span>
                  <span>No sharing of personal contact information</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-mystical-gold mt-1">•</span>
                  <span>Report any inappropriate behavior to support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-mystical-gold mt-1">•</span>
                  <span>All conversations are private and confidential</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
