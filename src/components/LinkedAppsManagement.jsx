import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import LinkedAppCard from './LinkedAppCard';
import LinkedAppForm from './LinkedAppForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiX, FiPackage } = FiIcons;

const LinkedAppsManagement = ({ websiteId }) => {
  const { 
    getLinkedAppsByWebsiteId, 
    addLinkedApp, 
    updateLinkedApp, 
    deleteLinkedApp 
  } = useWebsite();
  
  const linkedApps = getLinkedAppsByWebsiteId(websiteId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const handleAddApp = (appData) => {
    const appWithWebsite = {
      ...appData,
      linkedWebsites: [websiteId]
    };
    addLinkedApp(appWithWebsite);
    setShowAddForm(false);
  };

  const handleEditApp = (app) => {
    setEditingApp(app);
  };

  const handleUpdateApp = (appData) => {
    updateLinkedApp(editingApp.id, appData);
    setEditingApp(null);
  };

  const handleDeleteApp = (id) => {
    if (window.confirm('Are you sure you want to delete this linked app?')) {
      deleteLinkedApp(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <SafeIcon icon={FiPackage} className="text-blue-600" />
          <span>Linked Apps & Services</span>
        </h3>
        
        {!showAddForm && !editingApp && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiPlus} />
            <span>Link App</span>
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
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Link New App</h4>
          <LinkedAppForm onSubmit={handleAddApp} />
        </motion.div>
      )}

      {editingApp && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 relative"
        >
          <button 
            onClick={() => setEditingApp(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Linked App</h4>
          <LinkedAppForm 
            initialData={editingApp} 
            onSubmit={handleUpdateApp} 
            isEditing={true} 
          />
        </motion.div>
      )}

      {!showAddForm && !editingApp && (
        <div className="space-y-4">
          {linkedApps.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <SafeIcon icon={FiPackage} className="text-4xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No apps or services linked.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                Link your first app
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {linkedApps.map(app => (
                <LinkedAppCard
                  key={app.id}
                  app={app}
                  onEdit={handleEditApp}
                  onDelete={handleDeleteApp}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedAppsManagement;