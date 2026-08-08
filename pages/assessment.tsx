import React, { useState, useEffect, Component, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

// --- STRICT TS INTERFACES ---
type Lang = 'en' | 'ur';

interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

interface Question {
  id: number;
  q_text_en: string; q_text_ur: string;
  opt1_en: string; opt1_ur: string; opt1_stream: string;
  opt2_en: string; opt2_ur: string; opt2_stream: string;
  opt3_en: string; opt3_ur: string; opt3_stream: string;
  opt4_en: string; opt4_ur: string; opt4_stream: string;
}

interface AnswerLog {
  question_en: string;
  selected_stream: string;
}

// --- ERROR BOUNDARY ---
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{color:'white', background:'#0f172a', padding:'50px', textAlign:'center'}}>Assessment Engine Error. Please refresh.</div>;
    return this.props.children;
  }
}

// --- TRANSLATION DICTIONARY ---
const t: Record<Lang, Record<string, string>> = {
  en: { brand: "Samar Guidance", doctor: "Dr. Ashfaque Umar", navHome: "Home", navAbout: "About Us", navCareer: "Career Guidance", navAssess: "Career Assessment", courses10: "Courses After 10th", courses12: "Courses After 12th", introTitle: "Discover Your True Potential", introSub: "We won't test your memory. We will test your personality, problem-solving skills, and behavioral traits to suggest the absolute best career path for you.", startBtn: "Start Assessment", noQuestions: "No questions available right now. Please contact the administrator.", qOf: "Question", of: "of", analyzing: "Analyzing Your Responses...", leadSub: "Your career profile is ready! Click below to unlock your AI-calculated target stream securely.", unlockBtn: "Unlock My Result", unlocking: "Unlocking...", completeTitle: "Assessment Complete!", completeSub: "Based on your behavioral and logical mapping, your strongest aptitude aligns with:", exploreBtn: "Explore Courses" },
  ur: { brand: "ثمر گائیڈنس", doctor: "ڈاکٹر اشفاق عمر", navHome: "ہوم", navAbout: "ہمارے بارے میں", navCareer: "کیریئر گائیڈنس", navAssess: "کیریئر اسسمنٹ", courses10: "دسویں کے بعد کورسز", courses12: "بارہویں کے بعد کورسز", introTitle: "اپنی اصل صلاحیتوں کو پہچانیں", introSub: "ہم آپ کی یادداشت کا امتحان نہیں لیں گے۔ ہم آپ کی شخصیت اور رویے کا جائزہ لیں گے تاکہ بہترین کیریئر تجویز کر سکیں۔", startBtn: "اسسمنٹ شروع کریں", noQuestions: "ابھی کوئی سوال دستیاب نہیں ہے۔ ایڈمنسٹریٹر سے رابطہ کریں۔", qOf: "سوال", of: "میں سے", analyzing: "آپ کے جوابات کا تجزیہ کیا جا رہا ہے...", leadSub: "آپ کی کیریئر پروفائل تیار ہے! اپنی AI فیلڈ جاننے کے لیے نیچے کلک کریں۔", unlockBtn: "میرا نتیجہ دکھائیں", unlocking: "کھل رہا ہے...", completeTitle: "اسسمنٹ مکمل ہو گیا!", completeSub: "آپ کے جوابات کی بنیاد پر، آپ کے لیے سب سے موزوں شعبہ یہ ہے:", exploreBtn: "کورسز دریافت کریں" }
};

