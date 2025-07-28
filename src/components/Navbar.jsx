import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiGlobe, FiPlus, FiHome, FiLock } = FiIcons;

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <SafeIcon icon={FiGlobe} className="text-2xl text-blue-600" />
            <span className="text-xl font-bold text-gray-800">WebTracker</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={FiHome} className="text-lg" />
                <span className="font-medium">Dashboard</span>
              </motion.div>
            </Link>

            <Link to="/add">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/add') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <SafeIcon icon={FiPlus} className="text-lg" />
                <span className="font-medium">Add Website</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;