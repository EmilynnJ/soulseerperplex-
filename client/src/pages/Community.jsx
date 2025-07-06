import React from 'react';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const navigate = useNavigate();

  const handleDiscordJoin = () => {
    window.open('https://discord.gg/your-server-invite', '_blank');
  };

  const handlePatreonJoin = () => {
    window.open('https://www.patreon.com/your-patreon-page', '_blank');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-alex-brush text-6xl text-mystical-pink mb-4">
            SoulSeer Community
          </h1>
          <p className="font-playfair text-xl text-gray-300 max-w-3xl mx-auto">
            Join our vibrant community of spiritual seekers, psychic readers, and mystic enthusiasts
          </p>
        </div>

        {/* Main Community Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Discord Card */}
          <div className="card-mystical">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.174.372.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
                </svg>
              </div>
              <div>
                <h2 className="font-alex-brush text-3xl text-mystical-pink">Join Our Discord</h2>
                <p className="font-playfair text-gray-300">Connect with fellow seekers in real-time</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-playfair text-white">2,847 active members</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-mystical-pink rounded-full"></div>
                <span className="font-playfair text-white">24/7 spiritual discussions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-mystical-gold rounded-full"></div>
                <span className="font-playfair text-white">Daily oracle card pulls</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="font-playfair text-white">Weekly group meditations</span>
              </div>
            </div>

            <p className="font-playfair text-gray-300 mb-6">
              Join our Discord community to connect with like-minded souls, participate in group readings,
              share your spiritual experiences, and get support on your journey. Our moderators include
              certified psychic readers who offer guidance and wisdom.
            </p>

            <button
              className="btn-mystical w-full"
              onClick={handleDiscordJoin}
            >
              Join Discord Server
            </button>
          </div>

          {/* Patreon Card */}
          <div className="card-mystical">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 .48v23.04h4.22V.48zm15.385 0c-4.764 0-8.641 3.88-8.641 8.65 0 4.755 3.877 8.623 8.641 8.623 4.75 0 8.615-3.868 8.615-8.623C24 4.36 20.136.48 15.385.48z"/>
                </svg>
              </div>
              <div>
                <h2 className="font-alex-brush text-3xl text-mystical-pink">Support on Patreon</h2>
                <p className="font-playfair text-gray-300">Exclusive content & premium perks</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                <h3 className="font-playfair text-lg text-mystical-gold font-semibold mb-2">Supporter ($5/month)</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Exclusive monthly horoscope</li>
                  <li>• Discord supporter badge</li>
                  <li>• Early access to new features</li>
                </ul>
              </div>
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                <h3 className="font-playfair text-lg text-mystical-gold font-semibold mb-2">Mystic ($15/month)</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Everything in Supporter tier</li>
                  <li>• Monthly group reading session</li>
                  <li>• Exclusive meditation recordings</li>
                </ul>
              </div>
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                <h3 className="font-playfair text-lg text-mystical-gold font-semibold mb-2">Oracle ($30/month)</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Everything in previous tiers</li>
                  <li>• Monthly 1-on-1 with top readers</li>
                  <li>• Exclusive spiritual courses</li>
                </ul>
              </div>
            </div>

            <button
              className="btn-mystical w-full"
              onClick={handlePatreonJoin}
            >
              Become a Patron
            </button>
          </div>
        </div>

        {/* Community Features */}
        <section className="mb-16">
          <h2 className="font-alex-brush text-4xl text-mystical-pink text-center mb-12">
            Community Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-mystical text-center">
              <div className="w-16 h-16 bg-mystical-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌙</span>
              </div>
              <h3 className="font-playfair text-xl text-white font-semibold mb-3">Moon Circle Gatherings</h3>
              <p className="font-playfair text-gray-300 text-sm">
                Join our monthly new moon and full moon virtual gatherings for intention setting and release ceremonies.
              </p>
            </div>

            <div className="card-mystical text-center">
              <div className="w-16 h-16 bg-mystical-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
              <h3 className="font-playfair text-xl text-white font-semibold mb-3">Study Groups</h3>
              <p className="font-playfair text-gray-300 text-sm">
                Participate in guided study groups covering tarot, astrology, crystal healing, and other mystical arts.
              </p>
            </div>

            <div className="card-mystical text-center">
              <div className="w-16 h-16 bg-mystical-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-playfair text-xl text-white font-semibold mb-3">Reader Spotlights</h3>
              <p className="font-playfair text-gray-300 text-sm">
                Get to know our talented readers through weekly spotlights, Q&As, and behind-the-scenes content.
              </p>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="mb-16">
          <div className="card-mystical">
            <h2 className="font-alex-brush text-4xl text-mystical-pink text-center mb-8">
              Community Guidelines
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Our Values</h3>
                <ul className="space-y-3 font-playfair text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-mystical-pink mt-1">•</span>
                    <span>Respect and kindness towards all members</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-mystical-pink mt-1">•</span>
                    <span>Open-minded spiritual discussions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-mystical-pink mt-1">•</span>
                    <span>Support for all spiritual paths and beliefs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-mystical-pink mt-1">•</span>
                    <span>Constructive feedback and encouragement</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-4">Community Rules</h3>
                <ul className="space-y-3 font-playfair text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-mystical-gold mt-1">•</span>
                    <span>No spam or self-promotion without permission</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-mystical-gold mt-1">•</span>
                    <span>Keep discussions spiritual and relevant</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-mystical-gold mt-1">•</span>
                    <span>No solicitation of free readings</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-mystical-gold mt-1">•</span>
                    <span>Respect privacy and confidentiality</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="card-mystical text-center">
          <h2 className="font-alex-brush text-4xl text-mystical-pink mb-4">
            Ready to Connect?
          </h2>
          <p className="font-playfair text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether you're just starting your spiritual journey or you're a seasoned practitioner,
            our community welcomes you with open arms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="btn-mystical"
              onClick={() => navigate('/readers')}
            >
              Browse Readers
            </button>
            <button
              className="bg-gray-700 text-white px-6 py-3 rounded font-playfair font-semibold hover:bg-gray-600 transition-colors"
              onClick={() => navigate('/signup')}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
