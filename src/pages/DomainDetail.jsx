import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useWebsite } from '../context/WebsiteContext';
import DNSManagement from '../components/DNSManagement';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {
  FiArrowLeft, FiEdit2, FiTrash2, FiGlobe, FiCalendar,
  FiDollarSign, FiServer, FiLink, FiAlertTriangle
} = FiIcons;

const DomainDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDomainById, deleteDomain, websites, unlinkDomainFromWebsite } = useWebsite();
  
  const domain = getDomainById(id);

  if (!domain) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Domain not found</h2>
        <Link to="/domains" className="text-blue-600 hover:text-blue-800">
          Return to Domains
        </Link>
      </div>
    );
  }

  const linkedWebsites = websites.filter(site => 
    domain.linkedWebsites?.includes(site.id) || false
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      deleteDomain(id);
      navigate('/domains');
    }
  };

  const handleUnlinkWebsite = (websiteId) => {
    if (window.confirm('Are you sure you want to unlink this website from the domain?')) {
      unlinkDomainFromWebsite(id, websiteId);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-700';
      case 'redirect': return 'bg-green-100 text-green-700';
      case 'parked': return 'bg-yellow-100 text-yellow-700';
      case 'development': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'locked': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = () => {
    if (!domain.expirationDate) return false;
    const expirationDate = new Date(domain.expirationDate);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
  };

  const isExpired = () => {
    if (!domain.expirationDate) return false;
    const expirationDate = new Date(domain.expirationDate);
    const today = new Date();
    return expirationDate < today;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/domains')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <SafeIcon icon={FiArrowLeft} className="text-lg" />
          <span>Back to Domains</span>
        </motion.button>

        <div className="flex items-center space-x-3">
          <Link to={`/domain/${id}/edit`}>
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
                <SafeIcon icon={FiGlobe} className="text-3xl text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">{domain.name}</h1>
                {(isExpired() || isExpiringSoon()) && (
                  <SafeIcon 
                    icon={FiAlertTriangle} 
                    className={`text-2xl ${isExpired() ? 'text-red-500' : 'text-yellow-500'}`} 
                  />
                )}
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(domain.type)}`}>
                  {domain.type} domain
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(domain.status)}`}>
                  {domain.status}
                </span>
                {domain.autoRenew && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Auto-renew enabled
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Domain Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Registration Details</h3>
              
              {domain.registrar && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registrar</label>
                  <p className="text-gray-900">{domain.registrar}</p>
                </div>
              )}

              {domain.registrationDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCalendar} className="text-gray-600" />
                    <span className="text-gray-900">
                      {format(new Date(domain.registrationDate), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              )}

              {domain.expirationDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCalendar} className="text-gray-600" />
                    <span className={`${isExpired() ? 'text-red-600 font-medium' : isExpiringSoon() ? 'text-yellow-600 font-medium' : 'text-gray-900'}`}>
                      {format(new Date(domain.expirationDate), 'MMMM dd, yyyy')}
                      {isExpired() && ' (EXPIRED)'}
                      {isExpiringSoon() && ' (Expiring Soon)'}
                    </span>
                  </div>
                </div>
              )}

              {domain.cost && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiDollarSign} className="text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      ${domain.cost}
                    </span>
                    <span className="text-gray-600">/{domain.billingCycle}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">DNS Configuration</h3>
              
              {domain.dnsProvider && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DNS Provider</label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiServer} className="text-purple-600" />
                    <span className="text-gray-900">{domain.dnsProvider}</span>
                  </div>
                </div>
              )}

              {domain.nameservers && domain.nameservers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Nameservers</label>
                  <div className="space-y-2">
                    {domain.nameservers.map((nameserver, index) => (
                      <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-gray-900 font-mono text-sm">{nameserver}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subdomains */}
          {domain.subdomains && domain.subdomains.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subdomains</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domain.subdomains.map((subdomain) => (
                  <div key={subdomain.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900">{subdomain.name}.{domain.name}</div>
                    <div className="text-sm text-gray-600">{subdomain.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked Websites */}
          {linkedWebsites.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Linked Websites</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkedWebsites.map((website) => (
                  <div key={website.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex-1">
                      <Link
                        to={`/website/${website.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {website.name}
                      </Link>
                      <div className="text-sm text-gray-600">{website.type} website</div>
                    </div>
                    <button
                      onClick={() => handleUnlinkWebsite(website.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Unlink
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {domain.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{domain.notes}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span> {format(new Date(domain.createdAt), 'MMMM dd, yyyy HH:mm')}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {format(new Date(domain.updatedAt), 'MMMM dd, yyyy HH:mm')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DNS Management Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-8">
        <DNSManagement domainId={id} />
      </div>
    </div>
  );
};

export default DomainDetail;