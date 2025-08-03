import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiEdit2, FiTrash2, FiCopy, FiCheck, FiKey, FiLink2,
  FiActivity, FiAlertCircle, FiCheckCircle 
} = FiIcons;

const APIWebhookCard = ({ item, onEdit, onDelete }) => {
  const [copied, setCopied] = useState({});

  const getTypeIcon = (type) => {
    switch (type) {
      case 'api': return FiKey;
      case 'webhook': return FiLink2;
      default: return FiActivity;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'api': return 'bg-blue-100 text-blue-700';
      case 'webhook': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-red-600';
      case 'testing': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return FiCheckCircle;
      case 'inactive': return FiAlertCircle;
      case 'testing': return FiActivity;
      default: return FiActivity;
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [field]: true });
    setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
            <SafeIcon icon={getTypeIcon(item.type)} className="text-lg" />
          </span>
          <div>
            <h4 className="font-medium text-gray-900">{item.name}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <SafeIcon icon={FiEdit2} className="text-sm" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
          >
            <SafeIcon icon={FiTrash2} className="text-sm" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <div className="flex items-center space-x-1">
            <SafeIcon 
              icon={getStatusIcon(item.status)} 
              className={`text-sm ${getStatusColor(item.status)}`} 
            />
            <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
        </div>

        {item.endpoint && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Endpoint:</span>
              <button
                onClick={() => copyToClipboard(item.endpoint, 'endpoint')}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <SafeIcon icon={copied.endpoint ? FiCheck : FiCopy} className="text-xs" />
              </button>
            </div>
            <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded truncate">
              {item.endpoint}
            </p>
          </div>
        )}

        {item.method && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Method:</span>
            <span className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
              {item.method}
            </span>
          </div>
        )}

        {item.apiKey && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">API Key:</span>
              <button
                onClick={() => copyToClipboard(item.apiKey, 'apiKey')}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <SafeIcon icon={copied.apiKey ? FiCheck : FiCopy} className="text-xs" />
              </button>
            </div>
            <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
              {'*'.repeat(item.apiKey.length - 8) + item.apiKey.slice(-8)}
            </p>
          </div>
        )}

        {item.lastTriggered && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last Triggered:</span>
            <span className="text-sm text-gray-900">
              {format(new Date(item.lastTriggered), 'MMM dd, yyyy HH:mm')}
            </span>
          </div>
        )}

        {item.rateLimit && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Rate Limit:</span>
            <span className="text-sm text-gray-900">{item.rateLimit}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default APIWebhookCard;