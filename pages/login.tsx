import React, { useState, useEffect, Component, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- STRICT TS INTERFACES ---
type Lang = 'en' | 'ur';
type Step = 'form' | 'otp';

interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

// --- ERROR BOUNDARY (Rule 6: Zero Silent Failures) ---
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{color:'white', background:'#0f172a', padding:'50px', textAlign:'center'}}>UI Error Isolated. Please refresh the app.</div>;
    return this.props.children;
  }
}

// --- TRANSLATION DICTIONARY ---
const t: Record<Lang, Record<string, string>> = {
  en: {
    brand: "Samar Guidance", doctor: "Dr. Ashfaque Umar", navHome: "Home", navAbout: "About Us", navAssess: "Career Assessment",
    signIn: "Sign In", signUp: "Create Account", nameLabel: "Full Name", emailLabel: "Email Address",
    sendOtp: "Send Secure OTP", verifyOtp: "Verify & Login", otpLabel: "Enter 6-Digit Security PIN", otpSentTo: "OTP securely sent to",
    changeEmail: "Change Email", helloFriend: "Hello, Future Leader!", helloDesc: "Enter your personal details and start your career discovery journey with us.",
    welcomeBack: "Welcome Back!", welcomeDesc: "To keep connected with us please login with your registered email.",
    slideBtnSignIn: "Sign In Instead", slideBtnSignUp: "Sign Up Now"
  },
  ur: {
    brand: "ثمر گائیڈنس", doctor: "ڈاکٹر اشفاق عمر", navHome: "ہوم", navAbout: "ہمارے بارے میں", navAssess: "کیریئر اسسمنٹ",
    signIn: "لاگ ان کریں", signUp: "اکاؤنٹ بنائیں", nameLabel: "پورا نام", emailLabel: "ای میل ایڈریس",
    sendOtp: "او ٹی پی بھیجیں", verifyOtp: "تصدیق کریں", otpLabel: "6 ہندسوں کا پن درج کریں", otpSentTo: "او ٹی پی بھیج دیا گیا ہے",
    changeEmail: "ای میل تبدیل کریں", helloFriend: "خوش آمدید، مستقبل کے لیڈر!", helloDesc: "اپنی ذاتی تفصیلات درج کریں اور ہمارے ساتھ کیریئر دریافت کرنے کا سفر شروع کریں۔",
    welcomeBack: "خوش آمدید!", welcomeDesc: "ہمارے ساتھ جڑے رہنے کے لیے براہ کرم اپنے رجسٹرڈ ای میل سے لاگ ان کریں۔",
    slideBtnSignIn: "لاگ ان کریں", slideBtnSignUp: "نیا اکاؤنٹ بنائیں"
  }
};