export default function CareerAssessment() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0); 
  const [answers, setAnswers] = useState<string[]>([]); 
  const [answersLog, setAnswersLog] = useState<AnswerLog[]>([]); // 🔴 NEW: Detailed JSON Tracking
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [calculatedStream, setCalculatedStream] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); window.addEventListener('resize', handleResize);

    const initEngine = async () => {
      try {
        // 1. Secure Edge Verification
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/login'); return; }
        setUser(session.user);

        // 2. Fetch Active Questions
        const { data, error } = await supabase.from('diagnostic_questions').select('*').eq('is_active', true).order('created_at', { ascending: true });
        if (error) throw error;
        if (data) setQuestions(data as Question[]);
      } catch (err: any) {
        console.error("Engine Initialization Error:", err);
      } finally {
        setLoading(false);
      }
    };
    initEngine();
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ur' : 'en');

  const handleOptionSelect = (selectedStream: string, questionTextEn: string) => {
    setAnswers([...answers, selectedStream]);
    
    // 🔴 Log detailed answer for Counselor Review (Rule 4: Data Integrity)
    setAnswersLog([...answersLog, { question_en: questionTextEn, selected_stream: selectedStream }]);

    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg('');

    // Calculate Result
    const streamCounts = answers.reduce((acc: Record<string, number>, stream: string) => {
      acc[stream] = (acc[stream] || 0) + 1; return acc;
    }, {});

    const targetStream = Object.keys(streamCounts).reduce((a, b) => streamCounts[a] > streamCounts[b] ? a : b);
    setCalculatedStream(targetStream);

    try {
      // 🔴 Zero-Trust Secure Payload (No manual email input)
      const payload = {
        email: user.email,
        interest_area: targetStream,
        preferred_language: lang,
        answers_log: answersLog, // Pushing the JSON tracking array
        status: 'Completed'
      };

      const { error } = await supabase.from('user_assessments').insert([payload]);
      if (error) throw error;
      
      setCurrentStep(questions.length + 2);
    } catch (err: any) {
      setErrorMsg("Failed to securely lock results. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#38bdf8' }}><h2><i className='bx bx-loader-alt bx-spin'></i> Booting Assessment Engine...</h2></div>;

  return (
    <ErrorBoundary>
      <div style={{ direction: lang === 'ur' ? 'rtl' : 'ltr', fontFamily: lang === 'ur' ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Segoe UI', Roboto, sans-serif", backgroundColor: '#0f172a', backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px)`, backgroundSize: '30px 30px', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <title>{t[lang].navAssess} | {t[lang].brand}</title>
        </Head>

        <style dangerouslySetInnerHTML={{__html: `
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; }
          .desktop-menu { display: flex; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
          .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; cursor: pointer; background: none; border: none; font-family: inherit; }
          .en-text { font-family: 'Segoe UI', Roboto, sans-serif !important; direction: ltr !important; display: inline-block; }
          .lang-toggle-container { display: flex; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 4px; position: relative; cursor: pointer; width: 80px; height: 36px; direction: ltr !important; }
          .lang-toggle-indicator { position: absolute; top: 4px; left: ${lang === 'en' ? '4px' : '40px'}; width: 34px; height: 26px; background: #38bdf8; border-radius: 14px; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); }
          .lang-label { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; color: #fff; z-index: 1; user-select: none; font-family: 'Segoe UI', sans-serif; }
          .btn-primary { background: #38bdf8; color: #0f172a; padding: 16px 45px; border: none; border-radius: 30px; font-weight: bold; cursor: pointer; transition: 0.3s; font-size: 1.1rem; font-family: inherit; }
          .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4); }
          .btn-primary:disabled { background: #475569; color: #cbd5e1; cursor: not-allowed; }
        `}} />

        <nav>
          <div className="nav-top-row">
            <h1 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900', cursor:'pointer' }} onClick={() => router.push('/')}>{t[lang].brand}</h1>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div className="lang-toggle-container" onClick={toggleLanguage}>
                  <div className="lang-toggle-indicator"></div>
                  <span className="lang-label" style={{ color: lang === 'en' ? '#fff' : '#94a3b8' }}>EN</span>
                  <span className="lang-label" style={{ color: lang === 'ur' ? '#fff' : '#94a3b8' }}>UR</span>
              </div>
            </div>
          </div>
        </nav>

        <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '650px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', textAlign: 'center' }}>
            
            {/* STEP 0: INTRODUCTION */}
            {currentStep === 0 && (
              <div>
                <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🚀</div>
                <h1 style={{ color: '#fff', marginBottom: '15px', fontSize: '2rem', fontFamily: 'inherit' }}>{t[lang].introTitle}</h1>
                <p style={{ color: '#94a3b8', marginBottom: '35px', lineHeight: '1.6', fontSize: '1.1rem', fontFamily: 'inherit' }}>{t[lang].introSub}</p>
                {questions.length > 0 ? (
                  <button onClick={() => setCurrentStep(1)} className="btn-primary">{t[lang].startBtn}</button>
                ) : (
                  <p style={{ color: '#ef4444', fontFamily: 'inherit' }}>{t[lang].noQuestions}</p>
                )}
              </div>
            )}

            {/* STEP 1 to N: GAMIFIED QUESTIONS */}
            {currentStep > 0 && currentStep <= questions.length && (
              <div>
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
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleOptionSelect(questions[currentStep - 1][`opt${num}_stream` as keyof Question] as string, questions[currentStep - 1].q_text_en)}
                      style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#e2e8f0', padding: '18px 25px', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: lang === 'ur' ? 'right' : 'left', fontFamily: 'inherit' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; e.currentTarget.style.borderColor = '#38bdf8'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)'; e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'; }}
                    >
                      {lang === 'ur' ? questions[currentStep - 1][`opt${num}_ur` as keyof Question] : questions[currentStep - 1][`opt${num}_en` as keyof Question]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP N+1: SECURE LEAD LOCK */}
            {currentStep === questions.length + 1 && (
              <div>
                 <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🔒</div>
                 <h2 style={{ color: '#fff', marginBottom: '15px', fontFamily: 'inherit' }}>{t[lang].analyzing}</h2>
                 <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '1.1rem', fontFamily: 'inherit' }}>{t[lang].leadSub}</p>
                 {errorMsg && <p style={{ color: '#ef4444', marginBottom: '15px' }}><i className='bx bx-error-circle'></i> {errorMsg}</p>}
                 
                 <button onClick={handleFinalSubmit} disabled={isSubmitting} className="btn-primary" style={{ background: '#10b981', color: '#fff', width: '100%' }}>
                   {isSubmitting ? <><i className='bx bx-loader-alt bx-spin'></i> {t[lang].unlocking}</> : t[lang].unlockBtn}
                 </button>
              </div>
            )}

            {/* STEP N+2: FINAL RESULT */}
            {currentStep === questions.length + 2 && (
              <div>
                <div style={{ fontSize: '4.5rem', marginBottom: '15px', color: '#10b981' }}>🎯</div>
                <h2 style={{ color: '#fff', marginBottom: '15px', fontFamily: 'inherit' }}>{t[lang].completeTitle}</h2>
                <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '1.1rem', fontFamily: 'inherit' }}>{t[lang].completeSub}</p>
                
                <div style={{ background: 'rgba(56,189,248,0.1)', border: '1px dashed #38bdf8', borderRadius: '12px', padding: '25px', marginBottom: '35px' }}>
                   <h1 className="en-text" style={{ color: '#38bdf8', textTransform: 'uppercase', margin: 0, fontSize: '2rem', letterSpacing: '2px' }}>{calculatedStream}</h1>
                </div>

                <button onClick={() => router.push(`/categories?search=${calculatedStream}`)} className="btn-primary" style={{ background: '#3b82f6', color: '#fff' }}>
                  {t[lang].exploreBtn} <span className="en-text">{calculatedStream}</span>
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
