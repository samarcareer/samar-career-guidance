import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- TRANSLATION DICTIONARY FOR FULL ADMIN PAGE ---
const t = {
  en: {
    brand: "Samar Guidance",
    doctor: "Dr. Ashfaque Umar",
    searchPlaceholder: "Search matrix...",
    navHome: "Home",
    navAbout: "About Us",
    navCareer: "Career Guidance",
    navAssess: "Career Assessment",
    navPersonality: "Personality Development",
    navGallery: "Gallery",
    myProfile: "Student Dashboard",
    
    // Admin Dashboard Specific
    adminTitle: "Director's Dashboard",
    adminSub: "Samar Foundation • Advanced CRM & Operations",
    tabCrm: "CRM & Lead Management",
    tabCms: "Study Material & Matrix Manager",
    
    // KPI
    totalLeads: "Total Leads",
    science: "Science",
    commerce: "Commerce",
    otherStreams: "Other Streams",
    
    // Tools
    searchEmail: "Search by Email...",
    allStreams: "All Streams",
    refresh: "Refresh",
    exportCsv: "Export CSV",
    lock: "Lock",
    
    // Table
    date: "Date",
    studentId: "Student Identity (Email)",
    matrix: "Matrix (Stream)",
    lang: "Interface Lang",
    crmStatus: "CRM Status",
    noRecords: "No records found matching your filters.",
    syncing: "Syncing Database...",
    
    // CMS Section
    cmsTitle: "Knowledge Bank Management",
    cmsSub: "Add, edit, or remove study domains and career streams.",
    addNew: "+ Add New Matrix",
    edit: "Edit",
    scope: "Scope",
    duration: "Duration",
    jobs: "Key Careers"
  },
  ur: {
    brand: "ثمر گائیڈنس",
    doctor: "ڈاکٹر اشفاق عمر",
    searchPlaceholder: "تلاش کریں...",
    navHome: "ہوم",
    navAbout: "ہمارے بارے میں",
    navCareer: "کیریئر گائیڈنس",
    navAssess: "کیریئر اسسمنٹ",
    navPersonality: "شخصیت سازی",
    navGallery: "گیلری",
    myProfile: "طالب علم ڈیش بورڈ",
    
    // Admin Dashboard Specific
    adminTitle: "ڈائریکٹر ڈیش بورڈ",
    adminSub: "ثمر فاؤنڈیشن • ایڈوانسڈ سی آر ایم اور آپریشنز",
    tabCrm: "لیڈ مینجمنٹ",
    tabCms: "اسٹڈی میٹریل مینیجر",
    
    // KPI
    totalLeads: "کل لیڈز",
    science: "سائنس",
    commerce: "کامرس",
    otherStreams: "دیگر شعبے",
    
    // Tools
    searchEmail: "ای میل سے تلاش کریں...",
    allStreams: "تمام شعبے",
    refresh: "ریفریش",
    exportCsv: "CSV ڈاؤن لوڈ",
    lock: "لاک کریں",
    
    // Table
    date: "تاریخ",
    studentId: "طالب علم (ای میل)",
    matrix: "میٹرکس (شعبہ)",
    lang: "زبان",
    crmStatus: "سٹیٹس",
    noRecords: "آپ کے فلٹرز کے مطابق کوئی ریکارڈ نہیں ملا۔",
    syncing: "ڈیٹا بیس سنک ہو رہا ہے...",
    
    // CMS Section
    cmsTitle: "نالج بینک مینجمنٹ",
    cmsSub: "مطالعاتی ڈومینز اور کیریئر اسٹریمز شامل کریں، ترمیم کریں یا ہٹائیں۔",
    addNew: "+ نیا میٹرکس شامل کریں",
    edit: "ترمیم",
    scope: "دائرہ کار",
    duration: "مدت",
    jobs: "اہم کیریئر"
  }
};

// Dummy Initial DB for CMS Demonstration
const initialMatrixDB = [
  { id: 1, key: 'science', title: "Science & Technology", scope: "Research, Advanced Data Science, Labs...", duration: "3 to 4 Years", jobs: "Data Scientist, Researcher" },
  { id: 2, key: 'commerce', title: "Commerce & Finance", scope: "Corporate accounting, banking, taxation...", duration: "3 Years", jobs: "CA, CS, Bank Manager" },
  { id: 3, key: 'polytechnic', title: "Polytechnic Diploma", scope: "Core technical hands-on experience...", duration: "3 Years", jobs: "Junior Engineer, CAD Designer" },
];

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

  // --- Tab State ---
  const [adminTab, setAdminTab] = useState('crm'); // 'crm' | 'cms'

  // --- Data & CRM States ---
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState('');
  const [statusMap, setStatusMap] = useState({});

  // --- CMS States ---
  const [matrixContent, setMatrixContent] = useState(initialMatrixDB);

  // ⚠️ Authorized Admin Emails
  const ALLOWED_ADMIN_EMAILS = [
    "ashfaqueumar@gmail.com",
    "ashfaqueumarsir@gmail.com",
    "mohammedjunaid8484@gmail.com",
    "mohammedjunaid5463@gmail.com"
  ];

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
  };

  const filteredData = studentsData.filter(s => {
    const matchesSearch = s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStream = filterStream ? s.interest_area?.toLowerCase() === filterStream.toLowerCase() : true;
    return matchesSearch && matchesStream;
  });

  const downloadCSV = () => {
    if (filteredData.length === 0) return alert("No data to download!");
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

  const totalStudents = studentsData.length;
  const scienceCount = studentsData.filter(s => s.interest_area === 'science').length;
  const commerceCount = studentsData.filter(s => s.interest_area === 'commerce').length;
  const otherCount = totalStudents - scienceCount - commerceCount;

  return (
    <div style={{
      direction: lang === 'ur' ? 'rtl' : 'ltr',
      fontFamily: lang === 'ur' ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.1) 1px, #0f172a 1px)`,
      backgroundSize: '30px 30px',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex', flexDirection: 'column', width: '100vw', maxWidth: '100%', overflowX: 'hidden', margin: 0, padding: 0
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet" />
        <title>{t[lang].adminTitle} | {t[lang].brand}</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }
        .en-text { font-family: 'Segoe UI', Roboto, sans-serif !important; direction: ltr !important; display: inline-block; }

        .glass-navbar { width: 100%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; display: flex; flex-direction: column; }
        .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; border-bottom: 1px solid rgba(147, 197, 253, 0.1); }
        .nav-brand-container { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .desktop-menu { display: flex; align-items: center; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
        .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; position: relative; background: none; border: none; padding: 5px 0; white-space: nowrap; font-family: inherit; }
        .nav-link:hover { color: #38bdf8; }
        
        .lang-toggle-container { display: flex; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 4px; position: relative; cursor: pointer; width: 80px; height: 36px; direction: ltr !important; }
        .lang-toggle-indicator { position: absolute; top: 4px; left: ${lang === 'en' ? '4px' : '40px'}; width: 34px; height: 26px; background: #38bdf8; border-radius: 14px; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); }
        .lang-label { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; color: #fff; z-index: 1; user-select: none; font-family: 'Segoe UI', sans-serif; }

        .auth-icon-btn { width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.4rem; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(15, 23, 42, 0.6); }
        .logout-btn { color: #ef4444; } .logout-btn:hover { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; }
        
        .mobile-search-wrapper { display: none; }
        .desktop-search-wrapper { display: block; flex: 0.6; max-width: 400px; }
        .mobile-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 2rem; }

        .admin-main { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 40px 5%; width: 100%; }
        .admin-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 40px; width: 100%; max-width: 480px; text-align: center; margin: 0 auto; }
        .dashboard-container { width: 100%; max-width: 1400px; margin: 0 auto; }
        
        /* Dashboard Tabs */
        .admin-tabs { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
        .tab-btn { flex: 1; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; border: 1px solid rgba(56, 189, 248, 0.3); transition: 0.3s; font-family: inherit; font-size: 1rem; }
        .tab-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4); }
        .tab-btn.inactive { background: rgba(15, 23, 42, 0.6); color: #94a3b8; }
        .tab-btn.inactive:hover { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }

        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .kpi-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.2); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 15px; }
        .kpi-icon { width: 50px; height: 50px; border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 1.8rem; flex-shrink: 0; }
        .kpi-info h3 { margin: 0; font-size: 1.8rem; font-weight: 900; color: #fff; font-family: inherit; }
        .kpi-info p { margin: 0; color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; font-family: inherit; }

        .tools-bar { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
        .filter-input { padding: 10px 15px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.6); color: #fff; font-family: inherit; }
        
        .table-container { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 12px; padding: 20px; overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 700px; font-family: inherit; }
        .data-table th { background: rgba(56, 189, 248, 0.15); padding: 12px; color: #38bdf8; border-bottom: 2px solid #38bdf8; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; }
        .data-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e2e8f0; font-size: 0.9rem; }
        
        .status-select { padding: 6px 10px; border-radius: 6px; border: 1px solid #38bdf8; background: #0f172a; color: #fff; font-size: 0.85rem; cursor: pointer; }
        .action-btn { background: transparent; border: 1px solid #10b981; color: #10b981; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-family: inherit; font-size: 0.85rem; }
        
        /* CMS Cards */
        .cms-card { background: rgba(30, 41, 59, 0.6); border: 1px dashed rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
        .cms-info h4 { margin: 0 0 5px 0; color: #fff; font-size: 1.2rem; font-family: inherit; }
        .cms-info p { margin: 0; color: #94a3b8; font-size: 0.9rem; font-family: inherit; }

        @media (max-width: 1024px) {
          .desktop-search-wrapper { display: none !important; }
          .mobile-search-wrapper { display: block; }
          .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); padding: 20px 5%; gap: 15px; z-index: 999; }
          .mobile-toggle { display: block; }
        }

        @media (max-width: 768px) {
          .kpi-grid { grid-template-columns: 1fr 1fr; }
          .admin-main { padding: 20px 5%; }
          .tools-bar { flex-direction: column; align-items: stretch; }
          .filter-input { width: 100%; }
          .data-table th, .data-table td { font-size: 0.8rem; padding: 10px; }
        }
      `}} />

      <nav className="glass-navbar">
        <div className="nav-top-row">
          <div className="nav-brand-container" onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '900' }}>{t[lang].brand}</h1>
              <small style={{ color: '#93c5fd', fontWeight: 'bold', display: 'block' }}>{t[lang].doctor}</small>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="lang-toggle-container" onClick={toggleLanguage} title="Switch Language">
                <div className="lang-toggle-indicator"></div>
                <span className="lang-label" style={{ color: lang === 'en' ? '#fff' : '#94a3b8' }}>EN</span>
                <span className="lang-label" style={{ color: lang === 'ur' ? '#fff' : '#94a3b8' }}>UR</span>
            </div>
            {session ? (
              <button onClick={handleLogout} className="auth-icon-btn logout-btn"><i className='bx bx-log-out'></i></button>
            ) : null}
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <i className='bx bx-x'></i> : <i className='bx bx-menu'></i>}
            </button>
          </div>
        </div>
        <div className="desktop-menu">
            <button className="nav-link" onClick={() => router.push('/')}>{t[lang].navHome}</button>
            <button className="nav-link" onClick={() => router.push('/about')}>{t[lang].navAbout}</button>
            <button className="nav-link" onClick={() => router.push('/categories')}>{t[lang].navCareer}</button>
            <button className="nav-link" onClick={() => router.push('/assessment')}>{t[lang].navAssess}</button>
        </div>
      </nav>

      <main className="admin-main">
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <i className='bx bxs-pie-chart-alt-2' style={{ fontSize: '3.5rem', color: '#38bdf8', marginBottom: '10px' }}></i>
          <h1 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '2.2rem', fontWeight: '900', fontFamily: 'inherit' }}>{t[lang].adminTitle}</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1rem', fontFamily: 'inherit' }}>{t[lang].adminSub}</p>
        </header>

        {!isAuthenticated ? (
          <div className="admin-card">
            <h2 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.5rem', fontFamily: 'inherit' }}>Secure Authorization</h2>
            {error && <div className="alert-box alert-error"><i className='bx bx-error-circle'></i> {error}</div>}
            <form onSubmit={handleAdminLogin}>
              <div style={{ marginBottom: '15px', textAlign: 'left' }} dir="ltr">
                <label style={{ color: '#93c5fd', display: 'block', marginBottom: '5px' }}>Admin Email</label>
                <input type="email" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(15,23,42,0.6)', border: '1px solid #38bdf8', color: '#fff' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '20px', textAlign: 'left' }} dir="ltr">
                <label style={{ color: '#93c5fd', display: 'block', marginBottom: '5px' }}>Security Key</label>
                <input type="password" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(15,23,42,0.6)', border: '1px solid #38bdf8', color: '#fff' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Verify & Access</button>
            </form>
          </div>
        ) : (
          <div className="dashboard-container">
            
            {/* --- ADMIN TABS --- */}
            <div className="admin-tabs">
                <button onClick={() => setAdminTab('crm')} className={`tab-btn ${adminTab === 'crm' ? 'active' : 'inactive'}`}>
                    <i className='bx bx-line-chart'></i> {t[lang].tabCrm}
                </button>
                <button onClick={() => setAdminTab('cms')} className={`tab-btn ${adminTab === 'cms' ? 'active' : 'inactive'}`}>
                    <i className='bx bx-data'></i> {t[lang].tabCms}
                </button>
            </div>

            {/* --- TAB 1: CRM & LEADS --- */}
            {adminTab === 'crm' && (
                <>
                <div className="kpi-grid">
                  <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><i className='bx bx-group'></i></div>
                    <div className="kpi-info"><h3 className="en-text">{totalStudents}</h3><p>{t[lang].totalLeads}</p></div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className='bx bx-atom'></i></div>
                    <div className="kpi-info"><h3 className="en-text" style={{ color: '#10b981' }}>{scienceCount}</h3><p>{t[lang].science}</p></div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><i className='bx bx-line-chart'></i></div>
                    <div className="kpi-info"><h3 className="en-text" style={{ color: '#f59e0b' }}>{commerceCount}</h3><p>{t[lang].commerce}</p></div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}><i className='bx bx-layer'></i></div>
                    <div className="kpi-info"><h3 className="en-text" style={{ color: '#a855f7' }}>{otherCount}</h3><p>{t[lang].otherStreams}</p></div>
                  </div>
                </div>

                <div className="tools-bar">
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
                    <input type="text" placeholder={t[lang].searchEmail} className="filter-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <select className="filter-input" value={filterStream} onChange={(e) => setFilterStream(e.target.value)}>
                      <option value="">{t[lang].allStreams}</option>
                      <option value="science">Science</option>
                      <option value="commerce">Commerce</option>
                      <option value="paramedical">Paramedical</option>
                      <option value="polytechnic">Polytechnic</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={fetchData} className="action-btn" style={{ borderColor: '#38bdf8', color: '#38bdf8' }}><i className='bx bx-refresh'></i> {t[lang].refresh}</button>
                    <button onClick={downloadCSV} className="action-btn"><i className='bx bx-download'></i> {t[lang].exportCsv}</button>
                    <button onClick={() => { setIsAuthenticated(false); setPassword(''); }} className="action-btn" style={{ borderColor: '#ef4444', color: '#ef4444' }}><i className='bx bx-lock'></i> {t[lang].lock}</button>
                  </div>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#38bdf8' }}><i className='bx bx-loader-alt bx-spin' style={{ fontSize: '3rem' }}></i><p style={{ fontFamily: 'inherit' }}>{t[lang].syncing}</p></div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{t[lang].date}</th>
                          <th>{t[lang].studentId}</th>
                          <th>{t[lang].matrix}</th>
                          <th>{t[lang].lang}</th>
                          <th>{t[lang].crmStatus}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.length > 0 ? filteredData.map((s, idx) => {
                          const currentStatus = statusMap[s.email] || 'new';
                          return (
                            <tr key={idx}>
                              <td className="en-text">{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                              <td className="en-text">{s.email}</td>
                              <td className="en-text" style={{ color: '#38bdf8', fontWeight: 'bold' }}>{s.interest_area || 'Pending'}</td>
                              <td className="en-text">{s.preferred_language || 'EN'}</td>
                              <td>
                                <select className={`status-select ${currentStatus}`} value={currentStatus} onChange={(e) => handleStatusChange(s.email, e.target.value)}>
                                  <option value="new">🔴 New</option>
                                  <option value="counseled">🟡 Counseled</option>
                                  <option value="admitted">🟢 Admitted</option>
                                </select>
                              </td>
                            </tr>
                          );
                        }) : <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', fontFamily: 'inherit' }}>{t[lang].noRecords}</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
                </>
            )}

            {/* --- TAB 2: CMS --- */}
            {adminTab === 'cms' && (
                <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h2 style={{ color: '#fff', margin: '0 0 5px 0', fontFamily: 'inherit' }}>{t[lang].cmsTitle}</h2>
                            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', fontFamily: 'inherit' }}>{t[lang].cmsSub}</p>
                        </div>
                        <button className="action-btn" style={{ background: '#38bdf8', color: '#0f172a', borderColor: '#38bdf8' }}>
                            {t[lang].addNew}
                        </button>
                    </div>

                    <div>
                        {matrixContent.map(item => (
                            <div key={item.id} className="cms-card">
                                <div className="cms-info">
                                    <h4><span className="en-text">{item.title}</span></h4>
                                    <p><strong>{t[lang].scope}:</strong> <span className="en-text">{item.scope}</span></p>
                                    <p style={{ marginTop: '5px' }}><strong>{t[lang].duration}:</strong> <span className="en-text">{item.duration}</span> | <strong>{t[lang].jobs}:</strong> <span className="en-text">{item.jobs}</span></p>
                                </div>
                                <button className="action-btn" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                                    <i className='bx bx-edit'></i> {t[lang].edit}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- TRANSLATION DICTIONARY FOR FULL ADMIN PAGE ---
const t = {
  en: {
    brand: "Samar Guidance",
    doctor: "Dr. Ashfaque Umar",
    searchPlaceholder: "Search matrix...",
    navHome: "Home",
    navAbout: "About Us",
    navCareer: "Career Guidance",
    navAssess: "Career Assessment",
    navPersonality: "Personality Development",
    navGallery: "Gallery",
    myProfile: "Student Dashboard",
    
    // Dropdown items
    courses10: "Courses After 10th",
    courses12: "Courses After 12th",
    coursesGrad: "Courses After Graduation",
    coursesPost: "Courses After Post Graduation",
    coursesOther: "Other Specializations",
    
    // Admin Dashboard Specific
    adminTitle: "Director's Dashboard",
    adminSub: "Samar Foundation • Advanced CRM & Operations",
    tabCrm: "CRM & Lead Management",
    tabCms: "Study Material & Matrix Manager",
    
    // KPI
    totalLeads: "Total Leads",
    science: "Science",
    commerce: "Commerce",
    otherStreams: "Other Streams",
    
    // Tools
    searchEmail: "Search by Email...",
    allStreams: "All Streams",
    refresh: "Refresh",
    exportCsv: "Export CSV",
    lock: "Lock",
    
    // Table
    date: "Date",
    studentId: "Student Identity (Email)",
    matrix: "Matrix (Stream)",
    lang: "Interface Lang",
    crmStatus: "CRM Status",
    noRecords: "No records found matching your filters.",
    syncing: "Syncing Database...",
    
    // CMS Section
    cmsTitle: "Knowledge Bank Management",
    cmsSub: "Add, edit, or remove study domains and career streams.",
    addNew: "+ Add New Matrix",
    edit: "Edit",
    scope: "Scope",
    duration: "Duration",
    jobs: "Key Careers"
  },
  ur: {
    brand: "ثمر گائیڈنس",
    doctor: "ڈاکٹر اشفاق عمر",
    searchPlaceholder: "تلاش کریں...",
    navHome: "ہوم",
    navAbout: "ہمارے بارے میں",
    navCareer: "کیریئر گائیڈنس",
    navAssess: "کیریئر اسسمنٹ",
    navPersonality: "شخصیت سازی",
    navGallery: "گیلری",
    myProfile: "طالب علم ڈیش بورڈ",
    
    // Dropdown items
    courses10: "دسویں کے بعد کورسز",
    courses12: "بارہویں کے بعد کورسز",
    coursesGrad: "گریجویشن کے بعد",
    coursesPost: "پوسٹ گریجویشن کے بعد",
    coursesOther: "دیگر مہارتیں",

    // Admin Dashboard Specific
    adminTitle: "ڈائریکٹر ڈیش بورڈ",
    adminSub: "ثمر فاؤنڈیشن • ایڈوانسڈ سی آر ایم اور آپریشنز",
    tabCrm: "لیڈ مینجمنٹ",
    tabCms: "اسٹڈی میٹریل مینیجر",
    
    // KPI
    totalLeads: "کل لیڈز",
    science: "سائنس",
    commerce: "کامرس",
    otherStreams: "دیگر شعبے",
    
    // Tools
    searchEmail: "ای میل سے تلاش کریں...",
    allStreams: "تمام شعبے",
    refresh: "ریفریش",
    exportCsv: "CSV ڈاؤن لوڈ",
    lock: "لاک کریں",
    
    // Table
    date: "تاریخ",
    studentId: "طالب علم (ای میل)",
    matrix: "میٹرکس (شعبہ)",
    lang: "زبان",
    crmStatus: "سٹیٹس",
    noRecords: "آپ کے فلٹرز کے مطابق کوئی ریکارڈ نہیں ملا۔",
    syncing: "ڈیٹا بیس سنک ہو رہا ہے...",
    
    // CMS Section
    cmsTitle: "نالج بینک مینجمنٹ",
    cmsSub: "مطالعاتی ڈومینز اور کیریئر اسٹریمز شامل کریں، ترمیم کریں یا ہٹائیں۔",
    addNew: "+ نیا میٹرکس شامل کریں",
    edit: "ترمیم",
    scope: "دائرہ کار",
    duration: "مدت",
    jobs: "اہم کیریئر"
  }
};

// Dummy Initial DB for CMS Demonstration
const initialMatrixDB = [
  { id: 1, key: 'science', title: "Science & Technology", scope: "Research, Advanced Data Science, Labs...", duration: "3 to 4 Years", jobs: "Data Scientist, Researcher" },
  { id: 2, key: 'commerce', title: "Commerce & Finance", scope: "Corporate accounting, banking, taxation...", duration: "3 Years", jobs: "CA, CS, Bank Manager" },
  { id: 3, key: 'polytechnic', title: "Polytechnic Diploma", scope: "Core technical hands-on experience...", duration: "3 Years", jobs: "Junior Engineer, CAD Designer" },
];

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

  // --- Tab State ---
  const [adminTab, setAdminTab] = useState('crm'); // 'crm' | 'cms'

  // --- Data & CRM States ---
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState('');
  const [statusMap, setStatusMap] = useState({});

  // --- CMS States ---
  const [matrixContent, setMatrixContent] = useState(initialMatrixDB);

  // ⚠️ Authorized Admin Emails
  const ALLOWED_ADMIN_EMAILS = [
    "ashfaqueumar@gmail.com",
    "ashfaqueumarsir@gmail.com",
    "mohammedjunaid8484@gmail.com",
    "mohammedjunaid5463@gmail.com"
  ];

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
  };

  const filteredData = studentsData.filter(s => {
    const matchesSearch = s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStream = filterStream ? s.interest_area?.toLowerCase() === filterStream.toLowerCase() : true;
    return matchesSearch && matchesStream;
  });

  const downloadCSV = () => {
    if (filteredData.length === 0) return alert("No data to download!");
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

  const totalStudents = studentsData.length;
  const scienceCount = studentsData.filter(s => s.interest_area === 'science').length;
  const commerceCount = studentsData.filter(s => s.interest_area === 'commerce').length;
  const otherCount = totalStudents - scienceCount - commerceCount;

  return (
    <div style={{
      direction: lang === 'ur' ? 'rtl' : 'ltr',
      fontFamily: lang === 'ur' ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.1) 1px, #0f172a 1px)`,
      backgroundSize: '30px 30px',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex', flexDirection: 'column', width: '100vw', maxWidth: '100%', overflowX: 'hidden', margin: 0, padding: 0
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet" />
        <title>{t[lang].adminTitle} | {t[lang].brand}</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }
        .en-text { font-family: 'Segoe UI', Roboto, sans-serif !important; direction: ltr !important; display: inline-block; }

        .glass-navbar { width: 100%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; display: flex; flex-direction: column; }
        .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; border-bottom: 1px solid rgba(147, 197, 253, 0.1); }
        .nav-brand-container { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .desktop-menu { display: flex; align-items: center; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
        .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; position: relative; background: none; border: none; padding: 5px 0; white-space: nowrap; font-family: inherit; }
        .nav-link:hover { color: #38bdf8; }
        
        /* Dropdown CSS added for desktop menu */
        .nav-dropdown-container { position: relative; }
        .nav-dropdown-menu { position: absolute; top: 100%; left: 0; background: rgba(30, 64, 175, 0.95); backdrop-filter: blur(16px); border: 1px solid rgba(147, 197, 253, 0.2); border-radius: 8px; min-width: 260px; box-shadow: 0 15px 30px rgba(0,0,0,0.6); padding: 10px 0; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s ease; z-index: 200; }
        .nav-dropdown-container:hover .nav-dropdown-menu, .nav-dropdown-menu.active { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-item { padding: 12px 20px; color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left; background: transparent; border-left: none; border-right: none; border-top: none; width: 100%; cursor: pointer; font-family: inherit; }
        .dropdown-item:hover { background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding-left: 25px; }

        .lang-toggle-container { display: flex; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 4px; position: relative; cursor: pointer; width: 80px; height: 36px; direction: ltr !important; }
        .lang-toggle-indicator { position: absolute; top: 4px; left: ${lang === 'en' ? '4px' : '40px'}; width: 34px; height: 26px; background: #38bdf8; border-radius: 14px; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); }
        .lang-label { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; color: #fff; z-index: 1; user-select: none; font-family: 'Segoe UI', sans-serif; }

        .auth-icon-btn { width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.4rem; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(15, 23, 42, 0.6); }
        .logout-btn { color: #ef4444; } .logout-btn:hover { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; }
        
        .mobile-search-wrapper { display: none; }
        .desktop-search-wrapper { display: block; flex: 0.6; max-width: 400px; }
        .mobile-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 2rem; }

        .admin-main { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 40px 5%; width: 100%; }
        .admin-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 40px; width: 100%; max-width: 480px; text-align: center; margin: 0 auto; }
        .dashboard-container { width: 100%; max-width: 1400px; margin: 0 auto; }
        
        /* Dashboard Tabs */
        .admin-tabs { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
        .tab-btn { flex: 1; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; border: 1px solid rgba(56, 189, 248, 0.3); transition: 0.3s; font-family: inherit; font-size: 1rem; }
        .tab-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4); }
        .tab-btn.inactive { background: rgba(15, 23, 42, 0.6); color: #94a3b8; }
        .tab-btn.inactive:hover { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }

        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .kpi-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.2); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 15px; }
        .kpi-icon { width: 50px; height: 50px; border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 1.8rem; flex-shrink: 0; }
        .kpi-info h3 { margin: 0; font-size: 1.8rem; font-weight: 900; color: #fff; font-family: inherit; }
        .kpi-info p { margin: 0; color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; font-family: inherit; }

        .tools-bar { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
        .filter-input { padding: 10px 15px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.6); color: #fff; font-family: inherit; }
        
        .table-container { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 12px; padding: 20px; overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 700px; font-family: inherit; }
        .data-table th { background: rgba(56, 189, 248, 0.15); padding: 12px; color: #38bdf8; border-bottom: 2px solid #38bdf8; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; }
        .data-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e2e8f0; font-size: 0.9rem; }
        
        .status-select { padding: 6px 10px; border-radius: 6px; border: 1px solid #38bdf8; background: #0f172a; color: #fff; font-size: 0.85rem; cursor: pointer; }
        .action-btn { background: transparent; border: 1px solid #10b981; color: #10b981; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-family: inherit; font-size: 0.85rem; }
        
        /* CMS Cards */
        .cms-card { background: rgba(30, 41, 59, 0.6); border: 1px dashed rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
        .cms-info h4 { margin: 0 0 5px 0; color: #fff; font-size: 1.2rem; font-family: inherit; }
        .cms-info p { margin: 0; color: #94a3b8; font-size: 0.9rem; font-family: inherit; }

        @media (max-width: 1024px) {
          .desktop-search-wrapper { display: none !important; }
          .mobile-search-wrapper { display: block; }
          .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); padding: 20px 5%; gap: 15px; z-index: 999; }
          .mobile-toggle { display: block; }
        }

        @media (max-width: 768px) {
          .kpi-grid { grid-template-columns: 1fr 1fr; }
          .admin-main { padding: 20px 5%; }
          .tools-bar { flex-direction: column; align-items: stretch; }
          .filter-input { width: 100%; }
          .data-table th, .data-table td { font-size: 0.8rem; padding: 10px; }
        }
      `}} />

      <nav className="glass-navbar">
        <div className="nav-top-row">
          <div className="nav-brand-container" onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '900' }}>{t[lang].brand}</h1>
              <small style={{ color: '#93c5fd', fontWeight: 'bold', display: 'block' }}>{t[lang].doctor}</small>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="lang-toggle-container" onClick={toggleLanguage} title="Switch Language">
                <div className="lang-toggle-indicator"></div>
                <span className="lang-label" style={{ color: lang === 'en' ? '#fff' : '#94a3b8' }}>EN</span>
                <span className="lang-label" style={{ color: lang === 'ur' ? '#fff' : '#94a3b8' }}>UR</span>
            </div>
            {session ? (
              <button onClick={handleLogout} className="auth-icon-btn logout-btn"><i className='bx bx-log-out'></i></button>
            ) : null}
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <i className='bx bx-x'></i> : <i className='bx bx-menu'></i>}
            </button>
          </div>
        </div>
        <div className="desktop-menu">
            <button className="nav-link" onClick={() => router.push('/')}>{t[lang].navHome}</button>
            <button className="nav-link" onClick={() => router.push('/about')}>{t[lang].navAbout}</button>
            
            <div className="nav-dropdown-container" onMouseEnter={() => !isMobile && setShowGuidanceDropdown(true)} onMouseLeave={() => !isMobile && setShowGuidanceDropdown(false)}>
                <button className="nav-link" onClick={() => setIsMobile && setShowGuidanceDropdown(!showGuidanceDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {t[lang].navCareer} <i className='bx bx-chevron-down'></i>
                </button>
                <div className={`nav-dropdown-menu ${showGuidanceDropdown ? 'active' : ''}`}>
                    <button className="dropdown-item" onClick={() => router.push('/categories?search=10th')}>{t[lang].courses10}</button>
                    <button className="dropdown-item" onClick={() => router.push('/categories?search=12th')}>{t[lang].courses12}</button>
                    <button className="dropdown-item" onClick={() => router.push('/categories?search=graduation')}>{t[lang].coursesGrad}</button>
                    <button className="dropdown-item" onClick={() => router.push('/categories?search=postgrad')}>{t[lang].coursesPost}</button>
                    <button className="dropdown-item" onClick={() => router.push('/categories?search=other')}>{t[lang].coursesOther}</button>
                </div>
            </div>

            <button className="nav-link" onClick={() => router.push('/assessment')}>{t[lang].navAssess}</button>
        </div>
      </nav>

      <main className="admin-main">
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <i className='bx bxs-pie-chart-alt-2' style={{ fontSize: '3.5rem', color: '#38bdf8', marginBottom: '10px' }}></i>
          <h1 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '2.2rem', fontWeight: '900', fontFamily: 'inherit' }}>{t[lang].adminTitle}</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1rem', fontFamily: 'inherit' }}>{t[lang].adminSub}</p>
        </header>

        {!isAuthenticated ? (
          <div className="admin-card">
            <h2 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.5rem', fontFamily: 'inherit' }}>Secure Authorization</h2>
            {error && <div className="alert-box alert-error"><i className='bx bx-error-circle'></i> {error}</div>}
            <form onSubmit={handleAdminLogin}>
              <div style={{ marginBottom: '15px', textAlign: 'left' }} dir="ltr">
                <label style={{ color: '#93c5fd', display: 'block', marginBottom: '5px' }}>Admin Email</label>
                <input type="email" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(15,23,42,0.6)', border: '1px solid #38bdf8', color: '#fff' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '20px', textAlign: 'left' }} dir="ltr">
                <label style={{ color: '#93c5fd', display: 'block', marginBottom: '5px' }}>Security Key</label>
                <input type="password" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(15,23,42,0.6)', border: '1px solid #38bdf8', color: '#fff' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Verify & Access</button>
            </form>
          </div>
        ) : (
          <div className="dashboard-container">
            
            {/* --- ADMIN TABS --- */}
            <div className="admin-tabs">
                <button onClick={() => setAdminTab('crm')} className={`tab-btn ${adminTab === 'crm' ? 'active' : 'inactive'}`}>
                    <i className='bx bx-line-chart'></i> {t[lang].tabCrm}
                </button>
                <button onClick={() => setAdminTab('cms')} className={`tab-btn ${adminTab === 'cms' ? 'active' : 'inactive'}`}>
                    <i className='bx bx-data'></i> {t[lang].tabCms}
                </button>
            </div>

            {/* --- TAB 1: CRM & LEADS --- */}
            {adminTab === 'crm' && (
                <>
                <div className="kpi-grid">
                  <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><i className='bx bx-group'></i></div>
                    <div className="kpi-info"><h3 className="en-text">{totalStudents}</h3><p>{t[lang].totalLeads}</p></div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className='bx bx-atom'></i></div>
                    <div className="kpi-info"><h3 className="en-text" style={{ color: '#10b981' }}>{scienceCount}</h3><p>{t[lang].science}</p></div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><i className='bx bx-line-chart'></i></div>
                    <div className="kpi-info"><h3 className="en-text" style={{ color: '#f59e0b' }}>{commerceCount}</h3><p>{t[lang].commerce}</p></div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}><i className='bx bx-layer'></i></div>
                    <div className="kpi-info"><h3 className="en-text" style={{ color: '#a855f7' }}>{otherCount}</h3><p>{t[lang].otherStreams}</p></div>
                  </div>
                </div>

                <div className="tools-bar">
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
                    <input type="text" placeholder={t[lang].searchEmail} className="filter-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <select className="filter-input" value={filterStream} onChange={(e) => setFilterStream(e.target.value)}>
                      <option value="">{t[lang].allStreams}</option>
                      <option value="science">Science</option>
                      <option value="commerce">Commerce</option>
                      <option value="paramedical">Paramedical</option>
                      <option value="polytechnic">Polytechnic</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={fetchData} className="action-btn" style={{ borderColor: '#38bdf8', color: '#38bdf8' }}><i className='bx bx-refresh'></i> {t[lang].refresh}</button>
                    <button onClick={downloadCSV} className="action-btn"><i className='bx bx-download'></i> {t[lang].exportCsv}</button>
                    <button onClick={() => { setIsAuthenticated(false); setPassword(''); }} className="action-btn" style={{ borderColor: '#ef4444', color: '#ef4444' }}><i className='bx bx-lock'></i> {t[lang].lock}</button>
                  </div>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#38bdf8' }}><i className='bx bx-loader-alt bx-spin' style={{ fontSize: '3rem' }}></i><p style={{ fontFamily: 'inherit' }}>{t[lang].syncing}</p></div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{t[lang].date}</th>
                          <th>{t[lang].studentId}</th>
                          <th>{t[lang].matrix}</th>
                          <th>{t[lang].lang}</th>
                          <th>{t[lang].crmStatus}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.length > 0 ? filteredData.map((s, idx) => {
                          const currentStatus = statusMap[s.email] || 'new';
                          return (
                            <tr key={idx}>
                              <td className="en-text">{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                              <td className="en-text">{s.email}</td>
                              <td className="en-text" style={{ color: '#38bdf8', fontWeight: 'bold' }}>{s.interest_area || 'Pending'}</td>
                              <td className="en-text">{s.preferred_language || 'EN'}</td>
                              <td>
                                <select className={`status-select ${currentStatus}`} value={currentStatus} onChange={(e) => handleStatusChange(s.email, e.target.value)}>
                                  <option value="new">🔴 New</option>
                                  <option value="counseled">🟡 Counseled</option>
                                  <option value="admitted">🟢 Admitted</option>
                                </select>
                              </td>
                            </tr>
                          );
                        }) : <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', fontFamily: 'inherit' }}>{t[lang].noRecords}</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
                </>
            )}

            {/* --- TAB 2: CMS --- */}
            {adminTab === 'cms' && (
                <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h2 style={{ color: '#fff', margin: '0 0 5px 0', fontFamily: 'inherit' }}>{t[lang].cmsTitle}</h2>
                            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', fontFamily: 'inherit' }}>{t[lang].cmsSub}</p>
                        </div>
                        <button className="action-btn" style={{ background: '#38bdf8', color: '#0f172a', borderColor: '#38bdf8' }}>
                            {t[lang].addNew}
                        </button>
                    </div>

                    <div>
                        {matrixContent.map(item => (
                            <div key={item.id} className="cms-card">
                                <div className="cms-info">
                                    <h4><span className="en-text">{item.title}</span></h4>
                                    <p><strong>{t[lang].scope}:</strong> <span className="en-text">{item.scope}</span></p>
                                    <p style={{ marginTop: '5px' }}><strong>{t[lang].duration}:</strong> <span className="en-text">{item.duration}</span> | <strong>{t[lang].jobs}:</strong> <span className="en-text">{item.jobs}</span></p>
                                </div>
                                <button className="action-btn" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                                    <i className='bx bx-edit'></i> {t[lang].edit}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
