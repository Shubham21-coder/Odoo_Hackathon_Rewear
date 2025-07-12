const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const Exchange = require('../models/Exchange');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get pending items for approval
router.get('/pending-items', adminAuth, async (req, res) => {
  try {
    const items = await Item.find({ isApproved: false })
      .populate('owner', 'username firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject item
router.put('/items/:id/approve', adminAuth, async (req, res) => {
  try {
    const { isApproved, reason } = req.body;
    
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.isApproved = isApproved;
    item.approvedBy = req.user._id;
    item.approvedAt = new Date();

    await item.save();

    const populatedItem = await Item.findById(item._id)
      .populate('owner', 'username firstName lastName email')
      .populate('approvedBy', 'username');

    res.json(populatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    const filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ban/unban user
router.put('/users/:id/ban', adminAuth, async (req, res) => {
  try {
    const { isBanned } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get platform statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalItems,
      approvedItems,
      pendingItems,
      totalExchanges,
      completedExchanges,
      totalPoints
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Item.countDocuments({ isApproved: true }),
      Item.countDocuments({ isApproved: false }),
      Exchange.countDocuments(),
      Exchange.countDocuments({ status: 'completed' }),
      User.aggregate([
        { $group: { _id: null, totalPoints: { $sum: '$points' } } }
      ]).then(result => result[0]?.totalPoints || 0)
    ]);

    // Get recent activity
    const recentItems = await Item.find()
      .populate('owner', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentExchanges = await Exchange.find()
      .populate('initiator', 'username')
      .populate('recipient', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalItems,
      approvedItems,
      pendingItems,
      totalExchanges,
      completedExchanges,
      totalPoints,
      recentItems,
      recentExchanges
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exchange statistics
router.get('/exchanges', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const exchanges = await Exchange.find(filter)
      .populate('initiator', 'username firstName lastName')
      .populate('recipient', 'username firstName lastName')
      .populate('initiatorItem')
      .populate('recipientItem')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Exchange.countDocuments(filter);

    res.json({
      exchanges,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 