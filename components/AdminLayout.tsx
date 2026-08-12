// components/AdminLayout.tsx
import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase as clientSupabase } from '../utils/supabase';

interface AdminLayoutProps {
  children: ReactNode;
  userEmail?: string;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onRefresh: () => void;
  loading: boolean;
}

export default function AdminLayout({ children, userEmail, activeTab, setActiveTab, onRefresh, loading }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await clientSupabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#ededed', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <title>Vercel Style Admin | Samar</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }
        
        /* Vercel Style Sidebar */
        .sidebar { width: 260px; background: #0a0a0a; border-right: 1px solid #333; padding: 24px 16px; display: flex; flex-direction: column; position: fixed; height: 100vh; }
        .brand { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 1.1rem; color: #fff; margin-bottom: 40px; padding: 0 8px; }
        .nav-group-title { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; padding: 0 8px; font-weight: 600; }
        
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 6px; color: #a1a1aa; cursor: pointer; transition: 0.2s; font-size: 0.9rem; margin-bottom: 4px; border: none; background: transparent; width: 100%; text-align: left; }
        .nav-item:hover { color: #fff; background: #1a1a1a; }
        .nav-item.active { color: #fff; background: #27272a; font-weight: 500; }
        .nav-item i { font-size: 1.1rem; }

        /* Vercel Style Main Content */
        .main-content { flex: 1; margin-left: 260px; display: flex; flex-direction: column; }
        .topbar { height: 64px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; padding: 0 32px; background: rgba(0,0,0,0.8); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 10; }
        .page-container { padding: 40px 32px; max-width: 1200px; width: 100%; margin: 0 auto; }

        /* Vercel Style Elements */
        .v-button { padding: 8px 16px; border-radius: 6px; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: 0.2s; border: 1px solid transparent; display: inline-flex; align-items: center; gap: 8px; }
        .v-btn-primary { background: #fff; color: #000; }
        .v-btn-primary:hover { background: #e5e5e5; }
        .v-btn-secondary { background: transparent; color: #ededed; border-color: #333; }
        .v-btn-secondary:hover { background: #1a1a1a; border-color: #444; }
        .v-btn-danger { background: transparent; color: #ef4444; border-color: rgba(239,68,68,0.3); }
        .v-btn-danger:hover { background: rgba(239,68,68,0.1); border-color: #ef4444; }

        /* Form & Tables */
        .v-card { background: #0a0a0a; border: 1px solid #333; border-radius: 8px; overflow: hidden; }
        .v-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .v-table th { text-align: left; padding: 12px 16px; color: #888; border-bottom: 1px solid #333; font-weight: 500; background: #050505; }
        .v-table td { padding: 12px 16px; border-bottom: 1px solid #222; color: #ededed; }
        .v-table tr:hover td { background: #111; }
        
        .v-input { width: 100%; padding: 8px 12px; background: #000; border: 1px solid #333; border-radius: 6px; color: #fff; font-size: 0.875rem; outline: none; transition: 0.2s; }
        .v-input:focus { border-color: #666; }
        .v-label { display: block; font-size: 0.875rem; color: #a1a1aa; margin-bottom: 6px; }
      `}} />

      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="brand">
          <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #fff, #888)', borderRadius: '50%' }}></div>
          Samar Admin
        </div>

        <div className="nav-group-title">Database</div>
        <button className={`nav-item ${activeTab === 'matrix' ? 'active' : ''}`} onClick={() => setActiveTab('matrix')}>
          <i className='bx bx-data'></i> Course Matrix CMS
        </button>
        
        <div className="nav-group-title" style={{ marginTop: '24px' }}>Users</div>
        <button className={`nav-item ${activeTab === 'profiles' ? 'active' : ''}`} onClick={() => setActiveTab('profiles')}>
          <i className='bx bx-user'></i> Student Profiles
        </button>
        <button className={`nav-item ${activeTab === 'assessments' ? 'active' : ''}`} onClick={() => setActiveTab('assessments')}>
          <i className='bx bx-brain'></i> Assessments
        </button>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#888', padding: '0 8px', marginBottom: '8px', wordBreak: 'break-all' }}>{userEmail}</div>
          <button className="nav-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
            <i className='bx bx-log-out'></i> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <div className="topbar">
          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>
            {activeTab === 'matrix' && 'Course Matrix Content Management'}
            {activeTab === 'profiles' && 'Student Profile Directory'}
            {activeTab === 'assessments' && 'Assessment Result Logs'}
          </div>
          <button className="v-button v-btn-secondary" onClick={onRefresh}>
            <i className={loading ? 'bx bx-refresh bx-spin' : 'bx bx-refresh'}></i> Sync Data
          </button>
        </div>
        
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
