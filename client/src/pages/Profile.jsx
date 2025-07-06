import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.publicMetadata?.bio || '',
    birthDate: user?.publicMetadata?.birthDate || '',
    preferences: user?.publicMetadata?.preferences || []
  });

  const userRole = user?.publicMetadata?.role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Profile update functionality to be implemented:', formData);
    setEditing(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion functionality to be implemented');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Personal Info', icon: '👤' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-alex-brush text-5xl text-mystical-pink mb-4">
            Profile Settings
          </h1>
          <p className="font-playfair text-gray-300 text-lg">
            Manage your account settings and preferences
          </p>
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
        {activeTab === 'profile' && (
          <div className="card-mystical">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-alex-brush text-3xl text-mystical-pink">Personal Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="btn-mystical"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto border-4 border-mystical-pink mb-4 bg-gray-700 flex items-center justify-center">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                <button className="btn-mystical">
                  Change Photo
                </button>
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    userRole === 'admin' ? 'bg-mystical-gold text-black' :
                    userRole === 'reader' ? 'bg-purple-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {userRole || 'Client'}
                  </span>
                </div>
              </div>

              <div className="md:col-span-2">
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-playfair text-white text-sm font-medium mb-2 block">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="input-mystical w-full"
                        />
                      </div>
                      <div>
                        <label className="font-playfair text-white text-sm font-medium mb-2 block">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="input-mystical w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-playfair text-white text-sm font-medium mb-2 block">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                        className="input-mystical w-full"
                      />
                    </div>

                    <div>
                      <label className="font-playfair text-white text-sm font-medium mb-2 block">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="input-mystical w-full h-32"
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button type="submit" className="btn-mystical">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="bg-gray-700 text-white px-6 py-3 rounded font-playfair font-semibold hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-playfair text-mystical-pink text-lg font-semibold mb-2">
                          First Name
                        </h3>
                        <p className="font-playfair text-white">
                          {user?.firstName || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-playfair text-mystical-pink text-lg font-semibold mb-2">
                          Last Name
                        </h3>
                        <p className="font-playfair text-white">
                          {user?.lastName || 'Not set'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-playfair text-mystical-pink text-lg font-semibold mb-2">
                        Email
                      </h3>
                      <p className="font-playfair text-white">
                        {user?.emailAddresses?.[0]?.emailAddress}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-playfair text-mystical-pink text-lg font-semibold mb-2">
                        Account Type
                      </h3>
                      <p className="font-playfair text-white capitalize">
                        {userRole || 'Client'}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-playfair text-mystical-pink text-lg font-semibold mb-2">
                        Member Since
                      </h3>
                      <p className="font-playfair text-white">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>

                    {user?.publicMetadata?.bio && (
                      <div>
                        <h3 className="font-playfair text-mystical-pink text-lg font-semibold mb-2">
                          Bio
                        </h3>
                        <p className="font-playfair text-white">
                          {user.publicMetadata.bio}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="card-mystical">
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-8">Reading Preferences</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Preferred Reading Types</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Tarot', 'Astrology', 'Crystal Healing', 'Medium', 'Love & Relationships', 'Career Guidance'].map((type) => (
                    <label key={type} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="rounded border-mystical-pink text-mystical-pink focus:ring-mystical-pink" />
                      <span className="font-playfair text-white">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Communication Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="communication" value="video" className="text-mystical-pink focus:ring-mystical-pink" />
                    <span className="font-playfair text-white">Video calls preferred</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="communication" value="audio" className="text-mystical-pink focus:ring-mystical-pink" />
                    <span className="font-playfair text-white">Audio calls preferred</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="communication" value="chat" className="text-mystical-pink focus:ring-mystical-pink" />
                    <span className="font-playfair text-white">Text chat preferred</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Budget Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-mystical-pink text-mystical-pink focus:ring-mystical-pink" />
                    <span className="font-playfair text-white">Show readers within my budget only</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="font-playfair text-white">Max rate per minute:</label>
                    <select className="input-mystical">
                      <option>$2.00</option>
                      <option>$3.00</option>
                      <option>$4.00</option>
                      <option>$5.00+</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="btn-mystical">Save Preferences</button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card-mystical">
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-8">Security Settings</h2>
            
            <div className="space-y-8">
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Password</h3>
                <p className="font-playfair text-gray-300 mb-4">
                  Keep your account secure with a strong password.
                </p>
                <button className="btn-mystical">
                  Change Password
                </button>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Two-Factor Authentication</h3>
                <p className="font-playfair text-gray-300 mb-4">
                  Add an extra layer of security to your account with 2FA.
                </p>
                <button className="btn-mystical">
                  Enable 2FA
                </button>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Login Sessions</h3>
                <p className="font-playfair text-gray-300 mb-4">
                  Manage your active login sessions across devices.
                </p>
                <button className="bg-gray-700 text-white px-6 py-3 rounded font-playfair font-semibold hover:bg-gray-600 transition-colors">
                  View Active Sessions
                </button>
              </div>

              <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-6">
                <h3 className="font-playfair text-xl text-red-400 font-semibold mb-4">Danger Zone</h3>
                <p className="font-playfair text-gray-300 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-6 py-3 rounded font-playfair font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card-mystical">
            <h2 className="font-alex-brush text-3xl text-mystical-pink mb-8">Notification Settings</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-playfair text-white">Reading confirmations</span>
                    <input type="checkbox" className="rounded border-mystical-pink text-mystical-pink focus:ring-mystical-pink" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-playfair text-white">Favorite reader online alerts</span>
                    <input type="checkbox" className="rounded border-mystical-pink text-mystical-pink focus:ring-mystical-pink" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-playfair text-white">New message notifications</span>
                    <input type="checkbox" className="rounded border-mystical-pink text-mystical-pink focus:ring-mystical-pink" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-playfair text-white">Weekly newsletter</span>
                    <input type="checkbox" className="rounded border-mystical-pink text-mystical-pink focus:ring-mystical-pink" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-playfair text-white">Promotional offers</span>
                    <input type="checkbox" className="rounded border-mystical-pink text-mystical-pink focus:ring-mystical-pink" />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Browser Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-playfair text-white">New messages</span>
                    <input type="checkbox" className="rounded border-mystical-pink text-mystical-pink focus:ring-mystical-pink" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-playfair text-white">Reading reminders</span>
                    <input type="checkbox" className="rounded border-mystical-pink text-mystical-pink focus:ring-mystical-pink" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-playfair text-white">Live stream alerts</span>
                    <input type="checkbox" className="rounded border-mystical-pink text-mystical-pink focus:ring-mystical-pink" />
                  </label>
                </div>
              </div>

              <button className="btn-mystical">Save Notification Settings</button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card-mystical mt-8">
          <h2 className="font-alex-brush text-3xl text-mystical-pink mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              className="btn-mystical"
              onClick={() => navigate('/readers')}
            >
              Find a Reader
            </button>
            <button
              className="btn-mystical"
              onClick={() => navigate('/shop')}
            >
              Browse Shop
            </button>
            <button
              className="btn-mystical"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
