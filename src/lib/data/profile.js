import { createClient } from '@/lib/supabase/client';

export const getProfile = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return data;
};

export const updateProfile = async (profileData) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Auth required');

  // Map incoming data to schema
  const payload = {
    user_id: user.id,
    business_name: profileData.business_name || null,
    rnc: profileData.rnc || null,
    address: profileData.address || null,
    phone: profileData.phone || null,
    full_name: profileData.full_name || null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) {
    console.error("Error updating profile:", error);
    throw new Error("No pudimos guardar los cambios del perfil.");
  }
};
