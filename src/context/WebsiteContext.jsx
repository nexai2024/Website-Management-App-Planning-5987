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
  const [dnsRecords, setDnsRecords] = useState([]);
  const [serpData, setSerpData] = useState([]);
  const [linkedApps, setLinkedApps] = useState([]);
  const [apiWebhooks, setApiWebhooks] = useState([]);

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

    const savedDnsRecords = localStorage.getItem('dnsRecords');
    if (savedDnsRecords) {
      setDnsRecords(JSON.parse(savedDnsRecords));
    }

    const savedSerpData = localStorage.getItem('serpData');
    if (savedSerpData) {
      setSerpData(JSON.parse(savedSerpData));
    }

    const savedLinkedApps = localStorage.getItem('linkedApps');
    if (savedLinkedApps) {
      setLinkedApps(JSON.parse(savedLinkedApps));
    }

    const savedApiWebhooks = localStorage.getItem('apiWebhooks');
    if (savedApiWebhooks) {
      setApiWebhooks(JSON.parse(savedApiWebhooks));
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

  useEffect(() => {
    localStorage.setItem('dnsRecords', JSON.stringify(dnsRecords));
  }, [dnsRecords]);

  useEffect(() => {
    localStorage.setItem('serpData', JSON.stringify(serpData));
  }, [serpData]);

  useEffect(() => {
    localStorage.setItem('linkedApps', JSON.stringify(linkedApps));
  }, [linkedApps]);

  useEffect(() => {
    localStorage.setItem('apiWebhooks', JSON.stringify(apiWebhooks));
  }, [apiWebhooks]);

  // Website management
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
    setCredentials(prev => prev.filter(cred => cred.websiteId !== id));
    setSerpData(prev => prev.filter(data => data.websiteId !== id));
    setLinkedApps(prev => prev.filter(app => !app.linkedWebsites?.includes(id)));
    setApiWebhooks(prev => prev.filter(item => !item.linkedWebsites?.includes(id)));
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
    setDnsRecords(prev => prev.filter(record => record.domainId !== id));
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

  // DNS Records management
  const addDNSRecord = (record) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDnsRecords(prev => [...prev, newRecord]);
  };

  const updateDNSRecord = (id, updatedRecord) => {
    setDnsRecords(prev => prev.map(record => 
      record.id === id 
        ? { ...updatedRecord, id, updatedAt: new Date().toISOString() }
        : record
    ));
  };

  const deleteDNSRecord = (id) => {
    setDnsRecords(prev => prev.filter(record => record.id !== id));
  };

  const getDNSRecordsByDomainId = (domainId) => {
    return dnsRecords.filter(record => record.domainId === domainId);
  };

  // SERP Data management
  const addSERPData = (data) => {
    const newData = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSerpData(prev => [...prev, newData]);
  };

  const updateSERPData = (id, updatedData) => {
    setSerpData(prev => prev.map(data => 
      data.id === id 
        ? { ...updatedData, id, updatedAt: new Date().toISOString() }
        : data
    ));
  };

  const deleteSERPData = (id) => {
    setSerpData(prev => prev.filter(data => data.id !== id));
  };

  const getSERPDataByWebsiteId = (websiteId) => {
    return serpData.filter(data => data.websiteId === websiteId);
  };

  // Linked Apps management
  const addLinkedApp = (app) => {
    const newApp = {
      ...app,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLinkedApps(prev => [...prev, newApp]);
  };

  const updateLinkedApp = (id, updatedApp) => {
    setLinkedApps(prev => prev.map(app => 
      app.id === id 
        ? { ...updatedApp, id, updatedAt: new Date().toISOString() }
        : app
    ));
  };

  const deleteLinkedApp = (id) => {
    setLinkedApps(prev => prev.filter(app => app.id !== id));
  };

  const getLinkedAppsByWebsiteId = (websiteId) => {
    return linkedApps.filter(app => 
      app.linkedWebsites?.includes(websiteId) || false
    );
  };

  // API/Webhook management
  const addAPIWebhook = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setApiWebhooks(prev => [...prev, newItem]);
  };

  const updateAPIWebhook = (id, updatedItem) => {
    setApiWebhooks(prev => prev.map(item => 
      item.id === id 
        ? { ...updatedItem, id, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const deleteAPIWebhook = (id) => {
    setApiWebhooks(prev => prev.filter(item => item.id !== id));
  };

  const getAPIWebhooksByWebsiteId = (websiteId) => {
    return apiWebhooks.filter(item => 
      item.linkedWebsites?.includes(websiteId) || false
    );
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
      unlinkDomainFromWebsite,
      dnsRecords,
      addDNSRecord,
      updateDNSRecord,
      deleteDNSRecord,
      getDNSRecordsByDomainId,
      serpData,
      addSERPData,
      updateSERPData,
      deleteSERPData,
      getSERPDataByWebsiteId,
      linkedApps,
      addLinkedApp,
      updateLinkedApp,
      deleteLinkedApp,
      getLinkedAppsByWebsiteId,
      apiWebhooks,
      addAPIWebhook,
      updateAPIWebhook,
      deleteAPIWebhook,
      getAPIWebhooksByWebsiteId
    }}>
      {children}
    </WebsiteContext.Provider>
  );
};