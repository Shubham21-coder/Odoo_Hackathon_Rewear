import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  Star as StarIcon,
  Message as MessageIcon,
  SwapHoriz as SwapIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [exchangeMessage, setExchangeMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  // Sample item data
  const sampleItem = {
    id: parseInt(id),
    name: 'Vintage Denim Jacket',
    category: 'Outerwear',
    condition: 'Excellent',
    description: 'This is a beautiful vintage denim jacket in excellent condition. It features a classic design with a comfortable fit and authentic vintage appeal. Perfect for layering and adding a timeless touch to any outfit.',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop',
    ],
    points: 150,
    originalPrice: 120,
    size: 'M',
    brand: 'Levi\'s',
    color: 'Blue',
    material: 'Denim',
    location: 'New York, NY',
    owner: {
      id: 1,
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      rating: 4.8,
      memberSince: '2023',
      completedExchanges: 15,
    },
    createdAt: '2024-01-15',
    views: 24,
    likes: 8,
    tags: ['Vintage', 'Denim', 'Classic', 'Layering'],
    measurements: {
      chest: '40"',
      length: '26"',
      shoulders: '18"',
    },
    care: 'Machine wash cold, tumble dry low',
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItem(sampleItem);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleFavorite = () => {
    setFavorite(!favorite);
    toast.success(favorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    navigator.share({
      title: item.name,
      text: `Check out this ${item.name} on Clothing Exchange!`,
      url: window.location.href,
    }).catch(() => {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    });
  };

  const handleExchange = () => {
    if (!user) {
      toast.error('Please log in to request an exchange');
      navigate('/login');
      return;
    }
    setShowExchangeDialog(true);
  };

  const submitExchange = () => {
    toast.success('Exchange request sent! The owner will be notified.');
    setShowExchangeDialog(false);
    setExchangeMessage('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" textAlign="center">
          Item not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back
          </Button>
        </motion.div>

        <Grid container spacing={4}>
          {/* Left Column - Images */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardMedia
                  component="img"
                  height={400}
                  image={item.images[selectedImage]}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                
                {/* Thumbnail Images */}
                <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
                  {item.images.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={image}
                      alt={`${item.name} ${index + 1}`}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: selectedImage === index ? '2px solid' : '2px solid transparent',
                        borderColor: 'primary.main',
                        opacity: selectedImage === index ? 1 : 0.7,
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Column - Details */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {item.points} points
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={handleFavorite}>
                        {favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <IconButton onClick={handleShare}>
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Tags */}
                  <Box sx={{ mb: 3 }}>
                    {item.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>

                  {/* Condition and Category */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Chip
                      label={item.condition}
                      color="success"
                      icon={<CheckCircleIcon />}
                    />
                    <Chip label={item.category} variant="outlined" />
                  </Box>

                  {/* Description */}
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>

                  {/* Details List */}
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Brand"
                        secondary={item.brand}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Size"
                        secondary={item.size}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Color"
                        secondary={item.color}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ShippingIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Material"
                        secondary={item.material}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={item.location}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Listed"
                        secondary={new Date(item.createdAt).toLocaleDateString()}
                      />
                    </ListItem>
                  </List>

                  {/* Action Buttons */}
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<SwapIcon />}
                      onClick={handleExchange}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      Request Exchange
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<MessageIcon />}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      Message Owner
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Owner Information */}
        <motion.div variants={itemVariants}>
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                About the Owner
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={item.owner.avatar}
                  sx={{ width: 60, height: 60, mr: 2 }}
                >
                  {item.owner.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {item.owner.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={item.owner.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({item.owner.rating})
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Member since
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {item.owner.memberSince}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Completed exchanges
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {item.owner.completedExchanges}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Response rate
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    98%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Measurements and Care */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Measurements
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(item.measurements).map(([key, value]) => (
                      <Grid item xs={6} key={key}>
                        <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                          {key}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {value}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Care Instructions
                  </Typography>
                  <Typography variant="body1">
                    {item.care}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Exchange Dialog */}
      <Dialog
        open={showExchangeDialog}
        onClose={() => setShowExchangeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Request Exchange
          <IconButton
            onClick={() => setShowExchangeDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Send a message to {item.owner.name} about exchanging for "{item.name}"
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message (optional)"
            value={exchangeMessage}
            onChange={(e) => setExchangeMessage(e.target.value)}
            placeholder="Tell the owner why you're interested in this item..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExchangeDialog(false)}>
            Cancel
          </Button>
          <Button onClick={submitExchange} variant="contained">
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemDetail; 