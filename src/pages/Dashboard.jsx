import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import { useSupabase } from '../context/SupabaseContext';
import WebsiteCard from '../components/WebsiteCard';
import StatsOverview from '../components/StatsOverview';
import FilterTabs from '../components/FilterTabs';
import SubscriptionLimitsAlert from '../components/SubscriptionLimitsAlert';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus } = FiIcons;

const Dashboard = () => {
  const { websites } = useWebsite();
  const { user, fetchUserSubscription, fetchPricingTierById } = useSupabase();
  const [activeFilter, setActiveFilter] = useState('all');
  const [subscription, setSubscription] = useState(null);
  const [tier, setTier] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const filteredWebsites = activeFilter === 'all' 
    ? websites 
    : websites.filter(site => site.type === activeFilter);

  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        if (user) {
          const subscriptionData = await fetchUserSubscription();
          setSubscription(subscriptionData);
          
          if (subscriptionData?.tier_id) {
            const tierData = await fetchPricingTierById(subscriptionData.tier_id);
            setTier(tierData);
          }
        }
      } catch (err) {
        console.error('Error loading subscription data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSubscriptionData();
  }, [user]);
  
  // Calculate website limit based on tier
  const getWebsiteLimit = () => {
    if (!tier) return Infinity;
    
    const features = Array.isArray(tier.features) ? tier.features : [];
    const limitFeature = features.find(f => f.includes('websites'));
    
    if (!limitFeature) return Infinity;
    
    const limitMatch = limitFeature.match(/(\d+)/);
    if (limitMatch && limitMatch[1]) {
      const limit = parseInt(limitMatch[1], 10);
      return isNaN(limit) ? Infinity : limit;
    }
    
    return tier.name === 'Free' ? 5 : tier.name === 'Pro' ? 20 : Infinity;
  };
  
  const websiteLimit = getWebsiteLimit();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and track all your websites in one place</p>
        </div>
        <Link to="/add">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={websites.length >= websiteLimit}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-lg transition-colors ${
              websites.length >= websiteLimit
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <SafeIcon icon={FiPlus} className="text-lg" />
            <span className="font-medium">Add Website</span>
          </motion.button>
        </Link>
      </div>

      {tier && (
        <SubscriptionLimitsAlert 
          websiteCount={websites.length} 
          limit={websiteLimit}
          tierName={tier.name} 
        />
      )}

      <StatsOverview websites={websites} />

      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {filteredWebsites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="text-gray-400 mb-4">
            <SafeIcon icon={FiPlus} className="text-6xl mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No websites found</h3>
          <p className="text-gray-600 mb-6">
            {activeFilter === 'all'
              ? "Start by adding your first website to track"
              : `No ${activeFilter} websites found`}
          </p>
          <Link to="/add">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={websites.length >= websiteLimit}
              className={`px-6 py-3 rounded-lg transition-colors ${
                websites.length >= websiteLimit
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Add Your First Website
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map((website, index) => (
            <motion.div
              key={website.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WebsiteCard website={website} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;