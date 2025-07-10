const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes from server directory (more comprehensive implementations)
const authRoutes = require('../../server/routes/auth');
const userRoutes = require('../../server/routes/users');
const sessionRoutes = require('../../server/routes/sessions');
const stripeRoutes = require('../../server/routes/stripe');
const messageRoutes = require('../../server/routes/messages');
const adminRoutes = require('../../server/routes/admin');
const productRoutes = require('../../server/routes/products');
const streamsRoutes = require('../../server/routes/streams');

// Import middleware from server directory
const { authMiddleware } = require('../../server/middleware/auth');

// Initialize Express
const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - using path relative to /.netlify/functions/api
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/stripe', stripeRoutes);
app.use('/messages', messageRoutes);
app.use('/admin', adminRoutes);
app.use('/products', productRoutes);
app.use('/streams', streamsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Export the serverless handler
module.exports.handler = serverless(app);
