const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  stripeProductId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
  },
  prices: [
    {
      stripePriceId: {
        type: String,
        required: true,
        unique: true,
      },
      unitAmount: {
        type: Number, // Amount in cents
        required: true,
      },
      currency: {
        type: String,
        required: true,
        default: 'usd',
      },
      recurring: {
        interval: String,
        intervalCount: Number,
      },
      type: {
        type: String, // 'one_time' or 'recurring'
        enum: ['one_time', 'recurring'],
        required: true,
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
  ],
  metadata: {
    type: Map,
    of: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
