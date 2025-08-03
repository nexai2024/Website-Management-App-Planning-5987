import supabase from '../lib/supabase';

// Linked App operations
export const fetchLinkedAppsByWebsiteId = async (websiteId) => {
  const { data, error } = await supabase
    .from('linked_apps_mgr')
    .select('*')
    .contains('linked_websites', [websiteId]);

  if (error) throw error;
  return data;
};

export const createLinkedApp = async (appData) => {
  const { data, error } = await supabase
    .from('linked_apps_mgr')
    .insert([appData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateLinkedApp = async (id, appData) => {
  const { data, error } = await supabase
    .from('linked_apps_mgr')
    .update(appData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteLinkedApp = async (id) => {
  const { error } = await supabase
    .from('linked_apps_mgr')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};