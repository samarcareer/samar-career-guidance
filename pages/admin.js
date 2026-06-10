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
  
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        supabase.from('admin_users').select('email').eq('email', session.user.email).single().then(({ data }) => {
          if (data) { setIsAuthenticated(true); fetchCRMData(); } else { supabase.auth.signOut(); }
        });
      }
    });
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault(); setLoadingAuth(true); 
    const { data } = await supabase.from('admin_users').select('email').eq('email', email.trim().toLowerCase()).single();
    if (!data) { alert("Access Denied!"); setLoadingAuth(false); return; }
    await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase() });
    setOtpSent(true); setLoadingAuth(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setLoadingAuth(true); 
    const { data } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: otp, type: 'email' });
    if (data?.session) { setIsAuthenticated(true); fetchCRMData(); } else alert("Invalid OTP");
    setLoadingAuth(false);
  };

  const fetchCRMData = async () => {
    const { data: profiles } = await supabase.from('student_profiles').select('*').order('created_at', { ascending: false });
    const { data: assessments } = await supabase.from('user_assessments').select('*');
    
    const merged = (profiles || []).map(p => {
       const a = (assessments || []).find(x => x.email === p.email);
       return { ...p, ai_result: a ? a.interest_area : 'Pending' };
    });
    setStudentsData(merged);
  };

  const handleDeleteStudent = async (studentEmail) => {
    if (window.confirm(`Permanently delete student: ${studentEmail}?`)) {
      try {
        await supabase.from('student_profiles').delete().eq('email', studentEmail);
        await supabase.from('user_assessments').delete().eq('email', studentEmail);
        fetchCRMData();
        alert("Student deleted completely!");
      } catch(err) { alert("Delete failed due to security policies."); }
    }
  };

  // THE REAL FIX: Status changes now immediately save to Supabase
  const handleStatusChange = async (studentEmail, newStatus) => {
    const currentData = [...studentsData];
    const index = currentData.findIndex(s => s.email === studentEmail);
    if(index !== -1) {
      currentData[index].lead_status = newStatus;
      setStudentsData(currentData); // Optimistic UI update
    }
    const { error } = await supabase.from('student_profiles').update({ lead_status: newStatus }).eq('email', studentEmail);
    if(error) { alert("Failed to save status!"); fetchCRMData(); } // Revert if failed
  };

  const filteredData = studentsData.filter(s => String(s?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || String(s?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <ErrorBoundary>
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', padding: '40px 5%', fontFamily: "sans-serif" }}>
        <Head>
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <title>Director Dashboard</title>
        </Head>

        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem', color: '#38bdf8' }}><i className='bx bxs-pie-chart-alt-2'></i></div>
          <h1>Director's CRM</h1>
        </header>

        {!isAuthenticated ? (
          <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '40px', borderRadius: '16px', maxWidth: '400px', margin: '0 auto', border: '1px solid #38bdf8' }}>
               {!otpSent ? (
                 <form onSubmit={handleSendOtp}>
                   <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #38bdf8' }} />
                   <button type="submit" style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{loadingAuth ? 'Sending...' : 'Send OTP'}</button>
                 </form>
               ) : (
                 <form onSubmit={handleVerifyOtp}>
                   <input type="text" placeholder="PIN" value={otp} onChange={e => setOtp(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', background: '#0f172a', color: '#fff', textAlign:'center', letterSpacing:'5px' }} />
                   <button type="submit" style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Verify</button>
                 </form>
               )}
          </div>
        ) : (
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #38bdf8', background: '#0f172a', color: '#fff' }} />
              <button onClick={fetchCRMData} style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Refresh</button>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.8)', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px', borderBottom: '2px solid #38bdf8' }}>Name & Contact</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #38bdf8' }}>AI Target</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #38bdf8' }}>Lead Status</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #38bdf8' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((s, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                        <strong style={{ color: '#fff' }}>{s.full_name || 'N/A'}</strong><br/>
                        <small style={{ color: '#94a3b8' }}>{s.email}</small><br/>
                        <small style={{ color: '#10b981' }}>{s.phone || 'No Phone'}</small>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #334155', color: '#38bdf8', textTransform: 'capitalize' }}>{s.ai_result}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                        <select 
                          value={s.lead_status || 'New'} 
                          onChange={(e) => handleStatusChange(s.email, e.target.value)} 
                          style={{ padding: '8px', background: '#0f172a', color: '#fff', borderRadius: '6px', border: '1px solid #38bdf8' }}
                        >
                          <option value="New">🔴 New</option><option value="Contacted">🟡 Contacted</option><option value="Closed">🟢 Closed</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                        <button onClick={() => setSelectedStudent(s)} style={{ background: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', padding: '6px 10px', borderRadius: '6px', marginRight: '10px', cursor: 'pointer' }}><i className='bx bx-show'></i></button>
                        <button onClick={() => handleDeleteStudent(s.email)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}><i className='bx bx-trash'></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPREHENSIVE MODAL */}
        {selectedStudent && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: '20px', overflowY: 'auto' }}>
            <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '700px', position: 'relative' }}>
              <button onClick={() => setSelectedStudent(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }}><i className='bx bx-x'></i></button>
              <h2 style={{ color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px' }}>Comprehensive Profile</h2>
              
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {selectedStudent.photo_url ? (
                  <img 
                    src={selectedStudent.photo_url} 
                    alt="Student" 
                    onClick={() => setEnlargedImage(selectedStudent.photo_url)}
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #38bdf8', cursor: 'zoom-in' }} 
                  />
                ) : (
                  <i className='bx bx-user' style={{ fontSize: '4rem', color: '#64748b' }}></i>
                )}
                <h3 style={{ color: '#fff', marginTop: '10px' }}>{selectedStudent.full_name || 'No Name'}</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px' }}><p style={{ margin:0, color:'#94a3b8', fontSize:'0.8rem' }}>Phone</p><h3 style={{ margin:0, color:'#fff' }}>{selectedStudent.phone || '-'}</h3></div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px' }}><p style={{ margin:0, color:'#94a3b8', fontSize:'0.8rem' }}>City</p><h3 style={{ margin:0, color:'#fff' }}>{selectedStudent.city || '-'}</h3></div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px' }}><p style={{ margin:0, color:'#94a3b8', fontSize:'0.8rem' }}>Gender</p><h3 style={{ margin:0, color:'#fff' }}>{selectedStudent.gender || '-'}</h3></div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px' }}><p style={{ margin:0, color:'#94a3b8', fontSize:'0.8rem' }}>School/College</p><h3 style={{ margin:0, color:'#fff' }}>{selectedStudent.college_name || '-'}</h3></div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px' }}><p style={{ margin:0, color:'#94a3b8', fontSize:'0.8rem' }}>Education Level</p><h3 style={{ margin:0, color:'#fff' }}>{selectedStudent.education_level || '-'}</h3></div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px' }}><p style={{ margin:0, color:'#94a3b8', fontSize:'0.8rem' }}>Stream</p><h3 style={{ margin:0, color:'#fff' }}>{selectedStudent.stream || '-'}</h3></div>
              </div>

              <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}><p style={{ margin:0, color:'#94a3b8', fontSize:'0.8rem' }}>Target Goal Entered</p><h3 style={{ margin:0, color:'#fff' }}>{selectedStudent.career_goal || '-'}</h3></div>
              <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}><p style={{ margin:0, color:'#94a3b8', fontSize:'0.8rem' }}>Struggle</p><p style={{ margin:0, color:'#fff', fontStyle:'italic' }}>"{selectedStudent.main_struggle || 'None'}"</p></div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '20px', borderRadius: '8px' }}>
                 <h3 style={{ color: '#10b981', marginBottom: '10px' }}><i className='bx bx-brain'></i> Assessment Results</h3>
                 <p style={{ margin: '0 0 10px 0', color: '#fff' }}><strong>Final AI Target:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedStudent.ai_result}</span></p>
                 <div style={{ padding: '10px', background: '#0f172a', borderRadius: '6px' }}>
                    <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0 }}><i className='bx bx-info-circle'></i> Detailed answers will appear here once the Assessment Module saves individual Q&A data.</p>
                 </div>
              </div>

            </div>
          </div>
        )}

        {/* FULL SCREEN IMAGE OVERLAY */}
        {enlargedImage && (
          <div onClick={() => setEnlargedImage(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' }}>
             <img src={enlargedImage} alt="Enlarged" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px', border: '2px solid #38bdf8' }} />
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
}
