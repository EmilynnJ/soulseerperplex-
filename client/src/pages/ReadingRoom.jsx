import React from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useWebRTC } from '../hooks/useWebRTC';
import VideoCall from '../components/VideoCall';
import ChatBox from '../components/ChatBox';
import SessionTimer from '../components/SessionTimer';
import BalanceIndicator from '../components/BalanceIndicator';
import LoadingSpinner from '../components/LoadingSpinner';

const ReadingRoom = () => {
  const { sessionId } = useParams();
  const { user } = useUser();
  
  const {
    localStream,
    remoteStream,
    messages,
    connectionStatus,
    sessionTime,
    balance,
    sendMessage,
    toggleVideo,
    toggleAudio,
    endSession
  } = useWebRTC(sessionId, user?.role, 3.99); // Default rate

  if (connectionStatus === 'connecting') {
    return <LoadingSpinner text="Connecting to your reading..." />;
  }

  if (connectionStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-mystical text-center max-w-md">
          <h2 className="font-alex-brush text-3xl text-mystical-pink mb-4">
            Connection Failed
          </h2>
          <p className="font-playfair text-white mb-6">
            We couldn't establish a connection. Please try again.
          </p>
          <button 
            className="btn-mystical"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'ended') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-mystical text-center max-w-md">
          <h2 className="font-alex-brush text-3xl text-mystical-pink mb-4">
            Session Ended
          </h2>
          <p className="font-playfair text-white mb-6">
            Thank you for using SoulSeer. We hope your reading was helpful.
          </p>
          <button 
            className="btn-mystical"
            onClick={() => window.location.href = '/dashboard'}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Call Area */}
          <div className="lg:col-span-3">
            <div className="card-mystical">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-alex-brush text-3xl text-mystical-pink">
                  Live Reading Session
                </h2>
                <div className={`px-3 py-1 rounded-full text-sm font-playfair ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500' 
                    : 'bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500'
                }`}>
                  {connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}
                </div>
              </div>
              
              <VideoCall
                localStream={localStream}
                remoteStream={remoteStream}
                onToggleVideo={toggleVideo}
                onToggleAudio={toggleAudio}
                onEndCall={endSession}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Timer */}
            <SessionTimer 
              sessionTime={sessionTime}
              readerRate={3.99}
            />
            
            {/* Balance Indicator */}
            {user?.role === 'client' && (
              <BalanceIndicator 
                balance={balance}
                readerRate={3.99}
              />
            )}
            
            {/* Chat */}
            <ChatBox
              messages={messages}
              onSendMessage={sendMessage}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingRoom;
