import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import CredentialCard from './CredentialCard';
import CredentialForm from './CredentialForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiX, FiLock } = FiIcons;

const CredentialsList = ({ websiteId }) => {
  const { 
    getCredentialsByWebsiteId, 
    addCredential, 
    updateCredential, 
    deleteCredential 
  } = useWebsite();
  
  const credentials = getCredentialsByWebsiteId(websiteId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);

  const handleAddCredential = (credentialData) => {
    addCredential({ ...credentialData, websiteId });
    setShowAddForm(false);
  };

  const handleEditCredential = (credential) => {
    setEditingCredential(credential);
  };

  const handleUpdateCredential = (credentialData) => {
    updateCredential(editingCredential.id, credentialData);
    setEditingCredential(null);
  };

  const handleDeleteCredential = (id) => {
    if (window.confirm('Are you sure you want to delete this credential?')) {
      deleteCredential(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <SafeIcon icon={FiLock} className="text-blue-600" />
          <span>Stored Credentials</span>
        </h3>
        
        {!showAddForm && !editingCredential && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Credential</span>
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
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Add New Credential</h4>
          <CredentialForm onSubmit={handleAddCredential} websiteId={websiteId} />
        </motion.div>
      )}

      {editingCredential && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 relative"
        >
          <button 
            onClick={() => setEditingCredential(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Credential</h4>
          <CredentialForm 
            initialData={editingCredential} 
            onSubmit={handleUpdateCredential} 
            isEditing={true} 
          />
        </motion.div>
      )}

      {!showAddForm && !editingCredential && (
        <div className="space-y-4">
          {credentials.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <SafeIcon icon={FiLock} className="text-4xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No credentials stored for this website.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                Add your first credential
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {credentials.map(credential => (
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                  onEdit={handleEditCredential}
                  onDelete={handleDeleteCredential}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CredentialsList;