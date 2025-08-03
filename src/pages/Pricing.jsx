import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabase } from '../context/SupabaseContext';

const { FiCheck, FiX, FiArrowRight, FiCreditCard } = FiIcons;

const PricingTierCard = ({ tier, currentTier, onSelectTier }) => {
  const isCurrentTier = currentTier && currentTier.id === tier.id;
  const features = Array.isArray(tier.features) ? tier.features : [];
  
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className={`bg-white rounded-xl border ${isCurrentTier ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'} overflow-hidden shadow-lg`}
    >
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-extrabold text-gray-900">${tier.price}</span>
          <span className="ml-1 text-gray-600">/{tier.billing_cycle}</span>
        </div>
        <p className="text-gray-600 mb-6">{tier.description}</p>
        
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <SafeIcon icon={FiCheck} className="text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectTier(tier)}
          className={`w-full flex justify-center items-center space-x-2 py-3 rounded-lg 
            ${isCurrentTier 
              ? 'bg-gray-100 text-gray-800 cursor-default' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          disabled={isCurrentTier}
        >
          {isCurrentTier ? (
            <span>Current Plan</span>
          ) : (
            <>
              <span>{tier.price === 0 ? 'Get Started' : 'Upgrade'}</span>
              <SafeIcon icon={tier.price === 0 ? FiArrowRight : FiCreditCard} />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  const [pricingTiers, setPricingTiers] = useState([]);
  const [currentTier, setCurrentTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, fetchPricingTiers, fetchUserSubscription, upgradeTier } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPricingData = async () => {
      try {
        const tiersData = await fetchPricingTiers();
        setPricingTiers(tiersData);
        
        if (user) {
          const subscription = await fetchUserSubscription();
          if (subscription) {
            const userTier = tiersData.find(tier => tier.id === subscription.tier_id);
            setCurrentTier(userTier);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadPricingData();
  }, [user]);

  const handleSelectTier = async (tier) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (tier.price > 0) {
        // For paid tiers, we would normally redirect to a checkout page
        // For simplicity, we'll just update the subscription directly
        await upgradeTier(tier.id);
        setCurrentTier(tier);
      } else {
        // Free tier can be selected directly
        await upgradeTier(tier.id);
        setCurrentTier(tier);
      }
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that's right for you and start managing your digital assets
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-8 max-w-2xl mx-auto">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map(tier => (
          <PricingTierCard
            key={tier.id}
            tier={tier}
            currentTier={currentTier}
            onSelectTier={handleSelectTier}
          />
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto space-y-6 text-left">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I cancel my subscription?</h3>
            <p className="text-gray-600">You can cancel your subscription from your account settings. You'll continue to have access to your plan's features until the end of your current billing period.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
            <p className="text-gray-600">We offer a 14-day money-back guarantee. If you're not satisfied with our service, contact our support team within 14 days of your payment for a full refund.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;