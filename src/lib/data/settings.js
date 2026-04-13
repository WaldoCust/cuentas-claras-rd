import { createClient } from '@/lib/supabase/client';

export const updatePassword = async (newPassword) => {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return true;
};

export const getNotificationSettings = async () => {
  // Placeholder for persistent DB settings
  return {
    email: true,
    browser: false,
    vencimiento_itbis: true
  };
};

export const updateDigitalSignature = async (fileBase64, password) => {
  // In a real e-CF app, you'd store this in Supabase Storage and track metadata
  // For now, we simulate success for the Beta architecture
  return { success: true, timestamp: new Date().toISOString() };
};
