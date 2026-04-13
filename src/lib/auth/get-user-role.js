import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

/**
 * Retrieves the current user's profile and role.
 * Uses React cache to avoid multiple DB hits in the same request.
 * @returns {Promise<object|null>}
 */
export const getUserProfile = cache(async () => {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
});

/**
 * Fast helper to get just the role string.
 * @returns {Promise<string>}
 */
export const getUserRole = async () => {
  const profile = await getUserProfile();
  return profile?.role || 'viewer'; // Fallback to safest role
};
