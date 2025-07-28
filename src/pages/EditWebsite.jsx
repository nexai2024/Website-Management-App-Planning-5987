import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import WebsiteForm from '../components/WebsiteForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft } = FiIcons;

const EditWebsite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWebsiteById, updateWebsite } = useWebsite();
  
  const website = getWebsiteById(id);

  if (!website) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Website not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = (websiteData) => {
    updateWebsite(id, websiteData);
    navigate(`/website/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/website/${id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <SafeIcon icon={FiArrowLeft} className="text-lg" />
          <span>Back to Details</span>
        </motion.button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Website</h1>
          <p className="text-gray-600">Update the details for {website.name}</p>
        </div>

        <WebsiteForm 
          initialData={website}
          onSubmit={handleSubmit}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditWebsite;