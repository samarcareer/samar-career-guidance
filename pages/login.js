import { useState, useRef, useEffect } from 'react';
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
    
    // Auth Specific
    regTitle: "Student Registration",
    regSub: "Create your secure profile to begin your career assessment.",
    loginTitle: "Student Login",
    loginSub: "Enter your registered email to receive a secure OTP.",
    fullName: "Full Name",
    mobile: "Mobile Number",
    email: "Email Address",
    education: "Current Education Level",
    state: "Location (State)",
    city: "City",
    sendOtp: "Send Secure OTP",
    registerBtn: "Register & Send OTP",
    switchToLogin: "Already registered? Login here",
    switchToReg: "New student? Create an account",
    verifyTitle: "Verify Identity",
    verifySub: "Please enter the 6-digit verification code to continue.",
    verifyBtn: "Verify Identity",
    editDetails: "Go Back",
    photoOpt: "Profile Photo (Optional)",
    processing: "Processing...",
    verifying: "Verifying...",
    successReg: "Registration Data Saved! OTP sent to ",
    successLogin: "Secure OTP sent to ",
    errorNotFound: "Account not found. Please register first."
  },
  ur: {
    brand: "ثمر گائیڈنس",
    doctor: "ڈاکٹر اشفاق عمر",
    searchPlaceholder: "تلاش کریں...",
    studentLogin: "طالب علم لاگ ان",
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
    
    // Auth Specific
    regTitle: "طالب علم کی رجسٹریشن",
    regSub: "اپنا کیریئر اسسمنٹ شروع کرنے کے لیے پروفائل بنائیں۔",
    loginTitle: "طالب علم لاگ ان",
    loginSub: "محفوظ OTP حاصل کرنے کے لیے اپنا رجسٹرڈ ای میل درج کریں۔",
    fullName: "پورا نام",
    mobile: "موبائل نمبر",
    email: "ای میل ایڈریس",
    education: "موجودہ تعلیمی قابلیت",
    state: "ریاست",
    city: "شہر",
    sendOtp: "OTP بھیجیں",
    registerBtn: "رجسٹر کریں اور OTP بھیجیں",
    switchToLogin: "پہلے سے رجسٹرڈ ہیں؟ لاگ ان کریں",
    switchToReg: "نئے طالب علم ہیں؟ اکاؤنٹ بنائیں",
    verifyTitle: "شناخت کی تصدیق کریں",
    verifySub: "براہ کرم جاری رکھنے کے لیے 6 ہندسوں کا کوڈ درج کریں۔",
    verifyBtn: "تصدیق کریں",
    editDetails: "پیچھے جائیں",
    photoOpt: "پروفائل تصویر (اختیاری)",
    processing: "پراسیس ہو رہا ہے...",
    verifying: "تصدیق ہو رہی ہے...",
    successReg: "ڈیٹا محفوظ ہو گیا! OTP بھیج دیا گیا: ",
    successLogin: "محفوظ OTP بھیج دیا گیا: ",
    errorNotFound: "اکاؤنٹ نہیں ملا۔ براہ کرم پہلے رجسٹر کریں۔"
  }
};

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function StudentAuth() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  
  // --- Navbar States ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [session, setSession] = useState(null);

  // --- Auth States ---
  const [isLoginMode, setIsLoginMode] = useState(true); // Default to Login
  const [step, setStep] = useState(1); 
  const [otp, setOtp] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '', mobile: '', email: '', education: '', state: '', city: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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
  
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePhotoClick = () => fileInputRef.current.click();
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
  };

  // --- STEP 1: AUTHENTICATE (LOGIN OR REGISTER) ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');

    const cleanEmail = formData.email.trim().toLowerCase();

    try {
      if (isLoginMode) {
        // LOGIN MODE: shouldCreateUser: false ensures only existing users can login
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: { shouldCreateUser: false } 
        });

        if (otpError) {
          if (otpError.message.includes('Signups not allowed')) throw new Error(t[lang].errorNotFound);
          throw otpError;
        }
        setMessage(t[lang].successLogin + cleanEmail);
      } else {
        // REGISTER MODE: Send metadata
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            data: { full_name: formData.fullName, phone: formData.mobile, education: formData.education, state: formData.state, city: formData.city }
          }
        });
        if (otpError) throw otpError;
        setMessage(t[lang].successReg + cleanEmail);
      }
      setStep(2); // Move to OTP verification
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true); setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: formData.email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'email'
      });

      if (error) throw error;
      if (data?.session) router.push('/assessment'); // Success!
    } catch (err) {
      setError("Invalid or expired OTP. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
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
        <title>{t[lang].studentLogin} | {t[lang].brand}</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }

        /* --- NAVBAR STYLES (Copied from Home) --- */
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
          .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; align-items: flex-start; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); border-bottom: 1px solid rgba(56,189,248,0.3); padding: 20px 5%; gap: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .mobile-toggle { display: block; }
          .nav-dropdown-menu { position: static; box-shadow: none; border: none; background: rgba(0,0,0,0.2); margin-top: 10px; width: 100%; display: ${showGuidanceDropdown ? 'flex' : 'none'}; opacity: 1; visibility: visible; transform: none; }
          [dir="rtl"] .nav-dropdown-menu { text-align: right; }
          .nav-link { width: 100%; text-align: left; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          [dir="rtl"] .nav-link { text-align: right; }
          .nav-link::after { display: none; }
        }

        /* --- AUTH FORM STYLES --- */
        .login-main { flex: 1; display: flex; justify-content: center; align-items: center; padding: 60px 5%; width: 100%; }
        .auth-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); width: 100%; max-width: 600px; backdrop-filter: blur(10px); }
        
        .photo-upload-wrapper { display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; }
        .photo-circle { width: 110px; height: 110px; border-radius: 50%; border: 2px dashed #38bdf8; background: rgba(56, 189, 248, 0.05); display: flex; justify-content: center; align-items: center; cursor: pointer; position: relative; overflow: hidden; transition: 0.3s; box-shadow: 0 10px 25px rgba(56, 189, 248, 0.2); }
        .photo-circle:hover { background: rgba(56, 189, 248, 0.15); transform: scale(1.05); }
        .camera-icon { font-size: 2.5rem; color: #38bdf8; transition: 0.3s; }
        .photo-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; opacity: 0; transition: 0.3s; }
        .photo-circle:hover .photo-overlay { opacity: 1; }
        .photo-preview-img { width: 100%; height: 100%; object-fit: cover; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .input-group { margin-bottom: 20px; text-align: left; }
        [dir="rtl"] .input-group { text-align: right; }
        .input-group.full-width { grid-column: span 2; }
        .input-group label { display: block; color: #93c5fd; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; font-family: inherit; }
        .input-group input, .input-group select { width: 100%; padding: 14px 18px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.6); color: #fff; font-size: 1rem; outline: none; transition: 0.3s; font-family: inherit; }
        .input-group select option { background: #0f172a; color: #fff; }
        .input-group input:focus, .input-group select:focus { border-color: #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }

        .btn-primary { background: #3b82f6; color: #fff; padding: 16px 25px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1.1rem; width: 100%; transition: 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px; grid-column: span 2; margin-top: 10px; font-family: inherit; }
        .btn-primary:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
        .btn-primary:disabled { background: #64748b; cursor: not-allowed; }
        
        .alert-box { padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 500; display: flex; align-items: center; gap: 8px; text-align: left; font-family: inherit;}
        [dir="rtl"] .alert-box { text-align: right; }
        .alert-error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; }
        .alert-success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #6ee7b7; }
        
        .back-link { background: none; border: none; color: #94a3b8; font-size: 0.9rem; margin-top: 20px; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; gap: 5px; width: 100%; justify-content: center; font-family: inherit; }
        .back-link:hover { color: #38bdf8; }

        @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } .input-group.full-width { grid-column: span 1; } .btn-primary { grid-column: span 1; } }
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
                <button onClick={() => router.push('/profile')} className="auth-icon-btn profile-btn"><i className='bx bx-user-circle'></i></button>
                <button onClick={handleLogout} className="auth-icon-btn logout-btn"><i className='bx bx-log-out'></i></button>
              </>
            ) : null}
            
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

      {/* --- FORM SECTION --- */}
      <main className="login-main">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '8px', fontFamily: 'inherit' }}>
              {step === 1 ? (isLoginMode ? t[lang].loginTitle : t[lang].regTitle) : t[lang].verifyTitle}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontFamily: 'inherit' }}>
              {step === 1 ? (isLoginMode ? t[lang].loginSub : t[lang].regSub) : t[lang].verifySub}
            </p>
          </div>

          {error && <div className="alert-box alert-error"><i className='bx bx-error-circle'></i> {error}</div>}
          {message && <div className="alert-box alert-success"><i className='bx bx-check-circle'></i> {message}</div>}

          {step === 1 ? (
            <form onSubmit={handleAuthSubmit} className={isLoginMode ? "" : "form-grid"}>
              
              {!isLoginMode && (
                <>
                  <div className="photo-upload-wrapper full-width">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} style={{ display: 'none' }} />
                    <div className="photo-circle" onClick={handlePhotoClick}>
                      {photoPreview ? (
                        <><img src={photoPreview} alt="Profile" className="photo-preview-img" /><div className="photo-overlay"><i className='bx bx-pencil camera-icon' style={{ color: '#fff' }}></i></div></>
                      ) : <i className='bx bx-camera camera-icon'></i>}
                    </div>
                    <small style={{ color: '#94a3b8', fontFamily: 'inherit' }}>{t[lang].photoOpt}</small>
                  </div>

                  <div className="input-group full-width">
                    <label><i className='bx bx-user'></i> {t[lang].fullName}</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                  </div>

                  <div className="input-group">
                    <label><i className='bx bx-phone'></i> {t[lang].mobile}</label>
                    <input type="tel" name="mobile" pattern="[0-9]{10}" value={formData.mobile} onChange={handleInputChange} required />
                  </div>
                </>
              )}

              <div className={`input-group ${!isLoginMode ? '' : 'full-width'}`}>
                <label><i className='bx bx-envelope'></i> {t[lang].email}</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>

              {!isLoginMode && (
                <>
                  <div className="input-group full-width">
                    <label><i className='bx bxs-graduation'></i> {t[lang].education}</label>
                    <select name="education" value={formData.education} onChange={handleInputChange} required>
                      <option value="" disabled></option>
                      <option value="10th">10th Standard / SSC</option>
                      <option value="12th">12th Standard / HSC</option>
                      <option value="Undergraduate">Undergraduate (Degree/Diploma)</option>
                      <option value="Postgraduate">Postgraduate (Master's)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label><i className='bx bx-map-alt'></i> {t[lang].state}</label>
                    <select name="state" value={formData.state} onChange={handleInputChange} required>
                      <option value="" disabled></option>
                      {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>

                  <div className="input-group">
                    <label><i className='bx bx-buildings'></i> {t[lang].city}</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                </>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <i className='bx bx-loader-alt bx-spin'></i> : <i className={isLoginMode ? 'bx bx-log-in-circle' : 'bx bx-user-plus'}></i>}
                {loading ? t[lang].processing : (isLoginMode ? t[lang].sendOtp : t[lang].registerBtn)}
              </button>

              <button type="button" className="back-link" onClick={() => { setIsLoginMode(!isLoginMode); setError(''); setMessage(''); }}>
                <i className='bx bx-transfer-alt'></i> {isLoginMode ? t[lang].switchToReg : t[lang].switchToLogin}
              </button>
            </form>
          ) : (
            /* --- OTP STEP --- */
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="input-group full-width" style={{ width: '100%', maxWidth: '400px' }}>
                <label style={{ textAlign: 'center' }}><i className='bx bx-dialpad-alt'></i> 6-Digit OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="• • • • • •" maxLength={6} required style={{ letterSpacing: '12px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', direction: 'ltr' }} />
              </div>

              <button type="submit" className="btn-primary" disabled={loading || otp.length < 6} style={{ maxWidth: '400px' }}>
                {loading ? <i className='bx bx-loader-alt bx-spin'></i> : <i className='bx bx-lock-open-alt'></i>}
                {loading ? t[lang].verifying : t[lang].verifyBtn}
              </button>

              <button type="button" className="back-link" onClick={() => { setStep(1); setOtp(''); setMessage(''); setError(''); }}>
                <i className='bx bx-edit-alt'></i> {t[lang].editDetails}
              </button>
            </form>
          )}

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer style={{ width: '100%', background: 'rgba(30, 64, 175, 0.6)', backdropFilter: 'blur(16px)', padding: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#bfdbfe', fontWeight: '700', marginTop: 'auto', position: 'relative', fontFamily: 'inherit' }}>
        {t[lang].footer}
        <i className='bx bxs-shield-alt-2' onClick={() => router.push('/admin')} style={{ position: 'absolute', right: lang === 'ur' ? 'auto' : '20px', left: lang === 'ur' ? '20px' : 'auto', bottom: '20px', cursor: 'pointer', opacity: 0.3, fontSize: '1.2rem', transition: '0.3s' }} title="Security Protected"></i>
      </footer>
    </div>
  );
}
