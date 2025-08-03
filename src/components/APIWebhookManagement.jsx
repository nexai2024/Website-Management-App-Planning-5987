import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import APIWebhookCard from './APIWebhookCard';
import APIWebhookForm from './APIWebhookForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiX, FiActivity } = FiIcons;

const APIWebhookManagement = ({ websiteId }) => {
  const { 
    getAPIWebhooksByWebsiteId, 
    addAPIWebhook, 
    updateAPIWebhook, 
    deleteAPIWebhook 
  } = useWebsite();
  
  const apiWebhooks = getAPIWebhooksByWebsiteId(websiteId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddItem = (itemData) => {
    const itemWithWebsite = {
      ...itemData,
      linkedWebsites: [websiteId]
    };
    addAPIWebhook(itemWithWebsite);
    setShowAddForm(false);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (itemData) => {
    updateAPIWebhook(editingItem.id, itemData);
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this API/Webhook?')) {
      deleteAPIWebhook(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <SafeIcon icon={FiActivity} className="text-blue-600" />
          <span>APIs & Webhooks</span>
        </h3>
        
        {!showAddForm && !editingItem && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add API/Webhook</span>
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
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Add API/Webhook</h4>
          <APIWebhookForm onSubmit={handleAddItem} />
        </motion.div>
      )}

      {editingItem && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 relative"
        >
          <button 
            onClick={() => setEditingItem(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Edit API/Webhook</h4>
          <APIWebhookForm 
            initialData={editingItem} 
            onSubmit={handleUpdateItem} 
            isEditing={true} 
          />
        </motion.div>
      )}

      {!showAddForm && !editingItem && (
        <div className="space-y-4">
          {apiWebhooks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <SafeIcon icon={FiActivity} className="text-4xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No APIs or webhooks configured.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                Add your first API/Webhook
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apiWebhooks.map(item => (
                <APIWebhookCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default APIWebhookManagement;