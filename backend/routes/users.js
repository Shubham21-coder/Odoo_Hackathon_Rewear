const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const Exchange = require('../models/Exchange');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's items
router.get('/:id/items', async (req, res) => {
  try {
    const items = await Item.find({ 
      owner: req.params.id, 
      isApproved: true, 
      isAvailable: true 
    }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's exchanges (as initiator or recipient)
router.get('/exchanges', auth, async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [
        { initiator: req.user._id },
        { recipient: req.user._id }
      ]
    })
    .populate('initiator', 'username firstName lastName')
    .populate('recipient', 'username firstName lastName')
    .populate('initiatorItem')
    .populate('recipientItem')
    .sort({ createdAt: -1 });

    res.json(exchanges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Respond to exchange (accept/reject)
router.put('/exchanges/:id/respond', auth, async (req, res) => {
  try {
    const { status, message } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    if (exchange.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (exchange.status !== 'pending') {
      return res.status(400).json({ message: 'Exchange already processed' });
    }

    exchange.status = status;
    if (message) exchange.message = message;

    if (status === 'accepted') {
      // Handle points transfer for points-based exchanges
      if (exchange.exchangeType === 'points') {
        const initiator = await User.findById(exchange.initiator);
        const recipient = await User.findById(exchange.recipient);
        
        if (initiator.points < exchange.pointsAmount) {
          return res.status(400).json({ message: 'Initiator has insufficient points' });
        }

        // Transfer points
        initiator.points -= exchange.pointsAmount;
        recipient.points += exchange.pointsAmount;
        
        await initiator.save();
        await recipient.save();
      }

      // Mark items as unavailable
      if (exchange.recipientItem) {
        await Item.findByIdAndUpdate(exchange.recipientItem, { isAvailable: false });
      }
      if (exchange.initiatorItem) {
        await Item.findByIdAndUpdate(exchange.initiatorItem, { isAvailable: false });
      }

      exchange.completedAt = new Date();
    }

    await exchange.save();

    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('initiator', 'username firstName lastName')
      .populate('recipient', 'username firstName lastName')
      .populate('initiatorItem')
      .populate('recipientItem');

    res.json(populatedExchange);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel exchange
router.put('/exchanges/:id/cancel', auth, async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    if (exchange.initiator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (exchange.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel processed exchange' });
    }

    exchange.status = 'cancelled';
    await exchange.save();

    res.json({ message: 'Exchange cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user dashboard stats
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    const [totalItems, activeExchanges, completedExchanges] = await Promise.all([
      Item.countDocuments({ owner: req.user._id }),
      Exchange.countDocuments({
        $or: [{ initiator: req.user._id }, { recipient: req.user._id }],
        status: { $in: ['pending', 'accepted'] }
      }),
      Exchange.countDocuments({
        $or: [{ initiator: req.user._id }, { recipient: req.user._id }],
        status: 'completed'
      })
    ]);

    res.json({
      totalItems,
      activeExchanges,
      completedExchanges,
      points: req.user.points
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 