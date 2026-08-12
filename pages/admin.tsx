// pages/admin.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase as clientSupabase } from '../utils/supabase';
import AdminLayout from '../components/AdminLayout'; // Import our new Vercel Layout

interface StudentProfile { id: string; full_name: string; email: string; phone: string; career_goal: string; is_complete: boolean; created_at: string; }
interface AssessmentRecord { id: string; email: string; interest_area: string; status: string; created_at: string; }
interface MatrixRecord { id: string; stream_key: string; title_en: string; title_ur: string; courses_en: string[]; created_at: string; }

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('matrix');
  
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [matrixContent, setMatrixContent] = useState<MatrixRecord[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
      } catch (err) { alert("Upload Failed"); } finally { setIsSubmitting(false); }
  };

  const handleDeleteCourse = async (id: string) => {
      if (!window.confirm(`Delete this matrix?`)) return;
      setActionLoading(id);
      try {
          const res = await fetch('/api/admin-data', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, type: 'COURSE' }) });
          if (!res.ok) throw new Error("Deletion failed");
          setMatrixContent(prev => prev.filter(m => m.id !== id));
      } catch (err) { alert("Deletion failed"); } finally { setActionLoading(null); }
  };

  if (loading && !adminUser) return <div style={{ background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>Initializing Admin Workspace...</div>;

  return (
    <AdminLayout userEmail={adminUser?.email} activeTab={activeTab} setActiveTab={setActiveTab} onRefresh={fetchDashboardData} loading={loading}>
      
      {/* MATRIX CMS VIEW */}
      {activeTab === 'matrix' && (
        <>
          <div className="v-card" style={{ padding: '24px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', fontWeight: 500 }}>Add New Matrix</h3>
            <form onSubmit={handleCmsSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}><label className="v-label">Stream Key (URL Slug) *</label><input required className="v-input" type="text" value={cmsForm.stream_key} onChange={e => setCmsForm({...cmsForm, stream_key: e.target.value})} placeholder="e.g. btech" /></div>
              
              <div><label className="v-label">English Title *</label><input required className="v-input" type="text" value={cmsForm.title_en} onChange={e => setCmsForm({...cmsForm, title_en: e.target.value})} /></div>
              <div><label className="v-label" style={{textAlign:'right'}}>Urdu Title *</label><input required className="v-input ur-input" dir="rtl" type="text" value={cmsForm.title_ur} onChange={e => setCmsForm({...cmsForm, title_ur: e.target.value})} /></div>
              
              <div><label className="v-label">Courses EN (Comma separated) *</label><textarea required className="v-input" style={{height:'100px', resize:'none'}} value={cmsForm.courses_en} onChange={e => setCmsForm({...cmsForm, courses_en: e.target.value})}></textarea></div>
              <div><label className="v-label" style={{textAlign:'right'}}>Courses UR (Comma separated) *</label><textarea required className="v-input ur-input" dir="rtl" style={{height:'100px', resize:'none'}} value={cmsForm.courses_ur} onChange={e => setCmsForm({...cmsForm, courses_ur: e.target.value})}></textarea></div>

              <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                <button type="submit" disabled={isSubmitting} className="v-button v-btn-primary">{isSubmitting ? 'Saving...' : 'Save to Database'}</button>
              </div>
            </form>
          </div>

          <div className="v-card">
            <table className="v-table">
              <thead><tr><th>Stream Key</th><th>EN Title</th><th>UR Title</th><th>Action</th></tr></thead>
              <tbody>
                {matrixContent.map(m => (
                  <tr key={m.id}>
                    <td style={{fontFamily:'monospace', color:'#888'}}>{m.stream_key}</td>
                    <td>{m.title_en}</td><td dir="rtl">{m.title_ur}</td>
                    <td><button className="v-button v-btn-danger" onClick={() => handleDeleteCourse(m.id)}>{actionLoading === m.id ? '...' : 'Delete'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PROFILES VIEW */}
      {activeTab === 'profiles' && (
        <div className="v-card">
          <table className="v-table">
            <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Goal</th></tr></thead>
            <tbody>
              {profiles.map(p => (
                <tr key={p.id}>
                  <td style={{color:'#888'}}>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td style={{fontWeight: 500}}>{p.full_name || '-'}</td><td>{p.email}</td><td>{p.career_goal || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ASSESSMENTS VIEW */}
      {activeTab === 'assessments' && (
        <div className="v-card">
          <table className="v-table">
            <thead><tr><th>Date</th><th>Email</th><th>Target Stream</th><th>Status</th></tr></thead>
            <tbody>
              {assessments.map(a => (
                <tr key={a.id}>
                  <td style={{color:'#888'}}>{new Date(a.created_at).toLocaleDateString()}</td>
                  <td style={{fontWeight: 500}}>{a.email}</td><td>{a.interest_area}</td>
                  <td><span style={{color: '#10b981', fontSize:'0.75rem', padding:'2px 8px', background:'rgba(16,185,129,0.1)', borderRadius:'12px'}}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </AdminLayout>
  );
}
