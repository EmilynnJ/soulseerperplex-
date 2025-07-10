import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminAPI } from '../utils/api';

const Admin = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('readers');
  const [readers, setReaders] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showCreateReader, setShowCreateReader] = useState(false);
  const [newReader, setNewReader] = useState({
    email: '',
    password: '',
    name: '',
    bio: '',
    specialties: '',
    rates: {
      video: 3.99,
      audio: 2.99,
      chat: 1.99
    }
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      const [readersRes, sessionsRes] = await Promise.all([
        adminAPI.getReaders(),
        adminAPI.getSessions()
      ]);
      
      setReaders(readersRes.data.readers || readersRes.data);
      setSessions(sessionsRes.data.sessions || sessionsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReader = async (e) => {
    e.preventDefault();
    try {
      const readerData = {
        ...newReader,
        role: 'reader',
        specialties: newReader.specialties.split(',').map(s => s.trim())
      };
      
      await adminAPI.createReader(readerData);
      
      setShowCreateReader(false);
      setNewReader({
        email: '',
        password: '',
        name: '',
        bio: '',
        specialties: '',
        rates: {
          video: 3.99,
          audio: 2.99,
          chat: 1.99
        }
      });
      
      fetchAdminData();
      alert('Reader created successfully!');
    } catch (error) {
      console.error('Failed to create reader:', error);
      alert('Failed to create reader. Please try again.');
    }
  };

  const toggleReaderStatus = async (readerId, currentStatus) => {
    try {
      await adminAPI.updateReader(readerId, {
        isActive: !currentStatus
      });
      
      fetchAdminData();
    } catch (error) {
      console.error('Failed to update reader status:', error);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-alex-brush text-5xl text-mystical-pink mb-4">
            Admin Dashboard
          </h1>
          <p className="font-playfair text-gray-300 text-lg">
            Manage readers, sessions, and platform settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('readers')}
            className={`px-6 py-3 rounded-lg font-playfair font-semibold transition-colors ${
              activeTab === 'readers'
                ? 'bg-mystical-pink text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Readers
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-3 rounded-lg font-playfair font-semibold transition-colors ${
              activeTab === 'sessions'
                ? 'bg-mystical-pink text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Sessions
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-playfair font-semibold transition-colors ${
              activeTab === 'analytics'
                ? 'bg-mystical-pink text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Readers Tab */}
        {activeTab === 'readers' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-alex-brush text-3xl text-mystical-pink">
                Manage Readers
              </h2>
              <button
                onClick={() => setShowCreateReader(true)}
                className="btn-mystical"
              >
                Create New Reader
              </button>
            </div>

            {/* Create Reader Modal */}
            {showCreateReader && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="card-mystical max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-alex-brush text-2xl text-mystical-pink">
                      Create New Reader
                    </h3>
                    <button
                      onClick={() => setShowCreateReader(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateReader} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="font-playfair text-white text-sm font-medium mb-2 block">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={newReader.email}
                          onChange={(e) => setNewReader({...newReader, email: e.target.value})}
                          className="input-mystical w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="font-playfair text-white text-sm font-medium mb-2 block">
                          Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          value={newReader.password}
                          onChange={(e) => setNewReader({...newReader, password: e.target.value})}
                          className="input-mystical w-full"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="name" className="font-playfair text-white text-sm font-medium mb-2 block">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={newReader.name}
                        onChange={(e) => setNewReader({...newReader, name: e.target.value})}
                        className="input-mystical w-full"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="bio" className="font-playfair text-white text-sm font-medium mb-2 block">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={newReader.bio}
                        onChange={(e) => setNewReader({...newReader, bio: e.target.value})}
                        className="input-mystical w-full h-24"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label htmlFor="specialties" className="font-playfair text-white text-sm font-medium mb-2 block">
                        Specialties (comma-separated)
                      </label>
                      <input
                        id="specialties"
                        type="text"
                        value={newReader.specialties}
                        onChange={(e) => setNewReader({...newReader, specialties: e.target.value})}
                        className="input-mystical w-full"
                        placeholder="Tarot, Love, Career"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="videoRate" className="font-playfair text-white text-sm font-medium mb-2 block">
                          Video Rate ($/min)
                        </label>
                        <input
                          id="videoRate"
                          type="number"
                          step="0.01"
                          value={newReader.rates.video}
                          onChange={(e) => setNewReader({
                            ...newReader,
                            rates: {...newReader.rates, video: parseFloat(e.target.value)}
                          })}
                          className="input-mystical w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="audioRate" className="font-playfair text-white text-sm font-medium mb-2 block">
                          Audio Rate ($/min)
                        </label>
                        <input
                          id="audioRate"
                          type="number"
                          step="0.01"
                          value={newReader.rates.audio}
                          onChange={(e) => setNewReader({
                            ...newReader,
                            rates: {...newReader.rates, audio: parseFloat(e.target.value)}
                          })}
                          className="input-mystical w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="chatRate" className="font-playfair text-white text-sm font-medium mb-2 block">
                          Chat Rate ($/min)
                        </label>
                        <input
                          id="chatRate"
                          type="number"
                          step="0.01"
                          value={newReader.rates.chat}
                          onChange={(e) => setNewReader({
                            ...newReader,
                            rates: {...newReader.rates, chat: parseFloat(e.target.value)}
                          })}
                          className="input-mystical w-full"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button type="submit" className="btn-mystical flex-1">
                        Create Reader
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateReader(false)}
                        className="btn-mystical flex-1 bg-gray-600 hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Readers List */}
            <div className="card-mystical">
              <div className="space-y-4">
                {readers.map((reader) => (
                  <div key={reader._id} className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={reader.profile?.avatar || '/default-avatar.png'}
                        alt={reader.profile?.name}
                        className="w-12 h-12 rounded-full border-2 border-mystical-pink"
                      />
                      <div>
                        <h4 className="font-playfair text-white font-semibold">
                          {reader.profile?.name || 'Unnamed Reader'}
                        </h4>
                        <p className="font-playfair text-gray-300 text-sm">
                          {reader.email}
                        </p>
                        <p className="font-playfair text-mystical-pink text-sm">
                          ${reader.readerSettings?.rates?.video}/min video
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-playfair ${
                        reader.readerSettings?.isOnline
                          ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500'
                          : 'bg-gray-500 bg-opacity-20 text-gray-400 border border-gray-500'
                      }`}>
                        {reader.readerSettings?.isOnline ? 'Online' : 'Offline'}
                      </div>
                      
                      <button
                        onClick={() => toggleReaderStatus(reader._id, reader.isActive)}
                        className={`px-4 py-2 rounded-lg font-playfair text-sm ${
                          reader.isActive
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {reader.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div>
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">
              Recent Sessions
            </h2>
            <div className="card-mystical">
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session._id} className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                    <div>
                      <h4 className="font-playfair text-white font-semibold">
                        {session.readerId?.profile?.name} ↔ {session.clientId?.email}
                      </h4>
                      <p className="font-playfair text-gray-300 text-sm">
                        {new Date(session.createdAt).toLocaleString()} - {session.sessionType}
                      </p>
                      <p className="font-playfair text-mystical-pink text-sm">
                        Status: {session.status}
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
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">
              Platform Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card-mystical text-center">
                <h3 className="font-playfair text-xl text-mystical-pink mb-2">Total Readers</h3>
                <p className="font-alex-brush text-3xl text-white">{readers.length}</p>
              </div>
              <div className="card-mystical text-center">
                <h3 className="font-playfair text-xl text-mystical-pink mb-2">Active Readers</h3>
                <p className="font-alex-brush text-3xl text-white">
                  {Array.isArray(readers) && readers.filter(r => r.isActive).length}
                </p>
              </div>
              <div className="card-mystical text-center">
                <h3 className="font-playfair text-xl text-mystical-pink mb-2">Total Sessions</h3>
                <p className="font-alex-brush text-3xl text-white">{sessions.length}</p>
              </div>
              <div className="card-mystical text-center">
                <h3 className="font-playfair text-xl text-mystical-pink mb-2">Revenue</h3>
                <p className="font-alex-brush text-3xl text-white">
                  ${sessions.reduce((sum, s) => sum + (s.totalCost || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
