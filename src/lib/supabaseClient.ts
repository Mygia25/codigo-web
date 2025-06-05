
import { createBrowserClient } from '@supabase/ssr';

// --- BEGIN Studio Prototyper Fallback ---
// These values are from your apphosting.yaml and are used as a fallback
// if the environment variables are detected as common placeholders.
// Ideally, your .env file should be correctly loaded by Next.js.
const FALLBACK_SUPABASE_URL = "https://itrklyodvrgowtanxvhn.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cmtseW9kdnJnb3d0YW54dmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjgwNTUsImV4cCI6MjA2Mjc0NDA1NX0.0dF0l5zl6wSww2gz26ThQV3AAcxzaA96f2t6zpwD7pI";
const URL_PLACEHOLDER = "YOUR_SUPABASE_URL_HERE";
// Assuming a common placeholder pattern for the key if it were also an issue.
const ANON_KEY_PLACEHOLDER = "YOUR_SUPABASE_ANON_KEY_HERE";
// --- END Studio Prototyper Fallback ---

// Attempt to read from environment variables
let supabaseUrlFromEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKeyFromEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log raw values for diagnostics
console.log('[SupabaseClientInit] Raw NEXT_PUBLIC_SUPABASE_URL from process.env:', supabaseUrlFromEnv);
console.log('[SupabaseClientInit] Raw NEXT_PUBLIC_SUPABASE_ANON_KEY from process.env:', supabaseAnonKeyFromEnv);

// --- BEGIN Studio Prototyper Fallback Logic ---
if (supabaseUrlFromEnv === URL_PLACEHOLDER) {
  console.warn(`[SupabaseClientInit] Detected placeholder for NEXT_PUBLIC_SUPABASE_URL. Using fallback value. Please ensure your .env file is correctly configured and Next.js server is restarted.`);
  supabaseUrlFromEnv = FALLBACK_SUPABASE_URL;
  // If URL was a placeholder, it's likely the key might also be a placeholder or missing.
  if (supabaseAnonKeyFromEnv === ANON_KEY_PLACEHOLDER || !supabaseAnonKeyFromEnv) {
    console.warn(`[SupabaseClientInit] Detected placeholder or missing value for NEXT_PUBLIC_SUPABASE_ANON_KEY while URL was a placeholder. Using fallback value. Please ensure your .env file is correctly configured and Next.js server is restarted.`);
    supabaseAnonKeyFromEnv = FALLBACK_SUPABASE_ANON_KEY;
  }
}
// --- END Studio Prototyper Fallback Logic ---

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
