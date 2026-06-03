import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- TRANSLATION DICTIONARY FOR NAVBAR ---
const t = {
  en: {
    brand: "Samar Guidance",
    doctor: "Dr. Ashfaque Umar",
    searchPlaceholder: "Search matrix...",
    navHome: "Home",
    navAbout: "About Us",
    navCareer: "Career Guidance",
    courses10: "Courses After 10th",
    courses12: "Courses After 12th",
    coursesGrad: "Courses After Graduation",
    coursesPost: "Courses After Post Graduation",
    coursesOther: "Other Specializations",
    navAssess: "Career Assessment",
    navPersonality: "Personality Development",
    navGallery: "Gallery",
    myProfile: "Student Dashboard"
  },
  ur: {
    brand: "ثمر گائیڈنس",
    doctor: "ڈاکٹر اشفاق عمر",
    searchPlaceholder: "تلاش کریں...",
    navHome: "ہوم",
    navAbout: "ہمارے بارے میں",
    navCareer: "کیریئر گائیڈنس",
    courses10: "دسویں کے بعد کورسز",
    courses12: "بارہویں کے بعد کورسز",
    coursesGrad: "گریجویشن کے بعد",
    coursesPost: "پوسٹ گریجویشن کے بعد",
    coursesOther: "دیگر مہارتیں",
    navAssess: "کیریئر اسسمنٹ",
    navPersonality: "شخصیت سازی",
    navGallery: "گیلری",
    myProfile: "طالب علم ڈیش بورڈ"
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  
  // --- Navbar States ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [session, setSession] = useState(null);

  // --- Auth & Admin States ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Data & CRM States ---
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState('');
  const [statusMap, setStatusMap] = useState({}); // Local state for Lead Status

  // ⚠️ Authorized Admin Emails
  const ALLOWED_ADMIN_EMAILS = [
    "ashfaqueumar@gmail.com",
    "ashfaqueumarsir@gmail.com",
    "mohammedjunaid8484@gmail.com",
    "mohammedjunaid5463@gmail.com"
  ];

  // ⚠️ Master Password for Admin Login
  const MASTER_PASSWORD = "samar@2026";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));

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

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ur' : 'en');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
    }
  };

  // --- ADMIN LOGIN LOGIC ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
      setError("Access Denied! Your email is not authorized for Admin Access.");
      return;
    }

    if (password !== MASTER_PASSWORD) {
      setError("Incorrect Password! Please try again.");
      return;
    }

    setIsAuthenticated(true);
    fetchData();
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

  const handleStatusChange = (studentEmail, newStatus) => {
    setStatusMap(prev => ({ ...prev, [studentEmail]: newStatus }));
    // Future update: Add Supabase DB update logic here
  };

  // --- FILTERING LOGIC ---
  const filteredData = studentsData.filter(s => {
    const matchesSearch = s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStream = filterStream ? s.interest_area?.toLowerCase() === filterStream.toLowerCase() : true;
    return matchesSearch && matchesStream;
  });

  // --- EXPORT TO EXCEL ---
  const downloadCSV = () => {
    if (filteredData.length === 0) {
      alert("No data to download!");
      return;
    }
    const headers = "Date,Email,Selected Stream,Language,Lead Status\n";
    const rows = filteredData.map(s => {
      const date = new Date(s.created_at).toLocaleDateString('en-IN');
      const status = statusMap[s.email] || 'New Lead';
      return `"${date}","${s.email}","${s.interest_area || 'N/A'}","${s.preferred_language || 'N/A'}","${status}"`;
    }).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Samar_Leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- KPI CALCULATIONS ---
  const totalStudents = studentsData.length;
  const scienceCount = studentsData.filter(s => s.interest_area === 'science').length;
  const commerceCount = studentsData.filter(s => s.interest_area === 'commerce').length;
  const otherCount = totalStudents - scienceCount - commerceCount;

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.1) 1px, #0f172a 1px)`,
      backgroundSize: '30px 30px',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex', flexDirection: 'column', width: '100vw', maxWidth: '100%', overflowX: 'hidden', margin: 0, padding: 0
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <title>Director's Dashboard | Samar Guidance</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }

        /* --- NAVBAR STYLES (SamarUI) --- */
        .glass-navbar { width: 100%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; display: flex; flex-direction: column; }
        .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; border-bottom: 1px solid rgba(147, 197, 253, 0.1); }
        .nav-brand-container { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .desktop-menu { display: flex; align-items: center; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
        .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; position: relative; background: none; border: none; padding: 5px 0; white-space: nowrap; font-family: inherit; }
        .nav-link:hover { color: #38bdf8; }
        .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: 0; left: 0; background-color: #38bdf8; transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }

        .nav-dropdown-container { position: relative; }
        .nav-dropdown-menu { position: absolute; top: 100%; left: 0; background: rgba(30, 64, 175, 0.95); backdrop-filter: blur(16px); border: 1px solid rgba(147, 197, 253, 0.2); border-radius: 8px; min-width: 260px; box-shadow: 0 15px 30px rgba(0,0,0,0.6); padding: 10px 0; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s ease; z-index: 200; }
        .nav-dropdown-container:hover .nav-dropdown-menu, .nav-dropdown-menu.active { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-item { padding: 12px 20px; color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left; background: transparent; border-left: none; border-right: none; border-top: none; width: 100%; cursor: pointer; font-family: inherit; }
        .dropdown-item:hover { background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding-left: 25px; }

        .lang-toggle-container { display: flex; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 4px; position: relative; cursor: pointer; width: 80px; height: 36px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); direction: ltr !important; }
        .lang-toggle-indicator { position: absolute; top: 4px; left: ${lang === 'en' ? '4px' : '40px'}; width: 34px; height: 26px; background: #38bdf8; border-radius: 14px; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); box-shadow: 0 2px 8px rgba(56, 189, 248, 0.5); }
        .lang-label { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; color: #fff; z-index: 1; user-select: none; transition: color 0.3s; font-family: 'Segoe UI', sans-serif; }

        .auth-icon-btn { width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.4rem; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); transition: all 0.3s ease; }
        .profile-btn { color: #10b981; } .profile-btn:hover { background: rgba(16, 185, 129, 0.15); border-color: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.3); transform: translateY(-2px); }
        .logout-btn { color: #ef4444; } .logout-btn:hover { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.3); transform: translateY(-2px); }

        .mobile-search-wrapper { display: none; width: 100%; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 10px; }
        .desktop-search-wrapper { display: block; flex: 0.6; max-width: 400px; }
        .mobile-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 2rem; cursor: pointer; }

        @media (max-width: 1024px) {
          .desktop-search-wrapper { display: none !important; }
          .mobile-search-wrapper { display: block; }
          .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; align-items: flex-start; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); border-bottom: 1px solid rgba(56,189,248,0.3); padding: 20px 5%; gap: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); z-index: 999; }
          .mobile-toggle { display: block; }
          .nav-dropdown-menu { position: static; box-shadow: none; border: none; background: rgba(0,0,0,0.2); margin-top: 10px; width: 100%; display: ${showGuidanceDropdown ? 'flex' : 'none'}; opacity: 1; visibility: visible; transform: none; }
          .nav-link { width: 100%; text-align: left; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .nav-link::after { display: none; }
        }

        /* --- ADMIN SPECIFIC STYLES --- */
        .admin-main { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 60px 5%; width: 100%; }
        .admin-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); width: 100%; max-width: 480px; text-align: center; margin: 0 auto; backdrop-filter: blur(10px); }
        .dashboard-container { width: 100%; max-width: 1400px; margin: 0 auto; }
        
        /* KPI Cards */
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .kpi-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.2); border-radius: 12px; padding: 25px; display: flex; align-items: center; gap: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); backdrop-filter: blur(10px); }
        .kpi-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 2rem; flex-shrink: 0; }
        .kpi-info h3 { margin: 0; font-size: 2rem; font-weight: 900; color: #fff; }
        .kpi-info p { margin: 0; color: #94a3b8; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; }

        /* Tools Bar */
        .tools-bar { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 12px; padding: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; backdrop-filter: blur(10px); }
        .filter-group { display: flex; gap: 15px; flex-wrap: wrap; flex: 1; }
        .filter-input { padding: 12px 18px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.6); color: #fff; outline: none; min-width: 200px; }
        .filter-input:focus { border-color: #38bdf8; }

        /* Data Table */
        .table-container { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); backdrop-filter: blur(10px); overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 800px; }
        .data-table th { background: rgba(56, 189, 248, 0.15); padding: 15px; color: #38bdf8; border-bottom: 2px solid #38bdf8; font-size: 1rem; font-weight: 700; text-transform: uppercase; }
        .data-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e2e8f0; font-size: 0.95rem; vertical-align: middle; }
        .data-table tr:hover { background: rgba(56, 189, 248, 0.05); }

        /* CRM Select */
        .status-select { padding: 8px 12px; border-radius: 6px; border: 1px solid #38bdf8; background: #0f172a; color: #fff; font-weight: bold; cursor: pointer; outline: none; }
        .status-select.new { border-color: #3b82f6; color: #3b82f6; }
        .status-select.counseled { border-color: #f59e0b; color: #f59e0b; }
        .status-select.admitted { border-color: #10b981; color: #10b981; }

        .input-group { margin-bottom: 20px; text-align: left; }
        .input-group label { display: block; color: #93c5fd; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; }
        .input-group input { width: 100%; padding: 14px 18px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.6); color: #fff; font-size: 1rem; outline: none; transition: 0.3s; }
        .input-group input:focus { border-color: #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }

        .btn-primary { background: #3b82f6; color: #fff; padding: 14px 25px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1.05rem; width: 100%; transition: 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .btn-primary:hover { background: #2563eb; transform: translateY(-2px); }
        
        .action-btn { background: transparent; border: 1px solid #10b981; color: #10b981; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s; display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; }
        .action-btn:hover { background: #10b981; color: #0f172a; }
        
        .alert-box { padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 500; display: flex; align-items: center; gap: 8px; text-align: left; }
        .alert-error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; }
      `}} />

      {/* --- MASTER NAVBAR --- */}
      <nav className="glass-navbar">
        <div className="nav-top-row">
          <div className="nav-brand-container" onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '0.5px' }}>{t[lang].brand}</h1>
              <small style={{ color: '#93c5fd', fontWeight: 'bold', display: 'block' }}>{t[lang].doctor}</small>
            </div>
          </div>

          <form className="desktop-search-wrapper" onSubmit={handleSearchSubmit}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t[lang].searchPlaceholder} style={{ width: '100%', padding: '10px 18px', borderRadius: '25px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' }} />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="lang-toggle-container" onClick={toggleLanguage} title="Switch Language">
                <div className="lang-toggle-indicator"></div>
                <span className="lang-label" style={{ color: lang === 'en' ? '#fff' : '#94a3b8' }}>EN</span>
                <span className="lang-label" style={{ color: lang === 'ur' ? '#fff' : '#94a3b8' }}>UR</span>
            </div>

            {session ? (
              <>
                <button onClick={() => router.push('/profile')} className="auth-icon-btn profile-btn" title={t[lang].myProfile}><i className='bx bx-user-circle'></i></button>
                <button onClick={handleLogout} className="auth-icon-btn logout-btn" title="Logout"><i className='bx bx-log-out'></i></button>
              </>
            ) : (
              <button onClick={() => router.push('/login')} style={{ padding: '8px 20px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59,130,246,0.4)' }}>Login</button>
            )}
            
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <i className='bx bx-x'></i> : <i className='bx bx-menu'></i>}
            </button>
          </div>
        </div>

        <div className="desktop-menu">
          <form className="mobile-search-wrapper" onSubmit={handleSearchSubmit}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t[lang].searchPlaceholder} style={{ width: '100%', padding: '10px 18px', borderRadius: '8px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' }} />
          </form>

          <button className="nav-link" onClick={() => router.push('/')}>{t[lang].navHome}</button>
          <button className="nav-link" onClick={() => router.push('/about')}>{t[lang].navAbout}</button>
          <div className="nav-dropdown-container" onMouseEnter={() => !isMobile && setShowGuidanceDropdown(true)} onMouseLeave={() => !isMobile && setShowGuidanceDropdown(false)}>
            <button className="nav-link" onClick={() => setIsMobile && setShowGuidanceDropdown(!showGuidanceDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>{t[lang].navCareer} <i className='bx bx-chevron-down'></i></button>
            <div className={`nav-dropdown-menu ${showGuidanceDropdown ? 'active' : ''}`}>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=10th')}>{t[lang].courses10}</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=12th')}>{t[lang].courses12}</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=graduation')}>{t[lang].coursesGrad}</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=postgrad')}>{t[lang].coursesPost}</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=other')}>{t[lang].coursesOther}</button>
            </div>
          </div>
          <button className="nav-link" onClick={() => router.push('/assessment')}>{t[lang].navAssess}</button>
          <button className="nav-link" onClick={() => router.push('/personality')}>{t[lang].navPersonality}</button>
          <button className="nav-link" onClick={() => router.push('/gallery')}>{t[lang].navGallery}</button>
        </div>
      </nav>

      {/* --- ADMIN PAGE MAIN CONTENT --- */}
      <main className="admin-main">
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <i className='bx bxs-pie-chart-alt-2' style={{ fontSize: '4rem', color: '#38bdf8', marginBottom: '10px' }}></i>
          <h1 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '2.5rem', fontWeight: '900' }}>Director's Dashboard</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>Samar Foundation • Advanced CRM & Operations</p>
        </header>

        {!isAuthenticated ? (
          // --- LOGIN SCREEN ---
          <div className="admin-card">
            <h2 style={{ color: '#fff', marginBottom: '5px', fontSize: '1.5rem' }}>Secure Authorization</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '25px' }}>Enter assigned email and master key.</p>

            {error && <div className="alert-box alert-error"><i className='bx bx-error-circle'></i> {error}</div>}

            <form onSubmit={handleAdminLogin}>
              <div className="input-group">
                <label><i className='bx bx-envelope'></i> Admin Email</label>
                <input type="email" placeholder="director@samar.org" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label><i className='bx bx-lock-alt'></i> Security Key</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                <i className='bx bx-check-shield'></i> Verify & Access
              </button>
            </form>
          </div>
        ) : (
          // --- CRM DASHBOARD ---
          <div className="dashboard-container">
            
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><i className='bx bx-group'></i></div>
                <div className="kpi-info"><h3>{totalStudents}</h3><p>Total Leads</p></div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className='bx bx-atom'></i></div>
                <div className="kpi-info"><h3 style={{ color: '#10b981' }}>{scienceCount}</h3><p>Science</p></div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><i className='bx bx-line-chart'></i></div>
                <div className="kpi-info"><h3 style={{ color: '#f59e0b' }}>{commerceCount}</h3><p>Commerce</p></div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}><i className='bx bx-layer'></i></div>
                <div className="kpi-info"><h3 style={{ color: '#a855f7' }}>{otherCount}</h3><p>Other Streams</p></div>
              </div>
            </div>

            {/* Tools Bar (Search, Filter, Export) */}
            <div className="tools-bar">
              <div className="filter-group">
                <input 
                  type="text" 
                  placeholder="Search by Email..." 
                  className="filter-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="filter-input" 
                  value={filterStream} 
                  onChange={(e) => setFilterStream(e.target.value)}
                >
                  <option value="">All Streams</option>
                  <option value="science">Science</option>
                  <option value="commerce">Commerce</option>
                  <option value="paramedical">Paramedical</option>
                  <option value="btech">Engineering (B.Tech)</option>
                  <option value="polytechnic">Polytechnic</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={fetchData} className="action-btn" style={{ borderColor: '#38bdf8', color: '#38bdf8' }}>
                  <i className='bx bx-refresh'></i> Refresh
                </button>
                <button onClick={downloadCSV} className="action-btn">
                  <i className='bx bx-download'></i> Export CSV
                </button>
                <button onClick={() => { setIsAuthenticated(false); setPassword(''); }} className="action-btn" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                  <i className='bx bx-lock'></i> Lock
                </button>
              </div>
            </div>

            {/* Data Table */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#38bdf8' }}>
                <i className='bx bx-loader-alt bx-spin' style={{ fontSize: '3rem' }}></i>
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Syncing Database...</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student Identity (Email)</th>
                      <th>Matrix (Stream)</th>
                      <th>Interface Lang</th>
                      <th>CRM Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? filteredData.map((s, idx) => {
                      const currentStatus = statusMap[s.email] || 'new';
                      return (
                        <tr key={idx}>
                          <td style={{ fontWeight: 'bold' }}>{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                          <td>{s.email}</td>
                          <td style={{ textTransform: 'uppercase', color: '#38bdf8', fontWeight: 'bold' }}>{s.interest_area || 'Pending'}</td>
                          <td style={{ textTransform: 'uppercase' }}>{s.preferred_language || 'EN'}</td>
                          <td>
                            <select 
                              className={`status-select ${currentStatus}`}
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(s.email, e.target.value)}
                            >
                              <option value="new">🔴 New Lead</option>
                              <option value="counseled">🟡 Counseled</option>
                              <option value="admitted">🟢 Admitted</option>
                            </select>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                          <i className='bx bx-folder-open' style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></i>
                          No records found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
