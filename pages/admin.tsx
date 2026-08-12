// pages/admin.tsx
import React, { useState, useEffect, Component, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase as clientSupabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }
interface StudentProfile { id: string; full_name: string; email: string; phone: string; education_level: string; career_goal: string; is_complete: boolean; created_at: string; }
interface AssessmentRecord { id: string; email: string; interest_area: string; status: string; created_at: string; }

// NEW MATRIX INTERFACE
interface MatrixRecord { id: string; stream_key: string; title_en: string; title_ur: string; scope_en: string; scope_ur: string; duration_en: string; duration_ur: string; courses_en: string[]; courses_ur: string[]; details_en: string; details_ur: string; created_at: string; }

type TabState = 'profiles' | 'assessments' | 'matrix';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{color:'white', background:'#0f172a', padding:'50px', textAlign:'center'}}>Admin Error. Refresh required.</div>;
    return this.props.children;
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabState>('profiles');
  
  // Data States
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [matrixContent, setMatrixContent] = useState<MatrixRecord[]>([]); // New State
  
  // UI States
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // CMS Form State
  const [cmsForm, setCmsForm] = useState({
      stream_key: '', title_en: '', title_ur: '', scope_en: '', scope_ur: '', duration_en: '', duration_ur: '', courses_en: '', courses_ur: '', details_en: '', details_ur: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initAdmin = async () => {
      try {
        const { data: { session } } = await clientSupabase.auth.getSession();
        if (!session) { router.push('/'); return; }
        setAdminUser(session.user);
        await fetchDashboardData();
      } catch (err: any) {
        setErrorMsg("Auth check failed."); setLoading(false);
      } 
    };
    initAdmin();
  }, [router]);

  const fetchDashboardData = async () => {
    setLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin-data');
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) { router.push('/'); return; }
        throw new Error('Fetch failed');
      }
      const data = await res.json();
      setProfiles(data.profiles || []);
      setAssessments(data.assessments || []);
      setMatrixContent(data.matrixContent || []);
    } catch (err: any) {
      setErrorMsg("Failed to sync backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleCmsSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true); setErrorMsg('');
      try {
          const payload = {
              ...cmsForm,
              courses_en: cmsForm.courses_en.split(',').map(c => c.trim()), // Convert string to Array
              courses_ur: cmsForm.courses_ur.split(',').map(c => c.trim()),
          };

          const res = await fetch('/api/admin-data', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'ADD_COURSE', payload })
          });

          if (!res.ok) throw new Error("Failed to add course");
          const result = await res.json();
          setMatrixContent([result.data[0], ...matrixContent]);
          alert("✅ Matrix updated successfully!");
          setCmsForm({ stream_key: '', title_en: '', title_ur: '', scope_en: '', scope_ur: '', duration_en: '', duration_ur: '', courses_en: '', courses_ur: '', details_en: '', details_ur: '' });
      } catch (err) {
          setErrorMsg("CMS Upload failed.");
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
      if (!window.confirm(`⚠️ Delete ${title} from database?`)) return;
      setActionLoading(id);
      try {
          const res = await fetch('/api/admin-data', {
              method: 'DELETE', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, type: 'COURSE' })
          });
          if (!res.ok) throw new Error("Deletion failed");
          setMatrixContent(prev => prev.filter(m => m.id !== id));
      } catch (err) {
          alert("Deletion failed via API");
      } finally {
          setActionLoading(null);
      }
  };

  const handleDeleteRecord = async (email: string, id: string) => {
      alert("⚠️ Direct deletion disabled. Use Vercel API or DB panel.");
  };

  if (loading && !adminUser) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#10b981' }}><h2><i className='bx bx-check-shield bx-tada'></i> Verifying Credentials...</h2></div>;

  return (
    <ErrorBoundary>
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <title>Admin Command Center | Samar</title>
        </Head>

        {/* --- STRICT UI ISOLATION --- */}
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
          .tab-btn { padding: 12px 25px; background: transparent; color: #94a3b8; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-weight: bold; font-size: 1rem; transition: 0.3s; }
          .tab-btn.active { color: #10b981; border-bottom: 2px solid #10b981; background: rgba(16, 185, 129, 0.1); }
          
          /* CMS FORM STYLES */
          .cms-form { background: rgba(30,41,59,0.5); padding: 25px; border-radius: 8px; border: 1px solid rgba(147,197,253,0.1); display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .form-group { display: flex; flex-direction: column; gap: 8px; }
          .form-group label { font-size: 0.85rem; color: #93c5fd; font-weight: bold; }
          .form-group input, .form-group textarea { padding: 12px; border-radius: 6px; border: 1px solid #334155; background: rgba(15,23,42,0.8); color: white; }
          .form-group textarea { resize: vertical; min-height: 80px; }
          .ur-input { direction: rtl; font-family: 'Jameel Noori Nastaleeq', serif; font-size: 1.1rem; }
          .submit-btn { grid-column: span 2; padding: 15px; background: #10b981; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1.1rem; }
          @media (max-width: 768px) { .cms-form { grid-template-columns: 1fr; } .submit-btn { grid-column: span 1; } }
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
          
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #334155', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button className={`tab-btn ${activeTab === 'profiles' ? 'active' : ''}`} onClick={() => setActiveTab('profiles')}>
              <i className='bx bxs-user-detail'></i> Student Profiles ({profiles.length})
            </button>
            <button className={`tab-btn ${activeTab === 'assessments' ? 'active' : ''}`} onClick={() => setActiveTab('assessments')}>
              <i className='bx bx-brain'></i> Assessment Records ({assessments.length})
            </button>
            <button className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`} onClick={() => setActiveTab('matrix')}>
              <i className='bx bx-data'></i> Course Matrix CMS ({matrixContent.length})
            </button>
            <button onClick={fetchDashboardData} style={{ marginLeft: 'auto', background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '6px', padding: '0 15px', cursor: 'pointer' }}>
              <i className={loading ? 'bx bx-refresh bx-spin' : 'bx bx-refresh'}></i> Refresh
            </button>
          </div>

          {errorMsg && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '15px', borderRadius: '8px', border: '1px solid #ef4444', marginBottom: '20px' }}><i className='bx bx-error-circle'></i> {errorMsg}</div>}

          {/* CMS MATRIX TAB */}
          {activeTab === 'matrix' && (
              <div>
                  <h3 style={{color: '#38bdf8', marginBottom: '15px'}}><i className='bx bx-plus-circle'></i> Add New Bilingual Course Matrix</h3>
                  <form className="cms-form" onSubmit={handleCmsSubmit}>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                          <label>Stream Key (URL slug, e.g., 'science', 'arts', 'diploma') *</label>
                          <input required type="text" value={cmsForm.stream_key} onChange={e => setCmsForm({...cmsForm, stream_key: e.target.value})} placeholder="e.g. btech" />
                      </div>
                      
                      {/* ENGLISH SECTION */}
                      <div className="form-group"><label>English Title *</label><input required type="text" value={cmsForm.title_en} onChange={e => setCmsForm({...cmsForm, title_en: e.target.value})} /></div>
                      <div className="form-group"><label>Urdu Title *</label><input required className="ur-input" type="text" value={cmsForm.title_ur} onChange={e => setCmsForm({...cmsForm, title_ur: e.target.value})} /></div>
                      
                      <div className="form-group"><label>English Scope</label><textarea value={cmsForm.scope_en} onChange={e => setCmsForm({...cmsForm, scope_en: e.target.value})}></textarea></div>
                      <div className="form-group"><label>Urdu Scope</label><textarea className="ur-input" value={cmsForm.scope_ur} onChange={e => setCmsForm({...cmsForm, scope_ur: e.target.value})}></textarea></div>
                      
                      <div className="form-group"><label>Duration (EN)</label><input type="text" value={cmsForm.duration_en} onChange={e => setCmsForm({...cmsForm, duration_en: e.target.value})} /></div>
                      <div className="form-group"><label>Duration (UR)</label><input className="ur-input" type="text" value={cmsForm.duration_ur} onChange={e => setCmsForm({...cmsForm, duration_ur: e.target.value})} /></div>
                      
                      <div className="form-group"><label>Included Courses EN (Comma separated) *</label><textarea required value={cmsForm.courses_en} placeholder="BSc Physics, BSc Chemistry" onChange={e => setCmsForm({...cmsForm, courses_en: e.target.value})}></textarea></div>
                      <div className="form-group"><label>Included Courses UR (Comma separated) *</label><textarea required className="ur-input" placeholder="بی ایس سی فزکس, بی ایس سی کیمسٹری" value={cmsForm.courses_ur} onChange={e => setCmsForm({...cmsForm, courses_ur: e.target.value})}></textarea></div>

                      <div className="form-group"><label>Detailed Info (EN)</label><textarea value={cmsForm.details_en} onChange={e => setCmsForm({...cmsForm, details_en: e.target.value})}></textarea></div>
                      <div className="form-group"><label>Detailed Info (UR)</label><textarea className="ur-input" value={cmsForm.details_ur} onChange={e => setCmsForm({...cmsForm, details_ur: e.target.value})}></textarea></div>
                      
                      <button type="submit" disabled={isSubmitting} className="submit-btn">{isSubmitting ? 'Uploading to Vault...' : 'Push to Database 🚀'}</button>
                  </form>

                  <h3 style={{color: '#38bdf8', marginTop: '40px', marginBottom: '15px'}}><i className='bx bx-table'></i> Live Matrix Database</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead><tr><th>Key</th><th>EN Title</th><th>UR Title</th><th>Courses Loaded</th><th>Action</th></tr></thead>
                        <tbody>
                            {matrixContent.map(m => (
                                <tr key={m.id}>
                                    <td style={{color:'#10b981', fontWeight: 'bold'}}>{m.stream_key}</td>
                                    <td>{m.title_en}</td><td className="ur-input" style={{textAlign:'right'}}>{m.title_ur}</td>
                                    <td><span className="badge badge-green">{m.courses_en?.length || 0}</span></td>
                                    <td><button className="action-btn" onClick={() => handleDeleteCourse(m.id, m.title_en)} disabled={actionLoading === m.id}>{actionLoading === m.id ? <i className='bx bx-loader-alt bx-spin'></i> : <i className='bx bx-trash'></i>}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              </div>
          )}

          {/* PROFILES TABLE */}
          {activeTab === 'profiles' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Goal</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {profiles.map(p => (
                    <tr key={p.id}>
                      <td style={{ color: '#94a3b8' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 'bold' }}>{p.full_name || 'N/A'}</td><td>{p.email}</td><td>{p.phone || 'N/A'}</td>
                      <td><span style={{color: '#38bdf8'}}>{p.career_goal || '-'}</span></td>
                      <td><span className={`badge ${p.is_complete ? 'badge-green' : 'badge-red'}`}>{p.is_complete ? 'Complete' : 'Pending'}</span></td>
                      <td><button className="action-btn" onClick={() => handleDeleteRecord(p.email, p.id)} title="Disabled"><i className='bx bx-trash'></i></button></td>
                    </tr>
                  ))}
                  {profiles.length === 0 && !loading && <tr><td colSpan={7} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No profiles found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* ASSESSMENTS TABLE */}
          {activeTab === 'assessments' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>Date</th><th>Email</th><th>Target Stream</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {assessments.map(a => (
                    <tr key={a.id}>
                      <td style={{ color: '#94a3b8' }}>{new Date(a.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 'bold' }}>{a.email}</td>
                      <td><span className="badge badge-green" style={{ fontSize: '1rem', background: 'rgba(56,189,248,0.2)', color: '#38bdf8', borderColor: '#38bdf8' }}>{a.interest_area}</span></td>
                      <td><span className="badge badge-green">{a.status}</span></td>
                      <td><button className="action-btn" onClick={() => handleDeleteRecord(a.email, a.id)} title="Disabled"><i className='bx bx-trash'></i></button></td>
                    </tr>
                  ))}
                  {assessments.length === 0 && !loading && <tr><td colSpan={5} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No assessments recorded yet.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>
    </ErrorBoundary>
  );
}
