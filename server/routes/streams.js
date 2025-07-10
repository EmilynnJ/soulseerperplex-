const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');

// Get live streams (active sessions)
router.get('/live', async (req, res) => {
  try {
    // Query for active sessions
    const liveSessions = await Session.find({
      status: 'active'
    })
    .populate('readerId', 'profile.name profile.avatar profile.specialties profile.rating')
    .populate('clientId', 'profile.name')
    .select('sessionType startTime sessionId')
    .sort({ startTime: -1 })
    .limit(20);

    // Format the response
    const streams = liveSessions.map(session => ({
      id: session._id,
      sessionId: session.sessionId,
      title: `Live Reading with ${session.readerId?.profile?.name || 'Anonymous Reader'}`,
      reader: {
        id: session.readerId?._id,
        name: session.readerId?.profile?.name || 'Anonymous Reader',
        avatar: session.readerId?.profile?.avatar,
        specialties: session.readerId?.profile?.specialties || [],
        rating: session.readerId?.profile?.rating || 0
      },
      sessionType: session.sessionType,
      startTime: session.startTime,
      client: {
        name: session.clientId?.profile?.name || 'Anonymous'
      }
    }));

    res.json(streams);

  } catch (error) {
    console.error('Get live streams error:', error);
    res.status(500).json({ 
      message: 'Server error fetching live streams',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
