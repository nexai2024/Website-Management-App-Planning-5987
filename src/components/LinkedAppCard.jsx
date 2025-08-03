import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiEdit2, FiTrash2, FiExternalLink, FiDollarSign, 
  FiCalendar, FiCode, FiCreditCard, FiPackage 
} = FiIcons;

const LinkedAppCard = ({ app, onEdit, onDelete }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'custom': return FiCode;
      case 'saas': return FiCreditCard;
      case 'service': return FiPackage;
      default: return FiPackage;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'custom': return 'bg-blue-100 text-blue-700';
      case 'saas': return 'bg-green-100 text-green-700';
      case 'service': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'trial': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className={`p-2 rounded-lg ${getTypeColor(app.type)}`}>
            <SafeIcon icon={getTypeIcon(app.type)} className="text-lg" />
          </span>
          <div>
            <h4 className="font-medium text-gray-900">{app.name}</h4>
            <p className="text-sm text-gray-600">{app.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(app)}
            className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <SafeIcon icon={FiEdit2} className="text-sm" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(app.id)}
            className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
          >
            <SafeIcon icon={FiTrash2} className="text-sm" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
            {app.status}
          </span>
        </div>

        {app.url && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">URL:</span>
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
            >
              <span className="text-sm truncate max-w-32">{app.url}</span>
              <SafeIcon icon={FiExternalLink} className="text-xs" />
            </a>
          </div>
        )}

        {app.type === 'saas' && app.cost && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cost:</span>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiDollarSign} className="text-green-600 text-xs" />
              <span className="text-sm text-gray-900">${app.cost}/{app.billingCycle}</span>
            </div>
          </div>
        )}

        {app.type === 'saas' && app.renewalDate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Renewal:</span>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiCalendar} className="text-blue-600 text-xs" />
              <span className="text-sm text-gray-900">
                {format(new Date(app.renewalDate), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        )}

        {app.version && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Version:</span>
            <span className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
              {app.version}
            </span>
          </div>
        )}

        {app.apiEndpoint && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600">API Endpoint:</span>
            <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded mt-1 truncate">
              {app.apiEndpoint}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LinkedAppCard;