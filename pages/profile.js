import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- CAREER KNOWLEDGE BANK ---
const careerKnowledgeBank = {
  science: { title: "Science & Technology Framework", scope: "Bsc aur technical courses ke baad aap Research, Data Analytics, Space Science, Laboratory Tech, aur Civil Services mein ja sakte hain.", duration: "3 Years Standard Graduation", jobs: ["Data Scientist", "Lab Researcher", "Content Developer", "Forest Officer", "Forensic Expert"] },
  commerce: { title: "Commerce & Financial Management", scope: "Finance, Auditing, Corporate Laws, Investment Banking aur Taxation sector mein commerce students ki high demand rehti hai.", duration: "3 to 5 Years Professional Route", jobs: ["Chartered Accountant (CA)", "Financial Analyst", "Company Secretary", "Tax Consultant", "Bank Manager"] },
  paramedical: { title: "Paramedical & Nursing Allied Sciences", scope: "Hospitals, Diagnostics labs, Radiology centers aur Pharmacy lines mein immediate job placements milti hain.", duration: "2 to 4 Years (Diploma / Degree)", jobs: ["Pharmacist (D.Pharm/B.Pharm)", "Lab Technician", "X-Ray/Radiology Expert", "Physiotherapist"] },
  btech: { title: "Engineering & Advanced Automation", scope: "Software industries, Automation & Robotics, Infrastructure developers aur Aerospace corporations mein high-paying tech jobs.", duration: "4 Years Professional Degree", jobs: ["Software Engineer", "Robotics Specialist", "Civil Engineer", "Automobile Designer"] }
};

// --- TRANSLATION DICTIONARY ---
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
    navContact: "Contact Us",
    footer: "© 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked.",
    
    myProfile: "Student Dashboard",
    syncing: "Syncing Profile Data...",
    noAccount: "No Account Found!",
    takeAssess: "Take Assessment",
    studentAcc: "STUDENT ACCOUNT PROFILE",
    roadmapTitle: "Roadmap Matrix:",
    scope: "Scope:",
    duration: "Duration:",
    priority: "Priority Careers:",
    pendingAnalytics: "Analytics fetching pending...",
    
    bookmarksTitle: "My Bookmarks & Highlights",
    savedTopic: "Saved Topic",
    highlightedPath: "Highlighted Career Path",
    topic1: "UPSC Civil Services Strategy",
    topic2: "AI & Data Analytics Scope",
    topic3: "Top Colleges in Maharashtra",
    exploreMore: "Explore More Topics",
    uploading: "Uploading..."
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
    navContact: "ہم سے رابطہ کریں",
    footer: "© 2026 ثمر فاؤنڈیشن۔ انٹرپرائز گریڈ آرکیٹیکچر کے ذریعے محفوظ۔",
    
    myProfile: "طالب علم ڈیش بورڈ",
    syncing: "پروفائل ڈیٹا سنک ہو رہا ہے...",
    noAccount: "کوئی اکاؤنٹ نہیں ملا!",
    takeAssess: "اسسمنٹ شروع کریں",
    studentAcc: "طالب علم کی پروفائل",
    roadmapTitle: "روڈ میپ میٹرکس:",
    scope: "دائرہ کار:",
    duration: "مدت:",
    priority: "اہم کیریئر:",
    pendingAnalytics: "اینالیٹکس کا انتظار ہے...",
    
    bookmarksTitle: "میرے بک مارکس اور ہائی لائٹس",
    savedTopic: "محفوظ کردہ موضوع",
    highlightedPath: "ہائی لائٹ کردہ کیریئر",
    topic1: "یو پی ایس سی سول سروسز حکمت عملی",
    topic2: "اے آئی اور ڈیٹا اینالیٹکس کا دائرہ کار",
    topic3: "مہاراشٹر کے ٹاپ کالجز",
    exploreMore: "مزید موضوعات دریافت کریں",
    uploading: "اپ لوڈ ہو رہا ہے..."
  }
};

