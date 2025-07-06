import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ProtectedRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReadingRoom from './pages/ReadingRoom';
import ReadersPage from './pages/ReadersPage';
import LiveStream from './pages/LiveStream';
import Shop from './pages/Shop';
import Community from './pages/Community';
import Messages from './pages/Messages';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import HelpCenter from './pages/HelpCenter';
import Policies from './pages/Policies';
import Unauthorized from './pages/Unauthorized';
import LoadingSpinner from './components/LoadingSpinner';
// Role-specific dashboard pages
import AdminDashboard from './pages/dashboard/admin';
import ReaderDashboard from './pages/dashboard/reader';
import ClientDashboard from './pages/dashboard/client';

// Component to handle role-based redirects after login
const RoleBasedRedirect = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  
  if (!isLoaded) {
    return <LoadingSpinner />;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  const role = user?.publicMetadata?.role;
  
  if (role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  } else if (role === 'reader') {
    return <Navigate to="/dashboard/reader" replace />;
  } else if (role === 'client') {
    return <Navigate to="/dashboard/client" replace />;
  } else {
    // If no role is set, default to client dashboard
    return <Navigate to="/dashboard/client" replace />;
  }
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-cosmic">
        <Header />
        <main className="flex-1">
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/readers" element={<ReadersPage />} />
          <Route path="/livestream" element={<LiveStream />} />
          <Route path="/live/:streamId?" element={<LiveStream />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/community" element={<Community />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Role-based redirect after login */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />

          {/* Protected routes - authenticated users only */}
          <Route
            path="/reading/:sessionId"
            element={
              <ProtectedRoute allowedRoles={['admin', 'reader', 'client']}>
                <ReadingRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={['admin', 'reader', 'client']}>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['admin', 'reader', 'client']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Role-specific dashboard routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reader"
            element={
              <ProtectedRoute allowedRoles={['reader']}>
                <ReaderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
