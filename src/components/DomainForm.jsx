import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSave, FiPlus, FiX } = FiIcons;

const DomainForm = ({ initialData = {}, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    type: initialData.type || 'primary',
    registrar: initialData.registrar || '',
    registrationDate: initialData.registrationDate || '',
    expirationDate: initialData.expirationDate || '',
    autoRenew: initialData.autoRenew || false,
    dnsProvider: initialData.dnsProvider || '',
    nameservers: initialData.nameservers || [],
    subdomains: initialData.subdomains || [],
    status: initialData.status || 'active',
    notes: initialData.notes || '',
    cost: initialData.cost || '',
    billingCycle: initialData.billingCycle || 'yearly'
  });

  const [newNameserver, setNewNameserver] = useState('');
  const [newSubdomain, setNewSubdomain] = useState({ name: '', purpose: '' });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubdomainChange = (e) => {
    const { name, value } = e.target;
    setNewSubdomain(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addNameserver = () => {
    if (newNameserver.trim() && !formData.nameservers.includes(newNameserver.trim())) {
      setFormData(prev => ({
        ...prev,
        nameservers: [...prev.nameservers, newNameserver.trim()]
      }));
      setNewNameserver('');
    }
  };

  const removeNameserver = (nameserver) => {
    setFormData(prev => ({
      ...prev,
      nameservers: prev.nameservers.filter(ns => ns !== nameserver)
    }));
  };

  const addSubdomain = () => {
    if (newSubdomain.name.trim()) {
      const subdomain = {
        id: Date.now().toString(),
        name: newSubdomain.name.trim(),
        purpose: newSubdomain.purpose.trim() || 'General'
      };
      setFormData(prev => ({
        ...prev,
        subdomains: [...prev.subdomains, subdomain]
      }));
      setNewSubdomain({ name: '', purpose: '' });
    }
  };

  const removeSubdomain = (subdomainId) => {
    setFormData(prev => ({
      ...prev,
      subdomains: prev.subdomains.filter(sub => sub.id !== subdomainId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Domain Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domain Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domain Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="primary">Primary Domain</option>
              <option value="redirect">Redirect Domain</option>
              <option value="parked">Parked Domain</option>
              <option value="development">Development Domain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending Transfer</option>
              <option value="locked">Locked</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registrar
            </label>
            <input
              type="text"
              name="registrar"
              value={formData.registrar}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="GoDaddy, Namecheap, etc."
            />
          </div>
        </div>
      </div>

      {/* Registration Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Registration Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Date
            </label>
            <input
              type="date"
              name="registrationDate"
              value={formData.registrationDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date
            </label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Cost
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="15.99"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Cycle
            </label>
            <select
              name="billingCycle"
              value={formData.billingCycle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="biennial">Every 2 Years</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="autoRenew"
            checked={formData.autoRenew}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Auto-renew enabled
          </label>
        </div>
      </div>

      {/* DNS Configuration */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">DNS Configuration</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DNS Provider
          </label>
          <input
            type="text"
            name="dnsProvider"
            value={formData.dnsProvider}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Cloudflare, AWS Route 53, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nameservers
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newNameserver}
              onChange={(e) => setNewNameserver(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNameserver())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ns1.example.com"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addNameserver}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <SafeIcon icon={FiPlus} />
            </motion.button>
          </div>
          <div className="space-y-2">
            {formData.nameservers.map((nameserver, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-gray-700">{nameserver}</span>
                <button
                  type="button"
                  onClick={() => removeNameserver(nameserver)}
                  className="text-red-600 hover:text-red-800"
                >
                  <SafeIcon icon={FiX} className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subdomains */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Subdomains</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <input
            type="text"
            name="name"
            value={newSubdomain.name}
            onChange={handleSubdomainChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="api, blog, www"
          />
          <div className="flex space-x-2">
            <input
              type="text"
              name="purpose"
              value={newSubdomain.purpose}
              onChange={handleSubdomainChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Purpose (API, Blog, etc.)"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addSubdomain}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <SafeIcon icon={FiPlus} />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.subdomains.map((subdomain) => (
            <div key={subdomain.id} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{subdomain.name}</div>
                <div className="text-sm text-gray-600">{subdomain.purpose}</div>
              </div>
              <button
                type="button"
                onClick={() => removeSubdomain(subdomain.id)}
                className="text-red-600 hover:text-red-800"
              >
                <SafeIcon icon={FiX} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional notes about this domain..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <SafeIcon icon={FiSave} className="text-lg" />
          <span className="font-medium">
            {isEditing ? 'Update Domain' : 'Add Domain'}
          </span>
        </motion.button>
      </div>
    </form>
  );
};

export default DomainForm;