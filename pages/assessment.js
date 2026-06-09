import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- TRANSLATION DICTIONARY ---
const t = {
  en: {
    brand: "Samar Guidance", doctor: "Dr. Ashfaque Umar",
    navHome: "Home", navAbout: "About Us", navCareer: "Career Guidance", navAssess: "Career Assessment",
    courses10: "Courses After 10th", courses12: "Courses After 12th",
    introTitle: "Discover Your True Potential",
    introSub: "We won't test your memory. We will test your personality, problem-solving skills, and behavioral traits to suggest the absolute best career path for you.",
    startBtn: "Start Assessment",
    noQuestions: "No questions available right now. Please contact the administrator.",
    qOf: "Question", of: "of",
    analyzing: "Analyzing Your Responses...",
    leadSub: "Your career profile is ready! Enter your email to unlock your AI-calculated target stream and send the report to our counselors.",
    unlockBtn: "Unlock My Result",
    unlocking: "Unlocking...",
    completeTitle: "Assessment Complete!",
    completeSub: "Based on your behavioral and logical mapping, your strongest aptitude aligns with:",
    exploreBtn: "Explore Courses",
    emailPlaceholder: "Enter your Email ID"
  },
  ur: {
    brand: "ثمر گائیڈنس", doctor: "ڈاکٹر اشفاق عمر",
    navHome: "ہوم", navAbout: "ہمارے بارے میں", navCareer: "کیریئر گائیڈنس", navAssess: "کیریئر اسسمنٹ",
    courses10: "دسویں کے بعد کورسز", courses12: "بارہویں کے بعد کورسز",
    introTitle: "اپنی اصل صلاحیتوں کو پہچانیں",
    introSub: "ہم آپ کی یادداشت کا امتحان نہیں لیں گے۔ ہم آپ کی شخصیت، مسائل حل کرنے کی مہارت اور رویے کا جائزہ لیں گے تاکہ آپ کے لیے بہترین کیریئر تجویز کر سکیں۔",
    startBtn: "اسسمنٹ شروع کریں",
    noQuestions: "ابھی کوئی سوال دستیاب نہیں ہے۔ براہ کرم ایڈمنسٹریٹر سے رابطہ کریں۔",
    qOf: "سوال", of: "میں سے",
    analyzing: "آپ کے جوابات کا تجزیہ کیا جا رہا ہے...",
    leadSub: "آپ کی کیریئر پروفائل تیار ہے! اپنی AI سے تجویز کردہ فیلڈ جاننے کے لیے اپنا ای میل درج کریں۔",
    unlockBtn: "میرا نتیجہ دکھائیں",
    unlocking: "کھل رہا ہے...",
    completeTitle: "اسسمنٹ مکمل ہو گیا!",
    completeSub: "آپ کے رویے اور منطقی جوابات کی بنیاد پر، آپ کے لیے سب سے موزوں شعبہ یہ ہے:",
    exploreBtn: "کورسز دریافت کریں",
    emailPlaceholder: "اپنا ای میل درج کریں"
  }
};

