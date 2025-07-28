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

  useEffect(() => {
    const savedWebsites = localStorage.getItem('websites');
    if (savedWebsites) {
      setWebsites(JSON.parse(savedWebsites));
    }
    
    const savedCredentials = localStorage.getItem('credentials');
    if (savedCredentials) {
      setCredentials(JSON.parse(savedCredentials));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('websites', JSON.stringify(websites));
  }, [websites]);

  useEffect(() => {
    localStorage.setItem('credentials', JSON.stringify(credentials));
  }, [credentials]);

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
      getCredentialsByWebsiteId
    }}>
      {children}
    </WebsiteContext.Provider>
  );
};