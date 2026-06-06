import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- BILINGUAL KNOWLEDGE BANK DATABASE ---
const dbData = {
  en: {
    science: { title: "Science & Technology Domain", scope: "Research, Advanced Data Science, Labs, Agriculture systems and professional engineering branches.", duration: "3 to 4 Years Degree Modules", items: ["Bsc Physics", "Bsc Chemistry", "Bsc Botany", "Bsc Zoology", "Bsc Computer science", "Bsc Mathematics", "Bsc PCM", "Bsc CBZ", "Bsc Forensic Science", "Bsc Food technology"] },
    commerce: { title: "Commerce & Strategic Finance Hub", scope: "Corporate accounting, banking, management systems, taxation laws and professional financial audits.", duration: "3 Years Standard Graduation Route", items: ["CA Chartered Account", "CMA Cost Management Account", "CS Company Secretary", "B.Com Regular", "B.Com Taxation", "BBA / BBM Regular", "BFM Financial Management"] },
    paramedical: { title: "Paramedical & Healthcare Allied Science", scope: "Clinical pharmacy solutions, pathology laboratory expertise, radiology metrics, medical scanning and nursing fields.", duration: "2 to 4 Years (Diploma / Degrees)", items: ["Nursing", "Pharm D", "B.Pharm", "D.Pharm", "Anesthesia technical", "Cardiac Care technical", "Clinical Optometry", "Medical Lab technician", "PHYSIOTHERAPY"] },
    btech: { title: "Advanced Engineering Framework", scope: "Software development pipelines, robotic architectures, automation engineering, infrastructure mapping, system configurations.", duration: "4 Years Professional Engineering Degree", items: ["Computer Science Engi.", "Electronics & Comm.Engi.", "Mechanical Engineering", "Civil Engineering", "Automation & Robotics Eng.", "Biomedical Engineering"] }
  },
  ur: {
    science: { title: "سائنس اور ٹیکنالوجی ڈومین", scope: "ریسرچ، ایڈوانسڈ ڈیٹا سائنس، لیبز، ایگریکلچر سسٹمز اور پروفیشنل انجینئرنگ برانچز۔", duration: "3 سے 4 سالہ ڈگری ماڈیولز", items: ["Bsc Physics", "Bsc Chemistry", "Bsc Botany", "Bsc Zoology", "Bsc Computer science", "Bsc Mathematics", "Bsc PCM", "Bsc CBZ", "Bsc Forensic Science", "Bsc Food technology"] },
    commerce: { title: "کامرس اور اسٹریٹجک فنانس ہب", scope: "کارپوریٹ اکاؤنٹنگ، بینکنگ، مینجمنٹ سسٹمز، ٹیکسیشن قوانین اور پروفیشنل فنانشل آڈٹ۔", duration: "3 سالہ معیاری گریجویشن", items: ["CA Chartered Account", "CMA Cost Management Account", "CS Company Secretary", "B.Com Regular", "B.Com Taxation", "BBA / BBM Regular", "BFM Financial Management"] },
    paramedical: { title: "پیرامیڈیکل اور ہیلتھ کیئر الائیڈ سائنس", scope: "کلینیکل فارمیسی، پیتھالوجی لیبارٹری، ریڈیولوجی میٹرکس، میڈیکل اسکیننگ اور نرسنگ کے شعبے۔", duration: "2 سے 4 سال (ڈپلومہ / ڈگری)", items: ["Nursing", "Pharm D", "B.Pharm", "D.Pharm", "Anesthesia technical", "Cardiac Care technical", "Clinical Optometry", "Medical Lab technician", "PHYSIOTHERAPY"] },
    btech: { title: "ایڈوانسڈ انجینئرنگ فریم ورک", scope: "سافٹ ویئر ڈیولپمنٹ، روبوٹک آرکیٹیکچر، آٹومیشن انجینئرنگ، انفراسٹرکچر میپنگ، سسٹم کنفیگریشنز۔", duration: "4 سالہ پروفیشنل انجینئرنگ ڈگری", items: ["Computer Science Engi.", "Electronics & Comm.Engi.", "Mechanical Engineering", "Civil Engineering", "Automation & Robotics Eng.", "Biomedical Engineering"] }
  }
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
    
    // Categories Specific
    pageTitle: "Samar Course Knowledge Bank",
    pageSub: "Explore comprehensive global dynamic study stems instantly.",
    matrix: " Matrix",
    scope: "Scope:",
    duration: "Standard Course Duration:",
    coursesIncluded: "Courses Included Under This Scope:"
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
    
    // Categories Specific
    pageTitle: "ثمر کورس نالج بینک",
    pageSub: "جامع عالمی کیریئر کے اختیارات فوری طور پر دریافت کریں۔",
    matrix: " میٹرکس",
    scope: "دائرہ کار:",
    duration: "کورس کی معیاری مدت:",
    coursesIncluded: "اس دائرہ کار میں شامل کورسز:"
  }
};

