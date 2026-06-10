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

// --- TRANSLATION DICTIONARY ---
const t = {
  en: {
    brand: "Samar Guidance", doctor: "Dr. Ashfaque Umar",
    navHome: "Home", navAbout: "About Us", navAssess: "Career Assessment", navProfile: "My Profile",
    courses10: "Courses After 10th", courses12: "Courses After 12th",
    profileTitle: "Student Dashboard", profileSub: "Complete your profile to unlock the career assessment.",
    step1: "Basic Details", step2: "Academic Info", step3: "Career Goals",
    fullName: "Full Name", phone: "WhatsApp / Phone Number", gender: "Gender", city: "City / Town",
    eduLevel: "Current Education Level", stream: "Current Stream (If 11th/12th)", college: "School / College Name",
    goal: "Target Career Goal", struggle: "What is your main struggle in career selection?",
    saveBtn: "Save & Continue", saving: "Saving...",
    nextBtn: "Next Step", prevBtn: "Previous",
    assessmentCardTitle: "Diagnostic Career Assessment",
    assessmentCardSubLocked: "Please complete your profile to 100% to unlock your test.",
    assessmentCardSubUnlocked: "Your profile is complete! You can now take the AI-powered career test.",
    takeTestBtn: "Take Assessment Now", lockedBtn: "Profile Incomplete",
    selectOption: "-- Select Option --"
  },
  ur: {
    brand: "ثمر گائیڈنس", doctor: "ڈاکٹر اشفاق عمر",
    navHome: "ہوم", navAbout: "ہمارے بارے میں", navAssess: "کیریئر اسسمنٹ", navProfile: "میری پروفائل",
    courses10: "دسویں کے بعد کورسز", courses12: "بارہویں کے بعد کورسز",
    profileTitle: "طالب علم ڈیش بورڈ", profileSub: "کیریئر اسسمنٹ انلاک کرنے کے لیے اپنی پروفائل مکمل کریں۔",
    step1: "بنیادی تفصیلات", step2: "تعلیمی معلومات", step3: "کیریئر کے اہداف",
    fullName: "پورا نام", phone: "واٹس ایپ / فون نمبر", gender: "جنس", city: "شہر / قصبہ",
    eduLevel: "موجودہ تعلیمی قابلیت", stream: "موجودہ شعبہ (اگر 11ویں/12ویں میں ہیں)", college: "اسکول / کالج کا نام",
    goal: "کیریئر کا ہدف", struggle: "کیریئر کے انتخاب میں آپ کا سب سے بڑا مسئلہ کیا ہے؟",
    saveBtn: "محفوظ کریں", saving: "محفوظ ہو رہا ہے...",
    nextBtn: "اگلا قدم", prevBtn: "پچھلا قدم",
    assessmentCardTitle: "ڈائگنوسٹک کیریئر اسسمنٹ",
    assessmentCardSubLocked: "ٹیسٹ انلاک کرنے کے لیے براہ کرم اپنی پروفائل 100% مکمل کریں۔",
    assessmentCardSubUnlocked: "آپ کی پروفائل مکمل ہے! اب آپ AI کیریئر ٹیسٹ دے سکتے ہیں۔",
    takeTestBtn: "ابھی اسسمنٹ دیں", lockedBtn: "پروفائل نامکمل ہے",
    selectOption: "-- منتخب کریں --"
  }
};

