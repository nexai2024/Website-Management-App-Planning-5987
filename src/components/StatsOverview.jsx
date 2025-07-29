import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useWebsite } from '../context/WebsiteContext';

const { FiCode, FiCreditCard, FiBookmark, FiTrendingUp, FiLock, FiGlobe } = FiIcons;

const StatsOverview = ({ websites }) => {
  const { credentials, domains } = useWebsite();
  
  const ownedSites = websites.filter(site => site.type === 'owned').length;
  const subscriptions = websites.filter(site => site.type === 'subscription').length;
  const tracked = websites.filter(site => site.type === 'tracked').length;
  const total = websites.length;
  const totalCredentials = credentials.length;
  const totalDomains = domains.length;

  const stats = [
    {
      label: 'Owned Sites',
      value: ownedSites,
      icon: FiCode,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      label: 'Subscriptions',
      value: subscriptions,
      icon: FiCreditCard,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      label: 'Tracked Sites',
      value: tracked,
      icon: FiBookmark,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      label: 'Domains',
      value: totalDomains,
      icon: FiGlobe,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      label: 'Credentials',
      value: totalCredentials,
      icon: FiLock,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      label: 'Total Sites',
      value: total,
      icon: FiTrendingUp,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} p-6 rounded-xl border border-gray-200 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <SafeIcon icon={stat.icon} className="text-xl text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;