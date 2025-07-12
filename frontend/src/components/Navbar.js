import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleMode } = useCustomTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Browse Items', icon: <StoreIcon />, path: '/browse' },
    ...(user ? [
      { text: 'Add Item', icon: <AddIcon />, path: '/add-item' },
      { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    ] : []),
    ...(user?.role === 'admin' ? [
      { text: 'Admin Panel', icon: <AdminIcon />, path: '/admin' },
    ] : []),
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Clothing Exchange
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={handleDrawerToggle}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AppBar
          position="fixed"
          elevation={scrolled ? 8 : 0}
          sx={{
            background: scrolled 
              ? 'rgba(255, 255, 255, 0.95)' 
              : 'transparent',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            transition: 'all 0.3s ease',
            borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: scrolled ? 'primary.main' : 'white',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                Clothing Exchange
              </Typography>
            </motion.div>

            {isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  color="inherit"
                  onClick={toggleMode}
                  sx={{ color: scrolled ? 'primary.main' : 'white' }}
                >
                  {mode === 'dark' ? <LightIcon /> : <DarkIcon />}
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={handleDrawerToggle}
                  sx={{ color: scrolled ? 'primary.main' : 'white' }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {menuItems.map((item) => (
                  <motion.div
                    key={item.text}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={Link}
                      to={item.path}
                      sx={{
                        color: scrolled ? 'primary.main' : 'white',
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        '&:hover': {
                          backgroundColor: scrolled 
                            ? 'rgba(14, 165, 233, 0.1)' 
                            : 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                  </motion.div>
                ))}

                <IconButton
                  color="inherit"
                  onClick={toggleMode}
                  sx={{ color: scrolled ? 'primary.main' : 'white' }}
                >
                  {mode === 'dark' ? <LightIcon /> : <DarkIcon />}
                </IconButton>

                {user ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      sx={{ color: scrolled ? 'primary.main' : 'white' }}
                    >
                      <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        onClick={handleProfileMenuOpen}
                        sx={{ p: 0 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'primary.main',
                            fontSize: '0.875rem',
                          }}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                      </IconButton>
                    </motion.div>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        component={Link}
                        to="/login"
                        variant="outlined"
                        sx={{
                          color: scrolled ? 'primary.main' : 'white',
                          borderColor: scrolled ? 'primary.main' : 'white',
                          '&:hover': {
                            borderColor: scrolled ? 'primary.dark' : 'white',
                            backgroundColor: scrolled 
                              ? 'rgba(14, 165, 233, 0.1)' 
                              : 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        Login
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        sx={{
                          backgroundColor: scrolled ? 'primary.main' : 'white',
                          color: scrolled ? 'white' : 'primary.main',
                          '&:hover': {
                            backgroundColor: scrolled ? 'primary.dark' : 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                      >
                        Register
                      </Button>
                    </motion.div>
                  </Box>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </motion.div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar /> {/* Spacer */}
    </>
  );
};

export default Navbar; 