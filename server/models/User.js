const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false, // Not required for Clerk users
    minlength: 6
  },
  clerkUserId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values but ensures uniqueness when present
    default: null
  },
  role: {
    type: String,
    enum: ['client', 'reader', 'admin'],
    default: 'client'
  },
  profile: {
    name: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: 1000
    },
    specialties: [{
      type: String,
      trim: true
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    totalRating: {
      type: Number,
      default: 0
    }
  },
  readerSettings: {
    isOnline: {
      type: Boolean,
      default: false
    },
    rates: {
      video: {
        type: Number,
        default: 3.99,
        min: 0.50,
        max: 50.00
      },
      audio: {
        type: Number,
        default: 2.99,
        min: 0.50,
        max: 50.00
      },
      chat: {
        type: Number,
        default: 1.99,
        min: 0.50,
        max: 50.00
      }
    },
    availability: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      startTime: String,
      endTime: String,
      timezone: {
        type: String,
        default: 'UTC'
      }
    }],
    autoAcceptSessions: {
      type: Boolean,
      default: false
    }
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    paid: {
      type: Number,
      default: 0
    },
    lastPayout: {
      type: Date,
      default: null
    }
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeAccountId: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      showOnlineStatus: {
        type: Boolean,
        default: true
      },
      allowDirectMessages: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'readerSettings.isOnline': 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ clerkUserId: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Skip password hashing for Clerk users or if password isn't modified
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update rating method
userSchema.methods.updateRating = function(newRating) {
  this.profile.totalRating += newRating;
  this.profile.totalReviews += 1;
  this.profile.rating = this.profile.totalRating / this.profile.totalReviews;
  return this.save();
};

// Get public profile method
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.stripeCustomerId;
  delete user.stripeAccountId;
  delete user.earnings;
  delete user.balance;
  return user;
};

// Virtual for reader display info
userSchema.virtual('readerInfo').get(function() {
  if (this.role !== 'reader') {
    return null;
  }
  
  return {
    id: this._id,
    name: this.profile.name,
    avatar: this.profile.avatar,
    bio: this.profile.bio,
    specialties: this.profile.specialties,
    rating: this.profile.rating,
    totalReviews: this.profile.totalReviews,
    isOnline: this.readerSettings.isOnline,
    rates: this.readerSettings.rates
  };
});

module.exports = mongoose.model('User', userSchema);
