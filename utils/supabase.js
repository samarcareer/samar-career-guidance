import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Security & Debugging check: Agar .env file mein keys miss ho jayein, toh console mein bata dega
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env.local file.");
}

// Create a single, secure instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
