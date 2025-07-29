import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import DomainCard from './DomainCard';
import DomainForm from './DomainForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiX, FiGlobe, FiLink } = FiIcons;

const DomainsList = ({ websiteId }) => {
  const { 
    getDomainsByWebsiteId, 
    addDomain, 
    updateDomain, 
    deleteDomain,
    linkDomainToWebsite,
    domains
  } = useWebsite();
  
  const linkedDomains = websiteId ? getDomainsByWebsiteId(websiteId) : domains;
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const availableDomains = websiteId 
    ? domains.filter(domain => !domain.linkedWebsites?.includes(websiteId))
    : [];

  const handleAddDomain = (domainData) => {
    const newDomainId = Date.now().toString();
    const domainWithId = { ...domainData, id: newDomainId };
    
    if (websiteId) {
      domainWithId.linkedWebsites = [websiteId];
    }
    
    addDomain(domainWithId);
    setShowAddForm(false);
  };

  const handleEditDomain = (domain) => {
    setEditingDomain(domain);
  };

  const handleUpdateDomain = (domainData) => {
    updateDomain(editingDomain.id, domainData);
    setEditingDomain(null);
  };

  const handleDeleteDomain = (id) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      deleteDomain(id);
    }
  };

  const handleLinkExistingDomain = (domainId) => {
    if (websiteId) {
      linkDomainToWebsite(domainId, websiteId);
      setShowLinkModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <SafeIcon icon={FiGlobe} className="text-blue-600" />
          <span>{websiteId ? 'Linked Domains' : 'All Domains'}</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          {websiteId && availableDomains.length > 0 && !showAddForm && !editingDomain && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLinkModal(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <SafeIcon icon={FiLink} />
              <span>Link Existing</span>
            </motion.button>
          )}
          
          {!showAddForm && !editingDomain && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <SafeIcon icon={FiPlus} />
              <span>Add Domain</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Link Existing Domain Modal */}
      {showLinkModal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 relative"
        >
          <button 
            onClick={() => setShowLinkModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Link Existing Domain</h4>
          <div className="space-y-2">
            {availableDomains.map((domain) => (
              <div key={domain.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{domain.name}</div>
                  <div className="text-sm text-gray-600">{domain.type} domain</div>
                </div>
                <button
                  onClick={() => handleLinkExistingDomain(domain.id)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Link
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Add New Domain</h4>
          <DomainForm onSubmit={handleAddDomain} />
        </motion.div>
      )}

      {editingDomain && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 relative"
        >
          <button 
            onClick={() => setEditingDomain(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Domain</h4>
          <DomainForm 
            initialData={editingDomain} 
            onSubmit={handleUpdateDomain} 
            isEditing={true} 
          />
        </motion.div>
      )}

      {!showAddForm && !editingDomain && !showLinkModal && (
        <div className="space-y-4">
          {linkedDomains.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <SafeIcon icon={FiGlobe} className="text-4xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {websiteId ? 'No domains linked to this website.' : 'No domains added yet.'}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                {websiteId ? 'Add your first domain' : 'Add a domain'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {linkedDomains.map(domain => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  onEdit={handleEditDomain}
                  onDelete={handleDeleteDomain}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DomainsList;