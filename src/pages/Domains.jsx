import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DomainsList from '../components/DomainsList';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiGlobe, FiPlus } = FiIcons;

const Domains = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <SafeIcon icon={FiGlobe} className="text-blue-600" />
            <span>Domain Management</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage all your domains and their configurations</p>
        </div>
      </div>

      <DomainsList />
    </div>
  );
};

export default Domains;