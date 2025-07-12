const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const User = require('../models/User');
const Exchange = require('../models/Exchange');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all approved items with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      size,
      condition,
      exchangeType,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const filter = { isApproved: true, isAvailable: true };

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;
    if (exchangeType) filter.exchangeType = exchangeType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(filter)
      .populate('owner', 'username firstName lastName location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Item.countDocuments(filter);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'username firstName lastName location bio profilePicture')
      .populate('approvedBy', 'username');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new item
router.post('/', auth, upload.array('images', 5), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['shirts', 'pants', 'dresses', 'shoes', 'accessories', 'outerwear', 'other']).withMessage('Invalid category'),
  body('size').isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']).withMessage('Invalid size'),
  body('condition').isIn(['new', 'like-new', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('exchangeType').isIn(['swap', 'points']).withMessage('Invalid exchange type'),
  body('pointsValue').if(body('exchangeType').equals('points')).isInt({ min: 0 }).withMessage('Points value must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const {
      title,
      description,
      category,
      size,
      condition,
      brand,
      exchangeType,
      pointsValue,
      location,
      tags
    } = req.body;

    const images = req.files.map(file => `/uploads/${file.filename}`);

    const item = new Item({
      title,
      description,
      category,
      size,
      condition,
      brand,
      images,
      owner: req.user._id,
      exchangeType,
      pointsValue: exchangeType === 'points' ? pointsValue : 0,
      location: location || req.user.location,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await item.save();

    const populatedItem = await Item.findById(item._id)
      .populate('owner', 'username firstName lastName location');

    res.status(201).json(populatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateFields = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updateFields.images = [...item.images, ...newImages];
    }

    if (updateFields.tags && typeof updateFields.tags === 'string') {
      updateFields.tags = updateFields.tags.split(',').map(tag => tag.trim());
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('owner', 'username firstName lastName location');

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initiate exchange
router.post('/:id/exchange', auth, [
  body('exchangeType').isIn(['swap', 'points']).withMessage('Invalid exchange type'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot exchange with yourself' });
    }

    if (!item.isAvailable) {
      return res.status(400).json({ message: 'Item is not available' });
    }

    const { exchangeType, message, swapItemId, pointsAmount } = req.body;

    // Check if user has enough points for points-based exchange
    if (exchangeType === 'points') {
      if (req.user.points < item.pointsValue) {
        return res.status(400).json({ message: 'Insufficient points' });
      }
    }

    // Check if swap item exists and belongs to user
    if (exchangeType === 'swap' && swapItemId) {
      const swapItem = await Item.findById(swapItemId);
      if (!swapItem || swapItem.owner.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Invalid swap item' });
      }
    }

    const exchange = new Exchange({
      exchangeType,
      initiator: req.user._id,
      recipient: item.owner,
      initiatorItem: exchangeType === 'swap' ? swapItemId : null,
      recipientItem: item._id,
      pointsAmount: exchangeType === 'points' ? item.pointsValue : 0,
      message
    });

    await exchange.save();

    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('initiator', 'username firstName lastName')
      .populate('recipient', 'username firstName lastName')
      .populate('initiatorItem')
      .populate('recipientItem');

    res.status(201).json(populatedExchange);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's items
router.get('/user/me', auth, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 