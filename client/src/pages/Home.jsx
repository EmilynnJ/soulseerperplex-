import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import ReaderCard from '../components/ReaderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { clientAPI } from '../utils/api';

const Home = () => {
  const [readers, setReaders] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [products, setProducts] = useState([]);          // Added products state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch readers using the API service
      const readersRes = await clientAPI.getReaders();
      setReaders(readersRes.data.readers || readersRes.data || []);
      
      // For now, set empty arrays for streams and products since these endpoints don't exist
      // TODO: Implement these endpoints in the server
      setLiveStreams([]);
      setProducts([]);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
      // Set empty arrays on error to prevent UI issues
      setReaders([]);
      setLiveStreams([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectReader = async (readerId, sessionType) => {
    try {
      const response = await clientAPI.requestSession({
        readerId,
        sessionType
      });
      
      navigate(`/reading/${response.data.sessionId}`);
    } catch (error) {
      console.error('Failed to connect to reader:', error);
      alert('Failed to connect to reader. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading readers..." />;
  }

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* 1. Online Readers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-alex-brush text-4xl text-mystical-pink text-center mb-12">
            Online Readers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(readers) && readers.filter(reader => reader.isOnline).map((reader) => (
              <ReaderCard
                key={reader.id}
                reader={reader}
                onConnect={handleConnectReader}
              />
            ))}
          </div>
          
          {Array.isArray(readers) && readers.filter(reader => reader.isOnline).length === 0 && (
            <div className="text-center py-12">
              <p className="font-playfair text-gray-300 text-lg">
                No readers are currently online. Check back soon!
              </p>
              <button
                className="btn-mystical mt-4"
                onClick={() => navigate('/readers')}
              >
                Browse All Readers
              </button>
            </div>
          )}
          
          <div className="text-center mt-8">
            <button
              className="btn-mystical"
              onClick={() => navigate('/readers')}
            >
              View All Readers
            </button>
          </div>
        </div>
      </section>
      
      {/* 2. Live Streams */}
      <section className="py-16 bg-black bg-opacity-30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-alex-brush text-4xl text-mystical-pink text-center mb-12">
            Live Streams
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(liveStreams) && liveStreams.map((stream) => (
              <div key={stream.id} className="card-mystical cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
                   onClick={() => navigate(`/livestream`)}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-playfair text-xl text-white font-semibold">
                    {stream.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-playfair text-red-400 text-sm">LIVE</span>
                  </div>
                </div>
                
                <p className="font-playfair text-gray-300 mb-4">
                  {stream.readerName}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="font-playfair text-mystical-gold">
                    {stream.viewers} viewers
                  </span>
                  <button className="btn-mystical">
                    Join Stream
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {Array.isArray(liveStreams) && liveStreams.length === 0 && (
            <div className="text-center py-12">
              <p className="font-playfair text-gray-300 text-lg">
                No live streams at the moment. Check back soon!
              </p>
              <button
                className="btn-mystical mt-4"
                onClick={() => navigate('/livestream')}
              >
                View Live Streams
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-alex-brush text-4xl text-mystical-pink text-center mb-12">
            Featured Products
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.isArray(products) && products.filter(product => product.featured).map((product) => (
              <div key={product.id} className="card-mystical text-center">
                <div className="w-16 h-16 bg-mystical-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">{product.image || '✨'}</span> {/* Fallback image */}
                </div>
                <h3 className="font-playfair text-xl text-white font-semibold mb-2">{product.name}</h3>
                <p className="font-playfair text-gray-300 text-sm mb-4">{product.description}</p>
                <span className="font-playfair text-mystical-gold font-semibold">${product.price?.toFixed(2) || '0.00'}</span>
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
      </section>

      {/* 4. Community Highlights */}
      <section className="py-16 bg-black bg-opacity-30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-alex-brush text-4xl text-mystical-pink text-center mb-12">
            Community Highlights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-mystical">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">D</span>
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-white font-semibold">Join Our Discord</h3>
                  <p className="font-playfair text-gray-300 text-sm">Connect with fellow seekers</p>
                </div>
              </div>
              <p className="font-playfair text-gray-300 mb-4">
                Join our vibrant community of spiritual seekers and psychic readers. Share experiences, ask questions, and connect with like-minded souls.
              </p>
              <button
                className="btn-mystical"
                onClick={() => navigate('/community')}
              >
                Join Discord
              </button>
            </div>
            
            <div className="card-mystical">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">P</span>
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-white font-semibold">Support on Patreon</h3>
                  <p className="font-playfair text-gray-300 text-sm">Exclusive content & perks</p>
                </div>
              </div>
              <p className="font-playfair text-gray-300 mb-4">
                Support SoulSeer and get exclusive access to premium content, early reader access, and special community events.
              </p>
              <button
                className="btn-mystical"
                onClick={() => navigate('/community')}
              >
                Join Patreon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Newsletter Sign-up */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-alex-brush text-4xl text-mystical-pink mb-6">
            Stay Connected
          </h2>
          <p className="font-playfair text-lg text-gray-300 mb-8">
            Join our newsletter for spiritual insights, reader spotlights, and exclusive offers
          </p>
          
          <div className="card-mystical max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-mystical flex-1"
              />
              <button className="btn-mystical">
                Subscribe
              </button>
            </div>
            <p className="font-playfair text-gray-400 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
