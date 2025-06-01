
import { createBrowserClient } from '@supabase/ssr';

// Attempt to read from environment variables
const supabaseUrlFromEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKeyFromEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log raw values for diagnostics
console.log('[SupabaseClientInit] Raw NEXT_PUBLIC_SUPABASE_URL from process.env:', supabaseUrlFromEnv);
console.log('[SupabaseClientInit] Raw NEXT_PUBLIC_SUPABASE_ANON_KEY from process.env:', supabaseAnonKeyFromEnv);

// Check if Supabase URL is defined, is a string, and is not empty
if (typeof supabaseUrlFromEnv !== 'string' || !supabaseUrlFromEnv || supabaseUrlFromEnv.trim() === '') {
  const errorMessage = `Supabase URL is invalid or not set. Value received: "${supabaseUrlFromEnv}". Please ensure NEXT_PUBLIC_SUPABASE_URL is correctly set in your .env file (e.g., https://<your-project-ref>.supabase.co) and restart the development server.`;
  console.error(`[SupabaseClientInit] ERROR: ${errorMessage}`);
  throw new Error(errorMessage);
}

// Check if Supabase URL starts with https://
if (!supabaseUrlFromEnv.startsWith('https://')) {
  const errorMessage = `Supabase URL must start with "https://". Value received: "${supabaseUrlFromEnv}". Please correct NEXT_PUBLIC_SUPABASE_URL in your .env file and restart your development server.`;
  console.error(`[SupabaseClientInit] ERROR: ${errorMessage}`);
  throw new Error(errorMessage);
}

// Check if Supabase Anon Key is defined, is a string, and is not empty
if (typeof supabaseAnonKeyFromEnv !== 'string' || !supabaseAnonKeyFromEnv || supabaseAnonKeyFromEnv.trim() === '') {
  const errorMessage = `Supabase Anon Key is invalid or not set. Value received: "${supabaseAnonKeyFromEnv}". Please ensure NEXT_PUBLIC_SUPABASE_ANON_KEY is correctly set in your .env file and restart the development server.`;
  console.error(`[SupabaseClientInit] ERROR: ${errorMessage}`);
  throw new Error(errorMessage);
}

// At this point, supabaseUrlFromEnv and supabaseAnonKeyFromEnv are confirmed to be non-empty strings.
const supabaseUrl: string = supabaseUrlFromEnv;
const supabaseAnonKey: string = supabaseAnonKeyFromEnv;

console.log('[SupabaseClientInit] Attempting to create Supabase client with validated URL:', supabaseUrl);
// Avoid logging the full anon key for security, just confirm its presence.
console.log('[SupabaseClientInit] Supabase Anon Key is present:', !!supabaseAnonKey);

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

console.log('[SupabaseClientInit] Supabase client created successfully.');
