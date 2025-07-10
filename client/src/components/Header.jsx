import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Readers', path: '/readers' },
    { name: 'Live', path: '/livestream' },
    { name: 'Shop', path: '/shop' },
    { name: 'Community', path: '/community' },
    { name: 'Messages', path: '/messages' }
  ];

  const handleLogout = async () => {
    await signOut();
  };

  const userRole = user?.publicMetadata?.role;

  return (
    <header className="bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg border-b border-pink-500 border-opacity-20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="font-alex-brush text-4xl text-mystical-pink">
              SoulSeer
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-playfair transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-mystical-pink'
                    : 'text-white hover:text-mystical-pink'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoaded && isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="font-playfair text-white hover:text-mystical-pink transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="font-playfair text-white hover:text-mystical-pink transition-colors"
                >
                  Profile
                </Link>
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="font-playfair text-mystical-gold hover:text-yellow-300 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-mystical"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="font-playfair text-white hover:text-mystical-pink transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-mystical"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-mystical-pink transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-90 border-t border-pink-500 border-opacity-20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 font-playfair ${
                  isActive(item.path)
                    ? 'text-mystical-pink'
                    : 'text-white hover:text-mystical-pink'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isLoaded && isSignedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 font-playfair text-white hover:text-mystical-pink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 font-playfair text-white hover:text-mystical-pink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 font-playfair text-mystical-gold hover:text-yellow-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 font-playfair text-white hover:text-mystical-pink"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 font-playfair text-white hover:text-mystical-pink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 font-playfair text-white hover:text-mystical-pink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
