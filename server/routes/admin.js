const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Session = require('../models/Session');
const Transaction = require('../models/Transaction');
const Message = require('../models/Message');
const Product = require('../models/Product'); // Import Product model
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { validateUserRegistration, validateProfileUpdate } = require('../middleware/validation');

const router = express.Router();

// All admin routes require admin authentication
router.use(authMiddleware, requireAdmin);

// Get all readers
router.get('/readers', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { role: 'reader' };
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'online') {
      query['readerSettings.isOnline'] = true;
      query.isActive = true;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const readers = await User.find(query)
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await User.countDocuments(query);

    // Get additional stats for each reader
    const readersWithStats = await Promise.all(readers.map(async (reader) => {
      const sessionStats = await Session.aggregate([
        { $match: { readerId: reader._id } },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            totalEarnings: { $sum: '$readerEarnings' },
            averageRating: { $avg: '$rating' }
          }
        }
      ]);

      const stats = sessionStats[0] || {
        totalSessions: 0,
        totalEarnings: 0,
        averageRating: 0
      };

      return {
        ...reader,
        stats
      };
    }));

    res.json({
      success: true,
      readers: readersWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReaders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Admin get readers error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve readers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create new reader account
router.post('/readers', validateUserRegistration, async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      bio, 
      specialties = [], 
      rates = { video: 3.99, audio: 2.99, chat: 1.99 }
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create reader account
    const reader = new User({
      email,
      password,
      role: 'reader',
      profile: {
        name: name || '',
        bio: bio || '',
        specialties: Array.isArray(specialties) ? specialties : []
      },
      readerSettings: {
        rates: {
          video: rates.video || 3.99,
          audio: rates.audio || 2.99,
          chat: rates.chat || 1.99
        },
        isOnline: false
      },
      isVerified: true // Admin-created accounts are pre-verified
    });

    await reader.save();

    res.status(201).json({
      success: true,
      message: 'Reader account created successfully',
      reader: {
        id: reader._id,
        email: reader.email,
        profile: reader.profile,
        readerSettings: reader.readerSettings,
        createdAt: reader.createdAt
      }
    });

  } catch (error) {
    console.error('Admin create reader error:', error);
    res.status(500).json({ 
      message: 'Failed to create reader account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update reader account
router.patch('/readers/:readerId', async (req, res) => {
  try {
    const { readerId } = req.params;
    const updates = req.body;

    const reader = await User.findOne({ _id: readerId, role: 'reader' });
    if (!reader) {
      return res.status(404).json({ message: 'Reader not found' });
    }

    // Build update object
    const updateObj = {};
    
    if (updates.isActive !== undefined) {
      updateObj.isActive = updates.isActive;
    }
    
    if (updates.isVerified !== undefined) {
      updateObj.isVerified = updates.isVerified;
    }
    
    if (updates.profile) {
      if (updates.profile.name !== undefined) {
        updateObj['profile.name'] = updates.profile.name;
      }
      if (updates.profile.bio !== undefined) {
        updateObj['profile.bio'] = updates.profile.bio;
      }
      if (updates.profile.specialties !== undefined) {
        updateObj['profile.specialties'] = updates.profile.specialties;
      }
    }
    
    if (updates.readerSettings) {
      if (updates.readerSettings.rates) {
        updateObj['readerSettings.rates'] = updates.readerSettings.rates;
      }
      if (updates.readerSettings.isOnline !== undefined) {
        updateObj['readerSettings.isOnline'] = updates.readerSettings.isOnline;
      }
    }

    const updatedReader = await User.findByIdAndUpdate(
      readerId,
      { $set: updateObj },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Reader updated successfully',
      reader: updatedReader
    });

  } catch (error) {
    console.error('Admin update reader error:', error);
    res.status(500).json({ 
      message: 'Failed to update reader',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete reader account
router.delete('/readers/:readerId', async (req, res) => {
  try {
    const { readerId } = req.params;

    const reader = await User.findOne({ _id: readerId, role: 'reader' });
    if (!reader) {
      return res.status(404).json({ message: 'Reader not found' });
    }

    // Check for active sessions
    const activeSessions = await Session.countDocuments({
      readerId,
      status: { $in: ['pending', 'active'] }
    });

    if (activeSessions > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete reader with active sessions',
        activeSessions
      });
    }

    // Soft delete by deactivating
    reader.isActive = false;
    reader.readerSettings.isOnline = false;
    await reader.save();

    res.json({
      success: true,
      message: 'Reader account deactivated successfully'
    });

  } catch (error) {
    console.error('Admin delete reader error:', error);
    res.status(500).json({ 
      message: 'Failed to delete reader',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all sessions
router.get('/sessions', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status,
      sessionType,
      startDate,
      endDate,
      readerId,
      clientId
    } = req.query;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    if (sessionType) {
      query.sessionType = sessionType;
    }
    if (readerId) {
      query.readerId = readerId;
    }
    if (clientId) {
      query.clientId = clientId;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const sessions = await Session.find(query)
      .populate('clientId', 'email profile.name')
      .populate('readerId', 'email profile.name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Session.countDocuments(query);

    res.json({
      success: true,
      sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSessions: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Admin get sessions error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve sessions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all users (clients and readers)
router.get('/users', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role,
      status = 'all',
      search
    } = req.query;

    // Build query
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'profile.name': { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);

    // Get session statistics
    const sessionStats = await Session.getStatistics({
      createdAt: { $gte: startDate }
    });

    // Get transaction statistics
    const transactionStats = await Transaction.getStatistics({
      createdAt: { $gte: startDate },
      status: 'succeeded'
    });

    // Get recent activity
    const recentSessions = await Session.find({
      createdAt: { $gte: startDate }
    })
    .populate('clientId', 'email')
    .populate('readerId', 'email profile.name')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    // Format user stats
    const formattedUserStats = {
      clients: 0,
      readers: 0,
      admins: 0,
      activeClients: 0,
      activeReaders: 0,
      activeAdmins: 0
    };

    userStats.forEach(stat => {
      formattedUserStats[stat._id + 's'] = stat.count;
      formattedUserStats['active' + stat._id.charAt(0).toUpperCase() + stat._id.slice(1) + 's'] = stat.active;
    });

    res.json({
      success: true,
      period,
      stats: {
        users: formattedUserStats,
        sessions: sessionStats,
        transactions: transactionStats,
        recentActivity: recentSessions
      }
    });

  } catch (error) {
    console.error('Admin get stats error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get revenue analytics
router.get('/revenue', async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    let days = 30;
    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
    }

    const dailyRevenue = await Transaction.getDailyRevenue(days);

    // Calculate totals
    const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
    const totalTransactions = dailyRevenue.reduce((sum, day) => sum + day.transactions, 0);
    const averageDaily = totalRevenue / days;

    // Get platform fee (30% of total revenue)
    const platformRevenue = totalRevenue * 0.30;
    const readerPayouts = totalRevenue * 0.70;

    res.json({
      success: true,
      period,
      revenue: {
        total: totalRevenue,
        platform: platformRevenue,
        readerPayouts,
        averageDaily,
        totalTransactions,
        dailyBreakdown: dailyRevenue
      }
    });

  } catch (error) {
    console.error('Admin get revenue error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve revenue data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Manually process reader payouts
router.post('/payouts/process', async (req, res) => {
  try {
    const minimumPayout = 15.00;

    // Find readers with pending earnings >= minimum
    const eligibleReaders = await User.find({
      role: 'reader',
      'earnings.pending': { $gte: minimumPayout },
      stripeAccountId: { $exists: true, $ne: null }
    });

    const results = [];

    for (const reader of eligibleReaders) {
      try {
        // Process payout logic would go here
        // For now, just simulate the payout
        
        const payoutAmount = reader.earnings.pending;
        
        // Update reader earnings
        reader.earnings.pending = 0;
        reader.earnings.paid += payoutAmount;
        reader.earnings.lastPayout = new Date();
        await reader.save();

        // Create transaction record
        const transaction = new Transaction({
          userId: reader._id,
          type: 'payout',
          amount: payoutAmount,
          status: 'succeeded',
          description: `Automatic payout - $${payoutAmount.toFixed(2)}`,
          metadata: {
            automaticPayout: true
          }
        });
        await transaction.save();

        results.push({
          readerId: reader._id,
          email: reader.email,
          amount: payoutAmount,
          status: 'success'
        });

      } catch (error) {
        results.push({
          readerId: reader._id,
          email: reader.email,
          amount: reader.earnings.pending,
          status: 'failed',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Processed ${results.filter(r => r.status === 'success').length} payouts`,
      results
    });

  } catch (error) {
    console.error('Admin process payouts error:', error);
    res.status(500).json({ 
      message: 'Failed to process payouts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user account (admin override)
router.patch('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build update object
    const updateObj = {};
    
    if (updates.isActive !== undefined) {
      updateObj.isActive = updates.isActive;
    }
    
    if (updates.isVerified !== undefined) {
      updateObj.isVerified = updates.isVerified;
    }
    
    if (updates.balance !== undefined && user.role === 'client') {
      updateObj.balance = updates.balance;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateObj },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ 
      message: 'Failed to update user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Sync Stripe products and prices with local database
router.post('/products/sync', async (req, res) => {
  try {
    // Fetch all products from Stripe
    const stripeProducts = await stripe.products.list({ limit: 100, active: true });
    const stripePrices = await stripe.prices.list({ limit: 100, active: true });

    const productsToUpdate = [];
    const productMap = new Map(); // To store products by ID for efficient lookup

    for (const sp of stripeProducts.data) {
      const productData = {
        stripeProductId: sp.id,
        name: sp.name,
        description: sp.description,
        images: sp.images,
        active: sp.active,
        metadata: sp.metadata,
        prices: [],
      };
      productsToUpdate.push(productData);
      productMap.set(sp.id, productData);
    }

    for (const price of stripePrices.data) {
      const product = productMap.get(price.product);
      if (product) {
        product.prices.push({
          stripePriceId: price.id,
          unitAmount: price.unit_amount,
          currency: price.currency,
          recurring: price.recurring,
          type: price.type,
          active: price.active,
        });
      }
    }

    // Update or insert products in the database
    for (const productData of productsToUpdate) {
      await Product.findOneAndUpdate(
        { stripeProductId: productData.stripeProductId },
        productData,
        { upsert: true, new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Stripe products and prices synced successfully',
      syncedCount: productsToUpdate.length,
    });

  } catch (error) {
    console.error('Admin product sync error:', error);
    res.status(500).json({
      message: 'Failed to sync products from Stripe',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