export default function CourseCategories() {
  const router = useRouter();
  const { stream, search } = router.query;
  const [lang, setLang] = useState('en');
  
  // --- States ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [session, setSession] = useState(null);
  
  // Active Tab State
  const [activeTab, setActiveTab] = useState('science');

  useEffect(() => {
    // Responsive handler
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    // Auth handler
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));

    // Category Parsing Logic (Uses English base for logic checks)
    if (stream && dbData.en[stream]) {
        setActiveTab(stream);
    } else if (search) {
      const query = decodeURIComponent(search).toLowerCase();
      for (const [key, val] of Object.entries(dbData.en)) {
        if (val.items.some(i => i.toLowerCase().includes(query)) || key.includes(query)) { 
            setActiveTab(key); 
            break; 
        }
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      subscription.unsubscribe();
    };
  }, [stream, search]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ur' : 'en');
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
  };

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
        <title>{t[lang].pageTitle} | {t[lang].brand}</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }

        /* --- ENGLISH FONT FIX UTILITY --- */
        .en-text { font-family: 'Segoe UI', Roboto, sans-serif !important; direction: ltr !important; display: inline-block; }

        /* --- NAVBAR STYLES --- */
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
          .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; align-items: flex-start; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); border-bottom: 1px solid rgba(56,189,248,0.3); padding: 20px 5%; gap: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); z-index: 999;}
          .mobile-toggle { display: block; }
          .nav-dropdown-menu { position: static; box-shadow: none; border: none; background: rgba(0,0,0,0.2); margin-top: 10px; width: 100%; display: ${showGuidanceDropdown ? 'flex' : 'none'}; opacity: 1; visibility: visible; transform: none; }
          [dir="rtl"] .nav-dropdown-menu { text-align: right; }
          .nav-link { width: 100%; text-align: left; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          [dir="rtl"] .nav-link { text-align: right; }
          .nav-link::after { display: none; }
        }

        /* --- CATEGORY PAGE STYLES --- */
        .category-main { padding: 50px 5%; width: 100%; max-width: 1400px; margin: 0 auto; flex: 1; }
        .cat-header { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 25px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
        .cat-title { color: #38bdf8; margin: 0; font-weight: 800; font-size: clamp(1.8rem, 4vw, 2.5rem); font-family: inherit; }
        .cat-sub { color: #94a3b8; margin: 8px 0 0 0; font-size: 1.1rem; font-family: inherit; }
        
        .tab-container { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 40px; }
        .tab-btn { padding: 15px 30px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1rem; flex: 1; min-width: 200px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; }
        
        .content-card { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 50px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); backdrop-filter: blur(10px); }
        .content-title { color: #38bdf8; margin: 0 0 20px 0; font-size: clamp(1.8rem, 4vw, 2.2rem); font-weight: 800; font-family: inherit; }
        .content-desc { color: #cbd5e1; line-height: 1.8; margin: 0 0 25px 0; font-size: 1.1rem; font-family: inherit; }
        
        .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
        .course-item { background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255,255,255,0.1); padding: 15px 20px; border-radius: 8px; font-size: 1rem; font-weight: 600; color: #cbd5e1; display: flex; align-items: center; gap: 10px; transition: transform 0.2s; font-family: inherit; }
        .course-item:hover { transform: translateY(-3px); border-color: #38bdf8; background: rgba(56, 189, 248, 0.05); }

        @media (max-width: 768px) {
            .content-card { padding: 30px 20px; }
            .tab-btn { min-width: 100%; }
        }
      `}} />

      {/* --- MASTER NAVBAR --- */}
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

            {session ? (
              <>
                <button onClick={() => router.push('/profile')} className="auth-icon-btn profile-btn" title={t[lang].myProfile}><i className='bx bx-user-circle'></i></button>
                <button onClick={handleLogout} className="auth-icon-btn logout-btn" title="Logout"><i className='bx bx-log-out'></i></button>
              </>
            ) : (
              <button onClick={() => router.push('/login')} style={{ padding: '8px 20px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59,130,246,0.4)', fontFamily: 'inherit' }}>
                Login
              </button>
            )}
            
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

      {/* --- MAIN CATEGORY CONTENT --- */}
      <main className="category-main">
        <header className="cat-header">
          <div>
            <h2 className="cat-title">{t[lang].pageTitle}</h2>
            <p className="cat-sub">{t[lang].pageSub}</p>
          </div>
        </header>

        <div className="tab-container">
          {Object.keys(dbData[lang]).map((tabKey) => (
            <button 
                key={tabKey} 
                onClick={() => setActiveTab(tabKey)} 
                className="tab-btn"
                style={{ 
                    background: activeTab === tabKey ? '#1e3a8a' : 'rgba(30,41,59,0.5)', 
                    border: `1px solid ${activeTab === tabKey ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                    color: activeTab === tabKey ? '#fff' : '#94a3b8'
                }}
            >
              <span className="en-text" style={{ textTransform: 'uppercase' }}>{tabKey}</span> {t[lang].matrix}
            </button>
          ))}
        </div>

        <div className="content-card">
          <h3 className="content-title">{dbData[lang][activeTab].title}</h3>
          
          <p className="content-desc">
              <strong style={{ color: '#ff7a00', marginRight: lang === 'en' ? '8px' : '0', marginLeft: lang === 'ur' ? '8px' : '0' }}>{t[lang].scope}</strong> 
              {dbData[lang][activeTab].scope}
          </p>
          
          <p className="content-desc" style={{ marginBottom: '40px' }}>
              <strong style={{ color: '#ff7a00', marginRight: lang === 'en' ? '8px' : '0', marginLeft: lang === 'ur' ? '8px' : '0' }}>{t[lang].duration}</strong> 
              {dbData[lang][activeTab].duration}
          </p>
          
          <h4 style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px', color: '#fff', fontSize: '1.3rem', marginBottom: '20px', fontWeight: 700, fontFamily: 'inherit' }}>
              {t[lang].coursesIncluded}
          </h4>
          
          <div className="course-grid">
            {dbData[lang][activeTab].items.map((item, idx) => (
              <span key={idx} className="course-item">
                  <i className='bx bxs-book-bookmark' style={{ color: '#38bdf8' }}></i> 
                  <span className="en-text">{item}</span>
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* --- SECURE FOOTER --- */}
      <footer style={{ width: '100%', background: 'rgba(30, 64, 175, 0.6)', backdropFilter: 'blur(16px)', padding: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#bfdbfe', fontWeight: '700', marginTop: 'auto', position: 'relative', fontFamily: 'inherit' }}>
        {t[lang].footer}
        <i className='bx bxs-shield-alt-2' onClick={() => router.push('/admin')} style={{ position: 'absolute', right: lang === 'ur' ? 'auto' : '20px', left: lang === 'ur' ? '20px' : 'auto', bottom: '20px', cursor: 'pointer', opacity: 0.3, fontSize: '1.2rem', transition: '0.3s' }} title="Security Protected"></i>
      </footer>
    </div>
  );
}
