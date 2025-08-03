import supabase from '../lib/supabase';

// Website operations
export const fetchWebsites = async () => {
  const { data, error } = await supabase
    .from('websites_mgr')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchWebsiteById = async (id) => {
  const { data, error } = await supabase
    .from('websites_mgr')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createWebsite = async (websiteData) => {
  const { data, error } = await supabase
    .from('websites_mgr')
    .insert([websiteData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateWebsite = async (id, websiteData) => {
  const { data, error } = await supabase
    .from('websites_mgr')
    .update(websiteData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteWebsite = async (id) => {
  const { error } = await supabase
    .from('websites_mgr')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const fetchWebsitesByType = async (type) => {
  const { data, error } = await supabase
    .from('websites_mgr')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};