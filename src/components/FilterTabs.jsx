import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiGlobe, FiCode, FiCreditCard, FiBookmark } = FiIcons;

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Sites', icon: FiGlobe },
    { id: 'owned', label: 'Owned', icon: FiCode },
    { id: 'subscription', label: 'Subscriptions', icon: FiCreditCard },
    { id: 'tracked', label: 'Tracked', icon: FiBookmark }
  ];

  return (
    <div className="flex space-x-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
      {filters.map(filter => (
        <motion.button
          key={filter.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onFilterChange(filter.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            activeFilter === filter.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <SafeIcon icon={filter.icon} className="text-lg" />
          <span className="font-medium">{filter.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default FilterTabs;