export default function CareerAssessment() {
  const router = useRouter();
  
  // Layout States
  const [lang, setLang] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Assessment States
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); 
  const [answers, setAnswers] = useState([]); 
  
  // Lead Data States
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedStream, setCalculatedStream] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('diagnostic_questions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (data) setQuestions(data);
      if (error) console.error("Error fetching questions:", error);
      setLoading(false);
    };
    fetchQuestions();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ur' : 'en');

  const handleOptionSelect = (selectedStream) => {
    const newAnswers = [...answers, selectedStream];
    setAnswers(newAnswers);
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const streamCounts = answers.reduce((acc, stream) => {
      acc[stream] = (acc[stream] || 0) + 1;
      return acc;
    }, {});

    const targetStream = Object.keys(streamCounts).reduce((a, b) => streamCounts[a] > streamCounts[b] ? a : b);
    setCalculatedStream(targetStream);

    const { error } = await supabase.from('user_assessments').insert([{
      email: email,
      interest_area: targetStream,
      preferred_language: lang,
      status: 'Completed'
    }]);

    setIsSubmitting(false);

    if (error) {
      alert("Something went wrong! Please try again.");
      console.error(error);
    } else {
      setCurrentStep(questions.length + 2);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#38bdf8' }}>
        <h2><i className='bx bx-loader-alt bx-spin'></i> Loading Assessment...</h2>
      </div>
    );
  }

  return (
    <div style={{
      direction: lang === 'ur' ? 'rtl' : 'ltr',
      fontFamily: lang === 'ur' ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a', backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.1) 1px, #0f172a 1px)`,
      backgroundSize: '30px 30px', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column', width: '100vw', maxWidth: '100%', overflowX: 'hidden', margin: 0, padding: 0
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet" />
        <title>{t[lang].navAssess} | {t[lang].brand}</title>
      </Head>

      {/* GLOBAL THEME STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }
        .en-text { font-family: 'Segoe UI', Roboto, sans-serif !important; direction: ltr !important; display: inline-block; }
        .glass-navbar { width: 100%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; display: flex; flex-direction: column; }
        .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; border-bottom: 1px solid rgba(147, 197, 253, 0.1); }
        .nav-brand-container { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .desktop-menu { display: flex; align-items: center; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
        .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; position: relative; background: none; border: none; padding: 5px 0; white-space: nowrap; font-family: inherit; }
        .nav-link:hover, .nav-link.active { color: #38bdf8; }
        .nav-dropdown-container { position: relative; }
        .nav-dropdown-menu { position: absolute; top: 100%; left: 0; background: rgba(30, 64, 175, 0.95); backdrop-filter: blur(16px); border: 1px solid rgba(147, 197, 253, 0.2); border-radius: 8px; min-width: 260px; box-shadow: 0 15px 30px rgba(0,0,0,0.6); padding: 10px 0; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s ease; z-index: 200; }
        .nav-dropdown-container:hover .nav-dropdown-menu, .nav-dropdown-menu.active { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-item { padding: 12px 20px; color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left; background: transparent; border-left: none; border-right: none; border-top: none; width: 100%; cursor: pointer; font-family: inherit; }
        .dropdown-item:hover { background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding-left: 25px; }
        .lang-toggle-container { display: flex; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 4px; position: relative; cursor: pointer; width: 80px; height: 36px; direction: ltr !important; }
        .lang-toggle-indicator { position: absolute; top: 4px; left: ${lang === 'en' ? '4px' : '40px'}; width: 34px; height: 26px; background: #38bdf8; border-radius: 14px; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); }
        .lang-label { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; color: #fff; z-index: 1; user-select: none; font-family: 'Segoe UI', sans-serif; }
        .mobile-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 2rem; cursor: pointer; }
        @media (max-width: 1024px) {
          .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); padding: 20px 5%; gap: 15px; z-index: 999; }
          .mobile-toggle { display: block; }
        }
      `}} />

      {/* HEADER NAVBAR */}
      <nav className="glass-navbar">
        <div className="nav-top-row">
          <div className="nav-brand-container" onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '900', fontFamily: "'Segoe UI', sans-serif" }}>{t[lang].brand}</h1>
              <small style={{ color: '#93c5fd', fontWeight: 'bold', display: 'block', fontFamily: "'Segoe UI', sans-serif" }}>{t[lang].doctor}</small>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="lang-toggle-container" onClick={toggleLanguage} title="Switch Language">
                <div className="lang-toggle-indicator"></div>
                <span className="lang-label" style={{ color: lang === 'en' ? '#fff' : '#94a3b8' }}>EN</span>
                <span className="lang-label" style={{ color: lang === 'ur' ? '#fff' : '#94a3b8' }}>UR</span>
            </div>
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <i className='bx bx-x'></i> : <i className='bx bx-menu'></i>}
            </button>
          </div>
        </div>
        <div className="desktop-menu">
            <button className="nav-link" onClick={() => router.push('/')}>{t[lang].navHome}</button>
            <button className="nav-link" onClick={() => router.push('/about')}>{t[lang].navAbout}</button>
            <div className="nav-dropdown-container" onMouseEnter={() => !isMobile && setShowGuidanceDropdown(true)} onMouseLeave={() => !isMobile && setShowGuidanceDropdown(false)}>
                <button className="nav-link" onClick={() => isMobile && setShowGuidanceDropdown(!showGuidanceDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {t[lang].navCareer} <i className='bx bx-chevron-down'></i>
                </button>
                <div className={`nav-dropdown-menu ${showGuidanceDropdown ? 'active' : ''}`}>
                    <button className="dropdown-item" onClick={() => router.push('/categories?search=10th')}>{t[lang].courses10}</button>
                    <button className="dropdown-item" onClick={() => router.push('/categories?search=12th')}>{t[lang].courses12}</button>
                </div>
            </div>
            <button className="nav-link active" onClick={() => router.push('/assessment')}>{t[lang].navAssess}</button>
        </div>
      </nav>

      {/* MAIN ASSESSMENT CONTENT */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(56,189,248,0.3)',
          borderRadius: '16px',
          padding: '40px',
          width: '100%',
          maxWidth: '650px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          
          {/* STEP 0: INTRODUCTION */}
          {currentStep === 0 && (
            <div>
              <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🚀</div>
              <h1 style={{ color: '#fff', marginBottom: '15px', fontSize: '2rem', fontFamily: 'inherit' }}>{t[lang].introTitle}</h1>
              <p style={{ color: '#94a3b8', marginBottom: '35px', lineHeight: '1.6', fontSize: '1.1rem', fontFamily: 'inherit' }}>
                {t[lang].introSub}
              </p>
              {questions.length > 0 ? (
                <button 
                  onClick={() => setCurrentStep(1)}
                  style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '16px 45px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', fontFamily: 'inherit' }}
                >
                  {t[lang].startBtn}
                </button>
              ) : (
                <p style={{ color: '#ef4444', fontFamily: 'inherit' }}>{t[lang].noQuestions}</p>
              )}
            </div>
          )}

          {/* STEP 1 to N: GAMIFIED QUESTIONS */}
          {currentStep > 0 && currentStep <= questions.length && (
            <div>
              {/* Progress Bar */}
              <div style={{ width: '100%', background: '#1e293b', borderRadius: '10px', height: '8px', marginBottom: '30px', direction: 'ltr' }}>
                <div style={{ width: `${(currentStep / questions.length) * 100}%`, background: '#38bdf8', height: '8px', borderRadius: '10px', transition: 'width 0.3s ease' }}></div>
              </div>
              
              <h4 style={{ color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                {t[lang].qOf} {currentStep} {t[lang].of} {questions.length}
              </h4>
              <h2 style={{ color: '#fff', marginBottom: '35px', fontSize: '1.6rem', lineHeight: '1.5', fontFamily: 'inherit' }}>
                {lang === 'ur' ? questions[currentStep - 1].q_text_ur : questions[currentStep - 1].q_text_en}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Render the 4 dynamic options based on language */}
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleOptionSelect(questions[currentStep - 1][`opt${num}_stream`])}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#e2e8f0', padding: '18px 25px', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: lang === 'ur' ? 'right' : 'left', fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; e.currentTarget.style.borderColor = '#38bdf8'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)'; e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'; }}
                  >
                    {lang === 'ur' ? questions[currentStep - 1][`opt${num}_ur`] : questions[currentStep - 1][`opt${num}_en`]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP N+1: LEAD CAPTURE (Gated Content) */}
          {currentStep === questions.length + 1 && (
            <div>
               <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🔒</div>
               <h2 style={{ color: '#fff', marginBottom: '15px', fontFamily: 'inherit' }}>{t[lang].analyzing}</h2>
               <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '1.1rem', fontFamily: 'inherit' }}>
                 {t[lang].leadSub}
               </p>
               
               <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <input 
                    type="email" 
                    placeholder={t[lang].emailPlaceholder} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    dir="ltr"
                    style={{ padding: '16px', borderRadius: '8px', border: '1px solid #38bdf8', background: '#0f172a', color: '#fff', fontSize: '1.1rem', textAlign: 'center', fontFamily: "'Segoe UI', sans-serif" }}
                  />
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ background: '#10b981', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {isSubmitting ? <><i className='bx bx-loader-alt bx-spin'></i> {t[lang].unlocking}</> : t[lang].unlockBtn}
                  </button>
               </form>
            </div>
          )}

          {/* STEP N+2: FINAL RESULT & CTA */}
          {currentStep === questions.length + 2 && (
            <div>
              <div style={{ fontSize: '4.5rem', marginBottom: '15px', color: '#10b981' }}>🎯</div>
              <h2 style={{ color: '#fff', marginBottom: '15px', fontFamily: 'inherit' }}>{t[lang].completeTitle}</h2>
              <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '1.1rem', fontFamily: 'inherit' }}>{t[lang].completeSub}</p>
              
              <div style={{ background: 'rgba(56,189,248,0.1)', border: '1px dashed #38bdf8', borderRadius: '12px', padding: '25px', marginBottom: '35px' }}>
                 <h1 className="en-text" style={{ color: '#38bdf8', textTransform: 'uppercase', margin: 0, fontSize: '2rem', letterSpacing: '2px' }}>{calculatedStream}</h1>
              </div>

              <button 
                onClick={() => router.push(`/categories?search=${calculatedStream}`)}
                style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '15px 35px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {t[lang].exploreBtn} {calculatedStream}
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
