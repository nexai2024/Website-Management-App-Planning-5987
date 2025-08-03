import supabase from '../lib/supabase';

// API/Webhook operations
export const fetchAPIWebhooksByWebsiteId = async (websiteId) => {
  const { data, error } = await supabase
    .from('api_webhooks_mgr')
    .select('*')
    .contains('linked_websites', [websiteId]);

  if (error) throw error;
  return data;
};

export const createAPIWebhook = async (webhookData) => {
  const { data, error } = await supabase
    .from('api_webhooks_mgr')
    .insert([webhookData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateAPIWebhook = async (id, webhookData) => {
  const { data, error } = await supabase
    .from('api_webhooks_mgr')
    .update(webhookData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteAPIWebhook = async (id) => {
  const { error } = await supabase
    .from('api_webhooks_mgr')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};