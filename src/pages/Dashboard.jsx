import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import WebsiteCard from '../components/WebsiteCard';
import StatsOverview from '../components/StatsOverview';
import FilterTabs from '../components/FilterTabs';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus } = FiIcons;

const Dashboard = () => {
  const { websites } = useWebsite();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredWebsites = activeFilter === 'all' 
    ? websites 
    : websites.filter(site => site.type === activeFilter);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and track all your websites in one place</p>
        </div>
        
        <Link to="/add">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <SafeIcon icon={FiPlus} className="text-lg" />
            <span className="font-medium">Add Website</span>
          </motion.button>
        </Link>
      </div>

      <StatsOverview websites={websites} />
      
      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {filteredWebsites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="text-gray-400 mb-4">
            <SafeIcon icon={FiPlus} className="text-6xl mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No websites found</h3>
          <p className="text-gray-600 mb-6">
            {activeFilter === 'all' 
              ? "Start by adding your first website to track"
              : `No ${activeFilter} websites found`
            }
          </p>
          <Link to="/add">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Website
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map((website, index) => (
            <motion.div
              key={website.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WebsiteCard website={website} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;