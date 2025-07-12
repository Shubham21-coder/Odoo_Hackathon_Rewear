import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
  Pagination,
  Fab,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as CartIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const BrowseItems = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Sample data with real clothing items
  const sampleItems = [
    {
      id: 1,
      name: 'Vintage Denim Jacket',
      category: 'Outerwear',
      condition: 'Excellent',
      description: 'Classic vintage denim jacket in perfect condition. Perfect for layering.',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop',
      points: 150,
      originalPrice: 120,
      size: 'M',
      brand: 'Levi\'s',
      location: 'New York, NY',
      owner: 'Sarah M.',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Classic White Sneakers',
      category: 'Footwear',
      condition: 'Good',
      description: 'Comfortable white sneakers, great for everyday wear.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      points: 120,
      originalPrice: 80,
      size: '9',
      brand: 'Converse',
      location: 'Los Angeles, CA',
      owner: 'Mike R.',
      createdAt: '2024-01-14',
    },
    {
      id: 3,
      name: 'Summer Floral Dress',
      category: 'Dresses',
      condition: 'Like New',
      description: 'Beautiful floral summer dress, perfect for warm weather.',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
      points: 100,
      originalPrice: 95,
      size: 'S',
      brand: 'Zara',
      location: 'Miami, FL',
      owner: 'Emma L.',
      createdAt: '2024-01-13',
    },
    {
      id: 4,
      name: 'Leather Crossbody Bag',
      category: 'Accessories',
      condition: 'Excellent',
      description: 'High-quality leather crossbody bag with adjustable strap.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
      points: 200,
      originalPrice: 180,
      size: 'One Size',
      brand: 'Coach',
      location: 'Chicago, IL',
      owner: 'Jessica K.',
      createdAt: '2024-01-12',
    },
    {
      id: 5,
      name: 'Wool Sweater',
      category: 'Tops',
      condition: 'Good',
      description: 'Warm wool sweater perfect for cold weather.',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
      points: 80,
      originalPrice: 65,
      size: 'L',
      brand: 'Gap',
      location: 'Seattle, WA',
      owner: 'David P.',
      createdAt: '2024-01-11',
    },
    {
      id: 6,
      name: 'High-Waisted Jeans',
      category: 'Bottoms',
      condition: 'Excellent',
      description: 'Stylish high-waisted jeans with perfect fit.',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      points: 110,
      originalPrice: 90,
      size: '28',
      brand: 'Madewell',
      location: 'Austin, TX',
      owner: 'Rachel S.',
      createdAt: '2024-01-10',
    },
    {
      id: 7,
      name: 'Silk Blouse',
      category: 'Tops',
      condition: 'Like New',
      description: 'Elegant silk blouse for professional or casual wear.',
      image: 'https://images.unsplash.com/photo-1564257631407-3deb25e9c8e0?w=400&h=400&fit=crop',
      points: 130,
      originalPrice: 110,
      size: 'M',
      brand: 'Anthropologie',
      location: 'Portland, OR',
      owner: 'Lisa M.',
      createdAt: '2024-01-09',
    },
    {
      id: 8,
      name: 'Ankle Boots',
      category: 'Footwear',
      condition: 'Good',
      description: 'Comfortable ankle boots with low heel.',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
      points: 140,
      originalPrice: 120,
      size: '7.5',
      brand: 'Steve Madden',
      location: 'Denver, CO',
      owner: 'Amanda T.',
      createdAt: '2024-01-08',
    },
    {
      id: 9,
      name: 'Pencil Skirt',
      category: 'Bottoms',
      condition: 'Excellent',
      description: 'Professional pencil skirt for office wear.',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
      points: 90,
      originalPrice: 75,
      size: '6',
      brand: 'Banana Republic',
      location: 'Boston, MA',
      owner: 'Jennifer H.',
      createdAt: '2024-01-07',
    },
    {
      id: 10,
      name: 'Statement Necklace',
      category: 'Accessories',
      condition: 'Like New',
      description: 'Beautiful statement necklace to elevate any outfit.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
      points: 60,
      originalPrice: 50,
      size: 'One Size',
      brand: 'Kate Spade',
      location: 'Nashville, TN',
      owner: 'Melissa W.',
      createdAt: '2024-01-06',
    },
    {
      id: 11,
      name: 'Trench Coat',
      category: 'Outerwear',
      condition: 'Good',
      description: 'Classic trench coat perfect for spring and fall.',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
      points: 180,
      originalPrice: 150,
      size: 'S',
      brand: 'Burberry',
      location: 'San Francisco, CA',
      owner: 'Sophie L.',
      createdAt: '2024-01-05',
    },
    {
      id: 12,
      name: 'Maxi Dress',
      category: 'Dresses',
      condition: 'Excellent',
      description: 'Elegant maxi dress for special occasions.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
      points: 160,
      originalPrice: 130,
      size: 'M',
      brand: 'Reformation',
      location: 'Phoenix, AZ',
      owner: 'Nicole B.',
      createdAt: '2024-01-04',
    },
  ];

  const categories = ['all', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories'];
  const conditions = ['all', 'Like New', 'Excellent', 'Good', 'Fair'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems(sampleItems);
      setFilteredItems(sampleItems);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, selectedCategory, selectedCondition, priceRange, items]);

  const filterItems = () => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
      const matchesPrice = item.points >= priceRange[0] && item.points <= priceRange[1];

      return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
    });

    setFilteredItems(filtered);
    setPage(1);
  };

  const handleFavorite = (itemId) => {
    if (favorites.includes(itemId)) {
      setFavorites(favorites.filter(id => id !== itemId));
      toast.info('Removed from favorites');
    } else {
      setFavorites([...favorites, itemId]);
      toast.success('Added to favorites');
    }
  };

  const handleExchange = (item) => {
    toast.success(`Exchange request sent for ${item.name}!`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setPriceRange([0, 1000]);
  };

  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Browse Items
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Discover amazing clothing items from our community
        </Typography>
      </motion.div>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Condition</InputLabel>
              <Select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                label="Condition"
              >
                {conditions.map(condition => (
                  <MenuItem key={condition} value={condition}>
                    {condition === 'all' ? 'All Conditions' : condition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box>
              <Typography variant="body2" gutterBottom>
                Points Range: {priceRange[0]} - {priceRange[1]}
              </Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={10}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              onClick={clearFilters}
              startIcon={<ClearIcon />}
              fullWidth
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {filteredItems.length} items found
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ display: { md: 'none' } }}
        >
          Filters
        </Button>
      </Box>

      {/* Items Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            Array.from(new Array(itemsPerPage)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={24} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <AnimatePresence>
              {paginatedItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <motion.div
                    variants={itemVariants}
                    layout
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[8],
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={item.image}
                          alt={item.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 1)',
                            },
                          }}
                          onClick={() => handleFavorite(item.id)}
                        >
                          {favorites.includes(item.id) ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                        <Chip
                          label={item.condition}
                          size="small"
                          color={
                            item.condition === 'Like New' ? 'success' :
                            item.condition === 'Excellent' ? 'primary' :
                            item.condition === 'Good' ? 'warning' : 'default'
                          }
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {item.brand} • Size {item.size}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {item.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {item.points} pts
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.location}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          component={Link}
                          to={`/item/${item.id}`}
                          variant="outlined"
                          fullWidth
                          sx={{ mr: 1 }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<CartIcon />}
                          onClick={() => handleExchange(item)}
                          fullWidth
                        >
                          Exchange
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          )}
        </Grid>
      </motion.div>

      {/* Pagination */}
      {!loading && filteredItems.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredItems.length / itemsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* No Results */}
      {!loading && filteredItems.length === 0 && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No items found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria or filters
          </Typography>
          <Button variant="contained" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </Box>
      )}

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          component={Link}
          to="/add-item"
        >
          <CartIcon />
        </Fab>
      )}
    </Container>
  );
};

export default BrowseItems; 