import React, { useState, Component, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase as clientSupabase } from '../utils/supabase'; // Only for Logout now
import { createClient } from '@supabase/supabase-js'; // For Server-Side Master Key
import { createServerClient, type CookieOptions } from '@supabase/ssr'; // For Session check
import { GetServerSidePropsContext } from 'next';
import { User } from '@supabase/supabase-js';

// --- STRICT TS INTERFACES ---
interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

interface StudentProfile {
  id: string; full_name: string; email: string; phone: string; education_level: string; career_goal: string; is_complete: boolean; created_at: string;
}

interface AssessmentRecord {
  id: string; email: string; interest_area: string; status: string; created_at: string;
}

interface AdminProps {
  adminUser: User;
  initialProfiles: StudentProfile[];
  initialAssessments: AssessmentRecord[];
}

type TabState = 'profiles' | 'assessments';

// --- ERROR BOUNDARY ---
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{color:'white', background:'#0f172a', padding:'50px', textAlign:'center'}}>Admin Engine Error. Refresh required.</div>;
    return this.props.children;
  }
}

// 🔴 THE SERVER-SIDE GOD MODE VAULT (Zero Hardcoding, Service Role Active)
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // 1. Verify User Session Securely (Normal Client)
  const supabaseSessionClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return context.req.cookies[name]; } } }
  );

  const { data: { session } } = await supabaseSessionClient.auth.getSession();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("🚨 CRITICAL: ADMIN_EMAIL is missing in Server Environment Variables!");
    return { redirect: { destination: '/', permanent: false } };
  }

  if (!session || session.user.email !== adminEmail) {
    return { redirect: { destination: '/', permanent: false } };
  }

  // 2. ⚡ MASTER KEY ACTIVATION (Only runs on Vercel Server, NEVER in browser)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error("🚨 CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing!");
    return { props: { adminUser: session.user, initialProfiles: [], initialAssessments: [] } };
  }

  // Create an Admin-Level Supabase client to bypass RLS and fetch all data
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  // 3. Fetch Data securely using Master Key
  const [profilesRes, assessmentsRes] = await Promise.all([
    supabaseAdmin.from('student_profiles').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('user_assessments').select('*').order('created_at', { ascending: false })
  ]);

  return {
    props: {
      adminUser: session.user,
      initialProfiles: profilesRes.data || [],
      initialAssessments: assessmentsRes.data || []
    }
  };
};

export default function AdminDashboard({ adminUser, initialProfiles, initialAssessments }: AdminProps) {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabState>('profiles');
  const [profiles, setProfiles] = useState<StudentProfile[]>(initialProfiles);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(initialAssessments);

  const handleDeleteRecord = async (email: string, id: string) => {
    alert("⚠️ Security Update: Direct deletion from browser is disabled to protect the Master Key. Please use the Vercel/Supabase DB Dashboard for manual deletions.");
  };

  return (
    <ErrorBoundary>
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <title>Admin Command Center | Samar</title>
        </Head>

        <style dangerouslySetInnerHTML={{__html: `
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .admin-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; background: rgba(15, 23, 42, 0.95); border-bottom: 1px solid #10b981; position: sticky; top: 0; z-index: 100; }
          .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: rgba(30, 41, 59, 0.5); border-radius: 8px; overflow: hidden; }
          .data-table th, .data-table td { padding: 15px; text-align: left; border-bottom: 1px solid rgba(147, 197, 253, 0.1); }
          .data-table th { background: rgba(15, 23, 42, 0.8); color: #38bdf8; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; }
          .data-table tr:hover { background: rgba(56, 189, 248, 0.05); }
          .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
          .badge-green { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; }
          .badge-red { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; }
          .action-btn { background: transparent; color: #ef4444; border: 1px solid #ef4444; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: 0.3s; }
          .action-btn:hover:not(:disabled) { background: #ef4444; color: #fff; }
          .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .tab-btn { padding: 12px 25px; background: transparent; color: #94a3b8; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-weight: bold; font-size: 1rem; transition: 0.3s; }
          .tab-btn.active { color: #10b981; border-bottom: 2px solid #10b981; background: rgba(16, 185, 129, 0.1); }
        `}} />

        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className='bx bxs-dashboard' style={{ fontSize: '2rem', color: '#10b981' }}></i>
            <h1 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Command Center</h1>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}><i className='bx bx-user-circle'></i> {adminUser?.email}</span>
            <button onClick={async () => { await clientSupabase.auth.signOut(); router.push('/login'); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
          </div>
        </header>

        <main style={{ padding: '30px 5%', maxWidth: '1400px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
            <button className={`tab-btn ${activeTab === 'profiles' ? 'active' : ''}`} onClick={() => setActiveTab('profiles')}>
              <i className='bx bxs-user-detail'></i> Student Profiles ({profiles.length})
            </button>
            <button className={`tab-btn ${activeTab === 'assessments' ? 'active' : ''}`} onClick={() => setActiveTab('assessments')}>
              <i className='bx bx-brain'></i> Assessment Records ({assessments.length})
            </button>
            <button onClick={() => router.reload()} style={{ marginLeft: 'auto', background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '6px', padding: '0 15px', cursor: 'pointer' }}>
              <i className='bx bx-refresh'></i> Refresh Data
            </button>
          </div>

          {/* PROFILES TABLE */}
          {activeTab === 'profiles' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Education / Goal</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map(p => (
                    <tr key={p.id}>
                      <td style={{ color: '#94a3b8' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 'bold' }}>{p.full_name || 'N/A'}</td>
                      <td>{p.email}</td><td>{p.phone || 'N/A'}</td>
                      <td><span style={{color: '#38bdf8'}}>{p.education_level || '-'}</span> <br/> {p.career_goal || '-'}</td>
                      <td><span className={`badge ${p.is_complete ? 'badge-green' : 'badge-red'}`}>{p.is_complete ? 'Complete' : 'Pending'}</span></td>
                      <td>
                        <button className="action-btn" onClick={() => handleDeleteRecord(p.email, p.id)} title="Delete Disabled for Security">
                          <i className='bx bx-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {profiles.length === 0 && <tr><td colSpan={7} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No profiles found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* ASSESSMENTS TABLE */}
          {activeTab === 'assessments' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th><th>Email</th><th>Target Stream (AI Result)</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map(a => (
                    <tr key={a.id}>
                      <td style={{ color: '#94a3b8' }}>{new Date(a.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 'bold' }}>{a.email}</td>
                      <td><span className="badge badge-green" style={{ fontSize: '1rem', background: 'rgba(56,189,248,0.2)', color: '#38bdf8', borderColor: '#38bdf8' }}>{a.interest_area}</span></td>
                      <td><span className="badge badge-green">{a.status}</span></td>
                      <td>
                        <button className="action-btn" onClick={() => handleDeleteRecord(a.email, a.id)} title="Delete Disabled for Security">
                          <i className='bx bx-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {assessments.length === 0 && <tr><td colSpan={5} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No assessments recorded.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
