import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAlertCircle, FiArrowRight } = FiIcons;

const SubscriptionLimitsAlert = ({ websiteCount, limit, tierName }) => {
  const isApproachingLimit = websiteCount >= Math.floor(limit * 0.8);
  const isAtLimit = websiteCount >= limit;
  
  if (!isApproachingLimit) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
        isAtLimit 
          ? 'bg-red-50 text-red-800 border border-red-200' 
          : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
      }`}
    >
      <div className="flex items-center space-x-3">
        <SafeIcon icon={FiAlertCircle} className="text-2xl flex-shrink-0" />
        <div>
          <p className="font-medium">
            {isAtLimit 
              ? `You've reached the limit of ${limit} websites on your ${tierName} plan` 
              : `You're approaching your limit of ${limit} websites (${websiteCount}/${limit})`}
          </p>
          <p className="text-sm">
            {isAtLimit 
              ? 'Upgrade your plan to add more websites' 
              : 'Consider upgrading your plan to avoid hitting the limit'}
          </p>
        </div>
      </div>
      <Link to="/pricing">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isAtLimit 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-yellow-600 text-white hover:bg-yellow-700'
          }`}
        >
          <span>Upgrade</span>
          <SafeIcon icon={FiArrowRight} />
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default SubscriptionLimitsAlert;