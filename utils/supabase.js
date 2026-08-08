import { createBrowserClient } from '@supabase/ssr';

// Strict Environment Verification (Zero-Trust Protocol)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Agar Vercel par keys missing hongi, toh system securely crash hoga (No silent failures!)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("🚨 CRITICAL SECURITY HALT: Supabase Environment Variables are missing! Check your .env file or Vercel settings.");
}

// Next.js 14 Client-Side Engine (Safe from Session Leaks)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
