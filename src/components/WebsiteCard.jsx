import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useWebsite } from '../context/WebsiteContext';

const { 
  FiExternalLink, FiCode, FiCreditCard, FiBookmark, 
  FiCalendar, FiDollarSign, FiLock 
} = FiIcons;

const WebsiteCard = ({ website }) => {
  const { getCredentialsByWebsiteId } = useWebsite();
  const credentials = getCredentialsByWebsiteId(website.id);
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'owned': return FiCode;
      case 'subscription': return FiCreditCard;
      case 'tracked': return FiBookmark;
      default: return FiCode;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'owned': return 'bg-blue-100 text-blue-700';
      case 'subscription': return 'bg-green-100 text-green-700';
      case 'tracked': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'development': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{website.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(website.type)}`}>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={getTypeIcon(website.type)} className="text-xs" />
                  <span className="capitalize">{website.type}</span>
                </div>
              </span>
            </div>
            
            {website.url && (
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm mb-3"
              >
                <span className="truncate">{website.url}</span>
                <SafeIcon icon={FiExternalLink} className="text-xs flex-shrink-0" />
              </a>
            )}

            {website.status && (
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(website.status)}`}>
                {website.status}
              </span>
            )}
          </div>
        </div>

        {website.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{website.description}</p>
        )}

        <div className="space-y-2 mb-4">
          {website.type === 'subscription' && website.cost && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiDollarSign} className="text-green-600" />
              <span>${website.cost}/{website.billingCycle || 'month'}</span>
            </div>
          )}

          {website.type === 'subscription' && website.renewalDate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiCalendar} className="text-blue-600" />
              <span>Renews: {format(new Date(website.renewalDate), 'MMM dd, yyyy')}</span>
            </div>
          )}

          {website.type === 'owned' && website.techStack && (
            <div className="flex flex-wrap gap-1">
              {website.techStack.slice(0, 3).map((tech, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {tech}
                </span>
              ))}
              {website.techStack.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{website.techStack.length - 3} more
                </span>
              )}
            </div>
          )}

          {credentials.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
              <SafeIcon icon={FiLock} className="text-blue-600" />
              <span>{credentials.length} credential{credentials.length !== 1 ? 's' : ''} stored</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Added {format(new Date(website.createdAt), 'MMM dd, yyyy')}
          </span>
          <Link
            to={`/website/${website.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default WebsiteCard;