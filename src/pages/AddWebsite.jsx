import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import WebsiteForm from '../components/WebsiteForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft } = FiIcons;

const AddWebsite = () => {
  const navigate = useNavigate();
  const { addWebsite } = useWebsite();

  const handleSubmit = (websiteData) => {
    addWebsite(websiteData);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <SafeIcon icon={FiArrowLeft} className="text-lg" />
          <span>Back to Dashboard</span>
        </motion.button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Website</h1>
          <p className="text-gray-600">Track a new website by providing its details below</p>
        </div>

        <WebsiteForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddWebsite;