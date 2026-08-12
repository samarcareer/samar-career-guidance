// components/AdminLayout.tsx
import React, { ReactNode, useState } from 'react';
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
  
  // 🔴 NEW: Sidebar Toggle State
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        body { background: #0f172a; overflow-x: hidden; }
        
        /* Educational Dashboard Sidebar - DYNAMIC WIDTH */
        .sidebar { 
            width: ${isCollapsed ? '80px' : '240px'}; 
            background: #1e293b; 
            border-right: 1px solid #334155; 
            padding: ${isCollapsed ? '24px 10px' : '24px 16px'}; 
            display: flex; 
            flex-direction: column; 
            position: fixed; 
            height: 100vh; 
            box-shadow: 4px 0 15px rgba(0,0,0,0.2);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 50;
        }

        /* The Magical Collapse Button */
        .collapse-btn {
            position: absolute;
            right: -15px;
            top: 35px;
            width: 30px;
            height: 30px;
            background: #38bdf8;
            color: #0f172a;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 2px solid #0f172a;
            box-shadow: 0 2px 8px rgba(56,189,248,0.5);
            transition: 0.3s;
            z-index: 100;
        }
        .collapse-btn:hover { background: #0284c7; color: #fff; transform: scale(1.1); }

        .brand { display: flex; align-items: center; justify-content: ${isCollapsed ? 'center' : 'flex-start'}; gap: 10px; font-weight: 800; font-size: 1.1rem; color: #fff; margin-bottom: 30px; padding: 0 4px; white-space: nowrap; overflow: hidden; }
        
        .nav-group-title { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; padding: 0 8px; font-weight: 700; display: ${isCollapsed ? 'none' : 'block'}; }
        
        .nav-item { 
            display: flex; 
            align-items: center; 
            justify-content: ${isCollapsed ? 'center' : 'flex-start'};
            gap: 12px; 
            padding: ${isCollapsed ? '12px 0' : '10px 12px'}; 
            border-radius: 8px; 
            color: #cbd5e1; 
            cursor: pointer; 
            transition: 0.2s; 
            font-size: 0.85rem; /* SMALLER TEXT */
            margin-bottom: 6px; 
            border: none; 
            background: transparent; 
            width: 100%; 
            font-weight: 600; 
            white-space: nowrap;
        }
        .nav-item-text { display: ${isCollapsed ? 'none' : 'block'}; opacity: ${isCollapsed ? '0' : '1'}; transition: 0.2s; }
        .nav-item:hover { color: #fff; background: rgba(56, 189, 248, 0.1); }
        .nav-item.active { color: #38bdf8; background: rgba(56, 189, 248, 0.15); border-left: ${isCollapsed ? 'none' : '3px solid #38bdf8'}; }
        .nav-item i { font-size: 1.3rem; } /* ICONS STAY LARGE */

        /* Main Content Area - DYNAMIC MARGIN */
        .main-content { flex: 1; margin-left: ${isCollapsed ? '80px' : '240px'}; display: flex; flex-direction: column; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .topbar { height: 60px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; padding: 0 32px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 10; }
        .page-container { padding: 25px 32px; max-width: 1400px; width: 100%; margin: 0 auto; }

        /* Educational UI Elements - SCALED DOWN */
        .v-button { padding: 6px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: 0.2s; border: 1px solid transparent; display: inline-flex; align-items: center; gap: 6px; }
        .v-btn-primary { background: #38bdf8; color: #0f172a; box-shadow: 0 4px 10px rgba(56, 189, 248, 0.3); }
        .v-btn-primary:hover { background: #0284c7; color: #fff; }
        .v-btn-secondary { background: transparent; color: #38bdf8; border-color: #38bdf8; }
        .v-btn-secondary:hover { background: rgba(56, 189, 248, 0.1); }
        .v-btn-danger { background: transparent; color: #ef4444; border-color: rgba(239,68,68,0.4); }
        .v-btn-danger:hover { background: rgba(239,68,68,0.15); border-color: #ef4444; }

        /* Dashboard Cards & Tables - COMPACT */
        .v-card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
        .v-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; /* SMALLER TABLE TEXT */ }
        .v-table th { text-align: left; padding: 12px 16px; color: #94a3b8; border-bottom: 1px solid #334155; font-weight: 700; background: rgba(15, 23, 42, 0.4); text-transform: uppercase; letter-spacing: 0.5px; }
        .v-table td { padding: 12px 16px; border-bottom: 1px solid #334155; color: #f8fafc; }
        .v-table tr:hover td { background: rgba(56, 189, 248, 0.05); }
        
        .v-input { width: 100%; padding: 8px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #fff; font-size: 0.85rem; outline: none; transition: 0.2s; }
        .v-input:focus { border-color: #38bdf8; box-shadow: 0 0 0 2px rgba(56,189,248,0.2); }
        .v-label { display: block; font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px; font-weight: 600; }
        
        /* KPI Boxes */
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px; }
        .kpi-box { background: linear-gradient(145deg, #1e293b, #0f172a); border: 1px solid #334155; padding: 15px; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-top: 3px solid #38bdf8; }
        .kpi-info h4 { margin: 0; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; }
        .kpi-info h2 { margin: 5px 0 0 0; font-size: 1.5rem; color: #fff; font-weight: 800; }
        .kpi-icon { width: 45px; height: 45px; border-radius: 8px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
      `}} />

      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        {/* Toggle Button */}
        <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
           <i className={isCollapsed ? 'bx bx-chevron-right' : 'bx bx-chevron-left'} style={{fontSize: '1.2rem'}}></i>
        </button>

        <div className="brand" title="Samar HQ">
          <i className='bx bxs-graduation' style={{ color: '#38bdf8', fontSize: '1.6rem', minWidth: '25px' }}></i>
          {!isCollapsed && <span>Samar HQ</span>}
        </div>

        <div className="nav-group-title">Command Center</div>
        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} title="Dashboard">
          <i className='bx bxs-dashboard'></i>
          <span className="nav-item-text">Dashboard Overview</span>
        </button>

        <div className="nav-group-title" style={{ marginTop: '20px' }}>Database CMS</div>
        <button className={`nav-item ${activeTab === 'matrix' ? 'active' : ''}`} onClick={() => setActiveTab('matrix')} title="Course Matrix">
          <i className='bx bx-data'></i>
          <span className="nav-item-text">Course Knowledge Bank</span>
        </button>
        
        <div className="nav-group-title" style={{ marginTop: '20px' }}>Student Records</div>
        <button className={`nav-item ${activeTab === 'profiles' ? 'active' : ''}`} onClick={() => setActiveTab('profiles')} title="Registered Students">
          <i className='bx bxs-user-detail'></i>
          <span className="nav-item-text">Registered Students</span>
        </button>
        <button className={`nav-item ${activeTab === 'assessments' ? 'active' : ''}`} onClick={() => setActiveTab('assessments')} title="AI Assessments">
          <i className='bx bx-brain'></i>
          <span className="nav-item-text">AI Assessments</span>
        </button>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '16px' }}>
          {!isCollapsed && (
             <div style={{ fontSize: '0.7rem', color: '#94a3b8', padding: '0 8px', marginBottom: '8px', wordBreak: 'break-all' }}>
               Logged in as: <br/><strong style={{color:'#fff'}}>{userEmail}</strong>
             </div>
          )}
          <button className="nav-item" onClick={handleLogout} style={{ color: '#ef4444' }} title="Secure Logout">
            <i className='bx bx-log-out'></i>
            <span className="nav-item-text">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <div className="topbar">
          <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>
            {activeTab === 'dashboard' && 'Platform Analytics & Overview'}
            {activeTab === 'matrix' && 'Bilingual Course Content Management'}
            {activeTab === 'profiles' && 'Global Student Directory'}
            {activeTab === 'assessments' && 'Career Assessment Logs'}
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
