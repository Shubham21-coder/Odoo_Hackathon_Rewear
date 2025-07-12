import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Grid,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const steps = ['Account Details', 'Verification', 'Complete'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Registration successful! Welcome to Clothing Exchange!');
      setActiveStep(2);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    toast.info(`${provider} registration coming soon!`);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4} alignItems="center">
            {/* Left Side - Welcome Content */}
            <Grid item xs={12} md={6}>
              <motion.div variants={formVariants}>
                <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography
                    variant={isMobile ? 'h3' : 'h2'}
                    component="h1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Join Our Community!
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
                  >
                    Start your sustainable fashion journey today. Exchange clothes, 
                    earn points, and connect with fashion enthusiasts worldwide.
                  </Typography>
                  
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      What you'll get:
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {[
                        '✓ Access to thousands of clothing items',
                        '✓ Earn points for your listings',
                        '✓ Connect with fashion community',
                        '✓ Reduce your environmental impact',
                        '✓ Save money on clothing',
                      ].map((benefit, index) => (
                        <Typography
                          key={index}
                          variant="body1"
                          sx={{ mb: 1, opacity: 0.9 }}
                        >
                          {benefit}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Right Side - Registration Form */}
            <Grid item xs={12} md={6}>
              <motion.div variants={formVariants}>
                <Paper
                  elevation={8}
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
                      Create Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  </Box>

                  {/* Stepper */}
                  <Box sx={{ mb: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>

                  {activeStep === 0 && (
                    <Box component="form" onSubmit={handleSubmit}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                      />

                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                      />

                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                      />

                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                      />

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading}
                          sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            mb: 3,
                          }}
                        >
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                      </motion.div>
                    </Box>
                  )}

                  {activeStep === 2 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CheckCircleIcon
                        sx={{
                          fontSize: 80,
                          color: 'success.main',
                          mb: 2,
                        }}
                      />
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Welcome to Clothing Exchange!
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Your account has been created successfully. Redirecting to dashboard...
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        onClick={() => handleSocialRegister('Google')}
                        sx={{
                          borderColor: '#db4437',
                          color: '#db4437',
                          '&:hover': {
                            borderColor: '#db4437',
                            backgroundColor: 'rgba(219, 68, 55, 0.04)',
                          },
                        }}
                      >
                        Google
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<FacebookIcon />}
                        onClick={() => handleSocialRegister('Facebook')}
                        sx={{
                          borderColor: '#4267B2',
                          color: '#4267B2',
                          '&:hover': {
                            borderColor: '#4267B2',
                            backgroundColor: 'rgba(66, 103, 178, 0.04)',
                          },
                        }}
                      >
                        Facebook
                      </Button>
                    </motion.div>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      By creating an account, you agree to our{' '}
                      <Link
                        to="/terms"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                        }}
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/privacy"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                        }}
                      >
                        Privacy Policy
                      </Link>
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register; 