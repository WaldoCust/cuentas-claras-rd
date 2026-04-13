/**
 * Environment Configuration & Validation Engine
 * Ensures the platform doesn't start with missing critical variables.
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'GOOGLE_GEMINI_API_KEY'
];

/**
 * Validates that all required environment variables are present.
 * Throws an error with a clear message if any are missing.
 */
export function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    const errorMsg = `[CRITICAL CONFIG ERROR] Missing required environment variables: ${missing.join(', ')}. Please check your .env.local or deployment settings.`;
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    } else {
      console.error('❌ ' + errorMsg);
    }
  }
}

/**
 * Centralized configuration object
 */
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  ai: {
    geminiKey: process.env.GOOGLE_GEMINI_API_KEY,
  },
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',
};

// Auto-validate on import
if (typeof window === 'undefined') {
  validateEnv();
}
