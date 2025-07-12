const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
  exchangeType: {
    type: String,
    enum: ['swap', 'points'],
    required: true
  },
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  initiatorItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  recipientItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  pointsAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Update the updatedAt field before saving
exchangeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Exchange', exchangeSchema); 