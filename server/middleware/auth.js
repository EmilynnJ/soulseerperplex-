const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to handle Clerk token authentication
const handleClerkAuth = async (token) => {
  try {
    if (!token.startsWith('eyJ')) {
      return null;
    }

    const clerkPayload = jwt.decode(token, { complete: true });
    const { sub: clerkUserId, email, given_name, name } = clerkPayload?.payload || {};
    
    if (!clerkUserId) {
      return null;
    }

    // Find or create user based on Clerk user ID
    let user = await User.findOne({ clerkUserId });
    
    if (!user) {
      // Create a new user record for this Clerk user
      user = new User({
        clerkUserId,
        email: email || `user-${clerkUserId}@clerk.local`,
        role: 'admin', // Default to admin for now - you may want to change this
        isActive: true,
        isVerified: true,
        profile: {
          name: given_name || name || 'Admin User'
        }
      });
      await user.save();
    }
    
    return {
      user,
      userInfo: {
        userId: user._id,
        email: user.email,
        role: user.role,
        clerkUserId: user.clerkUserId
      }
    };
  } catch (error) {
    console.log('Clerk authentication error:', error.message);
    return null;
  }
};

// Helper function to handle custom JWT authentication
const handleCustomJWT = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // Find user and check if still active
  const user = await User.findById(decoded.userId).select('-password');
  
  if (!user) {
    throw new Error('Token is not valid - user not found');
  }

  if (!user.isActive) {
    throw new Error('Account has been deactivated');
  }

  // Update last seen
  user.lastSeen = new Date();
  await user.save();

  return {
    user,
    userInfo: {
      userId: user._id,
      email: user.email,
      role: user.role
    }
  };
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Try Clerk authentication first (returns null on failure)
    let authResult = await handleClerkAuth(token);
    
    // If Clerk auth failed, try custom JWT
    if (!authResult) {
      authResult = await handleCustomJWT(token);
    }
    
    req.user = authResult.userInfo;
    req.userDoc = authResult.user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    return res.status(500).json({ message: 'Server error in authentication' });
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    next();
  };
};

// Admin only middleware
const requireAdmin = requireRole('admin');

// Reader only middleware
const requireReader = requireRole('reader');

// Client only middleware
const requireClient = requireRole('client');

// Reader or Admin middleware
const requireReaderOrAdmin = requireRole(['reader', 'admin']);

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role
      };
      req.userDoc = user;
    }
    
    next();
  } catch (error) {
    // Log the error for debugging but continue without auth
    console.log('Optional auth failed:', error.message);
    next();
  }
};

// Rate limiting middleware for sensitive operations
const rateLimitSensitive = (req, res, next) => {
  // This would typically use Redis or similar for production
  // For now, we'll implement a simple in-memory rate limiter
  
  const key = req.ip + ':' + req.path;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }

  const attempts = global.rateLimitStore.get(key) || [];
  const recentAttempts = attempts.filter(time => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({
      message: 'Too many attempts. Please try again later.',
      retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
    });
  }

  recentAttempts.push(now);
  global.rateLimitStore.set(key, recentAttempts);

  next();
};

module.exports = {
  authMiddleware,
  requireRole,
  requireAdmin,
  requireReader,
  requireClient,
  requireReaderOrAdmin,
  optionalAuth,
  rateLimitSensitive
};