export default function StudentProfile() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Auth & DB States
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // UI States
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    full_name: '', phone: '', gender: '', city: '',
    education_level: '', stream: '', college_name: '',
    career_goal: '', main_struggle: ''
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const checkUserAndFetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login'); // Not logged in? Go to login
        return;
      }
      
      setUser(session.user);

      // Fetch existing profile if any
      const { data: profileData, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        setFormData({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          gender: profileData.gender || '',
          city: profileData.city || '',
          education_level: profileData.education_level || '',
          stream: profileData.stream || '',
          college_name: profileData.college_name || '',
          career_goal: profileData.career_goal || '',
          main_struggle: profileData.main_struggle || ''
        });
        setIsComplete(profileData.is_complete || false);
      }
      
      setLoading(false);
    };

    checkUserAndFetchProfile();
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ur' : 'en');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate Progress %
  const calculateProgress = () => {
    const totalFields = 8; // Excluding 'main_struggle' as optional/extra
    let filledFields = 0;
    if (formData.full_name) filledFields++;
    if (formData.phone) filledFields++;
    if (formData.gender) filledFields++;
    if (formData.city) filledFields++;
    if (formData.education_level) filledFields++;
    if (formData.stream || formData.education_level === '8th' || formData.education_level === '9th' || formData.education_level === '10th') filledFields++; // Stream not mandatory for low classes
    if (formData.college_name) filledFields++;
    if (formData.career_goal) filledFields++;
    
    return Math.min(Math.round((filledFields / totalFields) * 100), 100);
  };

  const progress = calculateProgress();

  const handleSaveProfile = async (e) => {
    if(e) e.preventDefault();
    setSaving(true);

    const isFullyFilled = progress === 100;
    
    const payload = {
      id: user.id,
      email: user.email,
      ...formData,
      is_complete: isFullyFilled
    };

    const { error } = await supabase.from('student_profiles').upsert([payload]);

    setSaving(false);
    
    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      setIsComplete(isFullyFilled);
      if(isFullyFilled) alert("Profile Saved Successfully! You can now take the assessment.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#38bdf8' }}><h2><i className='bx bx-loader-alt bx-spin'></i> Loading Dashboard...</h2></div>;
  }

  return (
    <ErrorBoundary>
      <div style={{
        direction: lang === 'ur' ? 'rtl' : 'ltr',
        fontFamily: lang === 'ur' ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Segoe UI', Roboto, sans-serif",
        backgroundColor: '#0f172a', backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px)`,
        backgroundSize: '30px 30px', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column'
      }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <title>{t[lang].navProfile} | {t[lang].brand}</title>
        </Head>

        {/* --- GLOBAL STYLES --- */}
        <style dangerouslySetInnerHTML={{__html: `
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body, html { overflow-x: hidden; scroll-behavior: smooth; }
          .en-text { font-family: 'Segoe UI', Roboto, sans-serif !important; direction: ltr !important; display: inline-block; }
          
          /* NAVBAR */
          .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; }
          .desktop-menu { display: flex; align-items: center; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
          .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; background: none; border: none; font-family: inherit; }
          .nav-link:hover, .nav-link.active { color: #38bdf8; }
          
          /* LANG TOGGLE */
          .lang-toggle-container { display: flex; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 4px; position: relative; cursor: pointer; width: 80px; height: 36px; direction: ltr !important; }
          .lang-toggle-indicator { position: absolute; top: 4px; left: ${lang === 'en' ? '4px' : '40px'}; width: 34px; height: 26px; background: #38bdf8; border-radius: 14px; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); }
          .lang-label { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; color: #fff; z-index: 1; user-select: none; font-family: 'Segoe UI', sans-serif; }
          
          /* FORMS & CARDS */
          .profile-card { background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(10px); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 35px; margin-bottom: 25px; box-shadow: 0 15px 30px rgba(0,0,0,0.3); width: 100%; max-width: 800px; }
          .input-field { width: 100%; padding: 14px; border-radius: 8px; background: rgba(15,23,42,0.6); border: 1px solid rgba(56,189,248,0.3); color: #fff; font-size: 1rem; margin-top: 5px; outline: none; transition: 0.3s; font-family: inherit; }
          .input-field:focus { border-color: #38bdf8; box-shadow: 0 0 10px rgba(56,189,248,0.2); }
          .form-label { color: #93c5fd; font-size: 0.9rem; font-weight: bold; }
          
          .btn-primary { background: #38bdf8; color: #0f172a; padding: 12px 25px; border: none; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: 0.3s; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; }
          .btn-primary:hover { background: #0284c7; color: #fff; }
          .btn-secondary { background: transparent; color: #94a3b8; border: 1px solid #475569; padding: 12px 25px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; font-family: inherit; }
          .btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }
          
          /* CTA CARD */
          .cta-card { background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); border: 1px solid #10b981; text-align: center; }
          .cta-card.locked { background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05)); border-color: #ef4444; }
          
          .mobile-menu { display: none; flex-direction: column; background: rgba(30, 64, 175, 0.98); position: absolute; width: 100%; top: 70px; left: 0; z-index: 1000; padding: 15px; }
          .mobile-menu.open { display: flex; }
          
          @media (max-width: 1024px) {
            .desktop-menu { display: none; }
          }
        `}} />

        {/* HEADER */}
        <nav>
          <div className="nav-top-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
              <div>
                <h1 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900', fontFamily: "'Segoe UI', sans-serif" }}>{t[lang].brand}</h1>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div className="lang-toggle-container" onClick={toggleLanguage}>
                  <div className="lang-toggle-indicator"></div>
                  <span className="lang-label" style={{ color: lang === 'en' ? '#fff' : '#94a3b8' }}>EN</span>
                  <span className="lang-label" style={{ color: lang === 'ur' ? '#fff' : '#94a3b8' }}>UR</span>
              </div>
              <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }} onClick={handleLogout} title="Logout">
                <i className='bx bx-log-out'></i>
              </button>
              {isMobile && (
                <button style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <i className={isMobileMenuOpen ? 'bx bx-x' : 'bx bx-menu'}></i>
                </button>
              )}
            </div>
          </div>
          <div className="desktop-menu">
              <button className="nav-link" onClick={() => router.push('/')}>{t[lang].navHome}</button>
              <button className="nav-link" onClick={() => router.push('/about')}>{t[lang].navAbout}</button>
              <button className="nav-link active" onClick={() => router.push('/profile')}>{t[lang].navProfile}</button>
          </div>
          {/* MOBILE MENU */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <a onClick={() => router.push('/')} style={{color:'#fff', padding:'10px', textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>{t[lang].navHome}</a>
            <a onClick={() => router.push('/profile')} style={{color:'#38bdf8', padding:'10px', textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>{t[lang].navProfile}</a>
          </div>
        </nav>

        {/* MAIN DASHBOARD CONTENT */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 5%' }}>
          
          <header style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '3rem', color: '#38bdf8', marginBottom: '10px' }}><i className='bx bx-user-circle'></i></div>
            <h1 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '5px', fontFamily: 'inherit' }}>{t[lang].profileTitle}</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontFamily: 'inherit' }}>{t[lang].profileSub}</p>
            <p className="en-text" style={{ background: 'rgba(15,23,42,0.8)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', color: '#10b981', border: '1px solid #334155', marginTop: '10px' }}>
              <i className='bx bx-check-shield'></i> Logged in as: {user?.email}
            </p>
          </header>

          {/* PROGRESS BAR */}
          <div className="profile-card" style={{ padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
               <span style={{ color: '#93c5fd', fontWeight: 'bold' }}>Profile Completion</span>
               <span className="en-text" style={{ color: progress === 100 ? '#10b981' : '#38bdf8', fontWeight: 'bold' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', background: '#1e293b', borderRadius: '10px', height: '10px', direction: 'ltr' }}>
               <div style={{ width: `${progress}%`, background: progress === 100 ? '#10b981' : '#38bdf8', height: '10px', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>

          {/* 3-STEP WIZARD FORM */}
          <form className="profile-card" onSubmit={handleSaveProfile}>
            
            {/* WIZARD TABS */}
            <div style={{ display: 'flex', borderBottom: '1px solid #334155', marginBottom: '25px' }}>
              <button type="button" onClick={()=>setCurrentStep(1)} style={{ flex: 1, padding: '15px', background: currentStep===1 ? 'rgba(56,189,248,0.1)' : 'transparent', color: currentStep===1 ? '#38bdf8' : '#64748b', border: 'none', borderBottom: currentStep===1 ? '2px solid #38bdf8' : 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>1. {t[lang].step1}</button>
              <button type="button" onClick={()=>setCurrentStep(2)} style={{ flex: 1, padding: '15px', background: currentStep===2 ? 'rgba(56,189,248,0.1)' : 'transparent', color: currentStep===2 ? '#38bdf8' : '#64748b', border: 'none', borderBottom: currentStep===2 ? '2px solid #38bdf8' : 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>2. {t[lang].step2}</button>
              <button type="button" onClick={()=>setCurrentStep(3)} style={{ flex: 1, padding: '15px', background: currentStep===3 ? 'rgba(56,189,248,0.1)' : 'transparent', color: currentStep===3 ? '#38bdf8' : '#64748b', border: 'none', borderBottom: currentStep===3 ? '2px solid #38bdf8' : 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>3. {t[lang].step3}</button>
            </div>

            {/* STEP 1: BASIC INFO */}
            {currentStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                 <div>
                   <label className="form-label">{t[lang].fullName} *</label>
                   <input type="text" name="full_name" className="input-field" value={formData.full_name} onChange={handleChange} required />
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                   <div>
                     <label className="form-label">{t[lang].phone} *</label>
                     <input type="tel" name="phone" className="input-field en-text" value={formData.phone} onChange={handleChange} dir="ltr" required />
                   </div>
                   <div>
                     <label className="form-label">{t[lang].gender} *</label>
                     <select name="gender" className="input-field" value={formData.gender} onChange={handleChange} required>
                       <option value="">{t[lang].selectOption}</option><option value="Male">Male</option><option value="Female">Female</option>
                     </select>
                   </div>
                 </div>
                 <div>
                   <label className="form-label">{t[lang].city} *</label>
                   <input type="text" name="city" className="input-field" value={formData.city} onChange={handleChange} required />
                 </div>
              </div>
            )}

            {/* STEP 2: ACADEMIC INFO */}
            {currentStep === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                   <div>
                     <label className="form-label">{t[lang].eduLevel} *</label>
                     <select name="education_level" className="input-field" value={formData.education_level} onChange={handleChange} required>
                       <option value="">{t[lang].selectOption}</option>
                       <option value="8th">8th Std</option><option value="9th">9th Std</option><option value="10th">10th Std</option>
                       <option value="11th">11th Std</option><option value="12th">12th Std</option><option value="Graduate">Graduate</option>
                     </select>
                   </div>
                   <div>
                     <label className="form-label">{t[lang].stream}</label>
                     <select name="stream" className="input-field" value={formData.stream} onChange={handleChange} disabled={['8th', '9th', '10th'].includes(formData.education_level)}>
                       <option value="">{['8th', '9th', '10th'].includes(formData.education_level) ? 'Not Applicable' : t[lang].selectOption}</option>
                       <option value="Science">Science</option><option value="Commerce">Commerce</option><option value="Arts">Arts</option><option value="Polytechnic">Polytechnic</option>
                     </select>
                   </div>
                 </div>
                 <div>
                   <label className="form-label">{t[lang].college} *</label>
                   <input type="text" name="college_name" className="input-field" value={formData.college_name} onChange={handleChange} required />
                 </div>
              </div>
            )}

            {/* STEP 3: CAREER GOALS */}
            {currentStep === 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                 <div>
                   <label className="form-label">{t[lang].goal} *</label>
                   <select name="career_goal" className="input-field" value={formData.career_goal} onChange={handleChange} required>
                     <option value="">{t[lang].selectOption}</option>
                     <option value="Engineering">Engineering / IT</option><option value="Medical">Medical / Pharmacy</option>
                     <option value="Business">Business / CA / Finance</option><option value="Arts">Arts / Design / Law</option>
                     <option value="Govt">Government Jobs / UPSC</option><option value="Undecided">Still Confused / Undecided</option>
                   </select>
                 </div>
                 <div>
                   <label className="form-label">{t[lang].struggle}</label>
                   <textarea name="main_struggle" className="input-field" rows="3" value={formData.main_struggle} onChange={handleChange} placeholder="Optional..."></textarea>
                 </div>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #334155' }}>
              {currentStep > 1 ? (
                <button type="button" className="btn-secondary" onClick={()=>setCurrentStep(currentStep - 1)}><i className='bx bx-left-arrow-alt'></i> {t[lang].prevBtn}</button>
              ) : <div></div>}
              
              {currentStep < 3 ? (
                <button type="button" className="btn-primary" onClick={()=>setCurrentStep(currentStep + 1)}>{t[lang].nextBtn} <i className='bx bx-right-arrow-alt'></i></button>
              ) : (
                <button type="submit" className="btn-primary" style={{ background: '#10b981', color: '#fff' }} disabled={saving}>
                  {saving ? <><i className='bx bx-loader-alt bx-spin'></i> {t[lang].saving}</> : <><i className='bx bx-save'></i> {t[lang].saveBtn}</>}
                </button>
              )}
            </div>
          </form>

          {/* ACTION CTA: TAKE ASSESSMENT */}
          <div className={`profile-card cta-card ${!isComplete ? 'locked' : ''}`} style={{ padding: '40px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '15px', color: isComplete ? '#10b981' : '#ef4444' }}>
              <i className={isComplete ? 'bx bx-rocket' : 'bx bxs-lock'}></i>
            </div>
            <h2 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.8rem', fontFamily: 'inherit' }}>{t[lang].assessmentCardTitle}</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '30px', fontSize: '1.1rem', fontFamily: 'inherit' }}>
              {isComplete ? t[lang].assessmentCardSubUnlocked : t[lang].assessmentCardSubLocked}
            </p>
            
            {isComplete ? (
               <button onClick={() => router.push('/assessment')} style={{ background: '#10b981', color: '#fff', padding: '15px 40px', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', border: 'none', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)', transition: '0.3s', fontFamily: 'inherit' }}>
                 {t[lang].takeTestBtn} <i className='bx bx-right-arrow-alt'></i>
               </button>
            ) : (
               <button disabled style={{ background: 'transparent', color: '#ef4444', border: '2px solid #ef4444', padding: '15px 40px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'not-allowed', fontFamily: 'inherit', opacity: 0.7 }}>
                 {t[lang].lockedBtn}
               </button>
            )}
          </div>

        </main>
      </div>
    </ErrorBoundary>
  );
}
