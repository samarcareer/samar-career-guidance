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
    if (data?.session) { setIsAuthenticated(true); fetchCRMData(); } else setError("Invalid OTP");
    setLoadingAuth(false);
  };

  const fetchCRMData = async () => {
    // Fetch Profiles and Assessments to merge them
    const { data: profiles } = await supabase.from('student_profiles').select('*').order('created_at', { ascending: false });
    const { data: assessments } = await supabase.from('user_assessments').select('*');
    
    // Merge data so CRM has full context
    const mergedData = (profiles || []).map(p => {
      const assess = (assessments || []).find(a => a.email === p.email);
      return { ...p, ai_result: assess ? assess.interest_area : 'Pending' };
    });
    setStudentsData(mergedData);
  };

  const handleDeleteStudent = async (studentEmail) => {
    if (window.confirm(`Are you sure you want to permanently delete student: ${studentEmail}?`)) {
      await supabase.from('student_profiles').delete().eq('email', studentEmail);
      await supabase.from('user_assessments').delete().eq('email', studentEmail);
      fetchCRMData();
    }
  };

  const filteredData = studentsData.filter(s => String(s?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || String(s?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <ErrorBoundary>
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', padding: '40px 5%', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
        <Head>
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <title>Director's Dashboard | CRM</title>
        </Head>

        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3.5rem', color: '#38bdf8', marginBottom: '10px' }}><i className='bx bxs-pie-chart-alt-2'></i></div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '2.2rem' }}>Director's Dashboard</h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Advanced CRM & Operations</p>
        </header>

        {!isAuthenticated ? (
          <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '40px', borderRadius: '16px', maxWidth: '480px', margin: '0 auto' }}>
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
            <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <input type="text" placeholder="Search Email or Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #38bdf8', background: '#0f172a', color: '#fff', width: '300px' }} />
              <button onClick={fetchCRMData} style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}><i className='bx bx-refresh'></i> Refresh Data</button>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.85)', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px', color: '#38bdf8', borderBottom: '2px solid #38bdf8' }}>Date</th>
                    <th style={{ padding: '12px', color: '#38bdf8', borderBottom: '2px solid #38bdf8' }}>Student Name & Contact</th>
                    <th style={{ padding: '12px', color: '#38bdf8', borderBottom: '2px solid #38bdf8' }}>AI Target Stream</th>
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
                      <td style={{ padding: '12px', borderBottom: '1px solid #334155', color: '#38bdf8', fontWeight: 'bold', textTransform: 'capitalize' }}>{s.ai_result}</td>
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
          </div>
        )}

        {/* DETAILED STUDENT MODAL */}
        {selectedStudent && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
            <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '600px', position: 'relative' }}>
              <button onClick={() => setSelectedStudent(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }}><i className='bx bx-x'></i></button>
              <h2 style={{ color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px' }}><i className='bx bx-user-circle'></i> Comprehensive Profile</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#e2e8f0', marginBottom: '20px' }}>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Name</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.full_name}</h3>
                </div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Phone</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.phone}</h3>
                </div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Education Level</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.education_level}</h3>
                </div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>City</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.city}</h3>
                </div>
              </div>

              <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '15px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Target Career Goal</p><h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStudent.career_goal}</h3>
              </div>
              <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Main Struggle / Query</p><p style={{ margin: 0, fontSize: '1rem', fontStyle: 'italic' }}>"{selectedStudent.main_struggle || 'None provided'}"</p>
              </div>

            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
