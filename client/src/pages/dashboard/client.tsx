import React, { useState, useEffect } from 'react';
// import { useUser } from '@clerk/clerk-react'; // Will use passed user prop
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../utils/api';
import { UserResource } from '@clerk/types'; // Import Clerk User type

interface ClientDashboardProps {
  user: UserResource | null;
}

// Type Definitions
interface Session {
  id: string;
  sessionId: string;
  sessionType: 'video' | 'chat' | 'audio';
  duration: number;
  totalCost: number;
  createdAt: string;
  rating?: number;
  status: 'completed' | 'pending' | 'active' | 'cancelled';
  review?: string;
  reader: {
    id: string;
    name: string;
    email: string;
  };
  isClient: boolean;
}

interface Reader {
  id: string;
  name: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  isOnline: boolean;
  rates: {
    video: number;
    audio: number;
    chat: number;
  };
  totalReviews: number;
  memberSince: string;
}

interface ClientStats {
  totalSessions: number;
  totalSpent: number;
  totalMinutes: number;
  averageSessionLength: number;
  favoriteReaders: number;
}

interface Order {
  id: number;
  item: string;
  type: string;
  amount: number;
  date: string;
  status: 'completed' | 'shipped' | 'pending';
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [favoriteReaders, setFavoriteReaders] = useState<Reader[]>([]);
  const [onlineReaders, setOnlineReaders] = useState<Reader[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      setLoading(true);
      const [readersResponse, sessionsResponse, statsResponse] = await Promise.all([
        clientAPI.getReaders({ limit: 20, isOnline: 'true' }),
        clientAPI.getSessionHistory({ limit: 10 }),
        clientAPI.getStats()
      ]);
      
      const balanceResponse = await clientAPI.getBalance();

      setOnlineReaders(readersResponse.data.readers);
      setSessions(sessionsResponse.data.sessions);
      setStats(statsResponse.data.stats);
      setBalance(balanceResponse.data.balance);
      
      // Mock favorite readers (subset of online readers)
      // This should ideally come from a user-specific API endpoint
      setFavoriteReaders(readersResponse.data.readers.slice(0, 3));
      
      // Mock recent orders
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
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load client data');
      console.error('Client dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    try {
      // This will integrate with Stripe later
      console.log('Add funds functionality to be implemented');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to add funds');
    }
  };

  const handleConnectReader = async (readerId: string, sessionType: string) => {
    try {
      const response = await clientAPI.requestSession({
        readerId,
        sessionType
      });
      
      alert(`Session request sent! Session ID: ${response.data.sessionId}`);
      await loadClientData(); // Reload data
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to request session');
    }
  };

  const handleAddToFavorites = (readerId: string) => {
    console.log(`Added reader ${readerId} to favorites`);
    // Implement favorites functionality with backend API
  };

  const handleViewOrder = (orderId: number) => {
    console.log(`Viewing order ${orderId}`);
  };

  // Format duration from seconds to readable format
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mystical-pink mx-auto mb-4"></div>
          <p className="font-playfair text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-playfair text-red-400 mb-4">{error}</p>
          <button
            onClick={loadClientData}
            className="btn-mystical"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            <p className="font-alex-brush text-3xl text-mystical-pink">${balance !== undefined && balance !== null ? balance.toFixed(2) : '0.00'}</p>
            <button
              className="btn-mystical mt-4 text-sm py-2"
              onClick={() => alert("Add Funds: This feature requires Stripe integration for payment processing. (Placeholder)")}
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
                      {reader.specialties.map((specialty) => (
                        <span key={`${reader.id}-${specialty}`} className="bg-mystical-pink text-white px-2 py-1 rounded text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-playfair text-mystical-gold">${reader.rates.video}/min</span>
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
                      <div className="text-3xl">🔮</div>
                      <div>
                        <h4 className="font-playfair text-white font-semibold">{session.reader.name}</h4>
                        <p className="font-playfair text-gray-300 text-sm">
                          {session.sessionType} • {formatDuration(session.duration)} • {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-playfair text-mystical-gold font-semibold">${session.totalCost.toFixed(2)}</p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={`recent-${session.id}-star-${i}`} className={i < (session.rating || 0) ? 'text-yellow-400' : 'text-gray-600'}>
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
                      <div className="text-4xl">🔮</div>
                      <div>
                        <h4 className="font-playfair text-xl text-white font-semibold">{session.reader.name}</h4>
                        <p className="font-playfair text-gray-300">
                          {session.sessionType} Session • {formatDuration(session.duration)} • {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString()}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${(() => {
                          if (session.status === 'completed') {
                            return 'bg-green-600 text-white';
                          }
                          if (session.status === 'active') {
                            return 'bg-blue-600 text-white';
                          }
                          if (session.status === 'pending') {
                            return 'bg-yellow-600 text-white';
                          }
                          return 'bg-gray-600 text-white';
                        })()}`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-playfair text-mystical-gold font-semibold text-xl">${session.totalCost.toFixed(2)}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={`history-${session.id}-star-${i}`} className={i < (session.rating || 0) ? 'text-yellow-400' : 'text-gray-600'}>
                            ⭐
                          </span>
                        ))}
                        <span className="font-playfair text-gray-300 ml-2">({session.rating || 'N/A'}/5)</span>
                      </div>
                    </div>
                  </div>
                  
                  {session.review && (
                    <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                      <h5 className="font-playfair text-white font-semibold mb-2">Session Notes:</h5>
                      <p className="font-playfair text-gray-300 italic">"{session.review}"</p>
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
                    {reader.specialties.map((specialty) => (
                      <span key={`fav-${reader.id}-${specialty}`} className="bg-mystical-pink text-white px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-playfair text-mystical-gold text-lg">${reader.rates.video}/min</span>
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
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${(() => {
                      if (order.status === 'completed') {
                        return 'bg-green-600 text-white';
                      }
                      if (order.status === 'shipped') {
                        return 'bg-blue-600 text-white';
                      }
                      return 'bg-yellow-600 text-white';
                    })()}`}>
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
                    <label htmlFor="displayName" className="block font-playfair text-white mb-2">Display Name</label>
                    <input
                      id="displayName"
                      type="text"
                      className="input-mystical w-full"
                      defaultValue={user?.firstName || ''}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-playfair text-white mb-2">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="input-mystical w-full"
                      defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                    />
                  </div>
                  <div>
                    <label htmlFor="birthDate" className="block font-playfair text-white mb-2">Birth Date</label>
                    <input
                      id="birthDate"
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
                    <fieldset>
                      <legend className="block font-playfair text-white mb-2">Preferred Reading Types</legend>
                      <div className="space-y-2">
                        {['Tarot', 'Astrology', 'Crystal Healing', 'Medium', 'Love & Relationships'].map((type) => (
                          <label key={type} className="flex items-center space-x-3">
                            <input type="checkbox" className="rounded" />
                            <span className="font-playfair text-white">{type}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                  
                  <div>
                    <fieldset>
                      <legend className="block font-playfair text-white mb-2">Notification Preferences</legend>
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
                    </fieldset>
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
