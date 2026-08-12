// pages/admin.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase as clientSupabase } from '../utils/supabase';
import AdminLayout from '../components/AdminLayout';

interface StudentProfile { id: string; full_name: string; email: string; phone: string; career_goal: string; is_complete: boolean; created_at: string; }
interface AssessmentRecord { id: string; email: string; interest_area: string; status: string; created_at: string; }
interface MatrixRecord { id: string; stream_key: string; title_en: string; title_ur: string; scope_en: string; scope_ur: string; duration_en: string; duration_ur: string; courses_en: string[]; courses_ur: string[]; details_en: string; details_ur: string; created_at: string; }

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [matrixContent, setMatrixContent] = useState<MatrixRecord[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal State for Viewing Full Details
  const [viewModalData, setViewModalData] = useState<MatrixRecord | null>(null);

  const [cmsForm, setCmsForm] = useState({
      stream_key: '', title_en: '', title_ur: '', scope_en: '', scope_ur: '', duration_en: '', duration_ur: '', courses_en: '', courses_ur: '', details_en: '', details_ur: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initAdmin = async () => {
      const { data: { session } } = await clientSupabase.auth.getSession();
      if (!session) { router.push('/'); return; }
      setAdminUser(session.user);
      await fetchDashboardData();
    };
    initAdmin();
  }, [router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-data');
      if (!res.ok) { if (res.status === 401 || res.status === 403) router.push('/'); throw new Error('Fetch failed'); }
      const data = await res.json();
      setProfiles(data.profiles || []); setAssessments(data.assessments || []); setMatrixContent(data.matrixContent || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleCmsSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setIsSubmitting(true);
      try {
          const payload = {
              ...cmsForm,
              courses_en: cmsForm.courses_en.split(',').map(c => c.trim()),
              courses_ur: cmsForm.courses_ur.split(',').map(c => c.trim()),
          };
          const res = await fetch('/api/admin-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ADD_COURSE', payload }) });
          if (!res.ok) throw new Error("Upload failed");
          const result = await res.json();
          setMatrixContent([result.data[0], ...matrixContent]);
          setCmsForm({ stream_key: '', title_en: '', title_ur: '', scope_en: '', scope_ur: '', duration_en: '', duration_ur: '', courses_en: '', courses_ur: '', details_en: '', details_ur: '' });
          alert("Course Matrix successfully uploaded!");
      } catch (err) { alert("Upload Failed"); } finally { setIsSubmitting(false); }
  };

  const handleDeleteCourse = async (id: string) => {
      if (!window.confirm(`Are you sure you want to permanently delete this matrix?`)) return;
      setActionLoading(id);
      try {
          const res = await fetch('/api/admin-data', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, type: 'COURSE' }) });
          if (!res.ok) throw new Error("Deletion failed");
          setMatrixContent(prev => prev.filter(m => m.id !== id));
      } catch (err) { alert("Deletion failed"); } finally { setActionLoading(null); }
  };

  if (loading && !adminUser) return <div style={{ background: '#0f172a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '1.2rem', fontWeight: 'bold' }}><i className='bx bx-loader-alt bx-spin' style={{marginRight: '10px'}}></i> Initializing Elite HQ...</div>;

  return (
    <AdminLayout userEmail={adminUser?.email} activeTab={activeTab} setActiveTab={setActiveTab} onRefresh={fetchDashboardData} loading={loading}>
      
      {/* DASHBOARD TAB (Global Overview Only) */}
      {activeTab === 'dashboard' && (
        <>
          <div className="kpi-grid">
            <div className="kpi-box">
              <div className="kpi-info"><h4>Total Platform Signups</h4><h2>{profiles.length}</h2></div>
              <div className="kpi-icon"><i className='bx bxs-user-account'></i></div>
            </div>
            <div className="kpi-box">
              <div className="kpi-info"><h4>Total AI Assessments</h4><h2>{assessments.length}</h2></div>
              <div className="kpi-icon" style={{color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)'}}><i className='bx bx-brain'></i></div>
            </div>
            <div className="kpi-box">
              <div className="kpi-info"><h4>Live Course Matrix</h4><h2>{matrixContent.length}</h2></div>
              <div className="kpi-icon" style={{color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)'}}><i className='bx bx-data'></i></div>
            </div>
          </div>

          <div className="v-card" style={{ padding: '60px 40px', textAlign: 'center', borderTop: '4px solid #38bdf8' }}>
              <i className='bx bxs-shield-check' style={{ fontSize: '5rem', color: '#10b981', marginBottom: '20px' }}></i>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#fff' }}>Samar Engine Active & Secure</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>All layers protected. Use the sidebar to navigate the command center.</p>
          </div>
        </>
      )}

      {/* MATRIX CMS VIEW */}
      {activeTab === 'matrix' && (
        <>
          <div className="v-card" style={{ padding: '24px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', fontWeight: 700, color: '#38bdf8' }}><i className='bx bx-plus-circle'></i> Push New Entry to Database</h3>
            <form onSubmit={handleCmsSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}><label className="v-label">Stream Key (URL Slug) *</label><input required className="v-input" type="text" value={cmsForm.stream_key} onChange={e => setCmsForm({...cmsForm, stream_key: e.target.value})} placeholder="e.g. btech" /></div>
              
              <div><label className="v-label">English Title *</label><input required className="v-input" type="text" value={cmsForm.title_en} onChange={e => setCmsForm({...cmsForm, title_en: e.target.value})} /></div>
              <div><label className="v-label" style={{textAlign:'right'}}>Urdu Title *</label><input required className="v-input ur-input" dir="rtl" type="text" style={{fontFamily: "'Jameel Noori Nastaleeq', serif", fontSize: '1.2rem'}} value={cmsForm.title_ur} onChange={e => setCmsForm({...cmsForm, title_ur: e.target.value})} /></div>
              
              <div><label className="v-label">English Scope</label><textarea className="v-input" style={{height:'80px', resize:'vertical'}} value={cmsForm.scope_en} onChange={e => setCmsForm({...cmsForm, scope_en: e.target.value})}></textarea></div>
              <div><label className="v-label" style={{textAlign:'right'}}>Urdu Scope</label><textarea className="v-input ur-input" dir="rtl" style={{height:'80px', resize:'vertical', fontFamily: "'Jameel Noori Nastaleeq', serif", fontSize: '1.2rem'}} value={cmsForm.scope_ur} onChange={e => setCmsForm({...cmsForm, scope_ur: e.target.value})}></textarea></div>

              <div><label className="v-label">Duration (EN)</label><input className="v-input" type="text" value={cmsForm.duration_en} onChange={e => setCmsForm({...cmsForm, duration_en: e.target.value})} /></div>
              <div><label className="v-label" style={{textAlign:'right'}}>Duration (UR)</label><input className="v-input ur-input" dir="rtl" type="text" style={{fontFamily: "'Jameel Noori Nastaleeq', serif", fontSize: '1.2rem'}} value={cmsForm.duration_ur} onChange={e => setCmsForm({...cmsForm, duration_ur: e.target.value})} /></div>

              <div><label className="v-label">Courses EN (Comma separated) *</label><textarea required className="v-input" style={{height:'80px', resize:'vertical'}} value={cmsForm.courses_en} placeholder="BSc Physics, BSc Math" onChange={e => setCmsForm({...cmsForm, courses_en: e.target.value})}></textarea></div>
              <div><label className="v-label" style={{textAlign:'right'}}>Courses UR (Comma separated) *</label><textarea required className="v-input ur-input" dir="rtl" style={{height:'80px', resize:'vertical', fontFamily: "'Jameel Noori Nastaleeq', serif", fontSize: '1.2rem'}} value={cmsForm.courses_ur} placeholder="بی ایس سی فزکس" onChange={e => setCmsForm({...cmsForm, courses_ur: e.target.value})}></textarea></div>

              <div><label className="v-label">Detailed Info (EN)</label><textarea className="v-input" style={{height:'100px', resize:'vertical'}} value={cmsForm.details_en} onChange={e => setCmsForm({...cmsForm, details_en: e.target.value})}></textarea></div>
              <div><label className="v-label" style={{textAlign:'right'}}>Detailed Info (UR)</label><textarea className="v-input ur-input" dir="rtl" style={{height:'100px', resize:'vertical', fontFamily: "'Jameel Noori Nastaleeq', serif", fontSize: '1.2rem'}} value={cmsForm.details_ur} onChange={e => setCmsForm({...cmsForm, details_ur: e.target.value})}></textarea></div>

              <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                <button type="submit" disabled={isSubmitting} className="v-button v-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    {isSubmitting ? 'Uploading to Database...' : 'Push to Database 🚀'}
                </button>
              </div>
            </form>
          </div>

          <div className="v-card">
            <table className="v-table">
              <thead><tr><th>Stream Key</th><th>EN Title</th><th>UR Title</th><th style={{textAlign: 'right'}}>Actions</th></tr></thead>
              <tbody>
                {matrixContent.map(m => (
                  <tr key={m.id}>
                    <td style={{fontFamily:'monospace', color:'#38bdf8', fontWeight: 'bold'}}>{m.stream_key}</td>
                    <td>{m.title_en}</td><td dir="rtl" style={{fontFamily: "'Jameel Noori Nastaleeq', serif", fontSize: '1.2rem'}}>{m.title_ur}</td>
                    <td style={{textAlign: 'right'}}>
                        <button className="v-button v-btn-secondary" onClick={() => setViewModalData(m)} style={{marginRight: '8px'}} title="View Details">
                            <i className='bx bx-show'></i>
                        </button>
                        <button className="v-button v-btn-danger" onClick={() => handleDeleteCourse(m.id)} title="Delete Matrix">
                            {actionLoading === m.id ? <i className='bx bx-loader-alt bx-spin'></i> : <i className='bx bx-trash'></i>}
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PROFILES VIEW (WITH CONTEXTUAL KPIs) */}
      {activeTab === 'profiles' && (
        <>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="kpi-box" style={{ borderTopColor: '#3b82f6' }}>
              <div className="kpi-info"><h4>Total Registered</h4><h2>{profiles.length}</h2></div>
              <div className="kpi-icon" style={{color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)'}}><i className='bx bx-user-pin'></i></div>
            </div>
            <div className="kpi-box" style={{ borderTopColor: '#10b981' }}>
              <div className="kpi-info"><h4>Active (Setup Done)</h4><h2>{profiles.filter(p => p.is_complete).length}</h2></div>
              <div className="kpi-icon" style={{color: '#10b981', background: 'rgba(16, 185, 129, 0.1)'}}><i className='bx bx-user-check'></i></div>
            </div>
            <div className="kpi-box" style={{ borderTopColor: '#ef4444' }}>
              <div className="kpi-info"><h4>Pending Setup</h4><h2>{profiles.filter(p => !p.is_complete).length}</h2></div>
              <div className="kpi-icon" style={{color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)'}}><i className='bx bx-user-x'></i></div>
            </div>
          </div>

          <div className="v-card">
            <table className="v-table">
              <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th></tr></thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id}>
                    <td style={{color:'#94a3b8'}}>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td style={{fontWeight: 'bold'}}>{p.full_name || '-'}</td>
                    <td>{p.email}</td>
                    <td>{p.phone || '-'}</td>
                    <td><span style={{color: p.is_complete ? '#10b981' : '#ef4444', fontSize:'0.75rem', padding:'4px 10px', background: p.is_complete ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius:'12px', fontWeight:'bold'}}>{p.is_complete ? 'Active' : 'Pending'}</span></td>
                  </tr>
                ))}
                {profiles.length === 0 && <tr><td colSpan={5} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No students found.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ASSESSMENTS VIEW */}
      {activeTab === 'assessments' && (
        <div className="v-card">
          <table className="v-table">
            <thead><tr><th>Date</th><th>Email</th><th>Target Stream</th><th>Status</th></tr></thead>
            <tbody>
              {assessments.map(a => (
                <tr key={a.id}>
                  <td style={{color:'#94a3b8'}}>{new Date(a.created_at).toLocaleDateString()}</td>
                  <td style={{fontWeight: 'bold'}}>{a.email}</td>
                  <td><span style={{color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding:'4px 10px', borderRadius:'12px', fontWeight:'bold', fontSize:'0.8rem'}}>{a.interest_area}</span></td>
                  <td><span style={{color: '#10b981', fontSize:'0.75rem', padding:'4px 10px', background:'rgba(16,185,129,0.1)', borderRadius:'12px', fontWeight:'bold'}}>{a.status}</span></td>
                </tr>
              ))}
              {assessments.length === 0 && <tr><td colSpan={4} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No assessments found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* --- DETAILS MODAL --- */}
      {viewModalData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                <button onClick={() => setViewModalData(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }}><i className='bx bx-x'></i></button>
                
                <h2 style={{ color: '#38bdf8', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Matrix X-Ray: {viewModalData.stream_key}</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* ENGLISH SIDE */}
                    <div>
                        <h4 style={{color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '5px'}}>English Data</h4>
                        <p style={{background: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '15px'}}><strong>Title:</strong> {viewModalData.title_en}</p>
                        <p style={{background: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '15px'}}><strong>Scope:</strong> {viewModalData.scope_en || '-'}</p>
                        <p style={{background: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '15px'}}><strong>Duration:</strong> {viewModalData.duration_en || '-'}</p>
                        <div style={{background: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '15px'}}>
                            <strong>Courses:</strong>
                            <ul style={{marginLeft: '20px', marginTop: '5px'}}>
                                {viewModalData.courses_en.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                        </div>
                        <p style={{background: '#0f172a', padding: '10px', borderRadius: '6px', whiteSpace: 'pre-wrap'}}><strong>Details:</strong><br/>{viewModalData.details_en || '-'}</p>
                    </div>

                    {/* URDU SIDE */}
                    <div dir="rtl" style={{fontFamily: "'Jameel Noori Nastaleeq', serif", fontSize: '1.1rem'}}>
                        <h4 style={{color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '5px', fontFamily: "'Segoe UI', sans-serif"}} dir="ltr">Urdu Data</h4>
                        <p style={{background: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '15px'}}><strong>عنوان:</strong> {viewModalData.title_ur}</p>
                        <p style={{background: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '15px'}}><strong>دائرہ کار:</strong> {viewModalData.scope_ur || '-'}</p>
                        <p style={{background: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '15px'}}><strong>مدت:</strong> {viewModalData.duration_ur || '-'}</p>
                        <div style={{background: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '15px'}}>
                            <strong>کورسز:</strong>
                            <ul style={{marginRight: '20px', marginTop: '5px'}}>
                                {viewModalData.courses_ur.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                        </div>
                        <p style={{background: '#0f172a', padding: '10px', borderRadius: '6px', whiteSpace: 'pre-wrap'}}><strong>تفصیلات:</strong><br/>{viewModalData.details_ur || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
      )}

    </AdminLayout>
  );
}
