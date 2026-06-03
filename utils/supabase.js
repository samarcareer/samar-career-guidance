import { createClient } from '@supabase/supabase-js';

// Ultimate Bulletproof Check: 
// Yeh check karega ki Vercel se aane wala URL sach mein 'http' se shuru hota hai ya nahi.
// Agar nahi (ya khali hai), toh yeh turant placeholder use kar lega taaki build crash na ho.
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co';

const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseAnonKey = rawKey !== '' ? rawKey : 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn("⚠️ Warning: Using Supabase placeholder. Valid URL not found during build.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
