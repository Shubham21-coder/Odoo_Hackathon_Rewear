import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  IconButton,
  Alert,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const AddItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: '',
    description: '',
    brand: '',
    size: '',
    color: '',
    material: '',
    points: '',
    originalPrice: '',
    tags: [],
    measurements: {
      chest: '',
      length: '',
      shoulders: '',
      waist: '',
      hips: '',
    },
    care: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = ['Basic Info', 'Details', 'Images', 'Review'];

  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories'
  ];

  const conditions = [
    'Like New', 'Excellent', 'Good', 'Fair'
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'
  ];

  const colors = [
    'Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Brown', 'Gray', 'Multi'
  ];

  const materials = [
    'Cotton', 'Polyester', 'Wool', 'Silk', 'Denim', 'Leather', 'Synthetic', 'Linen', 'Other'
  ];

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

  const handleMeasurementChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [field]: value
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error('Some files were invalid. Please upload images under 5MB.');
    }

    if (images.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.condition) newErrors.condition = 'Condition is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        break;
      case 1:
        if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
        if (!formData.size) newErrors.size = 'Size is required';
        if (!formData.color) newErrors.color = 'Color is required';
        if (!formData.points || formData.points <= 0) newErrors.points = 'Points must be greater than 0';
        break;
      case 2:
        if (images.length === 0) newErrors.images = 'At least one image is required';
        break;
      default:
        // No validation for other steps
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Item added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div variants={itemVariants}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  placeholder="e.g., Vintage Denim Jacket"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <Typography variant="caption" color="error">
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.condition}>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    label="Condition"
                  >
                    {conditions.map(condition => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.condition && (
                    <Typography variant="caption" color="error">
                      {errors.condition}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="Describe your item in detail..."
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div variants={itemVariants}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  error={!!errors.brand}
                  helperText={errors.brand}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.size}>
                  <InputLabel>Size</InputLabel>
                  <Select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    label="Size"
                  >
                    {sizes.map(size => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.size && (
                    <Typography variant="caption" color="error">
                      {errors.size}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.color}>
                  <InputLabel>Color</InputLabel>
                  <Select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    label="Color"
                  >
                    {colors.map(color => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.color && (
                    <Typography variant="caption" color="error">
                      {errors.color}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Material</InputLabel>
                  <Select
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    label="Material"
                  >
                    {materials.map(material => (
                      <MenuItem key={material} value={material}>
                        {material}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Points Value"
                  name="points"
                  type="number"
                  value={formData.points}
                  onChange={handleChange}
                  error={!!errors.points}
                  helperText={errors.points}
                  placeholder="150"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Original Price ($)"
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="120"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Measurements (optional)
                </Typography>
                <Grid container spacing={2}>
                  {Object.keys(formData.measurements).map(field => (
                    <Grid item xs={6} sm={4} key={field}>
                      <TextField
                        fullWidth
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={formData.measurements[field]}
                        onChange={(e) => handleMeasurementChange(field, e.target.value)}
                        placeholder="e.g., 40\"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Care Instructions"
                  name="care"
                  value={formData.care}
                  onChange={handleChange}
                  placeholder="e.g., Machine wash cold, tumble dry low"
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upload Images (Max 5)
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Choose Images
                </Button>
              </label>
              {errors.images && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.images}
                </Alert>
              )}
            </Box>

            <Grid container spacing={2}>
              {images.map((image) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                  <Paper sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={image.preview}
                      alt="Preview"
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      }}
                      onClick={() => removeImage(image.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        );

      case 3:
        return (
          <motion.div variants={itemVariants}>
            <Typography variant="h6" gutterBottom>
              Review Your Item
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                    <Typography><strong>Name:</strong> {formData.name}</Typography>
                    <Typography><strong>Category:</strong> {formData.category}</Typography>
                    <Typography><strong>Condition:</strong> {formData.condition}</Typography>
                    <Typography><strong>Description:</strong> {formData.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Details
                    </Typography>
                    <Typography><strong>Brand:</strong> {formData.brand}</Typography>
                    <Typography><strong>Size:</strong> {formData.size}</Typography>
                    <Typography><strong>Color:</strong> {formData.color}</Typography>
                    <Typography><strong>Points:</strong> {formData.points}</Typography>
                    {formData.originalPrice && (
                      <Typography><strong>Original Price:</strong> ${formData.originalPrice}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Images ({images.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {images.map((image) => (
                        <Grid item xs={12} sm={6} md={3} key={image.id}>
                          <Box
                            component="img"
                            src={image.preview}
                            alt="Preview"
                            sx={{
                              width: '100%',
                              height: 150,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h3" component="h1" fontWeight="bold">
              Add New Item
            </Typography>
          </Box>
        </motion.div>

        {/* Stepper */}
        <motion.div variants={itemVariants}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </motion.div>

        {/* Step Content */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {renderStepContent(activeStep)}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? null : <CheckIcon />}
                >
                  {loading ? 'Adding Item...' : 'Add Item'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default AddItem; 