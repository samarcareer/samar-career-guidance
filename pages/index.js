import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- TRANSLATION DICTIONARY ---
const t = {
  en: {
    brand: "Samar Guidance",
    doctor: "Dr. Ashfaque Umar",
    searchPlaceholder: "Search matrix...",
    studentLogin: "Student Login",
    myProfile: "My Profile",
    logout: "Logout",
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
    aboutTitle: "The Foundation Behind The Vision",
    aboutSub: "Rooted in Malegaon, Samar Guidance is an enterprise-level platform committed to transforming student aspirations into strategic, achievable roadmaps through data-driven academic counseling.",
    meetExperts: "Meet Our Experts",
    contactDirectly: "Contact directly",
    footer: "© 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked."
  },
  ur: {
    brand: "ثمر گائیڈنس",
    doctor: "ڈاکٹر اشفاق عمر",
    searchPlaceholder: "تلاش کریں...",
    studentLogin: "طالب علم لاگ ان",
    myProfile: "میری پروفائل",
    logout: "لاگ آؤٹ",
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
    aboutTitle: "ہمارے وژن کی بنیاد",
    aboutSub: "مالیگاؤں میں قائم، ثمر گائیڈنس ایک انٹرپرائز لیول پلیٹ فارم ہے جو طلباء کی خواہشات کو ڈیٹا پر مبنی تعلیمی کونسلنگ کے ذریعے اسٹریٹجک روڈ میپس میں بدلنے کے لیے پرعزم ہے۔",
    meetExperts: "ہمارے ماہرین سے ملیں",
    contactDirectly: "براہ راست رابطہ کریں",
    footer: "© 2026 ثمر فاؤنڈیشن۔ انٹرپرائز گریڈ آرکیٹیکچر کے ذریعے محفوظ۔"
  }
};

// --- TEAM DATA ---
const teamMembers = [
  {
    id: 1,
    name: "Dr. Ashfaque Umar",
    role: "Founder & Director",
    image: "https://ui-avatars.com/api/?name=Ashfaque+Umar&background=0D8ABC&color=fff&size=200",
    color: "#fde047", 
    bio: "Visionary founder of Samar Guidance. Dedicated to shaping the careers of thousands of students through precise, analytical, and empathetic counseling.",
    email: "ashfaqueumar@gmail.com"
  },
  {
    id: 2,
    name: "Mohammed Junaid",
    role: "Lead Platform Architect",
    image: "https://ui-avatars.com/api/?name=Mohammed+Junaid&background=10B981&color=fff&size=200",
    color: "#93c5fd", 
    bio: "The technical brain behind the Samar Guidance portal. Overseeing the enterprise-grade architecture, data protection, and seamless UI/UX from the Malegaon headquarters.",
    email: "mohammedjunaid5263@gmail.com"
  },
  {
    id: 3,
    name: "Mohammed Ozair",
    role: "Senior Academic Counselor",
    image: "https://ui-avatars.com/api/?name=MOHAMMED+OZAIR&background=F472B6&color=fff&size=200",
    color: "#f9a8d4", 
    bio: "Expert in psychological profiling and student mentoring. Ozair helps students bridge the gap between their passions and real-world opportunities.",
    email: "Ozair@samarguidance.com"
  },
  {
    id: 4,
    name: "Naeem Ahmed",
    role: "Student Success Manager",
    image: "https://ui-avatars.com/api/?name=Naeem+Ahmed&background=F59E0B&color=fff&size=200",
    color: "#a7f3d0", 
    bio: "Ensures every student gets personalized attention. naeem manages the tracking matrices and post-assessment follow-ups.",
    email: "naeem@samarguidance.com"
  }
];

