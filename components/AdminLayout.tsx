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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <title>Educational Center Admin | Samar</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f172a; }
        
        /* Educational Dashboard Sidebar */
        .sidebar { width: 260px; background: #1e293b; border-right: 1px solid #334155; padding: 24px 16px; display: flex; flex-direction: column; position: fixed; height: 100vh; box-shadow: 4px 0 15px rgba(0,0,0,0.2); }
        .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.2rem; color: #fff; margin-bottom: 40px; padding: 0 8px; }
        .nav-group-title { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; padding: 0 8px; font-weight: 700; }
        
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: #cbd5e1; cursor: pointer; transition: 0.2s; font-size: 0.95rem; margin-bottom: 6px; border: none; background: transparent; width: 100%; text-align: left; font-weight: 600; }
        .nav-item:hover { color: #fff; background: rgba(56, 189, 248, 0.1); }
        .nav-item.active { color: #38bdf8; background: rgba(56, 189, 248, 0.15); border-left: 3px solid #38bdf8; }
        .nav-item i { font-size: 1.2rem; }

        /* Main Content Area */
        .main-content { flex: 1; margin-left: 260px; display: flex; flex-direction: column; }
        .topbar { height: 70px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; padding: 0 32px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 10; }
        .page-container { padding: 30px 32px; max-width: 1400px; width: 100%; margin: 0 auto; }

        /* Educational UI Elements */
        .v-button { padding: 8px 16px; border-radius: 6px; font-size: 0.875rem; font-weight: bold; cursor: pointer; transition: 0.2s; border: 1px solid transparent; display: inline-flex; align-items: center; gap: 8px; }
        .v-btn-primary { background: #38bdf8; color: #0f172a; box-shadow: 0 4px 10px rgba(56, 189, 248, 0.3); }
        .v-btn-primary:hover { background: #0284c7; color: #fff; }
        .v-btn-secondary { background: transparent; color: #38bdf8; border-color: #38bdf8; }
        .v-btn-secondary:hover { background: rgba(56, 189, 248, 0.1); }
        .v-btn-danger { background: transparent; color: #ef4444; border-color: rgba(239,68,68,0.4); }
        .v-btn-danger:hover { background: rgba(239,68,68,0.15); border-color: #ef4444; }

        /* Dashboard Cards & Tables */
        .v-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
        .v-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        .v-table th { text-align: left; padding: 14px 20px; color: #94a3b8; border-bottom: 1px solid #334155; font-weight: 700; background: rgba(15, 23, 42, 0.4); text-transform: uppercase; letter-spacing: 0.5px; }
        .v-table td { padding: 14px 20px; border-bottom: 1px solid #334155; color: #f8fafc; }
        .v-table tr:hover td { background: rgba(56, 189, 248, 0.05); }
        
        .v-input { width: 100%; padding: 10px 14px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #fff; font-size: 0.95rem; outline: none; transition: 0.2s; }
        .v-input:focus { border-color: #38bdf8; box-shadow: 0 0 0 2px rgba(56,189,248,0.2); }
        .v-label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 6px; font-weight: 600; }
        
        /* KPI Boxes (The ones you drew) */
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .kpi-box { background: linear-gradient(145deg, #1e293b, #0f172a); border: 1px solid #334155; padding: 20px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-top: 3px solid #38bdf8; }
        .kpi-info h4 { margin: 0; font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; }
        .kpi-info h2 { margin: 5px 0 0 0; font-size: 1.8rem; color: #fff; font-weight: 800; }
        .kpi-icon { width: 50px; height: 50px; border-radius: 10px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; }
      `}} />

      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="brand">
          <i className='bx bxs-graduation' style={{ color: '#38bdf8', fontSize: '1.8rem' }}></i>
          Samar HQ
        </div>

        <div className="nav-group-title">Command Center</div>
        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <i className='bx bxs-dashboard'></i> Dashboard Overview
        </button>

        <div className="nav-group-title" style={{ marginTop: '24px' }}>Database CMS</div>
        <button className={`nav-item ${activeTab === 'matrix' ? 'active' : ''}`} onClick={() => setActiveTab('matrix')}>
          <i className='bx bx-data'></i> Course Knowledge Bank
        </button>
        
        <div className="nav-group-title" style={{ marginTop: '24px' }}>Student Records</div>
        <button className={`nav-item ${activeTab === 'profiles' ? 'active' : ''}`} onClick={() => setActiveTab('profiles')}>
          <i className='bx bxs-user-detail'></i> Registered Students
        </button>
        <button className={`nav-item ${activeTab === 'assessments' ? 'active' : ''}`} onClick={() => setActiveTab('assessments')}>
          <i className='bx bx-brain'></i> AI Assessments
        </button>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0 8px', marginBottom: '8px', wordBreak: 'break-all' }}>Logged in as: <br/><strong style={{color:'#fff'}}>{userEmail}</strong></div>
          <button className="nav-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
            <i className='bx bx-log-out'></i> Secure Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <div className="topbar">
          <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>
            {activeTab === 'dashboard' && 'Platform Analytics & Overview'}
            {activeTab === 'matrix' && 'Bilingual Course Content Management'}
            {activeTab === 'profiles' && 'Global Student Directory'}
            {activeTab === 'assessments' && 'Career Assessment Logs'}
          </div>
          <button className="v-button v-btn-secondary" onClick={onRefresh}>
            <i className={loading ? 'bx bx-refresh bx-spin' : 'bx bx-refresh'}></i> Sync Live Data
          </button>
        </div>
        
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
