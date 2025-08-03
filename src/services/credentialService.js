import supabase from '../lib/supabase';

// Credential operations
export const fetchCredentialsByWebsiteId = async (websiteId) => {
  const { data, error } = await supabase
    .from('credentials_mgr')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createCredential = async (credentialData) => {
  const { data, error } = await supabase
    .from('credentials_mgr')
    .insert([credentialData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateCredential = async (id, credentialData) => {
  const { data, error } = await supabase
    .from('credentials_mgr')
    .update(credentialData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteCredential = async (id) => {
  const { error } = await supabase
    .from('credentials_mgr')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};