import supabase from '../lib/supabase';

// Domain operations
export const fetchDomains = async () => {
  const { data, error } = await supabase
    .from('domains_mgr')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchDomainById = async (id) => {
  const { data, error } = await supabase
    .from('domains_mgr')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createDomain = async (domainData) => {
  const { data, error } = await supabase
    .from('domains_mgr')
    .insert([domainData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateDomain = async (id, domainData) => {
  const { data, error } = await supabase
    .from('domains_mgr')
    .update(domainData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteDomain = async (id) => {
  const { error } = await supabase
    .from('domains_mgr')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const fetchDomainsByWebsiteId = async (websiteId) => {
  const { data, error } = await supabase
    .from('domains_mgr')
    .select('*')
    .contains('linked_websites', [websiteId]);

  if (error) throw error;
  return data;
};

export const linkDomainToWebsite = async (domainId, websiteId) => {
  // First get the current domain to access its linked_websites
  const { data: domain, error: fetchError } = await supabase
    .from('domains_mgr')
    .select('linked_websites')
    .eq('id', domainId)
    .single();

  if (fetchError) throw fetchError;
  
  // Update with the new website ID added to the array
  const linkedWebsites = domain.linked_websites || [];
  if (!linkedWebsites.includes(websiteId)) {
    linkedWebsites.push(websiteId);
  }

  const { data, error } = await supabase
    .from('domains_mgr')
    .update({ linked_websites: linkedWebsites })
    .eq('id', domainId)
    .select();

  if (error) throw error;
  return data[0];
};

export const unlinkDomainFromWebsite = async (domainId, websiteId) => {
  // First get the current domain to access its linked_websites
  const { data: domain, error: fetchError } = await supabase
    .from('domains_mgr')
    .select('linked_websites')
    .eq('id', domainId)
    .single();

  if (fetchError) throw fetchError;
  
  // Update with the website ID removed from the array
  const linkedWebsites = domain.linked_websites || [];
  const updatedLinkedWebsites = linkedWebsites.filter(id => id !== websiteId);

  const { data, error } = await supabase
    .from('domains_mgr')
    .update({ linked_websites: updatedLinkedWebsites })
    .eq('id', domainId)
    .select();

  if (error) throw error;
  return data[0];
};