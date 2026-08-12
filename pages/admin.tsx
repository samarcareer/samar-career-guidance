// pages/admin.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase as clientSupabase } from '../utils/supabase';
import AdminLayout from '../components/AdminLayout';

interface StudentProfile { 
    id: string; email: string; full_name: string; phone: string; gender: string;
    education_level: string; stream: string; college_name: string; city: string;
    career_goal: string; main_struggle: string; is_complete: boolean; 
    created_at: string; updated_at: string; photo_url: string; 
    lead_status: string; 
}
interface AssessmentRecord { id: string; email: string; interest_area: string; status: string; created_at: string; }
interface MatrixRecord { id: string; stream_key: string; title_en: string; title_ur: string; scope_en: string; scope_ur: string; duration_en: string; duration_ur: string; courses_en: string[]; courses_ur: string[]; details_en: string; details_ur: string; created_at: string; }

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profiles');
  
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [matrixContent, setMatrixContent] = useState<MatrixRecord[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [viewMatrixData, setViewMatrixData] = useState<MatrixRecord | null>(null);
  const [viewStudentData, setViewStudentData] = useState<StudentProfile | null>(null);

  // CRM Status State (Strictly Dropdown, No Text Input)
  const [crmStatus, setCrmStatus] = useState('');
  const [isSavingCrm, setIsSavingCrm] = useState(false);

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

  const openStudentModal = (student: StudentProfile) => {
      setViewStudentData(student);
      setCrmStatus(student.lead_status || 'New');
  };

  const handleCrmUpdate = async () => {
      if (!viewStudentData) return;
      setIsSavingCrm(true);
      try {
          // Sending only the dropdown status
          const payload = { id: viewStudentData.id, lead_status: crmStatus };
          const res = await fetch('/api/admin-data', { 
              method: 'POST', headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ action: 'UPDATE_STUDENT_CRM', payload }) 
          });
          if (!res.ok) throw new Error("Update failed");
          
          setProfiles(prev => prev.map(p => p.id === viewStudentData.id ? { ...p, lead_status: crmStatus } : p));
          setViewStudentData(prev => prev ? { ...prev, lead_status: crmStatus } : null);
          alert("Status Locked & Saved!");
      } catch (err) { alert("Failed to save CRM data."); } finally { setIsSavingCrm(false); }
  };

  const handleCmsSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setIsSubmitting(true);
      try {
          const payload = { ...cmsForm, courses_en: cmsForm.courses_en.split(',').map(c => c.trim()), courses_ur: cmsForm.courses_ur.split(',').map(c => c.trim()) };
          const res = await fetch('/api/admin-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ADD_COURSE', payload }) });
          if (!res.ok) throw new Error("Upload failed");
          const result = await res.json();
          setMatrixContent([result.data[0], ...matrixContent]);
          setCmsForm({ stream_key: '', title_en: '', title_ur: '', scope_en: '', scope_ur: '', duration_en: '', duration_ur: '', courses_en: '', courses_ur: '', details_en: '', details_ur: '' });
          alert("Course Matrix successfully uploaded!");
      } catch (err) { alert("Upload Failed"); } finally { setIsSubmitting(false); }
  };

  const handleDeleteCourse = async (id: string) => {
      if (!window.confirm(`Permanently delete this matrix?`)) return;
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
      
      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <>
          <div className="kpi-grid">
            <div className="kpi-box"><div className="kpi-info"><h4>Total Signups</h4><h2>{profiles.length}</h2></div><div className="kpi-icon"><i className='bx bxs-user-account'></i></div></div>
            <div className="kpi-box"><div className="kpi-info"><h4>AI Assessments</h4><h2>{assessments.length}</h2></div><div className="kpi-icon" style={{color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)'}}><i className='bx bx-brain'></i></div></div>
            <div className="kpi-box"><div className="kpi-info"><h4>Course Matrix</h4><h2>{matrixContent.length}</h2></div><div className="kpi-icon" style={{color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)'}}><i className='bx bx-data'></i></div></div>
          </div>
          <div className="v-card" style={{ padding: '60px 40px', textAlign: 'center', borderTop: '4px solid #38bdf8' }}>
              <i className='bx bxs-shield-check' style={{ fontSize: '5rem', color: '#10b981', marginBottom: '20px' }}></i>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#fff' }}>Samar Engine Active & Secure</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Use the sidebar to manage database records, students, and CMS content.</p>
          </div>
        </>
      )}

      {/* MATRIX CMS VIEW */}
      {activeTab === 'matrix' && (
        <>
          <div className="v-card" style={{ padding: '24px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', fontWeight: 700, color: '#38bdf8' }}><i className='bx bx-plus-circle'></i> Add Matrix</h3>
            <form onSubmit={handleCmsSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}><label className="v-label">Stream Key *</label><input required className="v-input" type="text" value={cmsForm.stream_key} onChange={e => setCmsForm({...cmsForm, stream_key: e.target.value})} /></div>
              <div><label className="v-label">English Title *</label><input required className="v-input" type="text" value={cmsForm.title_en} onChange={e => setCmsForm({...cmsForm, title_en: e.target.value})} /></div>
              <div><label className="v-label">Urdu Title *</label><input required className="v-input ur-input" dir="rtl" type="text" value={cmsForm.title_ur} onChange={e => setCmsForm({...cmsForm, title_ur: e.target.value})} /></div>
              <div><label className="v-label">Courses EN *</label><textarea required className="v-input" value={cmsForm.courses_en} onChange={e => setCmsForm({...cmsForm, courses_en: e.target.value})}></textarea></div>
              <div><label className="v-label">Courses UR *</label><textarea required className="v-input ur-input" dir="rtl" value={cmsForm.courses_ur} onChange={e => setCmsForm({...cmsForm, courses_ur: e.target.value})}></textarea></div>
              <div style={{ gridColumn: '1 / -1' }}><button type="submit" disabled={isSubmitting} className="v-button v-btn-primary" style={{width:'100%', padding:'12px'}}>{isSubmitting ? 'Uploading...' : 'Push to Database 🚀'}</button></div>
            </form>
          </div>

          <div className="v-card">
            <table className="v-table">
              <thead><tr><th>Key</th><th>EN Title</th><th>UR Title</th><th style={{textAlign: 'right'}}>Actions</th></tr></thead>
              <tbody>
                {matrixContent.map(m => (
                  <tr key={m.id}>
                    <td style={{color:'#38bdf8'}}>{m.stream_key}</td><td>{m.title_en}</td><td dir="rtl">{m.title_ur}</td>
                    <td style={{textAlign: 'right'}}>
                        <button className="v-button v-btn-secondary" onClick={() => setViewMatrixData(m)} style={{marginRight: '8px'}}><i className='bx bx-show'></i></button>
                        <button className="v-button v-btn-danger" onClick={() => handleDeleteCourse(m.id)}>{actionLoading === m.id ? '...' : <i className='bx bx-trash'></i>}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PROFILES VIEW */}
      {activeTab === 'profiles' && (
        <>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="kpi-box" style={{ borderTopColor: '#3b82f6' }}><div className="kpi-info"><h4>Total Registered</h4><h2>{profiles.length}</h2></div><div className="kpi-icon" style={{color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)'}}><i className='bx bx-user-pin'></i></div></div>
            <div className="kpi-box" style={{ borderTopColor: '#10b981' }}><div className="kpi-info"><h4>Active</h4><h2>{profiles.filter(p => p.is_complete).length}</h2></div><div className="kpi-icon" style={{color: '#10b981', background: 'rgba(16, 185, 129, 0.1)'}}><i className='bx bx-user-check'></i></div></div>
            <div className="kpi-box" style={{ borderTopColor: '#f59e0b' }}><div className="kpi-info"><h4>Leads Contacted</h4><h2>{profiles.filter(p => p.lead_status === 'Contacted').length}</h2></div><div className="kpi-icon" style={{color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)'}}><i className='bx bx-phone-call'></i></div></div>
          </div>

          <div className="v-card">
            <table className="v-table">
              <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th style={{textAlign: 'right'}}>Action</th></tr></thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id}>
                    <td style={{color:'#94a3b8'}}>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td style={{fontWeight: 'bold'}}>{p.full_name || '-'}</td><td>{p.email}</td><td>{p.phone || '-'}</td>
                    <td><span style={{color: p.is_complete ? '#10b981' : '#ef4444', fontSize:'0.75rem', padding:'4px 10px', background: p.is_complete ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius:'12px', fontWeight:'bold'}}>{p.is_complete ? 'Active' : 'Pending'}</span></td>
                    <td style={{textAlign: 'right'}}>
                        <button className="v-button v-btn-secondary" onClick={() => openStudentModal(p)}><i className='bx bx-show'></i> Details</button>
                    </td>
                  </tr>
                ))}
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

      {/* --- STUDENT CRM MODAL (NOW 100% TEXT-INPUT FREE) --- */}
      {viewStudentData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button onClick={() => setViewStudentData(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }}><i className='bx bx-x'></i></button>
                
                <h2 style={{ color: '#38bdf8', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Student Profile X-Ray</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                    <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                            {viewStudentData.photo_url ? (
                                <img src={viewStudentData.photo_url} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #38bdf8' }} />
                            ) : (
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#334155', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', color: '#94a3b8' }}><i className='bx bxs-user'></i></div>
                            )}
                            <h3 style={{ marginTop: '10px', color: '#fff' }}>{viewStudentData.full_name || 'No Name'}</h3>
                            <span style={{ fontSize: '0.8rem', color: viewStudentData.is_complete ? '#10b981' : '#ef4444' }}>{viewStudentData.is_complete ? 'Active Profile' : 'Pending Profile'}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '2' }}>
                            <p><i className='bx bx-envelope'></i> {viewStudentData.email}</p>
                            <p><i className='bx bx-phone'></i> {viewStudentData.phone || 'N/A'}</p>
                            <p><i className='bx bx-map'></i> {viewStudentData.city || 'N/A'}</p>
                            <p><i className='bx bx-male-female'></i> {viewStudentData.gender || 'N/A'}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                            <h4 style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '15px' }}>Academic & Career Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.9rem' }}>
                                <div><strong style={{ color: '#38bdf8' }}>Education:</strong><br/>{viewStudentData.education_level || '-'}</div>
                                <div><strong style={{ color: '#38bdf8' }}>Stream:</strong><br/>{viewStudentData.stream || '-'}</div>
                                <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#38bdf8' }}>College/School:</strong><br/>{viewStudentData.college_name || '-'}</div>
                                <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#38bdf8' }}>Career Goal:</strong><br/>{viewStudentData.career_goal || '-'}</div>
                                <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#ef4444' }}>Main Struggle:</strong><br/>{viewStudentData.main_struggle || '-'}</div>
                            </div>
                        </div>

                        {/* STRICT STATUS UPDATE - NO TEXT AREA */}
                        <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                            <h4 style={{ color: '#38bdf8', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '15px' }}><i className='bx bx-headphone'></i> Office Tracking Status</h4>
                            
                            <label className="v-label">Lead Status (Verified Options Only)</label>
                            <select className="v-input" style={{ marginBottom: '15px', appearance: 'auto' }} value={crmStatus} onChange={e => setCrmStatus(e.target.value)}>
                                <option value="New">New Lead</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Progress">In Progress (Counseling)</option>
                                <option value="Closed/Enrolled">Closed / Enrolled</option>
                                <option value="Not Interested">Not Interested</option>
                            </select>

                            <button onClick={handleCrmUpdate} disabled={isSavingCrm} className="v-button v-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                {isSavingCrm ? 'Locking...' : 'Lock Status'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {viewMatrixData && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
              <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '800px' }}>
                  <button onClick={() => setViewMatrixData(null)} className="v-button v-btn-danger">Close Matrix View</button>
                  <h3 style={{marginTop: '20px'}}>{viewMatrixData.title_en}</h3>
                  <p>{viewMatrixData.courses_en.join(', ')}</p>
              </div>
          </div>
      )}
    </AdminLayout>
  );
}
