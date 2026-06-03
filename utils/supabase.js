import { createClient } from '@supabase/supabase-js';

// Fallback logic: Agar Vercel build time par variable read na kar paye, 
// toh code crash nahi hoga balki ek temporary placeholder use kar lega.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Console warning taaki developer ko pata chal jaye agar keys missing hain
if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn("⚠️ Warning: Supabase URL is missing. Please check Vercel Environment Variables.");
}

// Create a single, secure instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
