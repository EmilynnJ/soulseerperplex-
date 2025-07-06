import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ReaderCard from '../components/ReaderCard';
import { useUser } from '@clerk/clerk-react';

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    readers: [],
    sessions: [],
    earnings: null,
    balance: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (user.role === 'client') {
        const [readersRes, sessionsRes] = await Promise.all([
          axios.get('/api/users/readers'),
          axios.get('/api/sessions/history')
        ]);
        
        setData({
          readers: readersRes.data.readers,
          sessions: sessionsRes.data.sessions,
          balance: user.balance || 0
        });
      } else if (user.role === 'reader') {
        const [sessionsRes, earningsRes] = await Promise.all([
          axios.get('/api/sessions/history'),
          axios.get('/api/users/earnings')
        ]);
        
        setData({
          sessions: sessionsRes.data.sessions,
          earnings: earningsRes.data
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectReader = async (readerId, sessionType) => {
    try {
      const response = await axios.post('/api/sessions/request', {
        readerId,
        sessionType
      });
      
      navigate(`/reading/${response.data.sessionId}`);
    } catch (error) {
      console.error('Failed to connect to reader:', error);
      alert('Failed to connect to reader. Please try again.');
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      await axios.patch('/api/users/status', {
        isOnline: !user.readerSettings?.isOnline
      });
      
      // Refresh user data
      window.location.reload();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  // Client Dashboard
  if (user.role === 'client') {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-alex-brush text-5xl text-mystical-pink mb-4">
              Welcome Back, {user.profile?.name || 'Seeker'}
            </h1>
            <p className="font-playfair text-gray-300 text-lg">
              Connect with gifted psychics for guidance and clarity
            </p>
          </div>

          {/* Balance Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-mystical">
              <h3 className="font-playfair text-xl text-mystical-pink mb-2">Account Balance</h3>
              <p className="font-alex-brush text-3xl text-white">${data.balance.toFixed(2)}</p>
              <button className="btn-mystical mt-4">Add Funds</button>
            </div>
            
            <div className="card-mystical">
              <h3 className="font-playfair text-xl text-mystical-pink mb-2">Total Sessions</h3>
              <p className="font-alex-brush text-3xl text-white">{data.sessions.length}</p>
            </div>
            
            <div className="card-mystical">
              <h3 className="font-playfair text-xl text-mystical-pink mb-2">Favorite Readers</h3>
              <p className="font-alex-brush text-3xl text-white">3</p>
              <button className="btn-mystical mt-4">View All</button>
            </div>
          </div>

          {/* Online Readers */}
          <div className="mb-8">
            <h2 className="font-alex-brush text-4xl text-mystical-pink mb-6">
              Available Readers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(data.readers) && data.readers.filter(reader => reader.isOnline).map((reader) => (
                <ReaderCard
                  key={reader.id}
                  reader={reader}
                  onConnect={handleConnectReader}
                />
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <h2 className="font-alex-brush text-4xl text-mystical-pink mb-6">
              Recent Sessions
            </h2>
            <div className="card-mystical">
              {data.sessions.length > 0 ? (
                <div className="space-y-4">
                  {data.sessions.slice(0, 5).map((session) => (
                    <div key={session._id} className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                      <div>
                        <h4 className="font-playfair text-white font-semibold">
                          {session.readerId?.profile?.name || 'Reader'}
                        </h4>
                        <p className="font-playfair text-gray-300 text-sm">
                          {new Date(session.createdAt).toLocaleDateString()} - {session.sessionType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-playfair text-mystical-gold font-semibold">
                          ${session.totalCost?.toFixed(2) || '0.00'}
                        </p>
                        <p className="font-playfair text-gray-300 text-sm">
                          {Math.floor(session.duration / 60)}m {session.duration % 60}s
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-playfair text-gray-300 text-center py-8">
                  No sessions yet. Connect with a reader to get started!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reader Dashboard
  if (user.role === 'reader') {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-alex-brush text-5xl text-mystical-pink mb-4">
                Reader Dashboard
              </h1>
              <p className="font-playfair text-gray-300 text-lg">
                Manage your readings and earnings
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleOnlineStatus}
                className={`px-6 py-3 rounded-lg font-playfair font-semibold transition-colors ${
                  user.readerSettings?.isOnline
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {user.readerSettings?.isOnline ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          </div>

          {/* Earnings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card-mystical">
              <h3 className="font-playfair text-xl text-mystical-pink mb-2">Today's Earnings</h3>
              <p className="font-alex-brush text-3xl text-white">
                ${data.earnings?.today?.toFixed(2) || '0.00'}
              </p>
            </div>
            
            <div className="card-mystical">
              <h3 className="font-playfair text-xl text-mystical-pink mb-2">Pending Payout</h3>
              <p className="font-alex-brush text-3xl text-white">
                ${user.earnings?.pending?.toFixed(2) || '0.00'}
              </p>
            </div>
            
            <div className="card-mystical">
              <h3 className="font-playfair text-xl text-mystical-pink mb-2">Total Earned</h3>
              <p className="font-alex-brush text-3xl text-white">
                ${user.earnings?.total?.toFixed(2) || '0.00'}
              </p>
            </div>
            
            <div className="card-mystical">
              <h3 className="font-playfair text-xl text-mystical-pink mb-2">Sessions Today</h3>
              <p className="font-alex-brush text-3xl text-white">
                {Array.isArray(data.sessions) && data.sessions.filter(s =>
                  new Date(s.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>

          {/* Rate Settings */}
          <div className="card-mystical mb-8">
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">
              Your Rates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-playfair text-white font-semibold mb-2">Video Call</h4>
                <p className="font-alex-brush text-2xl text-mystical-gold">
                  ${user.readerSettings?.rates?.video?.toFixed(2) || '3.99'}/min
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-playfair text-white font-semibold mb-2">Audio Call</h4>
                <p className="font-alex-brush text-2xl text-mystical-gold">
                  ${user.readerSettings?.rates?.audio?.toFixed(2) || '2.99'}/min
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-playfair text-white font-semibold mb-2">Chat</h4>
                <p className="font-alex-brush text-2xl text-mystical-gold">
                  ${user.readerSettings?.rates?.chat?.toFixed(2) || '1.99'}/min
                </p>
              </div>
            </div>
            <div className="text-center mt-6">
              <button className="btn-mystical">Update Rates</button>
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <h2 className="font-alex-brush text-4xl text-mystical-pink mb-6">
              Recent Sessions
            </h2>
            <div className="card-mystical">
              {Array.isArray(data.sessions) && data.sessions.length > 0 ? (
                <div className="space-y-4">
                  {data.sessions.slice(0, 5).map((session) => (
                    <div key={session._id} className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                      <div>
                        <h4 className="font-playfair text-white font-semibold">
                          {session.clientId?.email || 'Client'}
                        </h4>
                        <p className="font-playfair text-gray-300 text-sm">
                          {new Date(session.createdAt).toLocaleDateString()} - {session.sessionType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-playfair text-mystical-gold font-semibold">
                          ${session.readerEarnings?.toFixed(2) || '0.00'}
                        </p>
                        <p className="font-playfair text-gray-300 text-sm">
                          {Math.floor(session.duration / 60)}m {session.duration % 60}s
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-playfair text-gray-300 text-center py-8">
                  No sessions yet. Go online to start receiving clients!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
