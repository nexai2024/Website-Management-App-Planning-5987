import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabase } from '../context/SupabaseContext';

const { 
  FiUser, FiBriefcase, FiMail, FiLock, FiSave, 
  FiCreditCard, FiAlertCircle, FiCheckCircle 
} = FiIcons;

const Account = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: '',
  });
  const [subscription, setSubscription] = useState(null);
  const [tier, setTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const { 
    user, 
    signOut, 
    fetchUserProfile, 
    updateProfile,
    fetchUserSubscription,
    fetchPricingTierById
  } = useSupabase();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        const profileData = await fetchUserProfile();
        setProfile(profileData || {});
        
        const subscriptionData = await fetchUserSubscription();
        setSubscription(subscriptionData);
        
        if (subscriptionData?.tier_id) {
          const tierData = await fetchPricingTierById(subscriptionData.tier_id);
          setTier(tierData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, navigate]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await updateProfile(profile);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 flex items-center">
          <SafeIcon icon={FiCheckCircle} className="mr-2" />
          {successMessage}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <SafeIcon icon={FiUser} className="mr-2 text-blue-600" />
          Profile Information
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={profile.company || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                value={profile.jobTitle || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email address cannot be changed
            </p>
          </div>
          
          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={updating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg ${updating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              <SafeIcon icon={FiSave} />
              <span>{updating ? 'Saving...' : 'Save Changes'}</span>
            </motion.button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <SafeIcon icon={FiCreditCard} className="mr-2 text-blue-600" />
          Subscription
        </h2>
        
        {tier && subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{tier.name} Plan</h3>
                <p className="text-gray-600">{tier.description}</p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {subscription.status}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Price:</span>{' '}
                <span className="font-medium">${tier.price}/{tier.billing_cycle}</span>
              </div>
              
              <div>
                <span className="text-gray-600">Current Period:</span>{' '}
                <span className="font-medium">
                  {format(new Date(subscription.current_period_start), 'MMM dd, yyyy')} - {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
            
            <div className="pt-4 flex">
              <a href="/pricing" className="text-blue-600 hover:text-blue-800 font-medium">
                Change Plan
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-gray-600">No active subscription</p>
            <a href="/pricing" className="text-blue-600 hover:text-blue-800 font-medium">
              View Plans
            </a>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <SafeIcon icon={FiLock} className="mr-2 text-blue-600" />
          Security
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Password</h3>
            <p className="text-gray-600 mb-4">
              Change your password to keep your account secure
            </p>
            <a 
              href="/update-password" 
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              Change Password
            </a>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign Out</h3>
            <p className="text-gray-600 mb-4">
              Sign out of your account on this device
            </p>
            <button 
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;