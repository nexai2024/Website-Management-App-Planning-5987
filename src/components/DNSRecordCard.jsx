import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiEdit2, FiTrash2, FiCopy, FiCheck, FiServer, FiGlobe } = FiIcons;

const DNSRecordCard = ({ record, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const getTypeColor = (type) => {
    switch (type) {
      case 'A': return 'bg-blue-100 text-blue-700';
      case 'AAAA': return 'bg-indigo-100 text-indigo-700';
      case 'CNAME': return 'bg-green-100 text-green-700';
      case 'MX': return 'bg-orange-100 text-orange-700';
      case 'TXT': return 'bg-purple-100 text-purple-700';
      case 'NS': return 'bg-yellow-100 text-yellow-700';
      case 'SRV': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const copyValue = () => {
    navigator.clipboard.writeText(record.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded-lg text-sm font-medium ${getTypeColor(record.type)}`}>
            {record.type}
          </span>
          <h4 className="font-medium text-gray-900">{record.name}</h4>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(record)}
            className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <SafeIcon icon={FiEdit2} className="text-sm" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(record.id)}
            className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
          >
            <SafeIcon icon={FiTrash2} className="text-sm" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Value:</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
              {record.value}
            </span>
            <button
              onClick={copyValue}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <SafeIcon icon={copied ? FiCheck : FiCopy} className="text-xs" />
            </button>
          </div>
        </div>

        {record.ttl && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">TTL:</span>
            <span className="text-sm text-gray-900">{record.ttl}s</span>
          </div>
        )}

        {record.priority && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Priority:</span>
            <span className="text-sm text-gray-900">{record.priority}</span>
          </div>
        )}

        {record.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">{record.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DNSRecordCard;