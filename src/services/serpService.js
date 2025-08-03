import supabase from '../lib/supabase';

// SERP data operations
export const fetchSERPDataByWebsiteId = async (websiteId) => {
  const { data, error } = await supabase
    .from('serp_data_mgr')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createSERPData = async (serpData) => {
  const { data, error } = await supabase
    .from('serp_data_mgr')
    .insert([serpData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateSERPData = async (id, serpData) => {
  const { data, error } = await supabase
    .from('serp_data_mgr')
    .update(serpData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteSERPData = async (id) => {
  const { error } = await supabase
    .from('serp_data_mgr')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};