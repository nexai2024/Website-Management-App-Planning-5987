import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useWebsite } from '../context/WebsiteContext';
import CredentialsList from '../components/CredentialsList';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {
  FiArrowLeft, FiEdit2, FiTrash2, FiExternalLink, FiCode,
  FiCreditCard, FiBookmark, FiCalendar, FiDollarSign,
  FiGithub, FiServer, FiGlobe, FiTag, FiLock
} = FiIcons;

const WebsiteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWebsiteById, deleteWebsite } = useWebsite();
  
  const website = getWebsiteById(id);

  if (!website) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Website not found</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this website? All associated credentials will also be deleted.')) {
      deleteWebsite(id);
      navigate('/');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'owned': return FiCode;
      case 'subscription': return FiCreditCard;
      case 'tracked': return FiBookmark;
      default: return FiCode;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'owned': return 'bg-blue-100 text-blue-700';
      case 'subscription': return 'bg-green-100 text-green-700';
      case 'tracked': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'development': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTypeSpecificInfo = () => {
    switch (website.type) {
      case 'owned':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Development Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {website.repositoryUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Repository</label>
                  <a
                    href={website.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <SafeIcon icon={FiGithub} />
                    <span>View Repository</span>
                    <SafeIcon icon={FiExternalLink} className="text-sm" />
                  </a>
                </div>
              )}

              {website.hostingProvider && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hosting Provider</label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiServer} className="text-gray-600" />
                    <span className="text-gray-900">{website.hostingProvider}</span>
                  </div>
                </div>
              )}

              {website.domainRegistrar && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domain Registrar</label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiGlobe} className="text-gray-600" />
                    <span className="text-gray-900">{website.domainRegistrar}</span>
                  </div>
                </div>
              )}
            </div>

            {website.techStack && website.techStack.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tech Stack</label>
                <div className="flex flex-wrap gap-2">
                  {website.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Subscription Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {website.cost && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiDollarSign} className="text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      ${website.cost}
                    </span>
                    <span className="text-gray-600">/{website.billingCycle || 'month'}</span>
                  </div>
                </div>
              )}

              {website.renewalDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Renewal Date</label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCalendar} className="text-blue-600" />
                    <span className="text-gray-900">
                      {format(new Date(website.renewalDate), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              )}

              {website.subscriptionType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Type</label>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {website.subscriptionType}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case 'tracked':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Tracking Details</h3>
            
            {website.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {website.category}
                </span>
              </div>
            )}

            {website.tags && website.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {website.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      <SafeIcon icon={FiTag} className="text-xs" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {website.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{website.notes}</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <SafeIcon icon={FiArrowLeft} className="text-lg" />
          <span>Back to Dashboard</span>
        </motion.button>

        <div className="flex items-center space-x-3">
          <Link to={`/edit/${id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <SafeIcon icon={FiEdit2} />
              <span>Edit</span>
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <SafeIcon icon={FiTrash2} />
            <span>Delete</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{website.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(website.type)}`}>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={getTypeIcon(website.type)} className="text-sm" />
                    <span className="capitalize">{website.type}</span>
                  </div>
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(website.status)}`}>
                  {website.status}
                </span>
              </div>

              {website.url && (
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
                >
                  <span className="text-lg">{website.url}</span>
                  <SafeIcon icon={FiExternalLink} />
                </a>
              )}

              {website.description && (
                <p className="text-gray-700 text-lg leading-relaxed">{website.description}</p>
              )}
            </div>
          </div>

          {/* Type-specific information */}
          {renderTypeSpecificInfo()}

          {/* Metadata */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span> {format(new Date(website.createdAt), 'MMMM dd, yyyy HH:mm')}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {format(new Date(website.updatedAt), 'MMMM dd, yyyy HH:mm')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-8">
        <CredentialsList websiteId={id} />
      </div>
    </div>
  );
};

export default WebsiteDetail;