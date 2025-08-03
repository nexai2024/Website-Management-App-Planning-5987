import supabase from '../lib/supabase';

// DNS Record operations
export const fetchDNSRecordsByDomainId = async (domainId) => {
  const { data, error } = await supabase
    .from('dns_records_mgr')
    .select('*')
    .eq('domain_id', domainId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createDNSRecord = async (recordData) => {
  const { data, error } = await supabase
    .from('dns_records_mgr')
    .insert([recordData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateDNSRecord = async (id, recordData) => {
  const { data, error } = await supabase
    .from('dns_records_mgr')
    .update(recordData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteDNSRecord = async (id) => {
  const { error } = await supabase
    .from('dns_records_mgr')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};