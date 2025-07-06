import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

// Type Definitions
interface Session {
  id: number;
  readerName: string;
  readerAvatar: string;
  type: 'video' | 'chat' | 'audio';
  duration: string;
  amount: number;
  date: string;
  rating: number;
  status: 'completed' | 'pending' | 'cancelled';
  notes: string;
}

interface Reader {
  id: number;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  isOnline: boolean;
  rate: number;
}

interface Order {
  id: number;
  item: string;
  type: string;
  amount: number;
  date: string;
  status: 'completed' | 'shipped' | 'pending';
}

const ClientDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [favoriteReaders, setFavoriteReaders] = useState<Reader[]>([]);
  const [onlineReaders, setOnlineReaders] = useState<Reader[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setBalance(125.75);
    
    setSessions([
      {
        id: 1,
        readerName: "Mystic Luna",
        readerAvatar: "🌙",
        type: "video",
        duration: "45:30",
        amount: 151.70,
        date: "2024-01-15T14:30:00Z",
        rating: 5,
        status: "completed",
        notes: "Amazing reading! Luna provided incredible insights about my career path."
      },
      {
        id: 2,
        readerName: "Crystal Rose",
        readerAvatar: "🌹",
        type: "chat",
        duration: "28:15",
        amount: 56.25,
        date: "2024-01-14T11:20:00Z",
        rating: 4,
        status: "completed",
        notes: "Very helpful guidance on relationships. Felt very connected."
      },
      {
        id: 3,
        readerName: "Star Walker",
        readerAvatar: "⭐",
        type: "audio",
        duration: "32:45",
        amount: 97.85,
        date: "2024-01-13T16:45:00Z",
        rating: 5,
        status: "completed",
        notes: "Astrology reading was spot on. Great predictions for the new year."
      }
    ]);

    setFavoriteReaders([
      {
        id: 1,
        name: "Mystic Luna",
        avatar: "🌙",
        specialties: ["Tarot", "Love"],
        rating: 4.9,
        isOnline: true,
        rate: 3.99
      },
      {
        id: 2,
        name: "Crystal Rose",
        avatar: "🌹",
        specialties: ["Crystals", "Healing"],
        rating: 4.8,
        isOnline: false,
        rate: 2.99
      },
      {
        id: 3,
        name: "Star Walker",
        avatar: "⭐",
        specialties: ["Astrology", "Career"],
        rating: 4.9,
        isOnline: true,
        rate: 3.49
      }
    ]);

    setOnlineReaders([
      {
        id: 4,
        name: "Soul Guide Maya",
        avatar: "👁️",
        specialties: ["Past Life", "Spiritual Guidance"],
        rating: 4.7,
        isOnline: true,
        rate: 4.99
      },
      {
        id: 5,
        name: "Intuitive Oracle",
        avatar: "🔮",
        specialties: ["Psychic", "Medium"],
        rating: 4.8,
        isOnline: true,
        rate: 3.79
      }
    ]);

    setRecentOrders([
      {
        id: 1,
        item: "Crystal Healing Guide",
        type: "Digital Download",
        amount: 19.99,
        date: "2024-01-12T10:30:00Z",
        status: "completed"
      },
      {
        id: 2,
        item: "Premium Tarot Deck",
        type: "Physical Product",
        amount: 34.99,
        date: "2024-01-10T15:20:00Z",
        status: "shipped"
      }
    ]);
  }, []);

  const handleAddFunds = () => {
    console.log('Add funds functionality to be implemented');
  };

  const handleConnectReader = (readerId: number, sessionType: string) => {
    console.log(`Connecting to reader ${readerId} for ${sessionType} session`);
  };

  const handleAddToFavorites = (readerId: number) => {
    console.log(`Added reader ${readerId} to favorites`);
  };

  const handleViewOrder = (orderId: number) => {
    console.log(`Viewing order ${orderId}`);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'sessions', name: 'Session History', icon: '💬' },
    { id: 'favorites', name: 'Favorite Readers', icon: '❤️' },
    { id: 'orders', name: 'Order History', icon: '🛍️' },
    { id: 'profile', name: 'Profile Settings', icon: '👤' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-alex-brush text-5xl text-mystical-pink mb-4">
            Welcome Back, {user?.firstName || 'Seeker'}
          </h1>
          <p className="font-playfair text-gray-300 text-lg">
            Connect with gifted psychics for guidance and clarity on your spiritual journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">💰</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Account Balance</h3>
            <p className="font-alex-brush text-3xl text-mystical-pink">${balance.toFixed(2)}</p>
            <button
              className="btn-mystical mt-4 text-sm py-2"
              onClick={handleAddFunds}
            >
              Add Funds
            </button>
          </div>
          
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">📖</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Total Sessions</h3>
            <p className="font-alex-brush text-3xl text-mystical-pink">{sessions.length}</p>
          </div>
          
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">❤️</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Favorite Readers</h3>
            <p className="font-alex-brush text-3xl text-mystical-pink">{favoriteReaders.length}</p>
          </div>
          
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">🛍️</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Orders</h3>
            <p className="font-alex-brush text-3xl text-mystical-pink">{recentOrders.length}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-playfair font-semibold transition-all flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-mystical-pink text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Online Readers */}
            <div className="card-mystical">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-alex-brush text-3xl text-mystical-pink">Readers Online Now</h2>
                <button
                  className="btn-mystical"
                  onClick={() => navigate('/readers')}
                >
                  View All Readers
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...favoriteReaders.filter(r => r.isOnline), ...onlineReaders].slice(0, 3).map((reader) => (
                  <div key={reader.id} className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-3xl">{reader.avatar}</div>
                      <div className="flex-1">
                        <h3 className="font-playfair text-lg text-white font-semibold">{reader.name}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-playfair text-gray-300 text-sm">{reader.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="font-playfair text-green-400 text-sm">Online</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {reader.specialties.map((specialty, index) => (
                        <span key={index} className="bg-mystical-pink text-white px-2 py-1 rounded text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-playfair text-mystical-gold">${reader.rate}/min</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        className="btn-mystical flex-1 text-sm py-2"
                        onClick={() => handleConnectReader(reader.id, 'video')}
                      >
                        Connect
                      </button>
                      <button
                        className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                        onClick={() => handleAddToFavorites(reader.id)}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="card-mystical">
              <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Recent Sessions</h2>
              <div className="space-y-4">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{session.readerAvatar}</div>
                      <div>
                        <h4 className="font-playfair text-white font-semibold">{session.readerName}</h4>
                        <p className="font-playfair text-gray-300 text-sm">
                          {session.type} • {session.duration} • {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-playfair text-mystical-gold font-semibold">${session.amount}</p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < session.rating ? 'text-yellow-400' : 'text-gray-600'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="card-mystical">
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Session History</h2>
            <div className="space-y-6">
              {sessions.map((session) => (
                <div key={session.id} className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{session.readerAvatar}</div>
                      <div>
                        <h4 className="font-playfair text-xl text-white font-semibold">{session.readerName}</h4>
                        <p className="font-playfair text-gray-300">
                          {session.type} Session • {session.duration} • {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString()}
                        </p>
                        <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold mt-2">
                          {session.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-playfair text-mystical-gold font-semibold text-xl">${session.amount}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < session.rating ? 'text-yellow-400' : 'text-gray-600'}>
                            ⭐
                          </span>
                        ))}
                        <span className="font-playfair text-gray-300 ml-2">({session.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                  
                  {session.notes && (
                    <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                      <h5 className="font-playfair text-white font-semibold mb-2">Session Notes:</h5>
                      <p className="font-playfair text-gray-300 italic">"{session.notes}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="card-mystical">
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Your Favorite Readers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteReaders.map((reader) => (
                <div key={reader.id} className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-4xl">{reader.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-playfair text-xl text-white font-semibold">{reader.name}</h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-playfair text-gray-300">{reader.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${reader.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className={`font-playfair text-sm ${reader.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                        {reader.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {reader.specialties.map((specialty, index) => (
                      <span key={index} className="bg-mystical-pink text-white px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-playfair text-mystical-gold text-lg">${reader.rate}/min</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 py-2 rounded font-playfair font-semibold transition-colors ${
                        reader.isOnline
                          ? 'btn-mystical'
                          : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      }`}
                      onClick={() => reader.isOnline && handleConnectReader(reader.id, 'video')}
                      disabled={!reader.isOnline}
                    >
                      {reader.isOnline ? 'Connect Now' : 'Offline'}
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card-mystical">
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Order History</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-6 bg-gray-800 bg-opacity-50 rounded-lg">
                  <div>
                    <h4 className="font-playfair text-xl text-white font-semibold">{order.item}</h4>
                    <p className="font-playfair text-gray-300">{order.type}</p>
                    <p className="font-playfair text-gray-400 text-sm">
                      Ordered: {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-playfair text-mystical-gold font-semibold text-lg">${order.amount}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'completed' ? 'bg-green-600 text-white' :
                      order.status === 'shipped' ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-white'
                    }`}>
                      {order.status}
                    </span>
                    <button
                      className="block mt-2 text-mystical-pink hover:text-pink-400 transition-colors text-sm"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <button
                className="btn-mystical"
                onClick={() => navigate('/shop')}
              >
                Browse Shop
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card-mystical">
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Profile Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-playfair text-white mb-2">Display Name</label>
                    <input
                      type="text"
                      className="input-mystical w-full"
                      defaultValue={user?.firstName || ''}
                    />
                  </div>
                  <div>
                    <label className="block font-playfair text-white mb-2">Email</label>
                    <input
                      type="email"
                      className="input-mystical w-full"
                      defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                    />
                  </div>
                  <div>
                    <label className="block font-playfair text-white mb-2">Birth Date</label>
                    <input
                      type="date"
                      className="input-mystical w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-playfair text-white mb-2">Preferred Reading Types</label>
                    <div className="space-y-2">
                      {['Tarot', 'Astrology', 'Crystal Healing', 'Medium', 'Love & Relationships'].map((type) => (
                        <label key={type} className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <span className="font-playfair text-white">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-playfair text-white mb-2">Notification Preferences</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="font-playfair text-white">Email notifications</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="font-playfair text-white">Favorite reader online alerts</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <span className="font-playfair text-white">Promotional offers</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <button className="btn-mystical">Save Changes</button>
              <button className="bg-gray-700 text-white px-6 py-3 rounded font-playfair font-semibold hover:bg-gray-600 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
