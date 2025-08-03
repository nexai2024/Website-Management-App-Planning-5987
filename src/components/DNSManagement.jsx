import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import DNSRecordCard from './DNSRecordCard';
import DNSRecordForm from './DNSRecordForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiX, FiServer } = FiIcons;

const DNSManagement = ({ domainId }) => {
  const { 
    getDNSRecordsByDomainId, 
    addDNSRecord, 
    updateDNSRecord, 
    deleteDNSRecord 
  } = useWebsite();
  
  const dnsRecords = getDNSRecordsByDomainId(domainId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleAddRecord = (recordData) => {
    addDNSRecord({ ...recordData, domainId });
    setShowAddForm(false);
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
  };

  const handleUpdateRecord = (recordData) => {
    updateDNSRecord(editingRecord.id, recordData);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm('Are you sure you want to delete this DNS record?')) {
      deleteDNSRecord(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <SafeIcon icon={FiServer} className="text-blue-600" />
          <span>DNS Records</span>
        </h3>
        
        {!showAddForm && !editingRecord && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Record</span>
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
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Add DNS Record</h4>
          <DNSRecordForm onSubmit={handleAddRecord} />
        </motion.div>
      )}

      {editingRecord && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 relative"
        >
          <button 
            onClick={() => setEditingRecord(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
          
          <h4 className="text-lg font-medium text-gray-900 mb-4">Edit DNS Record</h4>
          <DNSRecordForm 
            initialData={editingRecord} 
            onSubmit={handleUpdateRecord} 
            isEditing={true} 
          />
        </motion.div>
      )}

      {!showAddForm && !editingRecord && (
        <div className="space-y-4">
          {dnsRecords.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <SafeIcon icon={FiServer} className="text-4xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No DNS records found.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                Add your first DNS record
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dnsRecords.map(record => (
                <DNSRecordCard
                  key={record.id}
                  record={record}
                  onEdit={handleEditRecord}
                  onDelete={handleDeleteRecord}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DNSManagement;