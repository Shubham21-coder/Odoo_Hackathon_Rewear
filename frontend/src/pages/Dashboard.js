import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Store as StoreIcon,
  Favorite as FavoriteIcon,
  SwapHoriz as SwapIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [stats, setStats] = useState({
    totalItems: 12,
    activeExchanges: 3,
    completedExchanges: 8,
    points: 450,
    rating: 4.8,
  });

  const [recentItems, setRecentItems] = useState([
    {
      id: 1,
      name: 'Vintage Denim Jacket',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&h=200&fit=crop',
      status: 'active',
      views: 24,
      points: 150,
    },
    {
      id: 2,
      name: 'Classic White Sneakers',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop',
      status: 'pending',
      views: 18,
      points: 120,
    },
    {
      id: 3,
      name: 'Summer Floral Dress',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop',
      status: 'completed',
      views: 32,
      points: 100,
    },
  ]);

  const [recentExchanges, setRecentExchanges] = useState([
    {
      id: 1,
      itemName: 'Leather Handbag',
      otherUser: 'Sarah M.',
      status: 'pending',
      date: '2024-01-15',
      type: 'incoming',
    },
    {
      id: 2,
      itemName: 'Wool Sweater',
      otherUser: 'Mike R.',
      status: 'completed',
      date: '2024-01-12',
      type: 'outgoing',
    },
    {
      id: 3,
      itemName: 'Silk Blouse',
      otherUser: 'Emma L.',
      status: 'in_progress',
      date: '2024-01-10',
      type: 'incoming',
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'New exchange request for your Vintage Denim Jacket',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      message: 'Your item "Classic White Sneakers" was approved',
      time: '1 day ago',
      read: true,
    },
    {
      id: 3,
      message: 'Exchange completed with Sarah M.',
      time: '3 days ago',
      read: true,
    },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'in_progress':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon />;
      case 'pending':
        return <ScheduleIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      case 'in_progress':
        return <ShippingIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Welcome back, {user?.name || 'User'}! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Here's what's happening with your clothing exchange activities
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <StoreIcon />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                      Total Items
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {stats.totalItems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items listed
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                      <SwapIcon />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                      Active Exchanges
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="secondary.main">
                    {stats.activeExchanges}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In progress
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <CheckCircleIcon />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="success.main">
                    {stats.completedExchanges}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successful exchanges
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                      <MonetizationOnIcon />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                      Points
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="warning.main">
                    {stats.points}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available points
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Recent Items */}
            <motion.div variants={itemVariants}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                      Your Recent Items
                    </Typography>
                    <Button
                      component={Link}
                      to="/add-item"
                      variant="contained"
                      startIcon={<AddIcon />}
                    >
                      Add Item
                    </Button>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {recentItems.map((item) => (
                      <Grid item xs={12} sm={4} key={item.id}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: '100%',
                              height: 120,
                              objectFit: 'cover',
                            }}
                          />
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap>
                              {item.name}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Chip
                                label={item.status}
                                size="small"
                                color={getStatusColor(item.status)}
                                icon={getStatusIcon(item.status)}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {item.points} pts
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {item.views} views
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Exchanges */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Recent Exchanges
                  </Typography>
                  
                  <List>
                    {recentExchanges.map((exchange, index) => (
                      <React.Fragment key={exchange.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: getStatusColor(exchange.status) + '.main' }}>
                              {getStatusIcon(exchange.status)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={exchange.itemName}
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  {exchange.type === 'incoming' ? 'From' : 'To'}: {exchange.otherUser}
                                </Typography>
                                <br />
                                <Typography variant="caption" color="text.secondary">
                                  {exchange.date}
                                </Typography>
                              </Box>
                            }
                          />
                          <Chip
                            label={exchange.status.replace('_', ' ')}
                            color={getStatusColor(exchange.status)}
                            size="small"
                          />
                        </ListItem>
                        {index < recentExchanges.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Profile Summary */}
            <motion.div variants={itemVariants}>
              <Card sx={{ mb: 4 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {user?.name || 'User Name'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Member since {new Date().getFullYear()}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <StarIcon sx={{ color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="body1" fontWeight="bold">
                      {stats.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      rating
                    </Typography>
                  </Box>

                  <Button
                    component={Link}
                    to="/profile"
                    variant="outlined"
                    fullWidth
                    startIcon={<PersonIcon />}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Notifications
                    </Typography>
                  </Box>
                  
                  <List sx={{ p: 0 }}>
                    {notifications.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        <ListItem sx={{ px: 0, py: 1 }}>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: notification.read ? 400 : 600,
                                  color: notification.read ? 'text.secondary' : 'text.primary',
                                }}
                              >
                                {notification.message}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {notification.time}
                              </Typography>
                            }
                          />
                          {!notification.read && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                ml: 1,
                              }}
                            />
                          )}
                        </ListItem>
                        {index < notifications.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 