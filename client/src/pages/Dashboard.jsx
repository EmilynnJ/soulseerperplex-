import React from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useUser } from '@clerk/clerk-react';
import { useClerkUserRole } from '../hooks/useClerkUserRole';
import AdminDashboard from './dashboard/admin';
import ReaderDashboard from './dashboard/reader';
import ClientDashboard from './dashboard/client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { role, isLoading: isRoleLoading } = useClerkUserRole();

  if (!isUserLoaded || isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    toast.error("User not found. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // Render the specific dashboard based on the role
  // Pass the user object as a prop to the specific dashboards
  if (role === 'admin') {
    return <AdminDashboard user={user} />;
  }

  if (role === 'reader') {
    return <ReaderDashboard user={user} />;
  }

  if (role === 'client') {
    return <ClientDashboard user={user} />;
  }

  // Fallback if role is not defined or recognized
  // This could redirect to a generic page or show an error
  // For now, redirecting to home or an unauthorized page might be suitable.
  // Or, if a user *should* have a role, this indicates an issue.
  console.warn(`User ${user.id} has an unrecognized or missing role: ${role}.`);
  toast.warn("Your user role is not recognized. Please contact support.");
  return <Navigate to="/unauthorized" replace />;
  // Consider creating an Unauthorized.jsx page if it doesn't exist
  // or redirect to home: return <Navigate to="/" replace />;
};

export default Dashboard;
