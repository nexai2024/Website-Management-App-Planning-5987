import React, { createContext, useContext, useState, useEffect } from 'react';

const WebsiteContext = createContext();

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
};

export const WebsiteProvider = ({ children }) => {
  const [websites, setWebsites] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    const savedWebsites = localStorage.getItem('websites');
    if (savedWebsites) {
      setWebsites(JSON.parse(savedWebsites));
    }
    
    const savedCredentials = localStorage.getItem('credentials');
    if (savedCredentials) {
      setCredentials(JSON.parse(savedCredentials));
    }

    const savedDomains = localStorage.getItem('domains');
    if (savedDomains) {
      setDomains(JSON.parse(savedDomains));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('websites', JSON.stringify(websites));
  }, [websites]);

  useEffect(() => {
    localStorage.setItem('credentials', JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem('domains', JSON.stringify(domains));
  }, [domains]);

  const addWebsite = (website) => {
    const newWebsite = {
      ...website,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setWebsites(prev => [...prev, newWebsite]);
  };

  const updateWebsite = (id, updatedWebsite) => {
    setWebsites(prev => prev.map(site => 
      site.id === id 
        ? { ...updatedWebsite, id, updatedAt: new Date().toISOString() }
        : site
    ));
  };

  const deleteWebsite = (id) => {
    setWebsites(prev => prev.filter(site => site.id !== id));
    // Delete all credentials associated with this website
    setCredentials(prev => prev.filter(cred => cred.websiteId !== id));
    // Update domains to remove website association
    setDomains(prev => prev.map(domain => ({
      ...domain,
      linkedWebsites: domain.linkedWebsites?.filter(websiteId => websiteId !== id) || []
    })));
  };

  const getWebsiteById = (id) => {
    return websites.find(site => site.id === id);
  };

  const getWebsitesByType = (type) => {
    return websites.filter(site => site.type === type);
  };

  // Credential management
  const addCredential = (credential) => {
    const newCredential = {
      ...credential,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCredentials(prev => [...prev, newCredential]);
  };

  const updateCredential = (id, updatedCredential) => {
    setCredentials(prev => prev.map(cred => 
      cred.id === id 
        ? { ...updatedCredential, id, updatedAt: new Date().toISOString() }
        : cred
    ));
  };

  const deleteCredential = (id) => {
    setCredentials(prev => prev.filter(cred => cred.id !== id));
  };

  const getCredentialById = (id) => {
    return credentials.find(cred => cred.id === id);
  };

  const getCredentialsByWebsiteId = (websiteId) => {
    return credentials.filter(cred => cred.websiteId === websiteId);
  };

  // Domain management
  const addDomain = (domain) => {
    const newDomain = {
      ...domain,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedWebsites: domain.linkedWebsites || []
    };
    setDomains(prev => [...prev, newDomain]);
  };

  const updateDomain = (id, updatedDomain) => {
    setDomains(prev => prev.map(domain => 
      domain.id === id 
        ? { ...updatedDomain, id, updatedAt: new Date().toISOString() }
        : domain
    ));
  };

  const deleteDomain = (id) => {
    setDomains(prev => prev.filter(domain => domain.id !== id));
  };

  const getDomainById = (id) => {
    return domains.find(domain => domain.id === id);
  };

  const getDomainsByWebsiteId = (websiteId) => {
    return domains.filter(domain => 
      domain.linkedWebsites?.includes(websiteId) || false
    );
  };

  const linkDomainToWebsite = (domainId, websiteId) => {
    setDomains(prev => prev.map(domain => 
      domain.id === domainId 
        ? { 
            ...domain, 
            linkedWebsites: [...(domain.linkedWebsites || []), websiteId],
            updatedAt: new Date().toISOString()
          }
        : domain
    ));
  };

  const unlinkDomainFromWebsite = (domainId, websiteId) => {
    setDomains(prev => prev.map(domain => 
      domain.id === domainId 
        ? { 
            ...domain, 
            linkedWebsites: (domain.linkedWebsites || []).filter(id => id !== websiteId),
            updatedAt: new Date().toISOString()
          }
        : domain
    ));
  };

  return (
    <WebsiteContext.Provider value={{
      websites,
      addWebsite,
      updateWebsite,
      deleteWebsite,
      getWebsiteById,
      getWebsitesByType,
      credentials,
      addCredential,
      updateCredential,
      deleteCredential,
      getCredentialById,
      getCredentialsByWebsiteId,
      domains,
      addDomain,
      updateDomain,
      deleteDomain,
      getDomainById,
      getDomainsByWebsiteId,
      linkDomainToWebsite,
      unlinkDomainFromWebsite
    }}>
      {children}
    </WebsiteContext.Provider>
  );
};