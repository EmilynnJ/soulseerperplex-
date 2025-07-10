import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
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
// Main Dashboard Router
import Dashboard from './pages/Dashboard';
// Individual dashboard components are imported within Dashboard.jsx

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
          <Route path="/login/*" element={<Login />} />
          <Route path="/signup/*" element={<Signup />} />
          <Route path="/readers" element={<ReadersPage />} />
          <Route path="/livestream" element={<LiveStream />} />
          <Route path="/live/:streamId?" element={<LiveStream />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/community" element={<Community />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes - authenticated users only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'reader', 'client']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
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

          {/* Admin-only routes */}
          {/* Specific dashboard routes like /dashboard/admin can be removed if
              all access is intended to go through the main /dashboard route.
              If direct access to e.g. /dashboard/admin is still desired and should be protected,
              these routes can remain. For this fix, we assume /dashboard is the primary entry.
              If these are kept, ensure AdminDashboard, ReaderDashboard, ClientDashboard are imported.
              However, to ensure our new Dashboard.jsx is the one handling logic, we'll comment them out for now.
          */}
          {/*
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
          */}
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
