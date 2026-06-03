import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase'; 

export default function StudentLogin() {
  const router = useRouter();
  
  // --- NAVBAR STATES ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // --- LOGIN STATES ---
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle Resize for Navbar
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
    }
  };

  // STEP 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Security Check: Ensure supabase.auth exists
      if (!supabase || !supabase.auth) {
        throw new Error("Supabase client is not initialized correctly. Please check utils/supabase.js");
      }

      // Supabase v2 standard OTP function
      let authResponse;
      if (typeof supabase.auth.signInWithOtp === 'function') {
        authResponse = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { shouldCreateUser: true }
        });
      } else {
        // Fallback for older Supabase versions
        authResponse = await supabase.auth.signIn({ email: email.trim() });
      }

      if (authResponse.error) throw authResponse.error;
      
      setMessage('A secure 6-digit OTP has been sent. Please check your Inbox and Spam folder.');
      setStep(2); 
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email' // sometimes 'magiclink' is needed depending on setup, but 'email' is standard
      });

      if (error) throw error;

      if (data?.session) {
        router.push('/dashboard'); 
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
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
        <title>Secure Login | Samar Guidance</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; max-width: 100vw; background-color: #0f172a; scroll-behavior: smooth; }

        /* --- NAVBAR STYLES (From index.js) --- */
        .glass-navbar {
          width: 100%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; display: flex; flex-direction: column;
        }
        .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; border-bottom: 1px solid rgba(147, 197, 253, 0.1); }
        .nav-brand-container { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .desktop-menu { display: flex; align-items: center; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
        
        .nav-link {
          color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease;
          cursor: pointer; position: relative; background: none; border: none; padding: 5px 0; white-space: nowrap;
        }
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
        .dropdown-item { padding: 12px 20px; color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left; background: transparent; border: none; width: 100%; cursor: pointer; }
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

        /* --- LOGIN CARD STYLES --- */
        .login-main {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }

        .login-glass-card {
          background: rgba(30, 64, 175, 0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(147, 197, 253, 0.2); border-radius: 20px; padding: 40px; width: 100%; max-width: 450px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5); text-align: center; animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        .input-group { margin-bottom: 20px; text-align: left; }
        .input-group label { display: block; color: #93c5fd; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; }
        .input-group input { width: 100%; padding: 14px 18px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.6); color: #fff; font-size: 1rem; outline: none; transition: 0.3s; }
        .input-group input:focus { border-color: #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }

        .btn-primary { width: 100%; padding: 14px; border-radius: 10px; background: #3b82f6; color: #fff; font-size: 1.05rem; font-weight: 700; border: none; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); display: flex; justify-content: center; align-items: center; gap: 8px; }
        .btn-primary:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); }
        .btn-primary:disabled { background: #64748b; cursor: not-allowed; box-shadow: none; }

        .alert-box { padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 500; display: flex; align-items: center; gap: 8px; text-align: left; }
        .alert-error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; }
        .alert-success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #6ee7b7; }

        .back-link { background: none; border: none; color: #94a3b8; font-size: 0.9rem; margin-top: 20px; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; gap: 5px; }
        .back-link:hover { color: #38bdf8; }
      `}} />

      {/* --- HEADER NAVBAR --- */}
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
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search matrix..." style={{ width: '100%', padding: '10px 18px', borderRadius: '25px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' }} />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <i className='bx bx-x'></i> : <i className='bx bx-menu'></i>}
            </button>
          </div>
        </div>

        <div className="desktop-menu">
          <form className="mobile-search-wrapper" onSubmit={handleSearchSubmit}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search matrix..." style={{ width: '100%', padding: '10px 18px', borderRadius: '8px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' }} />
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
          <button className="nav-link" onClick={() => setShowContactModal(true)}>Contact Us</button>
        </div>
      </nav>

      {/* --- LOGIN AREA --- */}
      <main className="login-main">
        <div className="login-glass-card">
          <img src="/logo.jpg" alt="Logo" style={{ width: '70px', height: '70px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} />
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '5px', color: '#fff' }}>
            {step === 1 ? 'Student Portal' : 'Verify Identity'}
          </h2>
          
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '25px' }}>
            {step === 1 ? 'Enter your email to receive a secure login code.' : `OTP sent to ${email}`}
          </p>

          {error && (
            <div className="alert-box alert-error">
              <i className='bx bx-error-circle' style={{ fontSize: '1.2rem' }}></i> {error}
            </div>
          )}
          
          {message && step === 2 && !error && (
            <div className="alert-box alert-success">
              <i className='bx bx-check-circle' style={{ fontSize: '1.2rem' }}></i> {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="input-group">
                <label><i className='bx bx-envelope'></i> Email Address</label>
                <input 
                  type="email" 
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <i className='bx bx-loader-alt bx-spin'></i> : <i className='bx bx-send'></i>}
                {loading ? 'Sending...' : 'Send Secure OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="input-group">
                <label><i className='bx bx-dialpad-alt'></i> 6-Digit OTP Code</label>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading || otp.length < 6}>
                {loading ? <i className='bx bx-loader-alt bx-spin'></i> : <i className='bx bx-check-shield'></i>}
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button type="button" className="back-link" onClick={goBackToEmail}>
                <i className='bx bx-edit-alt'></i> Change Email Address
              </button>
            </form>
          )}
        </div>
      </main>

      {/* --- CONTACT MODAL --- */}
      {showContactModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#60a5fa', fontSize: '1.5rem', fontWeight: '800' }}>Contact Professional Help Desk</h4>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 25px 0' }}>For analytical matrix guidelines, reach out directly to the developer desk:</p>
            <div style={{ background: 'rgba(30, 64, 175, 0.2)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginBottom: '30px' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>👨‍💻 Website Developer: Mohammed Junaid</p>
              <p style={{ margin: 0, fontWeight: '800', color: '#60a5fa', fontSize: '1.2rem' }}>📞 9270323128</p>
            </div>
            <button onClick={() => setShowContactModal(false)} style={{ width: '100%', padding: '14px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Close Window</button>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer style={{ width: '100%', background: 'rgba(30, 64, 175, 0.6)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(147, 197, 253, 0.2)', padding: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#bfdbfe', fontWeight: '700' }}>
        © 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked.
      </footer>
    </div>
  );
}
