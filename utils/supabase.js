// Local package missing hone par yeh direct browser global memory se client uthayega
export const supabase = typeof window !== 'undefined' && window.supabase 
  ? window.supabase.createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  : {
      // Server-side fallback placeholder taaki Next.js compile crash na ho
      from: () => ({ insert: async () => ({ data: null, error: null }) })
    };