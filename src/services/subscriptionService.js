import supabase from '../lib/supabase';

// Pricing tier operations
export const fetchPricingTiers = async () => {
  const { data, error } = await supabase
    .from('pricing_tiers_a7b3c9')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const fetchPricingTierById = async (tierId) => {
  const { data, error } = await supabase
    .from('pricing_tiers_a7b3c9')
    .select('*')
    .eq('id', tierId)
    .single();
  
  if (error) throw error;
  return data;
};

// User subscription operations
export const fetchUserSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions_a7b3c9')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createSubscription = async (subscriptionData) => {
  const { data, error } = await supabase
    .from('subscriptions_a7b3c9')
    .insert([subscriptionData])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateSubscription = async (subscriptionId, subscriptionData) => {
  const { data, error } = await supabase
    .from('subscriptions_a7b3c9')
    .update({
      ...subscriptionData,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const cancelSubscription = async (subscriptionId) => {
  const { data, error } = await supabase
    .from('subscriptions_a7b3c9')
    .update({
      status: 'cancelled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId)
    .select();
  
  if (error) throw error;
  return data[0];
};