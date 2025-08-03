import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import SERPTrackingCard from './SERPTrackingCard';
import SERPTrackingForm from './SERPTrackingForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiX, FiSearch } = FiIcons;

const SERPTracking = ({ websiteId }) => {
  const { 
    getSERPDataByWebsiteId, 
    addSERPData, 
    updateSERPData, 
    deleteSERPData 
  } = useWebsite();
  
  const serpData = getSERPDataByWebsiteId(websiteId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handleAddData = (dataObj) => {
    addSERPData({ ...dataObj, websiteId });
    setShowAddForm(false);
  };

  const handleEditData = (data) => {
    setEditingData(data);
  };

  const handleUpdateData = (dataObj) => {
    updateSERPData(editingData.id, dataObj);
    setEditingData(null);
  };

  const handleDeleteData = (id) => {
    if (window.confirm('Are you sure you want to delete this SERP tracking data?')) {
      deleteSERPData(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <SafeIcon icon={FiSearch} className="text-blue-600" />
          <span>SERP Tracking</span>
        </h3>
        
        {!showAddForm && !editingData && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiPlus} />
            <span>Track Keyword</span>
          </motion.button>
        )}
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 relative"
        >
          <button 
            onClick={() => setShowAddForm(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Add Keyword Tracking</h4>
          <SERPTrackingForm onSubmit={handleAddData} />
        </motion.div>
      )}

      {editingData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 relative"
        >
          <button 
            onClick={() => setEditingData(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Keyword Tracking</h4>
          <SERPTrackingForm 
            initialData={editingData} 
            onSubmit={handleUpdateData} 
            isEditing={true} 
          />
        </motion.div>
      )}

      {!showAddForm && !editingData && (
        <div className="space-y-4">
          {serpData.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <SafeIcon icon={FiSearch} className="text-4xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No keywords being tracked.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                Start tracking keywords
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serpData.map(data => (
                <SERPTrackingCard
                  key={data.id}
                  serpData={data}
                  onEdit={handleEditData}
                  onDelete={handleDeleteData}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SERPTracking;