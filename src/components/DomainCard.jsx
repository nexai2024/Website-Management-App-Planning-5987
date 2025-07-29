import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useWebsite } from '../context/WebsiteContext';

const { 
  FiGlobe, FiCalendar, FiDollarSign, FiEdit2, FiTrash2, 
  FiLink, FiExternalLink, FiServer, FiAlertTriangle 
} = FiIcons;

const DomainCard = ({ domain, onEdit, onDelete }) => {
  const { websites } = useWebsite();
  
  const linkedWebsites = websites.filter(site => 
    domain.linkedWebsites?.includes(site.id) || false
  );

  const getTypeColor = (type) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-700';
      case 'redirect': return 'bg-green-100 text-green-700';
      case 'parked': return 'bg-yellow-100 text-yellow-700';
      case 'development': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'locked': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = () => {
    if (!domain.expirationDate) return false;
    const expirationDate = new Date(domain.expirationDate);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
  };

  const isExpired = () => {
    if (!domain.expirationDate) return false;
    const expirationDate = new Date(domain.expirationDate);
    const today = new Date();
    return expirationDate < today;
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
              <SafeIcon icon={FiGlobe} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{domain.name}</h3>
              {(isExpired() || isExpiringSoon()) && (
                <SafeIcon 
                  icon={FiAlertTriangle} 
                  className={`${isExpired() ? 'text-red-500' : 'text-yellow-500'}`} 
                />
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(domain.type)}`}>
                {domain.type}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}>
                {domain.status}
              </span>
              {domain.autoRenew && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Auto-renew
                </span>
              )}
            </div>

            {domain.registrar && (
              <p className="text-sm text-gray-600 mb-2">
                Registered with {domain.registrar}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(domain)}
              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <SafeIcon icon={FiEdit2} className="text-sm" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(domain.id)}
              className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
            >
              <SafeIcon icon={FiTrash2} className="text-sm" />
            </motion.button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {domain.expirationDate && (
            <div className="flex items-center space-x-2 text-sm">
              <SafeIcon icon={FiCalendar} className="text-gray-500" />
              <span className={`${isExpired() ? 'text-red-600 font-medium' : isExpiringSoon() ? 'text-yellow-600 font-medium' : 'text-gray-600'}`}>
                {isExpired() ? 'Expired: ' : 'Expires: '}
                {format(new Date(domain.expirationDate), 'MMM dd, yyyy')}
              </span>
            </div>
          )}

          {domain.cost && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiDollarSign} className="text-green-600" />
              <span>${domain.cost}/{domain.billingCycle}</span>
            </div>
          )}

          {domain.dnsProvider && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiServer} className="text-purple-600" />
              <span>DNS: {domain.dnsProvider}</span>
            </div>
          )}
        </div>

        {/* Subdomains */}
        {domain.subdomains && domain.subdomains.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Subdomains</h4>
            <div className="flex flex-wrap gap-1">
              {domain.subdomains.slice(0, 3).map((subdomain) => (
                <span key={subdomain.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {subdomain.name}
                </span>
              ))}
              {domain.subdomains.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{domain.subdomains.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Linked Websites */}
        {linkedWebsites.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Linked Websites</h4>
            <div className="space-y-1">
              {linkedWebsites.slice(0, 2).map((website) => (
                <Link
                  key={website.id}
                  to={`/website/${website.id}`}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <SafeIcon icon={FiLink} className="text-xs" />
                  <span className="truncate">{website.name}</span>
                </Link>
              ))}
              {linkedWebsites.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{linkedWebsites.length - 2} more websites
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Added {format(new Date(domain.createdAt), 'MMM dd, yyyy')}
          </span>
          <Link
            to={`/domain/${domain.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DomainCard;