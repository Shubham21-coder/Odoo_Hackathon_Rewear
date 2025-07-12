import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  ShoppingBag, 
  RefreshCw, 
  Star,
  MapPin,
  Calendar,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userItems, setUserItems] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      location: user?.location || ''
    }
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [itemsRes, exchangesRes] = await Promise.all([
        axios.get('/items/user/me'),
        axios.get('/users/exchanges')
      ]);
      setUserItems(itemsRes.data);
      setExchanges(exchangesRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (data) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axios.delete(`/items/${itemId}`);
      setUserItems(prev => prev.filter(item => item._id !== itemId));
      toast.success('Item deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const getExchangeStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getExchangeStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and activities</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Points:</span>
          <span className="text-lg font-semibold text-primary-600">{user?.points || 0}</span>
          <Star className="h-5 w-5 text-yellow-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'items', label: 'My Items', icon: ShoppingBag },
            { id: 'exchanges', label: 'Exchanges', icon: RefreshCw }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                    {...register('firstName', {
                      required: 'First name is required'
                    })}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                    {...register('lastName', {
                      required: 'Last name is required'
                    })}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., New York, NY"
                  {...register('location')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="input"
                  rows="4"
                  placeholder="Tell us about yourself..."
                  {...register('bio')}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">First Name</label>
                  <p className="text-gray-900">{user?.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Name</label>
                  <p className="text-gray-900">{user?.lastName}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Username</label>
                <p className="text-gray-900">{user?.username}</p>
              </div>

              {user?.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </label>
                  <p className="text-gray-900">{user.location}</p>
                </div>
              )}

              {user?.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Bio</label>
                  <p className="text-gray-900">{user.bio}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member Since
                </label>
                <p className="text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Items</h2>
            <button
              onClick={() => window.location.href = '/add-item'}
              className="btn-primary flex items-center space-x-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add New Item</span>
            </button>
          </div>

          {userItems.length === 0 ? (
            <div className="card p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
              <p className="text-gray-600 mb-4">Start sharing your clothing items with the community.</p>
              <button
                onClick={() => window.location.href = '/add-item'}
                className="btn-primary"
              >
                Add Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.map((item) => (
                <div key={item._id} className="card overflow-hidden">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.category} • {item.size} • {item.condition}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.isApproved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.exchangeType === 'swap' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.exchangeType === 'swap' ? 'Swap' : `${item.pointsValue} Points`}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.location.href = `/items/${item._id}`}
                        className="btn-secondary flex-1 flex items-center justify-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="btn-danger flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Exchanges Tab */}
      {activeTab === 'exchanges' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Exchange History</h2>

          {exchanges.length === 0 ? (
            <div className="card p-12 text-center">
              <RefreshCw className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exchanges yet</h3>
              <p className="text-gray-600">Start browsing items to make your first exchange.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exchanges.map((exchange) => (
                <div key={exchange._id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getExchangeStatusIcon(exchange.status)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getExchangeStatusColor(exchange.status)}`}>
                        {exchange.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(exchange.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-900 mb-1">
                      {exchange.exchangeType === 'swap' ? 'Swap request' : 'Points exchange'} 
                      with {exchange.recipient?.firstName} {exchange.recipient?.lastName}
                    </p>
                    {exchange.message && (
                      <p className="text-gray-600">"{exchange.message}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile; 