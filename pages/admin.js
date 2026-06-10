import React, { useState, useEffect, Component } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- ERROR BOUNDARY ---
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
  
  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [error, setError] = useState('');

  // UI States
  const [adminTab, setAdminTab] = useState('crm'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // CRM States
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // CMS States
  const [matrixContent, setMatrixContent] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCmsSubmitting, setIsCmsSubmitting] = useState(false);
  const blankForm = { id: null, stream_key: '', title_en: '', title_ur: '', scope_en: '', scope_ur: '', duration_en: '', duration_ur: '', courses_en: '', courses_ur: '', details_en: '', details_ur: '' };
  const [formData, setFormData] = useState(blankForm);

  // QNA States
  const [questionsData, setQuestionsData] = useState([]);
  const [isQnaModalOpen, setIsQnaModalOpen] = useState(false);
  const [isQnaSubmitting, setIsQnaSubmitting] = useState(false);
  const blankQnaForm = { id: null, q_text_en: '', q_text_ur: '', opt1_en: '', opt1_ur: '', opt1_stream: 'science', opt2_en: '', opt2_ur: '', opt2_stream: 'commerce', opt3_en: '', opt3_ur: '', opt3_stream: 'arts', opt4_en: '', opt4_ur: '', opt4_stream: 'polytechnic', is_active: true };
  const [qnaFormData, setQnaFormData] = useState(blankQnaForm);

  // Initial Auth Check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        supabase.from('admin_users').select('email').eq('email', session.user.email).single().then(({ data }) => {
          if (data) { 
            setIsAuthenticated(true); 
            fetchAllData(); 
          } else { 
            supabase.auth.signOut(); 
          }
        });
      }
    });
  }, []);

  // Login Handlers
  const handleSendOtp = async (e) => {
    e.preventDefault(); setLoadingAuth(true); setError('');
    const cleanEmail = email.trim().toLowerCase();
    const { data } = await supabase.from('admin_users').select('email').eq('email', cleanEmail).single();
    if (!data) { setError("Access Denied! Not an Admin."); setLoadingAuth(false); return; }
    const { error: err } = await supabase.auth.signInWithOtp({ email: cleanEmail });
    if (!err) setOtpSent(true); else setError(err.message);
    setLoadingAuth(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setLoadingAuth(true); setError('');
    const { data, error: err } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: otp, type: 'email' });
    if (data?.session) { setIsAuthenticated(true); fetchAllData(); } else setError("Invalid OTP");
    setLoadingAuth(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  // Fetch All Data
  const fetchAllData = () => {
    fetchCRMData();
    fetchCMSData();
    fetchQnaData();
  };

  // --- CRM LOGIC ---
  const fetchCRMData = async () => {
    const { data: profiles } = await supabase.from('student_profiles').select('*').order('created_at', { ascending: false });
    const { data: assessments } = await supabase.from('user_assessments').select('*');
    
    const merged = (profiles || []).map(p => {
       const a = (assessments || []).find(x => x.email === p.email);
       return { ...p, ai_result: a ? a.interest_area : 'Pending' };
    });

    (assessments || []).forEach(a => {
       if (!merged.find(m => m.email === a.email)) {
          merged.push({ email: a.email, created_at: a.created_at, full_name: 'Incomplete Profile', ai_result: a.interest_area, lead_status: 'New' });
       }
    });
    setStudentsData(merged);
  };

  const handleDeleteStudent = async (studentEmail) => {
    if (window.confirm(`Are you sure you want to permanently delete: ${studentEmail}?`)) {
      try {
        await supabase.from('student_profiles').delete().eq('email', studentEmail);
        await supabase.from('user_assessments').delete().eq('email', studentEmail);
        fetchCRMData();
        alert("Student deleted successfully!");
      } catch(err) { alert("Failed to delete. Check database RLS policies."); }
    }
  };

  const handleStatusChange = async (studentEmail, newStatus) => {
    setStudentsData(prev => prev.map(s => s.email === studentEmail ? { ...s, lead_status: newStatus } : s));
    const { error } = await supabase.from('student_profiles').update({ lead_status: newStatus }).eq('email', studentEmail);
    if(error) alert("Failed to save lead status!");
  };

  const filteredData = studentsData.filter(s => String(s?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || String(s?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  // --- CMS LOGIC ---
  const fetchCMSData = async () => { const { data } = await supabase.from('matrix_content').select('*').order('created_at', { ascending: true }); if (data) setMatrixContent(data); };
  const handleCmsSave = async (e) => {
    e.preventDefault(); setIsCmsSubmitting(true);
    const payload = { ...formData, stream_key: String(formData.stream_key).toLowerCase().trim(), courses_en: String(formData.courses_en).split(',').map(s=>s.trim()).filter(s=>s), courses_ur: String(formData.courses_ur).split(',').map(s=>s.trim()).filter(s=>s) };
    if (formData.id) await supabase.from('matrix_content').update(payload).eq('id', formData.id); else await supabase.from('matrix_content').insert([payload]);
    setIsCmsSubmitting(false); setIsModalOpen(false); fetchCMSData();
  };
  const handleCmsDelete = async (id) => { if (window.confirm("Delete this matrix?")) { await supabase.from('matrix_content').delete().eq('id', id); fetchCMSData(); } };

  // --- QNA LOGIC ---
  const fetchQnaData = async () => { const { data } = await supabase.from('diagnostic_questions').select('*').order('created_at', { ascending: true }); if (data) setQuestionsData(data); };
  const handleQnaSave = async (e) => {
    e.preventDefault(); setIsQnaSubmitting(true);
    const payload = { ...qnaFormData }; if (!payload.id) delete payload.id;
    if (qnaFormData.id) await supabase.from('diagnostic_questions').update(payload).eq('id', qnaFormData.id); else await supabase.from('diagnostic_questions').insert([payload]);
    setIsQnaSubmitting(false); setIsQnaModalOpen(false); fetchQnaData();
  };
  const toggleQuestionStatus = async (id, currentStatus) => { await supabase.from('diagnostic_questions').update({ is_active: !currentStatus }).eq('id', id); fetchQnaData(); };


  return (
    <ErrorBoundary>
      <div style={{ backgroundColor: '#0f172a', backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px)`, backgroundSize: '30px 30px', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <title>Admin Dashboard | Samar Guidance</title>
        </Head>

        {/* Global Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
          .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; }
          .desktop-menu { display: flex; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
          .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; cursor: pointer; background: none; border: none; }
          .tab-btn { flex: 1; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; border: 1px solid rgba(56, 189, 248, 0.3); transition: 0.3s; font-size: 1rem; }
          .tab-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4); }
          .tab-btn.inactive { background: rgba(15, 23, 42, 0.6); color: #94a3b8; }
          .tab-btn.inactive:hover { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
          .action-btn { background: transparent; border: 1px solid #10b981; color: #10b981; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.85rem; }
          /* Scrollbar for table */
          .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .table-wrapper::-webkit-scrollbar { height: 8px; }
          .table-wrapper::-webkit-scrollbar-track { background: #0f172a; }
          .table-wrapper::-webkit-scrollbar-thumb { background: #38bdf8; border-radius: 4px; }
        `}} />

        {/* PREMIUM HEADER NAVBAR */}
        <nav>
          <div className="nav-top-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
              <h1 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900' }}>Samar Admin</h1>
            </div>
            {isAuthenticated && (
              <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.8rem', cursor: 'pointer' }} onClick={handleLogout} title="Logout">
                <i className='bx bx-log-out'></i>
              </button>
            )}
          </div>
        </nav>

        <main style={{ flex: 1, padding: '40px 5%' }}>
          
          <header style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '3.5rem', color: '#38bdf8', marginBottom: '10px' }}><i className='bx bxs-pie-chart-alt-2'></i></div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '2.2rem' }}>Director's Dashboard</h1>
            <p style={{ color: '#94a3b8', margin: 0 }}>Advanced CRM & Operations</p>
          </header>

          {/* SECURE LOGIN */}
          {!isAuthenticated ? (
            <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '40px', borderRadius: '16px', maxWidth: '480px', margin: '0 auto', border: '1px solid #38bdf8' }}>
               <h2 style={{ marginBottom: '20px' }}>Secure Authorization</h2>
               {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}><i className='bx bx-error'></i> {error}</p>}
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
              
              {/* THE 3 TABS (RESTORED) */}
              <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                  <button onClick={() => setAdminTab('crm')} className={`tab-btn ${adminTab === 'crm' ? 'active' : 'inactive'}`}><i className='bx bx-line-chart'></i> CRM & Lead Management</button>
                  <button onClick={() => setAdminTab('cms')} className={`tab-btn ${adminTab === 'cms' ? 'active' : 'inactive'}`}><i className='bx bx-data'></i> Study Material & Matrix</button>
                  <button onClick={() => setAdminTab('qna')} className={`tab-btn ${adminTab === 'qna' ? 'active' : 'inactive'}`}><i className='bx bx-task'></i> Assessment Q&A Manager</button>
              </div>

              {/* TAB 1: CRM SYSTEM */}
              {adminTab === 'crm' && (
                <>
                  <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', border: '1px solid #334155' }}>
                    <input type="text" placeholder="Search Email or Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #38bdf8', background: '#0f172a', color: '#fff', flex: 1, minWidth: '250px' }} />
                    <button onClick={fetchCRMData} className="action-btn"><i className='bx bx-refresh'></i> Refresh Data</button>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '10px', display: 'block' }} className="mobile-scroll-hint"><i className='bx bx-right-arrow-alt'></i> Scroll right on mobile to see all details</p>

                  <div className="table-wrapper" style={{ background: 'rgba(30, 41, 59, 0.85)', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
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
                        {filteredData.length > 0 ? filteredData.map((s, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #334155', color: '#cbd5e1' }}>{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                              <strong style={{ display: 'block', color: '#fff', fontSize: '1.1rem' }}>{s.full_name || 'N/A'}</strong>
                              <small style={{ color: '#94a3b8' }}>{s.email}</small><br/>
                              <small style={{ color: '#10b981' }}><i className='bx bxs-phone'></i> {s.phone || 'No Phone'}</small>
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                              <span style={{ background: s.ai_result.includes('Pending') ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: s.ai_result.includes('Pending') ? '#f59e0b' : '#10b981', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <i className={s.ai_result.includes('Pending') ? 'bx bx-time' : 'bx bx-target-lock'}></i> {s.ai_result}
                              </span>
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                              <select 
                                value={s.lead_status || 'New'} 
                                onChange={(e) => handleStatusChange(s.email, e.target.value)} 
                                style={{ padding: '8px 12px', background: '#0f172a', color: '#fff', borderRadius: '6px', border: '1px solid #38bdf8', outline: 'none', cursor: 'pointer' }}
                              >
                                <option value="New">🔴 New</option>
                                <option value="Contacted">🟡 Contacted</option>
                                <option value="Closed">🟢 Closed</option>
                              </select>
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                              <button onClick={() => setSelectedStudent(s)} style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid #38bdf8', padding: '8px 12px', borderRadius: '6px', marginRight: '10px', cursor: 'pointer' }} title="View Profile"><i className='bx bx-show'></i></button>
                              <button onClick={() => handleDeleteStudent(s.email)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }} title="Delete Student"><i className='bx bx-trash'></i></button>
                            </td>
                          </tr>
                        )) : <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No records found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* TAB 2: CMS SYSTEM */}
              {adminTab === 'cms' && (
                <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '30px', borderRadius: '16px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                        <div><h2 style={{ color: '#fff', margin: '0 0 5px 0' }}>Knowledge Bank Management</h2><p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Manage study domains and streams.</p></div>
                        <button onClick={()=>{setFormData(blankForm); setIsModalOpen(true);}} style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add New Matrix</button>
                    </div>
                    <div>
                        {matrixContent.map(item => (
                            <div key={item.id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed #475569', borderRadius: '10px', padding: '20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                <div><h4 style={{ margin: '0', color: '#fff', fontSize: '1.2rem' }}>{item.title_en} <span style={{fontSize:'0.8rem', color:'#38bdf8', background:'rgba(56,189,248,0.1)', padding:'2px 8px', borderRadius:'10px', marginLeft:'10px'}}>{item.stream_key}</span></h4></div>
                                <div style={{display:'flex', gap:'10px'}}>
                                  <button onClick={() => {setFormData({...item, courses_en: item.courses_en?.join(', '), courses_ur: item.courses_ur?.join(', ')}); setIsModalOpen(true);}} style={{ background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}><i className='bx bx-edit'></i> Edit</button>
                                  <button onClick={() => handleCmsDelete(item.id)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}><i className='bx bx-trash'></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              )}

              {/* TAB 3: QNA SYSTEM */}
              {adminTab === 'qna' && (
                <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '30px', borderRadius: '16px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                        <div><h2 style={{ color: '#fff', margin: '0 0 5px 0' }}>Diagnostic Test Manager</h2><p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Manage interactive assessment questions.</p></div>
                        <button onClick={()=>{setQnaFormData(blankQnaForm); setIsQnaModalOpen(true);}} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add New Question</button>
                    </div>
                    <div>
                        {questionsData.map((q, i) => (
                            <div key={q.id} style={{ background: 'rgba(15, 23, 42, 0.6)', borderLeft: `4px solid ${q.is_active ? '#10b981' : '#ef4444'}`, borderRadius: '10px', padding: '20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: q.is_active ? 1 : 0.5, flexWrap: 'wrap', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1rem', color: '#fff', margin: '0 0 10px 0' }}>Q{i+1}: {q.q_text_en}</h4>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1' }}>A ➔ {q.opt1_stream}</span>
                                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1' }}>B ➔ {q.opt2_stream}</span>
                                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1' }}>C ➔ {q.opt3_stream}</span>
                                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1' }}>D ➔ {q.opt4_stream}</span>
                                    </div>
                                </div>
                                <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
                                  <button onClick={() => toggleQuestionStatus(q.id, q.is_active)} style={{ background: 'transparent', border: `1px solid ${q.is_active ? '#ef4444' : '#10b981'}`, color: q.is_active ? '#ef4444' : '#10b981', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>{q.is_active ? 'Deactivate' : 'Activate'}</button>
                                  <button onClick={() => {setQnaFormData(q); setIsQnaModalOpen(true);}} style={{ background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}><i className='bx bx-edit'></i> Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>
          )}

          {/* --- STUDENT COMPREHENSIVE MODAL --- */}
          {selectedStudent && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', overflowY: 'auto' }}>
              <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '700px', position: 'relative', marginTop: 'auto', marginBottom: 'auto' }}>
                <button onClick={() => setSelectedStudent(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '2rem', cursor: 'pointer' }}><i className='bx bx-x'></i></button>
                <h2 style={{ color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px', fontSize: '1.5rem' }}><i className='bx bx-user-circle'></i> Comprehensive Profile</h2>
                
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                  {selectedStudent.photo_url ? (
                    <img 
                      src={selectedStudent.photo_url} 
                      alt="Student" 
                      onClick={() => setEnlargedImage(selectedStudent.photo_url)}
                      style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #38bdf8', boxShadow: '0 0 15px rgba(56,189,248,0.3)', cursor: 'zoom-in' }} 
                    />
                  ) : (
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#0f172a', border: '3px dashed #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '4rem', color: '#38bdf8' }}>
                      <i className='bx bx-user'></i>
                    </div>
                  )}
                  <h3 style={{ color: '#fff', marginTop: '15px', fontSize: '1.8rem' }}>{selectedStudent.full_name || 'No Name'}</h3>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '1rem' }}>{selectedStudent.email}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#e2e8f0', marginBottom: '15px' }}>
                  <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Phone</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.phone || 'N/A'}</h3>
                  </div>
                  <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>City</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.city || 'N/A'}</h3>
                  </div>
                  <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Gender</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.gender || 'N/A'}</h3>
                  </div>
                  <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Education Level</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.education_level || 'N/A'}</h3>
                  </div>
                  <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155', gridColumn: '1 / -1' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>School/College Name</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.college_name || 'N/A'}</h3>
                  </div>
                </div>

                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Target Goal Entered By Student</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.career_goal || 'N/A'}</h3>
                </div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '20px' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Main Struggle / Query</p><p style={{ margin: 0, fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.5' }}>"{selectedStudent.main_struggle || 'None provided'}"</p>
                </div>

                {/* ASSESSMENT RESULT AREA */}
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '20px', borderRadius: '8px' }}>
                   <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '1.3rem' }}><i className='bx bx-brain'></i> Assessment Results</h3>
                   <p style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '1.1rem' }}><strong>Final AI Target:</strong> <span style={{ textTransform: 'capitalize', color: '#10b981' }}>{selectedStudent.ai_result}</span></p>
                   
                   <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px dashed #ef4444', borderRadius: '8px' }}>
                      <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}><i className='bx bx-info-circle'></i> <strong>Notice:</strong> Detailed answers will appear here once the Assessment Module is upgraded to save individual Q&A tracking data in the database.</p>
                   </div>
                </div>

              </div>
            </div>
          )}

          {/* FULL SCREEN IMAGE OVERLAY */}
          {enlargedImage && (
            <div onClick={() => setEnlargedImage(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' }}>
               <img src={enlargedImage} alt="Enlarged" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px', border: '3px solid #38bdf8', boxShadow: '0 0 30px rgba(56,189,248,0.5)' }} />
               <p style={{ position: 'absolute', bottom: '20px', color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '20px' }}>Click anywhere to close</p>
            </div>
          )}

          {/* CMS MODAL */}
          {isModalOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
              <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>{formData.id ? 'Edit Matrix' : 'Add Matrix'}</h2>
                <form onSubmit={handleCmsSave}>
                  <label style={{color:'#cbd5e1', fontSize:'0.9rem'}}>Stream Key (e.g. science)</label>
                  <input type="text" value={formData.stream_key} onChange={e=>setFormData({...formData, stream_key: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '15px', background:'#0f172a', color:'#fff', border:'1px solid #475569', borderRadius:'6px' }} required />
                  
                  <label style={{color:'#cbd5e1', fontSize:'0.9rem'}}>Title (English)</label>
                  <input type="text" value={formData.title_en} onChange={e=>setFormData({...formData, title_en: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '15px', background:'#0f172a', color:'#fff', border:'1px solid #475569', borderRadius:'6px' }} required />
                  
                  <label style={{color:'#cbd5e1', fontSize:'0.9rem'}}>Title (Urdu)</label>
                  <input type="text" value={formData.title_ur} onChange={e=>setFormData({...formData, title_ur: e.target.value})} dir="rtl" style={{ width: '100%', padding: '10px', marginBottom: '15px', background:'#0f172a', color:'#fff', border:'1px solid #475569', borderRadius:'6px' }} required />

                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={()=>setIsModalOpen(false)} style={{ padding: '12px', flex: 1, background: 'transparent', color: '#fff', border: '1px solid #64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                    <button type="submit" disabled={isCmsSubmitting} style={{ padding: '12px', flex: 1, background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{isCmsSubmitting ? 'Saving...' : 'Save Matrix'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* QNA MODAL */}
          {isQnaModalOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
              <div style={{ background: '#1e293b', border: '1px solid #a855f7', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ color: '#a855f7', marginBottom: '20px' }}>{qnaFormData.id ? 'Edit Question' : 'Add Question'}</h2>
                <form onSubmit={handleQnaSave}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div><label style={{color:'#cbd5e1', fontSize:'0.9rem'}}>Question (EN)</label><textarea value={qnaFormData.q_text_en} onChange={e=>setQnaFormData({...qnaFormData, q_text_en: e.target.value})} style={{ width: '100%', padding: '10px', background:'#0f172a', color:'#fff', border:'1px solid #475569', borderRadius:'6px' }} rows="3" required /></div>
                    <div><label style={{color:'#cbd5e1', fontSize:'0.9rem'}}>Question (UR)</label><textarea value={qnaFormData.q_text_ur} onChange={e=>setQnaFormData({...qnaFormData, q_text_ur: e.target.value})} dir="rtl" style={{ width: '100%', padding: '10px', background:'#0f172a', color:'#fff', border:'1px solid #475569', borderRadius:'6px' }} rows="3" required /></div>
                  </div>

                  {[1, 2, 3, 4].map(num => (
                    <div key={num} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '15px' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>Option {num}</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <input type="text" placeholder="EN Option" value={qnaFormData[`opt${num}_en`]} onChange={(e) => setQnaFormData({...qnaFormData, [`opt${num}_en`]: e.target.value})} style={{ padding: '8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }} required />
                        <input type="text" placeholder="UR Option" value={qnaFormData[`opt${num}_ur`]} onChange={(e) => setQnaFormData({...qnaFormData, [`opt${num}_ur`]: e.target.value})} dir="rtl" style={{ padding: '8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }} required />
                        <select value={qnaFormData[`opt${num}_stream`]} onChange={(e) => setQnaFormData({...qnaFormData, [`opt${num}_stream`]: e.target.value})} style={{ padding: '8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }}>
                          <option value="science">Science</option><option value="commerce">Commerce</option><option value="arts">Arts</option><option value="polytechnic">Polytechnic / ITI</option><option value="paramedical">Paramedical</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={()=>setIsQnaModalOpen(false)} style={{ padding: '12px', flex: 1, background: 'transparent', color: '#fff', border: '1px solid #64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                    <button type="submit" disabled={isQnaSubmitting} style={{ padding: '12px', flex: 1, background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{isQnaSubmitting ? 'Saving...' : 'Save Question'}</button>
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
