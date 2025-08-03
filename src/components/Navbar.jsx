import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabase } from '../context/SupabaseContext';

const { 
  FiGlobe, FiPlus, FiHome, FiLock, FiUser, 
  FiLogOut, FiSettings, FiChevronDown, FiCreditCard 
} = FiIcons;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useSupabase();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
                  isActive('/') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={FiHome} className="text-lg" />
                <span className="font-medium">Dashboard</span>
              </motion.div>
            </Link>
            
            <Link to="/domains">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/domains') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={FiGlobe} className="text-lg" />
                <span className="font-medium">Domains</span>
              </motion.div>
            </Link>
            
            <Link to="/pricing">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/pricing') ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={FiCreditCard} className="text-lg" />
                <span className="font-medium">Pricing</span>
              </motion.div>
            </Link>
            
            {user ? (
              <>
                <Link to="/add">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive('/add') ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <SafeIcon icon={FiPlus} className="text-lg" />
                    <span className="font-medium">Add Website</span>
                  </motion.div>
                </Link>
                
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="text-lg" />
                    </div>
                    <SafeIcon icon={FiChevronDown} className={`text-sm transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200"
                      >
                        <Link
                          to="/account"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <SafeIcon icon={FiSettings} className="mr-2" />
                          Account Settings
                        </Link>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleSignOut();
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          <SafeIcon icon={FiLogOut} className="mr-2" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link to="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <SafeIcon icon={FiUser} className="text-lg" />
                  <span className="font-medium">Sign In</span>
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;