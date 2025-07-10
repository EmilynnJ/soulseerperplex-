import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ReaderCard from '../components/ReaderCard';
import { clientAPI } from '../utils/api';

const ReadersPage = () => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllReaders();
  }, []);

  const fetchAllReaders = async () => {
    try {
      const response = await clientAPI.getReaders();
      setReaders(response.data.readers || response.data || []);
    } catch (error) {
      console.error('Failed to fetch readers:', error);
      setReaders([]);
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
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-alex-brush text-6xl text-mystical-pink mb-4">
            Our Gifted Readers
          </h1>
          <p className="font-playfair text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with experienced psychics and spiritual guides for personalized readings and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(readers) && readers.length > 0 ? (
            readers.map((reader) => (
              <ReaderCard
                key={reader.id}
                reader={reader}
                onConnect={handleConnectReader}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="font-playfair text-gray-300 text-lg">
                No readers found at the moment. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadersPage;
