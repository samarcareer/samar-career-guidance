// pages/api/admin-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Verify Session Securely via Cookies
    const supabaseSessionClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return req.cookies[name]; } } }
    );

    const { data: { session }, error: sessionError } = await supabaseSessionClient.auth.getSession();
    if (sessionError || !session) return res.status(401).json({ error: 'Unauthorized' });

    // 2. Validate Multi-Admin List
    const adminEmailsString = process.env.ADMIN_EMAIL;
    if (!adminEmailsString) return res.status(500).json({ error: 'Server Config Error' });

    const authorizedAdmins = adminEmailsString.split(',').map(e => e.trim().toLowerCase());
    const currentUserEmail = session.user.email?.toLowerCase();

    if (!currentUserEmail || !authorizedAdmins.includes(currentUserEmail)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // 3. MASTER KEY ACTIVATION
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) return res.status(500).json({ error: 'Missing Master Key' });

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // --- HANDLE GET (Fetch Data) ---
    if (req.method === 'GET') {
      const [profilesRes, assessmentsRes, matrixRes] = await Promise.all([
        supabaseAdmin.from('student_profiles').select('*').order('created_at', { ascending: false }),
        supabaseAdmin.from('user_assessments').select('*').order('created_at', { ascending: false }),
        supabaseAdmin.from('matrix_content').select('*').order('created_at', { ascending: false }) // Fetch Matrix Data
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (assessmentsRes.error) throw assessmentsRes.error;
      if (matrixRes.error) throw matrixRes.error;

      return res.status(200).json({
        profiles: profilesRes.data,
        assessments: assessmentsRes.data,
        matrixContent: matrixRes.data // New CMS Data
      });
    }

    // --- HANDLE POST (Add New Course) ---
    if (req.method === 'POST') {
        const { action, payload } = req.body;
        
        if (action === 'ADD_COURSE') {
            const { data, error } = await supabaseAdmin.from('matrix_content').insert([payload]).select();
            if (error) throw error;
            return res.status(200).json({ success: true, data });
        }
        return res.status(400).json({ error: 'Invalid Action' });
    }

    // --- HANDLE DELETE (Remove Course) ---
    if (req.method === 'DELETE') {
        const { id, type } = req.body;
        if (type === 'COURSE') {
             const { error } = await supabaseAdmin.from('matrix_content').delete().eq('id', id);
             if (error) throw error;
             return res.status(200).json({ success: true });
        }
        return res.status(400).json({ error: 'Invalid Delete Type' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err: any) {
    console.error("Admin API Error:", err);
    res.status(500).json({ error: err.message || 'Server Error' });
  }
}
