import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiTrendingDown, FiMinus, FiEdit2, FiTrash2, FiSearch } = FiIcons;

const SERPTrackingCard = ({ serpData, onEdit, onDelete }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return FiTrendingUp;
    if (trend < 0) return FiTrendingDown;
    return FiMinus;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRankColor = (rank) => {
    if (rank <= 3) return 'text-green-600 bg-green-50';
    if (rank <= 10) return 'text-blue-600 bg-blue-50';
    if (rank <= 20) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiSearch} className="text-blue-600" />
          <h4 className="font-medium text-gray-900 truncate">{serpData.keyword}</h4>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(serpData)}
            className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <SafeIcon icon={FiEdit2} className="text-sm" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(serpData.id)}
            className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
          >
            <SafeIcon icon={FiTrash2} className="text-sm" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Rank:</span>
          <span className={`px-2 py-1 rounded-lg text-sm font-bold ${getRankColor(serpData.currentRank)}`}>
            #{serpData.currentRank}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Search Engine:</span>
          <span className="text-sm text-gray-900 font-medium">{serpData.searchEngine}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Location:</span>
          <span className="text-sm text-gray-900">{serpData.location}</span>
        </div>

        {serpData.previousRank && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Change:</span>
            <div className="flex items-center space-x-1">
              <SafeIcon 
                icon={getTrendIcon(serpData.previousRank - serpData.currentRank)} 
                className={`text-sm ${getTrendColor(serpData.previousRank - serpData.currentRank)}`}
              />
              <span className={`text-sm font-medium ${getTrendColor(serpData.previousRank - serpData.currentRank)}`}>
                {Math.abs(serpData.previousRank - serpData.currentRank)}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Last Updated:</span>
          <span className="text-sm text-gray-900">
            {format(new Date(serpData.lastUpdated), 'MMM dd, yyyy')}
          </span>
        </div>

        {serpData.targetUrl && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600">Target URL:</span>
            <p className="text-sm text-blue-600 truncate mt-1">{serpData.targetUrl}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SERPTrackingCard;