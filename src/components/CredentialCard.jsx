import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiKey, FiUser, FiEye, FiEyeOff, FiEdit2, 
  FiTrash2, FiGlobe, FiServer, FiCalendar 
} = FiIcons;

const CredentialCard = ({ credential, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'login': return FiUser;
      case 'api': return FiKey;
      case 'hosting': return FiServer;
      default: return FiKey;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'login': return 'bg-blue-100 text-blue-700';
      case 'api': return 'bg-purple-100 text-purple-700';
      case 'hosting': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderTypeSpecificInfo = () => {
    switch (credential.type) {
      case 'login':
        return (
          <div className="space-y-3">
            {credential.username && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{credential.username}</span>
              </div>
            )}
            
            {credential.password && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiKey} className="text-blue-600 flex-shrink-0" />
                <div className="relative flex-1">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={credential.password}
                    readOnly
                    className="bg-gray-50 border border-gray-200 rounded px-3 py-1 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                  </button>
                </div>
              </div>
            )}
            
            {credential.url && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiGlobe} className="text-blue-600 flex-shrink-0" />
                <a 
                  href={credential.url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 truncate"
                >
                  {credential.url}
                </a>
              </div>
            )}
          </div>
        );

      case 'api':
        return (
          <div className="space-y-3">
            {credential.apiKey && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiKey} className="text-purple-600 flex-shrink-0" />
                <div className="relative flex-1">
                  <input 
                    type={showApiKey ? "text" : "password"}
                    value={credential.apiKey}
                    readOnly
                    className="bg-gray-50 border border-gray-200 rounded px-3 py-1 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <SafeIcon icon={showApiKey ? FiEyeOff : FiEye} />
                  </button>
                </div>
              </div>
            )}
            
            {credential.secretKey && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiKey} className="text-purple-600 flex-shrink-0" />
                <div className="relative flex-1">
                  <input 
                    type={showSecretKey ? "text" : "password"}
                    value={credential.secretKey}
                    readOnly
                    className="bg-gray-50 border border-gray-200 rounded px-3 py-1 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <SafeIcon icon={showSecretKey ? FiEyeOff : FiEye} />
                  </button>
                </div>
              </div>
            )}
            
            {credential.expirationDate && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCalendar} className="text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">
                  Expires: {new Date(credential.expirationDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        );

      case 'hosting':
        return (
          <div className="space-y-3">
            {credential.accountId && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiServer} className="text-orange-600 flex-shrink-0" />
                <span className="text-gray-700">Account ID: {credential.accountId}</span>
              </div>
            )}
            
            {credential.username && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="text-orange-600 flex-shrink-0" />
                <span className="text-gray-700">{credential.username}</span>
              </div>
            )}
            
            {credential.password && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiKey} className="text-orange-600 flex-shrink-0" />
                <div className="relative flex-1">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={credential.password}
                    readOnly
                    className="bg-gray-50 border border-gray-200 rounded px-3 py-1 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                  </button>
                </div>
              </div>
            )}
            
            {credential.url && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiGlobe} className="text-orange-600 flex-shrink-0" />
                <a 
                  href={credential.url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 truncate"
                >
                  {credential.url}
                </a>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`p-2 rounded-lg ${getTypeColor(credential.type)}`}>
              <SafeIcon icon={getTypeIcon(credential.type)} className="text-lg" />
            </span>
            <h3 className="font-medium text-gray-900">{credential.name}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(credential)}
              className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <SafeIcon icon={FiEdit2} className="text-sm" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(credential.id)}
              className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
            >
              <SafeIcon icon={FiTrash2} className="text-sm" />
            </motion.button>
          </div>
        </div>
        
        {renderTypeSpecificInfo()}
        
        {credential.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">{credential.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CredentialCard;