import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import {
  fetchDomains,
  fetchDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
  fetchDomainsByWebsiteId,
  linkDomainToWebsite,
  unlinkDomainFromWebsite
} from '../services/domainService';
import {
  fetchDNSRecordsByDomainId,
  createDNSRecord,
  updateDNSRecord,
  deleteDNSRecord
} from '../services/dnsRecordService';
import {
  fetchWebsites,
  fetchWebsiteById,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  fetchWebsitesByType
} from '../services/websiteService';
import {
  fetchCredentialsByWebsiteId,
  createCredential,
  updateCredential,
  deleteCredential
} from '../services/credentialService';
import {
  fetchSERPDataByWebsiteId,
  createSERPData,
  updateSERPData,
  deleteSERPData
} from '../services/serpService';
import {
  fetchLinkedAppsByWebsiteId,
  createLinkedApp,
  updateLinkedApp,
  deleteLinkedApp
} from '../services/linkedAppService';
import {
  fetchAPIWebhooksByWebsiteId,
  createAPIWebhook,
  updateAPIWebhook,
  deleteAPIWebhook
} from '../services/apiWebhookService';

const SupabaseContext = createContext();

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export const SupabaseProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [domains, setDomains] = useState([]);
  const [error, setError] = useState(null);

  // Check for session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user || null);
        
        // Load initial data if user is authenticated
        if (data?.session?.user) {
          await loadInitialData();
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          await loadInitialData();
        } else {
          // Clear data on sign out
          setWebsites([]);
          setDomains([]);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load websites
      const websitesData = await fetchWebsites();
      setWebsites(websitesData);

      // Load domains
      const domainsData = await fetchDomains();
      setDomains(domainsData);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auth functions
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserPassword = async (password) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Profile operations
  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles_a7b3c9')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { error } = await supabase
        .from('profiles_a7b3c9')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Subscription and pricing operations
  const fetchPricingTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_tiers_a7b3c9')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchPricingTierById = async (tierId) => {
    try {
      const { data, error } = await supabase
        .from('pricing_tiers_a7b3c9')
        .select('*')
        .eq('id', tierId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions_a7b3c9')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const upgradeTier = async (tierId) => {
    try {
      // First check if user already has a subscription
      const { data: existingSub, error: fetchError } = await supabase
        .from('subscriptions_a7b3c9')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      if (existingSub) {
        // Update existing subscription
        const { error } = await supabase
          .from('subscriptions_a7b3c9')
          .update({
            tier_id: tierId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSub.id);
        
        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('subscriptions_a7b3c9')
          .insert({
            user_id: user.id,
            tier_id: tierId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          });
        
        if (error) throw error;
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Domain operations with state updates
  const addDomain = async (domainData) => {
    try {
      const newDomain = await createDomain(domainData);
      setDomains(prev => [...prev, newDomain]);
      return newDomain;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateDomainData = async (id, domainData) => {
    try {
      const updatedDomain = await updateDomain(id, domainData);
      setDomains(prev => prev.map(domain => domain.id === id ? updatedDomain : domain));
      return updatedDomain;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeDomain = async (id) => {
    try {
      await deleteDomain(id);
      setDomains(prev => prev.filter(domain => domain.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Website operations with state updates
  const addWebsite = async (websiteData) => {
    try {
      const newWebsite = await createWebsite(websiteData);
      setWebsites(prev => [...prev, newWebsite]);
      return newWebsite;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateWebsiteData = async (id, websiteData) => {
    try {
      const updatedWebsite = await updateWebsite(id, websiteData);
      setWebsites(prev => prev.map(website => website.id === id ? updatedWebsite : website));
      return updatedWebsite;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeWebsite = async (id) => {
    try {
      await deleteWebsite(id);
      setWebsites(prev => prev.filter(website => website.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    websites,
    domains,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserPassword,
    fetchUserProfile,
    updateProfile,
    fetchPricingTiers,
    fetchPricingTierById,
    fetchUserSubscription,
    upgradeTier,

    // Domain operations
    fetchDomains,
    fetchDomainById,
    addDomain,
    updateDomainData,
    removeDomain,
    fetchDomainsByWebsiteId,
    linkDomainToWebsite,
    unlinkDomainFromWebsite,

    // DNS operations
    fetchDNSRecordsByDomainId,
    createDNSRecord,
    updateDNSRecord,
    deleteDNSRecord,

    // Website operations
    fetchWebsites,
    fetchWebsiteById,
    addWebsite,
    updateWebsiteData,
    removeWebsite,
    fetchWebsitesByType,

    // Credential operations
    fetchCredentialsByWebsiteId,
    createCredential,
    updateCredential,
    deleteCredential,

    // SERP operations
    fetchSERPDataByWebsiteId,
    createSERPData,
    updateSERPData,
    deleteSERPData,

    // Linked App operations
    fetchLinkedAppsByWebsiteId,
    createLinkedApp,
    updateLinkedApp,
    deleteLinkedApp,

    // API/Webhook operations
    fetchAPIWebhooksByWebsiteId,
    createAPIWebhook,
    updateAPIWebhook,
    deleteAPIWebhook,

    // Utility
    refreshData: loadInitialData
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};