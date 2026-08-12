// pages/api/admin-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Verify User Session Securely via Cookies
    const supabaseSessionClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies[name];
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabaseSessionClient.auth.getSession();
    
    if (sessionError || !session) {
      return res.status(401).json({ error: 'Unauthorized: No valid session' });
    }

    // 2. ⚡ MULTI-ADMIN VALIDATION LOGIC
    const adminEmailsString = process.env.ADMIN_EMAIL;
    
    if (!adminEmailsString) {
      console.error("🚨 CRITICAL: ADMIN_EMAIL is missing in Server Environment Variables!");
      return res.status(500).json({ error: 'Server Configuration Error' });
    }

    // Convert comma-separated string from Vercel into an array and clean up spaces
    const authorizedAdmins = adminEmailsString.split(',').map(email => email.trim().toLowerCase());
    const currentUserEmail = session.user.email?.toLowerCase();

    // Check if the current user's email exists in the authorized list
    if (!currentUserEmail || !authorizedAdmins.includes(currentUserEmail)) {
      console.warn(`Admin access denied for: ${currentUserEmail}`);
      return res.status(403).json({ error: 'Forbidden: Admin access denied' });
    }

    // 3. MASTER KEY ACTIVATION (Runs only on server)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error("🚨 CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing!");
      return res.status(500).json({ error: 'Internal Server Error: Missing Master Key' });
    }

    // Create Admin Client to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // 4. Fetch Data securely using Master Key
    const [profilesRes, assessmentsRes] = await Promise.all([
      supabaseAdmin.from('student_profiles').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('user_assessments').select('*').order('created_at', { ascending: false })
    ]);

    if (profilesRes.error) throw profilesRes.error;
    if (assessmentsRes.error) throw assessmentsRes.error;

    // Send isolated, pure data back to frontend
    res.status(200).json({
      profiles: profilesRes.data,
      assessments: assessmentsRes.data
    });

  } catch (err: any) {
    console.error("Admin API Error:", err);
    res.status(500).json({ error: 'Failed to securely fetch data' });
  }
}
