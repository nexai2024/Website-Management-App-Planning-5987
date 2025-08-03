import supabase from '../lib/supabase';

// Profile operations
export const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles_a7b3c9')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles_a7b3c9')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select();
  
  if (error) throw error;
  return data[0];
};