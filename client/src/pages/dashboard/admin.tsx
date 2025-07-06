import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

interface ReaderApplication {
  id: number;
  name: string;
  email: string;
  specialties: string[];
  experience: string;
  status: string;
  appliedDate: string;
}
const AdminDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [readerApplications, setReaderApplications] = useState<ReaderApplication[]>([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeReaders: 0,
    totalSessions: 0,
    revenue: 0
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    setAnalytics({
      totalUsers: 2847,
      activeReaders: 42,
      totalSessions: 1529,
      revenue: 25840.50
    });

    setReaderApplications([
      {
        id: 1,
        name: "Sarah Crystal",
        email: "sarah@example.com",
        specialties: ["Tarot", "Crystal Healing"],
        experience: "5 years",
        status: "pending",
        appliedDate: "2024-01-15"
      },
      {
        id: 2,
        name: "Michael Star",
        email: "michael@example.com",
        specialties: ["Astrology", "Numerology"],
        experience: "8 years",
        status: "pending",
        appliedDate: "2024-01-14"
      }
    ]);
  }, []);

  const handleApproveReader = (readerId: number) => {
    console.log(`Approved reader with ID: ${readerId}`);
  };

  const handleRejectReader = (readerId: number) => {
    console.log(`Rejected reader with ID: ${readerId}`);
  };

  const handleCreateReader = () => {
    console.log('Create new reader profile');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'readers', name: 'Reader Management', icon: '🔮' },
    { id: 'content', name: 'Content Moderation', icon: '🛡️' },
    { id: 'financial', name: 'Financial Admin', icon: '💰' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'inventory', name: 'Shop Inventory', icon: '🏪' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-alex-brush text-5xl text-mystical-pink mb-4">
            Admin Dashboard
          </h1>
          <p className="font-playfair text-gray-300 text-lg">
            Manage your SoulSeer platform
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Total Users</h3>
            <p className="font-alex-brush text-3xl text-mystical-pink">{analytics.totalUsers.toLocaleString()}</p>
          </div>
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">🔮</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Active Readers</h3>
            <p className="font-alex-brush text-3xl text-mystical-pink">{analytics.activeReaders}</p>
          </div>
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">💬</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Total Sessions</h3>
            <p className="font-alex-brush text-3xl text-mystical-pink">{analytics.totalSessions.toLocaleString()}</p>
          </div>
          <div className="card-mystical text-center">
            <div className="text-4xl mb-2">💰</div>
            <h3 className="font-playfair text-lg text-white font-semibold">Revenue</h3>
            <p className="font-alex-brush text-3xl text-mystical-pink">${analytics.revenue.toLocaleString()}</p>
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
            {/* Recent Activity */}
            <div className="card-mystical">
              <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-playfair text-white">New reader approved: Mystic Luna</p>
                      <p className="font-playfair text-gray-400 text-sm">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                    <div>
                      <p className="font-playfair text-white">Daily payouts processed: $3,247.85</p>
                      <p className="font-playfair text-gray-400 text-sm">4 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⚠️</span>
                    </div>
                    <div>
                      <p className="font-playfair text-white">Content flagged for review: 3 items</p>
                      <p className="font-playfair text-gray-400 text-sm">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'readers' && (
          <div className="space-y-8">
            {/* Reader Applications */}
            <div className="card-mystical">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-alex-brush text-3xl text-mystical-pink">Reader Applications</h2>
                <button
                  className="btn-mystical"
                  onClick={handleCreateReader}
                >
                  Create Reader Profile
                </button>
              </div>
              
              <div className="space-y-4">
                {readerApplications.map((application) => (
                  <div key={application.id} className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-playfair text-xl text-white font-semibold mb-2">
                          {application.name}
                        </h3>
                        <p className="font-playfair text-gray-300 mb-2">{application.email}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {application.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-mystical-pink text-white px-3 py-1 rounded-full text-sm"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                        <p className="font-playfair text-gray-400 text-sm">
                          Experience: {application.experience} | Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApproveReader(application.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded font-playfair font-semibold hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectReader(application.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded font-playfair font-semibold hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-8">
            <div className="card-mystical">
              <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Financial Administration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <h3 className="font-playfair text-xl text-white font-semibold mb-4">Revenue Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Platform Revenue (30%)</span>
                      <span className="font-playfair text-mystical-gold">${(analytics.revenue * 0.3).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Reader Payouts (70%)</span>
                      <span className="font-playfair text-mystical-gold">${(analytics.revenue * 0.7).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Pending Payouts</span>
                      <span className="font-playfair text-mystical-gold">$12,847.32</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <h3 className="font-playfair text-xl text-white font-semibold mb-4">Transaction Monitoring</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Successful Transactions</span>
                      <span className="font-playfair text-green-400">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Failed Transactions</span>
                      <span className="font-playfair text-red-400">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-playfair text-gray-300">Chargebacks</span>
                      <span className="font-playfair text-yellow-400">3</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button className="btn-mystical">Process Payouts</button>
                <button className="bg-gray-700 text-white px-6 py-3 rounded font-playfair font-semibold hover:bg-gray-600 transition-colors">
                  Export Financial Report
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <div className="card-mystical">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-alex-brush text-3xl text-mystical-pink">Shop Inventory Management</h2>
                <button className="btn-mystical">
                  Add New Product
                </button>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 mb-6">
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Stripe Integration</h3>
                <p className="font-playfair text-gray-300 mb-4">
                  Manage your product inventory through Stripe. Products are automatically synced with your Stripe catalog.
                </p>
                <div className="flex space-x-4">
                  <button className="btn-mystical">Sync with Stripe</button>
                  <button className="bg-gray-700 text-white px-6 py-3 rounded font-playfair font-semibold hover:bg-gray-600 transition-colors">
                    View Stripe Dashboard
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h4 className="font-playfair text-lg text-white font-semibold mb-2">Total Products</h4>
                  <p className="font-alex-brush text-2xl text-mystical-pink">47</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h4 className="font-playfair text-lg text-white font-semibold mb-2">Low Stock</h4>
                  <p className="font-alex-brush text-2xl text-yellow-400">5</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h4 className="font-playfair text-lg text-white font-semibold mb-2">Out of Stock</h4>
                  <p className="font-alex-brush text-2xl text-red-400">2</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="card-mystical">
              <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Platform Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
                  <h3 className="font-playfair text-lg text-white font-semibold mb-2">User Growth</h3>
                  <p className="font-alex-brush text-3xl text-green-400">+12.5%</p>
                  <p className="font-playfair text-gray-400 text-sm">This month</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
                  <h3 className="font-playfair text-lg text-white font-semibold mb-2">Session Duration</h3>
                  <p className="font-alex-brush text-3xl text-mystical-pink">23.4m</p>
                  <p className="font-playfair text-gray-400 text-sm">Average</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
                  <h3 className="font-playfair text-lg text-white font-semibold mb-2">Reader Rating</h3>
                  <p className="font-alex-brush text-3xl text-yellow-400">4.8⭐</p>
                  <p className="font-playfair text-gray-400 text-sm">Average</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
                  <h3 className="font-playfair text-lg text-white font-semibold mb-2">Retention Rate</h3>
                  <p className="font-alex-brush text-3xl text-blue-400">67%</p>
                  <p className="font-playfair text-gray-400 text-sm">30-day</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
