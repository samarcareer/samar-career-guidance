import React, { useState, useEffect, Component } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{color:'white', background:'#0f172a', padding:'50px', textAlign:'center'}}>UI Error. Please refresh.</div>;
    return this.props.children;
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [error, setError] = useState('');

  const [adminTab, setAdminTab] = useState('crm'); 
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMap, setStatusMap] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [matrixContent, setMatrixContent] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCmsSubmitting, setIsCmsSubmitting] = useState(false);
  const blankForm = { id: null, stream_key: '', title_en: '', title_ur: '', scope_en: '', scope_ur: '', duration_en: '', duration_ur: '', courses_en: '', courses_ur: '', details_en: '', details_ur: '' };
  const [formData, setFormData] = useState(blankForm);

  const [questionsData, setQuestionsData] = useState([]);
  const [isQnaModalOpen, setIsQnaModalOpen] = useState(false);
  const [isQnaSubmitting, setIsQnaSubmitting] = useState(false);
  const blankQnaForm = { id: null, q_text_en: '', q_text_ur: '', opt1_en: '', opt1_ur: '', opt1_stream: 'science', opt2_en: '', opt2_ur: '', opt2_stream: 'commerce', opt3_en: '', opt3_ur: '', opt3_stream: 'arts', opt4_en: '', opt4_ur: '', opt4_stream: 'polytechnic', is_active: true };
  const [qnaFormData, setQnaFormData] = useState(blankQnaForm);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        supabase.from('admin_users').select('email').eq('email', session.user.email).single().then(({ data }) => {
          if (data) { setIsAuthenticated(true); fetchAllData(); } else { supabase.auth.signOut(); }
        });
      }
    });
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault(); setLoadingAuth(true); setError('');
    const cleanEmail = email.trim().toLowerCase();
    const { data } = await supabase.from('admin_users').select('email').eq('email', cleanEmail).single();
    if (!data) { setError("Access Denied!"); setLoadingAuth(false); return; }
    const { error } = await supabase.auth.signInWithOtp({ email: cleanEmail });
    if (!error) setOtpSent(true); else setError(error.message);
    setLoadingAuth(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setLoadingAuth(true); setError('');
    const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: otp, type: 'email' });
    if (data?.session) { setIsAuthenticated(true); fetchAllData(); } else setError("Invalid OTP");
    setLoadingAuth(false);
  };

  const fetchAllData = () => { fetchCRMData(); fetchCMSData(); fetchQnaData(); };

  const fetchCRMData = async () => {
    const { data: profiles } = await supabase.from('student_profiles').select('*').order('created_at', { ascending: false });
    const { data: assessments } = await supabase.from('user_assessments').select('*');
    
    const merged = [];
    const allProfiles = profiles || [];
    const allAssess = assessments || [];

    allProfiles.forEach(p => {
       const a = allAssess.find(x => x.email === p.email);
       merged.push({ ...p, ai_result: a ? a.interest_area : 'Pending/Not Taken' });
    });

    allAssess.forEach(a => {
       if (!merged.find(m => m.email === a.email)) {
          merged.push({ email: a.email, created_at: a.created_at, full_name: 'Incomplete Profile', ai_result: a.interest_area });
       }
    });
    setStudentsData(merged);
  };

  const handleDeleteStudent = async (studentEmail) => {
    if (window.confirm(`Are you sure you want to permanently delete student: ${studentEmail}?`)) {
      await supabase.from('student_profiles').delete().eq('email', studentEmail);
      await supabase.from('user_assessments').delete().eq('email', studentEmail);
      fetchCRMData();
    }
  };

  const fetchCMSData = async () => { const { data } = await supabase.from('matrix_content').select('*').order('created_at', { ascending: true }); if (data) setMatrixContent(data); };
  const handleCmsSave = async (e) => {
    e.preventDefault(); setIsCmsSubmitting(true);
    const payload = { ...formData, stream_key: String(formData.stream_key).toLowerCase().trim(), courses_en: String(formData.courses_en).split(',').map(s=>s.trim()).filter(s=>s), courses_ur: String(formData.courses_ur).split(',').map(s=>s.trim()).filter(s=>s) };
    if (formData.id) await supabase.from('matrix_content').update(payload).eq('id', formData.id); else await supabase.from('matrix_content').insert([payload]);
    setIsCmsSubmitting(false); setIsModalOpen(false); fetchCMSData();
  };
  const handleCmsDelete = async (id) => { if (window.confirm("Delete this matrix?")) { await supabase.from('matrix_content').delete().eq('id', id); fetchCMSData(); } };

  const fetchQnaData = async () => { const { data } = await supabase.from('diagnostic_questions').select('*').order('created_at', { ascending: true }); if (data) setQuestionsData(data); };
  const handleQnaSave = async (e) => {
    e.preventDefault(); setIsQnaSubmitting(true);
    const payload = { ...qnaFormData }; if (!payload.id) delete payload.id;
    if (qnaFormData.id) await supabase.from('diagnostic_questions').update(payload).eq('id', qnaFormData.id); else await supabase.from('diagnostic_questions').insert([payload]);
    setIsQnaSubmitting(false); setIsQnaModalOpen(false); fetchQnaData();
  };
  const toggleQuestionStatus = async (id, currentStatus) => { await supabase.from('diagnostic_questions').update({ is_active: !currentStatus }).eq('id', id); fetchQnaData(); };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  const filteredData = studentsData.filter(s => String(s?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || String(s?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <ErrorBoundary>
      <div style={{ backgroundColor: '#0f172a', backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px)`, backgroundSize: '30px 30px', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Head>
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <title>Director's Dashboard | Admin</title>
        </Head>

        <style dangerouslySetInnerHTML={{__html:`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; }
          .desktop-menu { display: flex; align-items: center; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
          .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 0.95rem; cursor: pointer; background: none; border: none; font-family: inherit; }
          .tab-btn { flex: 1; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; border: 1px solid rgba(56, 189, 248, 0.3); transition: 0.3s; font-family: inherit; font-size: 1rem; }
          .tab-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4); }
          .tab-btn.inactive { background: rgba(15, 23, 42, 0.6); color: #94a3b8; }
          .tab-btn.inactive:hover { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
        `}} />

        {/* ADMIN NAVBAR (Global Theme) */}
        <nav>
          <div className="nav-top-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
              <h1 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900' }}>Samar Guidance - Admin</h1>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }} onClick={handleLogout} title="Logout"><i className='bx bx-log-out'></i></button>
            </div>
          </div>
        </nav>

        <main style={{ padding: '40px 5%', flex: 1 }}>
          <header style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '3.5rem', color: '#38bdf8', marginBottom: '10px' }}><i className='bx bxs-pie-chart-alt-2'></i></div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '2.2rem' }}>Director's Dashboard</h1>
            <p style={{ color: '#94a3b8', margin: 0 }}>Advanced CRM & Operations</p>
          </header>

          {!isAuthenticated ? (
            <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '40px', borderRadius: '16px', maxWidth: '480px', margin: '0 auto', border: '1px solid #38bdf8' }}>
               <h2 style={{ marginBottom: '20px' }}>Secure Authorization</h2>
               {error && <p style={{ color: '#ef4444' }}>{error}</p>}
               {!otpSent ? (
                 <form onSubmit={handleSendOtp}>
                   <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', background: '#0f172a', border: '1px solid #38bdf8', color: '#fff' }} />
                   <button type="submit" disabled={loadingAuth} style={{ width: '100%', padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{loadingAuth ? 'Verifying...' : 'Send OTP'}</button>
                 </form>
               ) : (
                 <form onSubmit={handleVerifyOtp}>
                   <input type="text" placeholder="6-Digit PIN" value={otp} onChange={(e) => setOtp(e.target.value)} required style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '8px', background: '#0f172a', border: '1px solid #10b981', color: '#fff', textAlign: 'center', letterSpacing: '5px', fontSize: '1.5rem' }} />
                   <button type="submit" disabled={loadingAuth} style={{ width: '100%', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Verify & Access</button>
                 </form>
               )}
            </div>
          ) : (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                  <button onClick={() => setAdminTab('crm')} className={`tab-btn ${adminTab === 'crm' ? 'active' : 'inactive'}`}><i className='bx bx-line-chart'></i> CRM & Lead Management</button>
                  <button onClick={() => setAdminTab('cms')} className={`tab-btn ${adminTab === 'cms' ? 'active' : 'inactive'}`}><i className='bx bx-data'></i> Study Material & Matrix Manager</button>
                  <button onClick={() => setAdminTab('qna')} className={`tab-btn ${adminTab === 'qna' ? 'active' : 'inactive'}`}><i className='bx bx-task'></i> Assessment Q&A Manager</button>
              </div>

              {/* TAB 1: CRM SYSTEM */}
              {adminTab === 'crm' && (
                <>
                  <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', border: '1px solid #334155' }}>
                    <input type="text" placeholder="Search Email or Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #38bdf8', background: '#0f172a', color: '#fff', width: '300px' }} />
                    <button onClick={fetchCRMData} style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}><i className='bx bx-refresh'></i> Refresh Data</button>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.85)', borderRadius: '12px', padding: '20px', overflowX: 'auto', border: '1px solid #334155' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '12px', color: '#38bdf8', borderBottom: '2px solid #38bdf8' }}>Date</th>
                          <th style={{ padding: '12px', color: '#38bdf8', borderBottom: '2px solid #38bdf8' }}>Student Name & Contact</th>
                          <th style={{ padding: '12px', color: '#38bdf8', borderBottom: '2px solid #38bdf8' }}>AI Target (Test Result)</th>
                          <th style={{ padding: '12px', color: '#38bdf8', borderBottom: '2px solid #38bdf8' }}>Lead Status</th>
                          <th style={{ padding: '12px', color: '#38bdf8', borderBottom: '2px solid #38bdf8' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((s, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                              <strong style={{ display: 'block', color: '#fff' }}>{s.full_name || 'N/A'}</strong>
                              <small style={{ color: '#94a3b8' }}>{s.email}</small><br/>
                              <small style={{ color: '#10b981' }}><i className='bx bxs-phone'></i> {s.phone || 'No Phone'}</small>
                            </td>
                            {/* HIGHLIGHTED RESULT COLUMN */}
                            <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                              <span style={{ background: s.ai_result.includes('Pending') ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: s.ai_result.includes('Pending') ? '#f59e0b' : '#10b981', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold', textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <i className={s.ai_result.includes('Pending') ? 'bx bx-time' : 'bx bx-target-lock'}></i> {s.ai_result}
                              </span>
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                              <select value={statusMap[s.email] || 'new'} onChange={(e) => setStatusMap({...statusMap, [s.email]: e.target.value})} style={{ padding: '5px', background: '#0f172a', color: '#fff', borderRadius: '4px', border: '1px solid #38bdf8' }}>
                                <option value="new">🔴 New</option><option value="counseled">🟡 Counseled</option><option value="admitted">🟢 Admitted</option>
                              </select>
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                              <button onClick={() => setSelectedStudent(s)} style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid #38bdf8', padding: '6px 10px', borderRadius: '6px', marginRight: '10px', cursor: 'pointer' }}><i className='bx bx-show'></i></button>
                              <button onClick={() => handleDeleteStudent(s.email)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }} title="Delete Student"><i className='bx bx-trash'></i></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* TAB 2 & 3 Kept Functional but minimized code for reading */}
              {adminTab === 'cms' && (
                <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '30px', borderRadius: '16px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                        <div><h2 style={{ color: '#fff', margin: '0 0 5px 0' }}>Knowledge Bank Management</h2><p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Manage study domains and streams.</p></div>
                        <button onClick={()=>{setFormData(blankForm); setIsModalOpen(true);}} style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add New Matrix</button>
                    </div>
                    <div>
                        {matrixContent.map(item => (
                            <div key={item.id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #475569', borderRadius: '10px', padding: '20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div><h4 style={{ margin: '0', color: '#fff', fontSize: '1.2rem' }}>{item.title_en} <span style={{fontSize:'0.8rem', color:'#38bdf8', background:'rgba(56,189,248,0.1)', padding:'2px 8px', borderRadius:'10px', marginLeft:'10px'}}>{item.stream_key}</span></h4></div>
                                <div style={{display:'flex', gap:'10px'}}>
                                  <button onClick={() => {setFormData({...item, courses_en: item.courses_en?.join(', '), courses_ur: item.courses_ur?.join(', ')}); setIsModalOpen(true);}} style={{ background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}><i className='bx bx-edit'></i></button>
                                  <button onClick={() => handleCmsDelete(item.id)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}><i className='bx bx-trash'></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              )}

              {adminTab === 'qna' && (
                <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '30px', borderRadius: '16px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                        <div><h2 style={{ color: '#fff', margin: '0 0 5px 0' }}>Diagnostic Test Manager</h2><p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Manage interactive assessment questions.</p></div>
                        <button onClick={()=>{setQnaFormData(blankQnaForm); setIsQnaModalOpen(true);}} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add New Question</button>
                    </div>
                    <div>
                        {questionsData.map((q, i) => (
                            <div key={q.id} style={{ background: 'rgba(15, 23, 42, 0.6)', borderLeft: `4px solid ${q.is_active ? '#10b981' : '#ef4444'}`, borderRadius: '10px', padding: '20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: q.is_active ? 1 : 0.5 }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1rem', color: '#fff', margin: '0 0 10px 0' }}>Q{i+1}: {q.q_text_en}</h4>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1' }}>A ➔ {q.opt1_stream}</span>
                                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1' }}>B ➔ {q.opt2_stream}</span>
                                    </div>
                                </div>
                                <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
                                  <button onClick={() => toggleQuestionStatus(q.id, q.is_active)} style={{ background: 'transparent', border: `1px solid ${q.is_active ? '#ef4444' : '#10b981'}`, color: q.is_active ? '#ef4444' : '#10b981', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>{q.is_active ? 'Deactivate' : 'Activate'}</button>
                                  <button onClick={() => {setQnaFormData(q); setIsQnaModalOpen(true);}} style={{ background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}><i className='bx bx-edit'></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              )}
              
            </div>
          )}

          {/* DETAILED STUDENT MODAL (Now includes AI Target and Admin View) */}
          {selectedStudent && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', overflowY: 'auto' }}>
              <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '600px', position: 'relative' }}>
                <button onClick={() => setSelectedStudent(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }}><i className='bx bx-x'></i></button>
                <h2 style={{ color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px' }}><i className='bx bx-user-circle'></i> Comprehensive Profile</h2>
                
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                  {selectedStudent.photo_url ? (
                    <img src={selectedStudent.photo_url} alt="Student" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #38bdf8', boxShadow: '0 0 15px rgba(56,189,248,0.3)' }} />
                  ) : (
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#0f172a', border: '3px dashed #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '4rem', color: '#38bdf8' }}>
                      <i className='bx bx-user'></i>
                    </div>
                  )}
                  <h3 style={{ color: '#fff', marginTop: '10px', fontSize: '1.5rem' }}>{selectedStudent.full_name || 'No Name'}</h3>
                  <p style={{ color: '#94a3b8', margin: 0 }}>{selectedStudent.email}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#e2e8f0', marginBottom: '15px' }}>
                  <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Phone</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.phone || 'N/A'}</h3>
                  </div>
                  <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>City</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.city || 'N/A'}</h3>
                  </div>
                  <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Education Level</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.education_level || 'N/A'}</h3>
                  </div>
                  {/* RESULT HIGHLIGHT */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '8px', border: '1px solid #10b981' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold' }}>AI Assessment Result</p>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', textTransform: 'capitalize' }}>{selectedStudent.ai_result || 'Pending'}</h3>
                  </div>
                </div>

                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Goal Entered By Student</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.career_goal || 'N/A'}</h3>
                </div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Main Struggle / Query</p><p style={{ margin: 0, fontSize: '1rem', fontStyle: 'italic' }}>"{selectedStudent.main_struggle || 'None provided'}"</p>
                </div>

              </div>
            </div>
          )}

          {/* CMS Modal Logic (Minimized UI) */}
          {isModalOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
              <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '12px', padding: '30px', width: '90%', maxWidth: '600px' }}>
                <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>{formData.id ? 'Edit Matrix' : 'Add Matrix'}</h2>
                <form onSubmit={handleCmsSave}>
                  <input type="text" placeholder="Stream Key (e.g. science)" value={formData.stream_key} onChange={e=>setFormData({...formData, stream_key: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} required />
                  <input type="text" placeholder="Title EN" value={formData.title_en} onChange={e=>setFormData({...formData, title_en: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} required />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={()=>setIsModalOpen(false)} style={{ padding: '10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '10px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Save Matrix</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* QNA Modal Logic (Minimized UI) */}
          {isQnaModalOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
              <div style={{ background: '#1e293b', border: '1px solid #a855f7', borderRadius: '12px', padding: '30px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ color: '#a855f7', marginBottom: '20px' }}>{qnaFormData.id ? 'Edit Question' : 'Add Question'}</h2>
                <form onSubmit={handleQnaSave}>
                  <textarea placeholder="Question Text" value={qnaFormData.q_text_en} onChange={e=>setQnaFormData({...qnaFormData, q_text_en: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} required />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={()=>setIsQnaModalOpen(false)} style={{ padding: '10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '10px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Save Question</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </ErrorBoundary>
  );
}