export default function StudentLogin() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  
  // UI & Form States
  const [isSignUp, setIsSignUp] = useState<boolean>(false); 
  const [step, setStep] = useState<Step>('form'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  
  // Security & Spam States (Rule 3 & 6)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cooldown, setCooldown] = useState<number>(0);

  // Optimistic Cooldown Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const toggleLanguage = () => setLang((prev) => prev === 'en' ? 'ur' : 'en');

  // Strict Error Sanitizer
  const sanitizeError = (errMessage: string): string => {
    const msg = errMessage.toLowerCase();
    if (msg.includes('rate limit')) return "Security Lock: Too many attempts. Please wait a minute.";
    if (msg.includes('invalid') || msg.includes('expired')) return "Invalid or Expired OTP. Please check and try again.";
    if (msg.includes('format')) return "Invalid Email format.";
    return "Secure connection failed. Please try again.";
  };

  // --- SECURE OTP AUTHENTICATION ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setError('');
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const authOptions = isSignUp ? { data: { full_name: fullName } } : {};
      const { error: otpError } = await supabase.auth.signInWithOtp({ 
        email: cleanEmail,
        options: authOptions
      });

      if (otpError) throw otpError;
      
      setStep('otp'); 
      setCooldown(60);
    } catch (err: any) {
      setError(sanitizeError(err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // --- SMART REDIRECT ROUTING (ADMIN VS STUDENT) ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: otp,
        type: 'email'
      });
      
      if (verifyError) throw verifyError;
      
      if (data?.session) {
        // Fetch authorized admin list from env or fallback list
        const adminEmailsString = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'samarfoundationmalegaon@gmail.com,mohammedjunaid5463@gmail.com,ashfaqueumar@gmail.com,ashfaqueumarsir@gmail.com';
        const authorizedAdmins = adminEmailsString.split(',').map(e => e.trim().toLowerCase());
        
        // Smart Routing: If user is admin, take them to /admin. Otherwise /profile.
        if (authorizedAdmins.includes(cleanEmail)) {
          router.push('/admin');
        } else {
          router.push('/profile');
        }
      }
      
    } catch (err: any) {
      setError(sanitizeError(err.message || ""));
    } finally {
      setLoading(false);
    }
  };

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
          <title>Secure Login | {t[lang].brand}</title>
        </Head>

        {/* --- STRICT PURE CSS FOR UI ISOLATION --- */}
        <style dangerouslySetInnerHTML={{__html: `
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); }
          .lang-toggle-container { display: flex; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 4px; position: relative; cursor: pointer; width: 80px; height: 36px; direction: ltr !important; }
          .lang-toggle-indicator { position: absolute; top: 4px; left: ${lang === 'en' ? '4px' : '40px'}; width: 34px; height: 26px; background: #38bdf8; border-radius: 14px; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); }
          .lang-label { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; color: #fff; z-index: 1; user-select: none; font-family: 'Segoe UI', sans-serif; }
          
          .input-field { width: 100%; padding: 12px 15px; border-radius: 8px; background: rgba(15,23,42,0.6); border: 1px solid rgba(56,189,248,0.3); color: #fff; font-size: 1rem; margin-bottom: 15px; outline: none; transition: 0.3s; font-family: inherit; }
          .input-field:focus { border-color: #38bdf8; box-shadow: 0 0 10px rgba(56,189,248,0.2); }
          
          .auth-btn { width: 100%; padding: 14px; background: #3b82f6; color: #fff; border: none; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: 0.3s; font-family: inherit; display: flex; justify-content: center; align-items: center; gap: 8px; }
          .auth-btn:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4); }
          .auth-btn:disabled { background: #475569; cursor: not-allowed; opacity: 0.7; }
          
          /* MASTER CONTAINER */
          .auth-container { position: relative; width: 100%; max-width: 900px; height: 550px; background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(10px); border: 1px solid rgba(56,189,248,0.3); border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); overflow: hidden; margin: 0 auto; }
          
          /* --- VIEW ISOLATION LOGIC --- */
          .mobile-view { display: none; }
          .desktop-view { display: block; height: 100%; width: 100%; position: relative; }
          
          @media (max-width: 850px) {
            .mobile-view { display: block; width: 100%; }
            .desktop-view { display: none !important; }
            .auth-container { background: transparent; border: none; box-shadow: none; height: auto; min-height: 600px; overflow: visible; }
            .mobile-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); width: 100%; }
          }

          /* --- DESKTOP DOUBLE SLIDER LOGIC --- */
          .form-container { position: absolute; top: 0; height: 100%; width: 50%; transition: all 0.6s ease-in-out; display: flex; flex-direction: column; justify-content: center; padding: 40px; }
          
          .sign-in-container { 
             left: 0; z-index: 2; 
             opacity: ${isSignUp ? '0' : '1'}; 
             transform: ${isSignUp ? 'translateX(100%)' : 'translateX(0)'}; 
             pointer-events: ${isSignUp ? 'none' : 'auto'}; 
          }
          
          .sign-up-container { 
             left: 0; z-index: 1; 
             opacity: ${isSignUp ? '1' : '0'}; 
             transform: ${isSignUp ? 'translateX(100%)' : 'translateX(0)'}; 
             pointer-events: ${isSignUp ? 'auto' : 'none'}; 
          }

          .overlay-container { position: absolute; top: 0; left: 50%; width: 50%; height: 100%; overflow: hidden; transition: transform 0.6s ease-in-out; z-index: 100; transform: ${isSignUp ? 'translateX(-100%)' : 'translateX(0)'}; }
          
          .overlay { background: linear-gradient(135deg, #1e40af, #38bdf8); background-repeat: no-repeat; background-size: cover; color: #fff; position: relative; left: -100%; height: 100%; width: 200%; transform: ${isSignUp ? 'translateX(50%)' : 'translateX(0)'}; transition: transform 0.6s ease-in-out; }
          
          .overlay-panel { position: absolute; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 0 40px; text-align: center; top: 0; height: 100%; width: 50%; transform: translateX(0); transition: transform 0.6s ease-in-out; }
          .overlay-left { transform: ${isSignUp ? 'translateX(0)' : 'translateX(-20%)'}; }
          .overlay-right { right: 0; transform: ${isSignUp ? 'translateX(20%)' : 'translateX(0)'}; }
          
          .ghost-btn { background: transparent; border: 2px solid #fff; color: #fff; padding: 12px 35px; border-radius: 30px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: 0.3s; margin-top: 20px; font-family: inherit; }
          .ghost-btn:hover { background: #fff; color: #1e40af; }
          
          .mobile-menu { display: none; flex-direction: column; background: rgba(30, 64, 175, 0.95); position: absolute; width: 100%; top: 70px; left: 0; z-index: 1000; padding: 15px; border-bottom: 1px solid #38bdf8; }
          .mobile-menu.open { display: flex; }
          .mobile-link { color: #fff; padding: 10px; text-decoration: none; font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        `}} />

        {/* HEADER */}
        <nav className="nav-top-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
            <div><h1 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900', fontFamily: "'Segoe UI', sans-serif" }}>{t[lang].brand}</h1></div>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div className="lang-toggle-container" onClick={toggleLanguage}>
                <div className="lang-toggle-indicator"></div>
                <span className="lang-label" style={{ color: lang === 'en' ? '#fff' : '#94a3b8' }}>EN</span>
                <span className="lang-label" style={{ color: lang === 'ur' ? '#fff' : '#94a3b8' }}>UR</span>
            </div>
            <button style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.8rem', cursor: 'pointer' }} className="mobile-only-btn mobile-view" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <i className={isMobileMenuOpen ? 'bx bx-x' : 'bx bx-menu'}></i>
            </button>
          </div>
        </nav>

        {/* MOBILE MENU DROPDOWN */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <a className="mobile-link" onClick={() => router.push('/')}>{t[lang].navHome}</a>
          <a className="mobile-link" onClick={() => router.push('/about')}>{t[lang].navAbout}</a>
        </div>

        {/* MAIN AUTH SECTION */}
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div className="auth-container">
            
            {/* MOBILE VIEW */}
            <div className="mobile-view">
               {step === 'form' ? (
                 <>
                   {isSignUp ? (
                     <div className="mobile-card">
                        <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '20px' }}>{t[lang].signUp}</h2>
                        {error && <p style={{ color: '#ef4444', marginBottom: '15px', fontSize:'0.9rem' }}><i className='bx bx-error'></i> {error}</p>}
                        <form onSubmit={handleSendOtp}>
                          <input type="text" className="input-field" placeholder={t[lang].nameLabel} value={fullName} onChange={(e)=>setFullName(e.target.value)} required />
                          <input type="email" className="input-field" placeholder={t[lang].emailLabel} value={email} onChange={(e)=>setEmail(e.target.value)} required dir="ltr" />
                          <button className="auth-btn" type="submit" disabled={loading || cooldown > 0}>
                            {loading ? <i className='bx bx-loader-alt bx-spin'></i> : cooldown > 0 ? `Wait ${cooldown}s` : t[lang].sendOtp}
                          </button>
                        </form>
                        <p style={{ color: '#94a3b8', marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>Already have an account? <span style={{ color: '#38bdf8', cursor: 'pointer', fontWeight:'bold' }} onClick={()=>setIsSignUp(false)}>Sign In</span></p>
                     </div>
                   ) : (
                     <div className="mobile-card">
                        <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '20px' }}>{t[lang].signIn}</h2>
                        {error && <p style={{ color: '#ef4444', marginBottom: '15px', fontSize:'0.9rem' }}><i className='bx bx-error'></i> {error}</p>}
                        <form onSubmit={handleSendOtp}>
                          <input type="email" className="input-field" placeholder={t[lang].emailLabel} value={email} onChange={(e)=>setEmail(e.target.value)} required dir="ltr" />
                          <button className="auth-btn" type="submit" disabled={loading || cooldown > 0}>
                            {loading ? <i className='bx bx-loader-alt bx-spin'></i> : cooldown > 0 ? `Wait ${cooldown}s` : t[lang].sendOtp}
                          </button>
                        </form>
                        <p style={{ color: '#94a3b8', marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>New here? <span style={{ color: '#38bdf8', cursor: 'pointer', fontWeight:'bold' }} onClick={()=>setIsSignUp(true)}>Sign Up</span></p>
                     </div>
                   )}
                 </>
               ) : (
                 <div className="mobile-card" style={{textAlign: 'center'}}>
                    <div style={{ fontSize: '3rem', color: '#10b981', marginBottom: '10px' }}><i className='bx bx-check-shield'></i></div>
                    <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '10px' }}>{t[lang].verifyOtp}</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize:'0.9rem' }}>{t[lang].otpSentTo} <br/><strong style={{ color: '#38bdf8' }}>{email}</strong></p>
                    {error && <p style={{ color: '#ef4444', marginBottom: '15px', fontSize:'0.9rem' }}><i className='bx bx-error'></i> {error}</p>}
                    <form onSubmit={handleVerifyOtp}>
                      <input type="text" maxLength={6} className="input-field" placeholder="••••••" value={otp} onChange={(e)=>setOtp(e.target.value)} required dir="ltr" style={{ fontSize: '1.8rem', textAlign: 'center', letterSpacing: '10px', fontWeight: 'bold' }} />
                      <button className="auth-btn" type="submit" disabled={loading} style={{ background: '#10b981' }}>{loading ? <i className='bx bx-loader-alt bx-spin'></i> : t[lang].verifyOtp}</button>
                      <button type="button" onClick={() => { setStep('form'); setOtp(''); setError(''); }} style={{ width: '100%', background: 'transparent', color: '#94a3b8', border: '1px solid #475569', padding: '12px', borderRadius: '8px', marginTop: '15px', cursor: 'pointer' }}>{t[lang].changeEmail}</button>
                    </form>
                 </div>
               )}
            </div>

            {/* DESKTOP VIEW */}
            <div className="desktop-view">
                <div className="form-container sign-up-container">
                  <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '20px', fontFamily: 'inherit' }}>{t[lang].signUp}</h2>
                  {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}><i className='bx bx-error'></i> {error}</p>}
                  <form onSubmit={handleSendOtp}>
                    <input type="text" className="input-field" placeholder={t[lang].nameLabel} value={fullName} onChange={(e)=>setFullName(e.target.value)} required />
                    <input type="email" className="input-field" placeholder={t[lang].emailLabel} value={email} onChange={(e)=>setEmail(e.target.value)} required dir="ltr" />
                    <button className="auth-btn" type="submit" disabled={loading || cooldown > 0}>
                      {loading ? <i className='bx bx-loader-alt bx-spin'></i> : cooldown > 0 ? `Security Lock: ${cooldown}s` : t[lang].sendOtp}
                    </button>
                  </form>
                </div>

                <div className="form-container sign-in-container">
                  <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '20px', fontFamily: 'inherit' }}>{t[lang].signIn}</h2>
                  {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}><i className='bx bx-error'></i> {error}</p>}
                  <form onSubmit={handleSendOtp}>
                    <input type="email" className="input-field" placeholder={t[lang].emailLabel} value={email} onChange={(e)=>setEmail(e.target.value)} required dir="ltr" />
                    <button className="auth-btn" type="submit" disabled={loading || cooldown > 0}>
                      {loading ? <i className='bx bx-loader-alt bx-spin'></i> : cooldown > 0 ? `Security Lock: ${cooldown}s` : t[lang].sendOtp}
                    </button>
                  </form>
                </div>

                <div className="overlay-container">
                  <div className="overlay">
                    <div className="overlay-panel overlay-left">
                      <h1 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>{t[lang].welcomeBack}</h1>
                      <p style={{ fontSize: '1rem', opacity: 0.9 }}>{t[lang].welcomeDesc}</p>
                      <button className="ghost-btn" onClick={() => { setIsSignUp(false); setError(''); }}>{t[lang].slideBtnSignIn}</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                      <h1 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>{t[lang].helloFriend}</h1>
                      <p style={{ fontSize: '1rem', opacity: 0.9 }}>{t[lang].helloDesc}</p>
                      <button className="ghost-btn" onClick={() => { setIsSignUp(true); setError(''); }}>{t[lang].slideBtnSignUp}</button>
                    </div>
                  </div>
                </div>

                {step === 'otp' && (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                     <div style={{ fontSize: '4rem', color: '#10b981', marginBottom: '10px' }}><i className='bx bx-check-shield'></i></div>
                     <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '10px', fontFamily: 'inherit' }}>{t[lang].verifyOtp}</h2>
                     <p style={{ color: '#94a3b8', marginBottom: '30px', textAlign: 'center' }}>{t[lang].otpSentTo} <strong style={{ color: '#38bdf8' }}>{email}</strong></p>
                     {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}><i className='bx bx-error'></i> {error}</p>}
                     <form onSubmit={handleVerifyOtp} style={{ width: '100%', maxWidth: '400px' }}>
                        <input type="text" maxLength={6} className="input-field" placeholder="••••••" value={otp} onChange={(e)=>setOtp(e.target.value)} required dir="ltr" style={{ fontSize: '2.5rem', textAlign: 'center', letterSpacing: '15px', fontWeight: 'bold', padding: '20px' }} />
                        <button className="auth-btn" type="submit" disabled={loading} style={{ background: '#10b981', marginTop: '10px' }}>{loading ? <i className='bx bx-loader-alt bx-spin'></i> : t[lang].verifyOtp}</button>
                        <button type="button" onClick={() => { setStep('form'); setOtp(''); setError(''); }} style={{ width: '100%', background: 'transparent', color: '#94a3b8', border: '1px solid #475569', padding: '12px', borderRadius: '8px', marginTop: '15px', cursor: 'pointer' }}>{t[lang].changeEmail}</button>
                     </form>
                  </div>
                )}
            </div>

          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
