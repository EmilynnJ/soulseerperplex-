import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useUser } from '@clerk/clerk-react';

const ReaderDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    pending: 0,
    total: 0
  });
  const [rates, setRates] = useState({
    video: 3.99,
    audio: 2.99,
    chat: 1.99
  });
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setEarnings({
      today: 127.85,
      week: 842.50,
      month: 3247.90,
      pending: 456.75,
      total: 18247.30
    });

    setSessions([
      {
        id: 1,
        clientName: "Sarah M.",
        type: "video",
        duration: "32:15",
        amount: 107.60,
        date: "2024-01-15T14:30:00Z",
        rating: 5,
        status: "completed"
      },
      {
        id: 2,
        clientName: "John D.",
        type: "chat",
        duration: "18:45",
        amount: 37.25,
        date: "2024-01-15T11:20:00Z",
        rating: 4,
        status: "completed"
      },
      {
        id: 3,
        clientName: "Maria L.",
        type: "audio",
        duration: "25:30",
        amount: 76.25,
        date: "2024-01-14T16:45:00Z",
        rating: 5,
        status: "completed"
      }
    ]);

    setNotifications([
      {
        id: 1,
        type: "new_session",
        message: "New reading request from client",
        time: "2 minutes ago",
        urgent: true
      },
      {
        id: 2,
        type: "payout",
        message: "Daily payout processed: $127.85",
        time: "1 hour ago",
        urgent: false
      },
      {
        id: 3,
        type: "review",
        message: "New 5-star review received",
        time: "3 hours ago",
        urgent: false
      }
    ]);
  }, []);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    console.log(`Toggling online status to: ${!isOnline}`);
  };

  const handleUpdateRates = () => {
    console.log('Rate update functionality to be implemented');
  };

  const handleAcceptSession = (notificationId: number) => {
    console.log(`Accepting session from notification ${notificationId}`);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'sessions', name: 'Session History', icon: '💬' },
    { id: 'earnings', name: 'Earnings', icon: '💰' },
    { id: 'profile', name: 'Profile Settings', icon: '👤' },
    { id: 'schedule', name: 'Availability', icon: '📅' },
    { id: 'reviews', name: 'Reviews', icon: '⭐' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-alex-brush text-5xl text-mystical-pink mb-4">
              Reader Dashboard
            </h1>
            <p className="font-playfair text-gray-300 text-lg">
              Welcome back, {user?.profile?.name || user?.email || 'Reader'}
            </p>
          </div>
          
          {/* Online Status Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="font-playfair text-white">Status:</span>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isOnline ? 'bg-green-600' : 'bg-gray-600'}`}>
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-300' : 'bg-gray-300'}`}></div>
                <span className="font-playfair text-white font-semibold">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleOnline}
              className={`px-6 py-3 rounded-lg font-playfair font-semibold transition-colors ${
                isOnline
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        {notifications.filter(n => n.urgent).length > 0 && (
          <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-8">
            <h3 className="font-playfair text-xl text-red-400 font-semibold mb-4">
              🚨 Urgent Notifications
            </h3>
            <div className="space-y-3">
              {notifications.filter(n => n.urgent).map((notification) => (
                <div key={notification.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-playfair text-white">{notification.message}</p>
                    <p className="font-playfair text-gray-400 text-sm">{notification.time}</p>
                  </div>
                  {notification.type === 'new_session' && (
                    <button
                      onClick={() => handleAcceptSession(notification.id)}
                      className="btn-mystical"
                    >
                      Accept Session
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">💰</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Today</h3>
            <p className="font-alex-brush text-2xl text-mystical-pink">${earnings.today}</p>
          </div>
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="font-playfair text-lg text-white font-semibold">This Week</h3>
            <p className="font-alex-brush text-2xl text-mystical-pink">${earnings.week}</p>
          </div>
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">📈</div>
            <h3 className="font-playfair text-lg text-white font-semibold">This Month</h3>
            <p className="font-alex-brush text-2xl text-mystical-pink">${earnings.month}</p>
          </div>
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">⏳</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Pending</h3>
            <p className="font-alex-brush text-2xl text-mystical-gold">${earnings.pending}</p>
          </div>
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Total Earned</h3>
            <p className="font-alex-brush text-2xl text-mystical-pink">${earnings.total.toLocaleString()}</p>
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
            {/* Current Rates */}
            <div className="card-mystical">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-alex-brush text-3xl text-mystical-pink">Your Current Rates</h2>
                <button
                  className="btn-mystical"
                  onClick={handleUpdateRates}
                >
                  Update Rates
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <div className="text-4xl mb-3">📹</div>
                  <h4 className="font-playfair text-xl text-white font-semibold mb-2">Video Call</h4>
                  <p className="font-alex-brush text-3xl text-mystical-gold">${rates.video}/min</p>
                </div>
                <div className="text-center bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <div className="text-4xl mb-3">🎧</div>
                  <h4 className="font-playfair text-xl text-white font-semibold mb-2">Audio Call</h4>
                  <p className="font-alex-brush text-3xl text-mystical-gold">${rates.audio}/min</p>
                </div>
                <div className="text-center bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <div className="text-4xl mb-3">💬</div>
                  <h4 className="font-playfair text-xl text-white font-semibold mb-2">Live Chat</h4>
                  <p className="font-alex-brush text-3xl text-mystical-gold">${rates.chat}/min</p>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="card-mystical">
              <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Recent Sessions</h2>
              <div className="space-y-4">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {session.type === 'video' ? '📹' : session.type === 'audio' ? '🎧' : '💬'}
                      </div>
                      <div>
                        <h4 className="font-playfair text-white font-semibold">{session.clientName}</h4>
                        <p className="font-playfair text-gray-300 text-sm">
                          {session.duration} • {new Date(session.date).toLocaleDateString()}
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
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-6 bg-gray-800 bg-opacity-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">
                      {session.type === 'video' ? '📹' : session.type === 'audio' ? '🎧' : '💬'}
                    </div>
                    <div>
                      <h4 className="font-playfair text-xl text-white font-semibold">{session.clientName}</h4>
                      <p className="font-playfair text-gray-300">
                        Duration: {session.duration} • {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString()}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        session.status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                      }`}>
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
              ))}
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-8">
            <div className="card-mystical">
              <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Earnings Breakdown</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <h3 className="font-playfair text-xl text-white font-semibold mb-4">Payout Schedule</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Next Payout</span>
                      <span className="font-playfair text-mystical-gold">Tomorrow</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Minimum Threshold</span>
                      <span className="font-playfair text-mystical-gold">$15.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Your Share</span>
                      <span className="font-playfair text-mystical-gold">70%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <h3 className="font-playfair text-xl text-white font-semibold mb-4">Session Types</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Video Sessions</span>
                      <span className="font-playfair text-mystical-gold">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Audio Sessions</span>
                      <span className="font-playfair text-mystical-gold">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Chat Sessions</span>
                      <span className="font-playfair text-mystical-gold">25%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="btn-mystical">
                Request Early Payout
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card-mystical">
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Profile Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Tarot', 'Astrology', 'Crystal Healing', 'Medium'].map((specialty) => (
                    <span key={specialty} className="bg-mystical-pink text-white px-3 py-1 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Bio</h3>
                <textarea
                  className="input-mystical w-full h-32 mb-4"
                  placeholder="Tell clients about your gifts and experience..."
                  defaultValue="I am a gifted psychic reader with over 10 years of experience in tarot, astrology, and spiritual guidance. I'm here to help you find clarity on your path."
                />
              </div>
              
              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Profile Photo</h3>
                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
                <button className="btn-mystical w-full mb-6">
                  Upload New Photo
                </button>
                
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Contact Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="font-playfair text-white">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="font-playfair text-white">SMS alerts for new sessions</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="font-playfair text-white">Marketing communications</span>
                  </label>
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

export default ReaderDashboard;