export default function StudentProfile() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  
  // --- States ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [streamDetails, setStreamDetails] = useState(null);
  const [userName, setUserName] = useState("Student");
  
  // --- Photo Upload States ---
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        setSession(session);
        const email = session.user.email;
        
        const metadata = session.user.user_metadata;
        if (metadata?.full_name) {
            setUserName(metadata.full_name);
        } else {
            setUserName(email.split('@')[0].toUpperCase());
        }

        if (metadata?.avatar_url) {
            setAvatarUrl(metadata.avatar_url);
        }

        const { data, error } = await supabase
          .from('user_assessments')
          .select('*')
          .eq('email', email.trim().toLowerCase())
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setStudentData(data[0]);
          if (careerKnowledgeBank[data[0].interest_area]) {
              setStreamDetails(careerKnowledgeBank[data[0].interest_area]);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
      else setSession(session);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ur' : 'en');
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
  };

  const handlePhotoClick = () => {
      if (!avatarUrl) fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(true);
      try {
          const objectUrl = URL.createObjectURL(file);
          setAvatarUrl(objectUrl);

          const fileExt = file.name.split('.').pop();
          const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
          
          if (!uploadError) {
              const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
              await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
              setAvatarUrl(publicUrl);
          }
      } catch (error) {
          console.error("Upload error:", error);
      } finally {
          setIsUploading(false);
      }
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#38bdf8' }}>
        <i className='bx bx-loader-alt bx-spin' style={{ fontSize: '4rem', marginBottom: '20px' }}></i>
        <h2 style={{ fontFamily: "'Segoe UI', sans-serif" }}>{t[lang].syncing}</h2>
    </div>
  );

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
        <title>{t[lang].myProfile} | {t[lang].brand}</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }

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
        .logout-btn { color: #ef4444; } .logout-btn:hover { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.3); transform: translateY(-2px); }

        .mobile-search-wrapper { display: none; width: 100%; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 10px; }
        .desktop-search-wrapper { display: block; flex: 0.6; max-width: 400px; }
        .mobile-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 2rem; cursor: pointer; }

        .profile-container { padding: 40px 5%; width: 100%; max-width: 1400px; margin: 0 auto; display: grid; gap: 40px; }
        
        .profile-header { background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.4); display: flex; flex-wrap: wrap; gap: 30px; align-items: center; backdrop-filter: blur(10px); }
        
        .avatar-lg { width: 130px; height: 130px; background-color: #1e293b; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 4px solid #38bdf8; overflow: hidden; position: relative; font-size: 4rem; color: #38bdf8; flex-shrink: 0; transition: 0.3s; }
        .avatar-lg.uploadable:hover { border-color: #10b981; color: #10b981; transform: scale(1.05); }
        .verified-badge { position: absolute; bottom: 0; width: 100%; background: #10b981; color: #fff; font-size: 0.75rem; font-weight: bold; text-align: center; padding: 4px 0; font-family: 'Segoe UI', sans-serif; z-index: 2; }
        .upload-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; opacity: 0; transition: 0.3s; font-size: 1rem; font-weight: bold; color: #fff; z-index: 1; }
        .avatar-lg.uploadable:hover .upload-overlay { opacity: 1; }
        
        .text-container { flex: 1; min-width: 0; }
        .student-name { font-size: clamp(1.8rem, 4vw, 2.5rem); color: #fff; margin: 15px 0 0 0; font-weight: 900; font-family: inherit; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.2; }
        .account-badge { display: inline-block; font-size: 0.85rem; background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-family: inherit; margin-bottom: 5px; }

        .roadmap-card { background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.4); backdrop-filter: blur(10px); }
        .job-pill { background: rgba(255,122,0,0.1); border: 1px solid rgba(255,122,0,0.3); padding: 12px 20px; border-radius: 8px; font-size: 1.05rem; font-weight: bold; color: #fff; font-family: inherit; }

        .bookmark-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .bookmark-item { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.15); border-radius: 12px; padding: 20px; transition: 0.3s; cursor: pointer; display: flex; flex-direction: column; gap: 10px; }
        .bookmark-item:hover { transform: translateY(-5px); border-color: #38bdf8; background: rgba(56, 189, 248, 0.05); box-shadow: 0 10px 20px rgba(56, 189, 248, 0.1); }
        .bookmark-header { display: flex; justify-content: space-between; align-items: center; }
        .bookmark-icon { width: 45px; height: 45px; border-radius: 10px; background: rgba(16, 185, 129, 0.1); color: #10b981; display: flex; justify-content: center; align-items: center; font-size: 1.8rem; }
        
        .btn-outline { background: transparent; border: 1px solid #38bdf8; color: #38bdf8; padding: 12px 25px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; font-size: 1rem; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; }
        .btn-outline:hover { background: rgba(56, 189, 248, 0.1); }

        @media (max-width: 1024px) {
          .desktop-search-wrapper { display: none !important; }
          .mobile-search-wrapper { display: block; }
          .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; align-items: flex-start; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); border-bottom: 1px solid rgba(56,189,248,0.3); padding: 20px 5%; gap: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .mobile-toggle { display: block; }
          .nav-dropdown-menu { position: static; box-shadow: none; border: none; background: rgba(0,0,0,0.2); margin-top: 10px; width: 100%; display: ${showGuidanceDropdown ? 'flex' : 'none'}; opacity: 1; visibility: visible; transform: none; }
          [dir="rtl"] .nav-dropdown-menu { text-align: right; }
          .nav-link { width: 100%; text-align: left; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          [dir="rtl"] .nav-link { text-align: right; }
          .nav-link::after { display: none; }
        }

        /* --- MOBILE VIEW FIX FOR PROFILE HEADER --- */
        @media (max-width: 768px) {
          .profile-header { flex-direction: column; text-align: center; justify-content: center; padding: 30px 20px; gap: 15px; }
          .text-container { width: 100%; display: flex; flex-direction: column; align-items: center; }
          .student-name { font-size: 2rem; text-align: center; }
          .roadmap-card { padding: 25px 20px; }
          .bookmark-grid { grid-template-columns: 1fr; }
        }
      `}} />

      <nav className="glass-navbar">
        <div className="nav-top-row">
          <div className="nav-brand-container" onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '0.5px', fontFamily: 'inherit' }}>{t[lang].brand}</h1>
              <small style={{ color: '#93c5fd', fontWeight: 'bold', display: 'block', fontFamily: 'inherit' }}>{t[lang].doctor}</small>
            </div>
          </div>

          <form className="desktop-search-wrapper" onSubmit={handleSearchSubmit}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t[lang].searchPlaceholder} style={{ width: '100%', padding: '10px 18px', borderRadius: '25px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none', fontFamily: 'inherit' }} />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="lang-toggle-container" onClick={toggleLanguage} title="Switch Language">
                <div className="lang-toggle-indicator"></div>
                <span className="lang-label" style={{ color: lang === 'en' ? '#fff' : '#94a3b8' }}>EN</span>
                <span className="lang-label" style={{ color: lang === 'ur' ? '#fff' : '#94a3b8' }}>UR</span>
            </div>

            <button onClick={handleLogout} className="auth-icon-btn logout-btn" title="Logout"><i className='bx bx-log-out'></i></button>
            
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <i className='bx bx-x'></i> : <i className='bx bx-menu'></i>}
            </button>
          </div>
        </div>

        <div className="desktop-menu">
          <form className="mobile-search-wrapper" onSubmit={handleSearchSubmit}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t[lang].searchPlaceholder} style={{ width: '100%', padding: '10px 18px', borderRadius: '8px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none', fontFamily: 'inherit' }} />
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

      <div className="profile-container">
        
        {!studentData ? (
           <div style={{ background: 'rgba(15, 23, 42, 0.85)', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 15px 35px rgba(0,0,0,0.4)' }}>
              <i className='bx bx-error-circle' style={{ fontSize: '5rem', color: '#ef4444', marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '20px', fontFamily: 'inherit' }}>{t[lang].noAccount}</h3>
              <button onClick={() => router.push('/assessment')} style={{ padding: '15px 30px', background: '#38bdf8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', fontFamily: 'inherit' }}>
                {t[lang].takeAssess}
              </button>
          </div>
        ) : (
          <>
            <section className="profile-header">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} style={{ display: 'none' }} />
              
              <div 
                  className={`avatar-lg ${!avatarUrl ? 'uploadable' : ''}`} 
                  onClick={handlePhotoClick}
                  style={{ cursor: !avatarUrl ? 'pointer' : 'default' }}
              >
                  {isUploading ? (
                      <i className='bx bx-loader-alt bx-spin' style={{ fontSize: '2.5rem' }}></i>
                  ) : avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                      <>
                          <i className='bx bx-camera'></i>
                          <div className="upload-overlay"><i className='bx bx-upload'></i></div>
                      </>
                  )}
                  <div className="verified-badge">VERIFIED</div>
              </div>

              <div className="text-container">
                <span className="account-badge">
                    {t[lang].studentAcc}
                </span>
                <h2 className="student-name">{userName}</h2>
              </div>
            </section>

            <section className="roadmap-card">
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '30px' }}>
                <h3 style={{ margin: '0', fontSize: '2rem', color: '#fff', fontWeight: '900', fontFamily: 'inherit' }}>
                  {t[lang].roadmapTitle} {studentData.interest_area.toUpperCase()}
                </h3>
              </div>

              {streamDetails ? (
                <div>
                  <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '25px', fontFamily: 'inherit' }}><strong style={{ color: '#38bdf8' }}>{t[lang].scope}</strong> {streamDetails.scope}</p>
                  <p style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '30px', fontFamily: 'inherit' }}><strong style={{ color: '#38bdf8' }}>{t[lang].duration}</strong> {streamDetails.duration}</p>
                  <h5 style={{ color: '#ff7a00', fontSize: '1.3rem', marginBottom: '15px', fontFamily: 'inherit' }}>{t[lang].priority}</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {streamDetails.jobs.map((job, idx) => <span key={idx} className="job-pill">💼 {job}</span>)}
                  </div>
                </div>
              ) : <p style={{ color: '#94a3b8', fontFamily: 'inherit' }}>{t[lang].pendingAnalytics}</p>}
            </section>

            <section className="roadmap-card">
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ margin: '0', fontSize: '1.8rem', color: '#fff', fontWeight: '800', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className='bx bx-bookmark-star' style={{ color: '#f59e0b' }}></i> {t[lang].bookmarksTitle}
                </h3>
                <button className="btn-outline" onClick={() => router.push('/categories')}>
                  {t[lang].exploreMore} <i className={`bx bx-${lang === 'ur' ? 'left' : 'right'}-arrow-alt`}></i>
                </button>
              </div>

              <div className="bookmark-grid">
                <div className="bookmark-item" onClick={() => router.push('/guidance?level=graduation')}>
                  <div className="bookmark-header">
                    <div className="bookmark-icon"><i className='bx bxs-institution'></i></div>
                    <i className='bx bxs-bookmark' style={{ color: '#38bdf8', fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.1rem', fontFamily: 'inherit' }}>{t[lang].topic1}</h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', fontFamily: 'inherit' }}>{t[lang].highlightedPath}</p>
                  </div>
                </div>

                <div className="bookmark-item" onClick={() => router.push('/guidance?level=12th')} style={{ borderColor: 'rgba(244, 114, 182, 0.3)' }}>
                  <div className="bookmark-header">
                    <div className="bookmark-icon" style={{ background: 'rgba(244, 114, 182, 0.1)', color: '#f472b6' }}><i className='bx bx-data'></i></div>
                    <i className='bx bxs-bookmark' style={{ color: '#f472b6', fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.1rem', fontFamily: 'inherit' }}>{t[lang].topic2}</h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', fontFamily: 'inherit' }}>{t[lang].savedTopic}</p>
                  </div>
                </div>

                <div className="bookmark-item" onClick={() => router.push('/guidance?level=10th')} style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  <div className="bookmark-header">
                    <div className="bookmark-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className='bx bxs-school'></i></div>
                    <i className='bx bxs-bookmark' style={{ color: '#10b981', fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.1rem', fontFamily: 'inherit' }}>{t[lang].topic3}</h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', fontFamily: 'inherit' }}>{t[lang].savedTopic}</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <footer style={{ width: '100%', background: 'rgba(30, 64, 175, 0.6)', backdropFilter: 'blur(16px)', padding: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#bfdbfe', fontWeight: '700', marginTop: 'auto', position: 'relative', fontFamily: 'inherit' }}>
        {t[lang].footer}
        <i className='bx bxs-shield-alt-2' onClick={() => router.push('/admin')} style={{ position: 'absolute', right: lang === 'ur' ? 'auto' : '20px', left: lang === 'ur' ? '20px' : 'auto', bottom: '20px', cursor: 'pointer', opacity: 0.3, fontSize: '1.2rem', transition: '0.3s' }} title="Security Protected"></i>
      </footer>
    </div>
  );
}
