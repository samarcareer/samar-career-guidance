import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  
  // --- SamarUI Navbar States ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [session, setSession] = useState(null);

  // --- Auth & Admin States ---
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // --- Data State ---
  const [studentsData, setStudentsData] = useState([]);

  // ⚠️ Authorized Admin Emails
  const ALLOWED_ADMIN_EMAILS = [
    "ashfaqueumar@gmail.com",
    "ashfaqueumarsir@gmail.com",
    "mohammedjunaid8484@gmail.com",
    "mohammedjunaid5463@gmail.com"
  ];

  useEffect(() => {
    // Navbar & Auth Listeners
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
    }
  };

  // --- ADMIN LOGIC ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
      setError("Security Alert: Access Denied! You are not authorized as an Admin.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: true }
      });
      
      if (error) throw error;
      
      setMessage("Secure Admin OTP has been sent to authorized email.");
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'email'
      });

      if (error) throw error;

      if (data?.session) {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (err) {
      setError("Invalid or expired OTP. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_assessments')
        .select('*')
        .order('created_at', { ascending: false }); 

      if (error) throw error;
      if (data) setStudentsData(data);
    } catch (err) {
      alert("Error fetching data: " + err.message);
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (studentsData.length === 0) {
      alert("No data to download!");
      return;
    }
    const headers = "Date,Email,Selected Stream,Language\n";
    const rows = studentsData.map(s => {
      const date = new Date(s.created_at).toLocaleDateString('en-IN');
      return `"${date}","${s.email}","${s.interest_area}","${s.preferred_language}"`;
    }).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Samar_Students_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goBackToEmail = () => {
    setStep(1);
    setOtp('');
    setError('');
    setMessage('');
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.1) 1px, #0f172a 1px)`,
      backgroundSize: '30px 30px',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      maxWidth: '100%',
      overflowX: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <title>Director's Dashboard | Samar Guidance</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }

        /* --- NAVBAR STYLES (SamarUI) --- */
        .glass-navbar {
          width: 100%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; display: flex; flex-direction: column;
        }
        .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; border-bottom: 1px solid rgba(147, 197, 253, 0.1); }
        .nav-brand-container { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        
        .desktop-menu { display: flex; align-items: center; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
        
        .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; position: relative; background: none; border: none; padding: 5px 0; white-space: nowrap; }
        .nav-link:hover { color: #38bdf8; }
        .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: 0; left: 0; background-color: #38bdf8; transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }

        .nav-dropdown-container { position: relative; }
        .nav-dropdown-menu {
          position: absolute; top: 100%; left: 0; background: rgba(30, 64, 175, 0.95); backdrop-filter: blur(16px);
          border: 1px solid rgba(147, 197, 253, 0.2); border-radius: 8px; min-width: 260px; box-shadow: 0 15px 30px rgba(0,0,0,0.6);
          padding: 10px 0; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s ease; z-index: 200;
        }
        .nav-dropdown-container:hover .nav-dropdown-menu, .nav-dropdown-menu.active { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-item { padding: 12px 20px; color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left; background: transparent; border-left: none; border-right: none; border-top: none; width: 100%; cursor: pointer; }
        .dropdown-item:hover { background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding-left: 25px; }

        .mobile-search-wrapper { display: none; width: 100%; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 10px; }
        .desktop-search-wrapper { display: block; flex: 0.6; max-width: 400px; }
        .mobile-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 2rem; cursor: pointer; }

        @media (max-width: 1024px) {
          .desktop-search-wrapper { display: none !important; }
          .mobile-search-wrapper { display: block; }
          .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; align-items: flex-start; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); border-bottom: 1px solid rgba(56,189,248,0.3); padding: 20px 5%; gap: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .mobile-toggle { display: block; }
          .nav-dropdown-menu { position: static; box-shadow: none; border: none; background: rgba(0,0,0,0.2); margin-top: 10px; width: 100%; display: ${showGuidanceDropdown ? 'flex' : 'none'}; opacity: 1; visibility: visible; transform: none; }
          .nav-link { width: 100%; text-align: left; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .nav-link::after { display: none; }
        }

        /* --- ADMIN SPECIFIC STYLES --- */
        .admin-main { flex: 1; display: flex; flex-direction: column; alignItems: center; padding: 60px 5%; width: 100%; }
        .admin-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); width: 100%; max-width: 480px; text-align: center; margin: 0 auto; backdrop-filter: blur(10px); }
        .dashboard-container { width: 100%; max-width: 1200px; background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); margin: 0 auto; backdrop-filter: blur(10px); }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; text-align: left; }
        .data-table th { background: rgba(56, 189, 248, 0.15); padding: 15px; color: #38bdf8; border-bottom: 2px solid #38bdf8; font-size: 1.1rem; }
        .data-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-size: 0.95rem; }
        .data-table tr:hover { background: rgba(255,255,255,0.05); }
        
        .input-group { margin-bottom: 20px; text-align: left; }
        .input-group label { display: block; color: #93c5fd; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; }
        .input-group input { width: 100%; padding: 14px 18px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.6); color: #fff; font-size: 1rem; outline: none; transition: 0.3s; }
        .input-group input:focus { border-color: #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }

        .btn-primary { background: #3b82f6; color: #fff; padding: 14px 25px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1.05rem; width: 100%; transition: 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .btn-primary:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); }
        .btn-primary:disabled { background: #64748b; cursor: not-allowed; }
        
        .action-btn { background: transparent; border: 1px solid #10b981; color: #10b981; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.3s; display: flex; align-items: center; gap: 5px; }
        .action-btn:hover { background: #10b981; color: #0f172a; }
        .table-responsive { overflow-x: auto; }
        
        .alert-box { padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 500; display: flex; align-items: center; gap: 8px; text-align: left; }
        .alert-error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; }
        .alert-success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #6ee7b7; }
        .back-link { background: none; border: none; color: #94a3b8; font-size: 0.9rem; margin-top: 20px; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; gap: 5px; }
        .back-link:hover { color: #38bdf8; }
      `}} />

      {/* --- MASTER NAVBAR (SAMAR UI) --- */}
      <nav className="glass-navbar">
        <div className="nav-top-row">
          <div className="nav-brand-container" onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '0.5px' }}>Samar Guidance</h1>
              <small style={{ color: '#93c5fd', fontWeight: 'bold', display: 'block' }}>Dr. Ashfaque Umar</small>
            </div>
          </div>

          <form className="desktop-search-wrapper" onSubmit={handleSearchSubmit}>
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matrix..." 
              style={{ width: '100%', padding: '10px 18px', borderRadius: '25px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' }}
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {session ? (
              <>
                <button onClick={() => router.push('/profile')} style={{ padding: '8px 20px', background: '#10b981', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.4)' }}>
                  My Profile
                </button>
                <button onClick={handleLogout} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => router.push('/login')} style={{ padding: '8px 20px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59,130,246,0.4)' }}>
                Student Login
              </button>
            )}
            
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <i className='bx bx-x'></i> : <i className='bx bx-menu'></i>}
            </button>
          </div>
        </div>

        <div className="desktop-menu">
          <form className="mobile-search-wrapper" onSubmit={handleSearchSubmit}>
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matrix..." 
              style={{ width: '100%', padding: '10px 18px', borderRadius: '8px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' }}
            />
          </form>

          <button className="nav-link" onClick={() => router.push('/')}>Home</button>
          <button className="nav-link" onClick={() => router.push('/about')}>About Us</button>
          
          <div className="nav-dropdown-container" onMouseEnter={() => !isMobile && setShowGuidanceDropdown(true)} onMouseLeave={() => !isMobile && setShowGuidanceDropdown(false)}>
            <button className="nav-link" onClick={() => setIsMobile && setShowGuidanceDropdown(!showGuidanceDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              Career Guidance <i className='bx bx-chevron-down'></i>
            </button>
            
            <div className={`nav-dropdown-menu ${showGuidanceDropdown ? 'active' : ''}`}>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=10th')}>Courses After 10th</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=12th')}>Courses After 12th</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=graduation')}>Courses After Graduation</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=postgrad')}>Courses After Post Graduation</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=other')}>Other Specializations</button>
            </div>
          </div>

          <button className="nav-link" onClick={() => router.push('/assessment')}>Career Assessment</button>
          <button className="nav-link" onClick={() => router.push('/personality')}>Personality Development</button>
          <button className="nav-link" onClick={() => router.push('/gallery')}>Gallery</button>
        </div>
      </nav>

      {/* --- ADMIN PAGE MAIN CONTENT --- */}
      <main className="admin-main">
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <i className='bx bxs-pie-chart-alt-2' style={{ fontSize: '4rem', color: '#38bdf8', marginBottom: '10px' }}></i>
          <h1 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '2.5rem', fontWeight: '900' }}>Director's Dashboard</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>Samar Foundation • Authorized Personnel Only</p>
        </header>

        {!isAuthenticated ? (
          // --- SECURE OTP LOGIN SCREEN FOR ADMIN ---
          <div className="admin-card">
            <h2 style={{ color: '#fff', marginBottom: '5px', fontSize: '1.5rem' }}>Admin Authentication</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '25px' }}>
              {step === 1 ? 'Enter authorized email to proceed.' : `OTP sent to ${email}`}
            </p>

            {error && <div className="alert-box alert-error"><i className='bx bx-error-circle'></i> {error}</div>}
            {message && step === 2 && !error && <div className="alert-box alert-success"><i className='bx bx-check-circle'></i> {message}</div>}

            {step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <div className="input-group">
                  <label><i className='bx bx-user-circle'></i> Admin Email</label>
                  <input type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <i className='bx bx-loader-alt bx-spin'></i> : <i className='bx bx-send'></i>}
                  {loading ? 'Verifying...' : 'Request Admin OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="input-group">
                  <label><i className='bx bx-dialpad-alt'></i> 6-Digit Code</label>
                  <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }} />
                </div>
                <button type="submit" className="btn-primary" disabled={loading || otp.length < 6}>
                  {loading ? <i className='bx bx-loader-alt bx-spin'></i> : <i className='bx bx-lock-open-alt'></i>}
                  {loading ? 'Unlocking...' : 'Verify & Unlock'}
                </button>
                <button type="button" className="back-link" onClick={goBackToEmail}>
                  <i className='bx bx-edit-alt'></i> Change Admin Email
                </button>
              </form>
            )}
          </div>
        ) : (
          // --- DASHBOARD DATA SCREEN ---
          <div className="dashboard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
              <div>
                <h2 style={{ color: '#fff', margin: '0 0 5px 0' }}>Student Assessments Database</h2>
                <p style={{ color: '#94a3b8', margin: 0 }}>Total Registered Students: <strong style={{ color: '#38bdf8' }}>{studentsData.length}</strong></p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={fetchData} className="action-btn" style={{ borderColor: '#3b82f6', color: '#3b82f6' }}>
                  <i className='bx bx-refresh'></i> Refresh
                </button>
                <button onClick={downloadCSV} className="action-btn">
                  <i className='bx bx-download'></i> Download Excel
                </button>
                <button onClick={() => { setIsAuthenticated(false); setStep(1); setOtp(''); }} className="action-btn" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                  <i className='bx bx-log-out'></i> Lock Dashboard
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#38bdf8' }}>
                <i className='bx bx-loader-alt bx-spin' style={{ fontSize: '3rem' }}></i>
                <p>Fetching Secure Data...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Registration Date</th>
                      <th>Student Email ID</th>
                      <th>Selected Stream</th>
                      <th>Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsData.length > 0 ? (
                      studentsData.map((student, index) => (
                        <tr key={student.id || index}>
                          <td style={{ fontWeight: 'bold', color: '#38bdf8' }}>{index + 1}</td>
                          <td>{new Date(student.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                          <td style={{ color: '#fff' }}>{student.email}</td>
                          <td><span style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '5px 10px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>{student.interest_area}</span></td>
                          <td>{student.preferred_language === 'ur' ? 'اردو (Urdu)' : 'English'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No student records found in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer style={{ width: '100%', background: 'rgba(30, 64, 175, 0.6)', backdropFilter: 'blur(16px)', padding: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#bfdbfe', fontWeight: '700', marginTop: 'auto' }}>
        © 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked.
      </footer>
    </div>
  );
}
