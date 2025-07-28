import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiCopy, FiCheck } = FiIcons;

const CredentialModal = ({ credential, onClose }) => {
  const [copied, setCopied] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(copied).length > 0) {
        setCopied({});
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [copied]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [field]: true });
    });
  };

  const renderField = (label, value, field) => {
    if (!value) return null;
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center">
          <input
            type={field === 'password' || field === 'apiKey' || field === 'secretKey' ? 'password' : 'text'}
            value={value}
            readOnly
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          />
          <button
            onClick={() => copyToClipboard(value, field)}
            className="ml-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            aria-label={`Copy ${label}`}
          >
            <SafeIcon 
              icon={copied[field] ? FiCheck : FiCopy} 
              className={copied[field] ? "text-green-600" : "text-gray-600"} 
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {credential.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <SafeIcon icon={FiX} className="h-5 w-5" />
            </button>
          </div>
          
          <div className="px-6 py-4">
            {renderField("Username", credential.username, "username")}
            {renderField("Password", credential.password, "password")}
            {renderField("API Key", credential.apiKey, "apiKey")}
            {renderField("Secret Key", credential.secretKey, "secretKey")}
            {renderField("Account ID", credential.accountId, "accountId")}
            {renderField("URL", credential.url, "url")}
            
            {credential.notes && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{credential.notes}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CredentialModal;