export default function AboutUs() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  
  // --- SamarUI Navbar States ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [session, setSession] = useState(null);

  // --- Modal State ---
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
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

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ur' : 'en');
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
        <title>{t[lang].navAbout} | {t[lang].brand}</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }
        .en-text { font-family: 'Segoe UI', Roboto, sans-serif !important; direction: ltr !important; display: inline-block; }

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
        .lang-toggle-indicator { position: absolute; top: 4px; left: ${lang === 'en' ? '4px' : '40px'}; width: 34px; height: 26px; background: #38bdf8; border-radius: 14px; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); }
        .lang-label { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; color: #fff; z-index: 1; user-select: none; font-family: 'Segoe UI', sans-serif; }

        .mobile-search-wrapper { display: none; }
        .desktop-search-wrapper { display: block; flex: 0.6; max-width: 400px; }
        .mobile-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 2rem; cursor: pointer; }

        @media (max-width: 1024px) {
          .desktop-search-wrapper { display: none !important; }
          .mobile-search-wrapper { display: block; }
          .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; align-items: flex-start; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); border-bottom: 1px solid rgba(56,189,248,0.3); padding: 20px 5%; gap: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); z-index: 999; }
          .mobile-toggle { display: block; }
          .nav-dropdown-menu { position: static; box-shadow: none; border: none; background: rgba(0,0,0,0.2); margin-top: 10px; width: 100%; display: ${showGuidanceDropdown ? 'flex' : 'none'}; opacity: 1; visibility: visible; transform: none; }
          [dir="rtl"] .nav-dropdown-menu { text-align: right; }
          .nav-link { width: 100%; text-align: left; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          [dir="rtl"] .nav-link { text-align: right; }
          .nav-link::after { display: none; }
        }

        /* --- ABOUT US SPECIFIC STYLES --- */
        .about-main { flex: 1; padding: 60px 5%; width: 100%; max-width: 1200px; margin: 0 auto; text-align: center; }
        .section-title { font-size: 2.5rem; color: #fff; font-weight: 900; margin-bottom: 15px; text-shadow: 0 4px 15px rgba(56,189,248,0.4); font-family: inherit; }
        .section-subtitle { color: #93c5fd; font-size: 1.1rem; max-width: 800px; margin: 0 auto 50px auto; line-height: 1.6; font-family: inherit; }
        
        .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; padding: 20px 0; justify-items: center; }
        .team-card { display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.3s ease; }
        .team-card:hover { transform: translateY(-10px); }
        
        .badge-wrapper {
          width: 160px; height: 160px; display: flex; justify-content: center; align-items: center;
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); margin-bottom: 15px; transition: 0.3s ease;
        }
        .team-card:hover .badge-wrapper { transform: scale(1.05) rotate(5deg); }
        .badge-image { width: 146px; height: 146px; object-fit: cover; clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); }

        .team-name { color: #fff; font-size: 1.1rem; font-weight: 700; margin: 0 0 5px 0; font-family: 'Segoe UI', sans-serif; }
        .team-role { color: #cbd5e1; font-size: 0.9rem; margin: 0; font-family: 'Segoe UI', sans-serif; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 2000; padding: 20px; opacity: 0; animation: fadeIn 0.3s forwards; }
        .modal-content { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 20px; padding: 40px; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.6); position: relative; transform: translateY(20px); animation: slideUp 0.3s forwards; }
        .close-btn { position: absolute; top: 15px; right: 15px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; width: 35px; height: 35px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; cursor: pointer; transition: 0.2s; }
        .close-btn:hover { background: #ef4444; color: #fff; }
        
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes slideUp { to { transform: translateY(0); } }
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
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t[lang].searchPlaceholder} 
              style={{ width: '100%', padding: '10px 18px', borderRadius: '25px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none', fontFamily: 'inherit' }}
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="lang-toggle-container" onClick={toggleLanguage} title="Switch Language">
                <div className="lang-toggle-indicator"></div>
                <span className="lang-label" style={{ color: lang === 'en' ? '#fff' : '#94a3b8' }}>EN</span>
                <span className="lang-label" style={{ color: lang === 'ur' ? '#fff' : '#94a3b8' }}>UR</span>
            </div>

            {session ? (
              <>
                <button onClick={() => router.push('/profile')} style={{ padding: '8px 20px', background: '#10b981', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.4)', fontFamily: 'inherit' }}>
                  {t[lang].myProfile}
                </button>
                <button onClick={handleLogout} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {t[lang].logout}
                </button>
              </>
            ) : (
              <button onClick={() => router.push('/login')} style={{ padding: '8px 20px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59,130,246,0.4)', fontFamily: 'inherit' }}>
                {t[lang].studentLogin}
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
              placeholder={t[lang].searchPlaceholder} 
              style={{ width: '100%', padding: '10px 18px', borderRadius: '8px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none', fontFamily: 'inherit' }}
            />
          </form>

          <button className="nav-link" onClick={() => router.push('/')}>{t[lang].navHome}</button>
          <button className="nav-link" onClick={() => router.push('/about')} style={{ color: '#38bdf8' }}>{t[lang].navAbout}</button>
          
          {/* --- FIXED INTERFACE REDIRECTION MATRIX --- */}
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
          <button className="nav-link" onClick={() => router.push('/personality')}>{t[lang].navPersonality}</button>
          <button className="nav-link" onClick={() => router.push('/gallery')}>{t[lang].navGallery}</button>
        </div>
      </nav>

      <main className="about-main">
        <h1 className="section-title">{t[lang].aboutTitle}</h1>
        <p className="section-subtitle">{t[lang].aboutSub}</p>

        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '30px', borderBottom: '2px solid rgba(56, 189, 248, 0.3)', display: 'inline-block', paddingBottom: '10px', fontFamily: 'inherit' }}>
          {t[lang].meetExperts}
        </h2>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card" onClick={() => setSelectedMember(member)}>
              <div className="badge-wrapper" style={{ backgroundColor: member.color }}>
                <img src={member.image} alt={member.name} className="badge-image" />
              </div>
              <h3 className="team-name en-text">{member.name}</h3>
              <p className="team-role en-text">{member.role}</p>
            </div>
          ))}
        </div>
      </main>

      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedMember(null)}><i className='bx bx-x'></i></button>
            
            <div className="badge-wrapper" style={{ backgroundColor: selectedMember.color, margin: '0 auto 20px auto', width: '120px', height: '120px' }}>
              <img src={selectedMember.image} alt={selectedMember.name} className="badge-image" style={{ width: '110px', height: '110px' }} />
            </div>
            
            <h2 className="en-text" style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '5px' }}>{selectedMember.name}</h2>
            <h4 className="en-text" style={{ color: selectedMember.color, margin: '0 0 20px 0', fontSize: '1.1rem' }}>{selectedMember.role}</h4>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: lang === 'en' ? `4px solid ${selectedMember.color}` : 'none', borderRight: lang === 'ur' ? `4px solid ${selectedMember.color}` : 'none' }}>
              <p className="en-text" style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, textAlign: 'left', display: 'block' }}>
                {selectedMember.bio}
              </p>
            </div>

            <a href={`mailto:${selectedMember.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '25px', fontWeight: 'bold', transition: '0.3s', fontFamily: 'inherit' }} onMouseOver={(e) => e.target.style.background = '#38bdf8'} onMouseOut={(e) => e.target.style.background = 'rgba(56, 189, 248, 0.1)'}>
              <i className='bx bx-envelope'></i> {t[lang].contactDirectly}
            </a>
          </div>
        </div>
      )}

      <footer style={{ width: '100%', background: 'rgba(30, 64, 175, 0.6)', backdropFilter: 'blur(16px)', padding: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#bfdbfe', fontWeight: '700', marginTop: 'auto', position: 'relative', fontFamily: 'inherit' }}>
        {t[lang].footer}
        <i className='bx bxs-shield-alt-2' onClick={() => router.push('/admin')} style={{ position: 'absolute', right: lang === 'ur' ? 'auto' : '20px', left: lang === 'ur' ? '20px' : 'auto', bottom: '20px', cursor: 'pointer', opacity: 0.3, fontSize: '1.2rem', transition: '0.3s' }} title="Security Protected"></i>
      </footer>
    </div>
  );
}
