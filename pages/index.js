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
    marquee: "🔥 Notification Alert: Government Approved Career Alignment Matrix Now Live! Explore Over 150+ Dynamic Strategic Stems.",
    bookTitle: "Samar Career Guidance Platform",
    bookSub: "By Dr. Ashfaque Umar",
    bookDesc: "Discover the perfect career path with enterprise-grade data protection and analytical student profiling matrices.",
    startAssess: "Start Assessment",
    knowledgeBank: "Our Knowledge Bank",
    science: "Science & Technology",
    scienceDesc: "BSc Physics, Chemistry, Data Analytics, Forensics, and Agriculture.",
    commerce: "Commerce & Finance",
    commerceDesc: "Chartered Accountancy, Banking, Corporate Laws, and Taxation.",
    medical: "Medical & Paramedical",
    medicalDesc: "MBBS, Pharmacy, Lab Technology, and Radiology fields.",
    nextPage: "Next Page",
    advEng: "Advanced Engineering",
    advEngDesc: "Computer Science, Robotics, Civil, Aerospace, and Mechanical.",
    jobOpp: "Job Opportunities",
    jobOppDesc: "BBA Aviation, Cargo Management, SAP Cloud Computing, and Logistics.",
    back: "Back",
    next: "Next",
    platformFeatures: "Platform Features",
    secureAssess: "Secure Assessment",
    secureDesc: "End-to-end protected tracking profiles for students.",
    multiLang: "Multi-Language Support",
    multiLangDesc: "Seamlessly switch between English and Urdu.",
    realTime: "Real-Time Analytics",
    realTimeDesc: "Get career scope, durations, and exact job profiles instantly.",
    readyToBegin: "Ready to Begin?",
    joinMap: "Join the ultimate career roadmap system today.",
    takeTest: "Take The Career Test",
    exploreCat: "Explore Categories",
    review: "Review",
    finish: "Finish",
    completedText: "Successfully Completed ",
    tourCompleted: "Tour Completed",
    navSuccess: "You have successfully navigated the platform guide.",
    poweredBy: "Powered By Samar Foundation",
    restart: "Restart Book",
    liveVisitors: "Live Visitors",
    activeStudents: "Active Students",
    careerStems: "Career Stems Matrix",
    footer: "© 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked."
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
    marquee: "🔥 نوٹیفکیشن الرٹ: گورنمنٹ سے منظور شدہ کیریئر الائنمنٹ میٹرکس اب لائیو ہے! 150 سے زیادہ آپشنز دریافت کریں۔",
    bookTitle: "ثمر کیریئر گائیڈنس پلیٹ فارم",
    bookSub: "از ڈاکٹر اشفاق عمر",
    bookDesc: "انٹرپرائز لیول ڈیٹا پروٹیکشن اور طلباء کی پروفائلنگ کے ساتھ بہترین کیریئر کا راستہ دریافت کریں۔",
    startAssess: "اسسمنٹ شروع کریں",
    knowledgeBank: "ہمارا نالج بینک",
    science: "سائنس اور ٹیکنالوجی",
    scienceDesc: "بی ایس سی فزکس، کیمسٹری، ڈیٹا اینالیٹکس، فرانزک، اور ایگریکلچر۔",
    commerce: "کامرس اور فنانس",
    commerceDesc: "چارٹرڈ اکاؤنٹنسی، بینکنگ، کارپوریٹ لاء، اور ٹیکسیشن۔",
    medical: "میڈیکل اور پیرا میڈیکل",
    medicalDesc: "ایم بی بی ایس، فارمیسی، لیب ٹیکنالوجی، اور ریڈیولوجی۔",
    nextPage: "اگلا صفحہ",
    advEng: "ایڈوانسڈ انجینئرنگ",
    advEngDesc: "کمپیوٹر سائنس، روبوٹکس، سول، ایرو اسپیس، اور مکینیکل۔",
    jobOpp: "ملازمت کے مواقع",
    jobOppDesc: "بی بی اے ایوی ایشن، کارگو مینجمنٹ، کلاؤڈ کمپیوٹنگ، اور لاجسٹکس۔",
    back: "پیچھے",
    next: "آگے",
    platformFeatures: "پلیٹ فارم کی خصوصیات",
    secureAssess: "محفوظ اسسمنٹ",
    secureDesc: "طلباء کے لیے مکمل طور پر محفوظ ٹریکنگ پروفائلز۔",
    multiLang: "کثیر لسانی سپورٹ",
    multiLangDesc: "انگریزی اور اردو کے درمیان آسانی سے سوئچ کریں۔",
    realTime: "ریئل ٹائم اینالیٹکس",
    realTimeDesc: "کیریئر کے مواقع اور ملازمت کی تفصیلات فوری حاصل کریں۔",
    readyToBegin: "کیا آپ تیار ہیں؟",
    joinMap: "آج ہی بہترین کیریئر روڈ میپ سسٹم میں شامل ہوں۔",
    takeTest: "کیریئر ٹیسٹ شروع کریں",
    exploreCat: "اقسام دریافت کریں",
    review: "جائزہ لیں",
    finish: "مکمل",
    completedText: "کامیابی سے مکمل ہوا ",
    tourCompleted: "ٹور مکمل ہو گیا",
    navSuccess: "آپ نے پلیٹ فارم گائیڈ کامیابی سے مکمل کر لی ہے۔",
    poweredBy: "بشکریہ ثمر فاؤنڈیشن",
    restart: "دوبارہ شروع کریں",
    liveVisitors: "لائیو زائرین",
    activeStudents: "فعال طلباء",
    careerStems: "کیریئر میٹرکس",
    footer: "© 2026 ثمر فاؤنڈیشن۔ انٹرپرائز گریڈ آرکیٹیکچر کے ذریعے محفوظ۔"
  }
};

export default function HomeLanding() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [showContactModal, setShowContactModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [session, setSession] = useState(null);

  // Navbar States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  
  // 3D Book State Logic
  const totalPages = 3; 
  const maxLoc = totalPages + 1;
  const [currentLoc, setCurrentLoc] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  // Completion State
  const [isCompleted, setIsCompleted] = useState(false);

  // Live Stats State
  const [visitors, setVisitors] = useState(0);
  const [students, setStudents] = useState(0);
  const [careers, setCareers] = useState(0);

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

    const animateCounter = (target, setter, duration) => {
      let start = 0;
      const increment = target / (duration / 16); 
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    const fetchLiveVisitors = async () => {
      try {
        const { data, error } = await supabase.rpc('increment_page_view', { page_slug_param: 'home' });
        let finalVisitorCount = 645; 
        if (!error && data) {
          finalVisitorCount = data;
        }
        animateCounter(finalVisitorCount, setVisitors, 2000); 
      } catch (err) {
        animateCounter(645, setVisitors, 2000); 
      }
    };

    fetchLiveVisitors();
    animateCounter(12000, setStudents, 2500); 
    animateCounter(150, setCareers, 1500);    

    return () => {
      window.removeEventListener('resize', handleResize);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const nextPage = () => { if (currentLoc < maxLoc) setCurrentLoc((prev) => prev + 1); };
  const prevPage = () => { if (currentLoc > 1) setCurrentLoc((prev) => prev - 1); };
  
  const handleFinish = () => {
      setIsCompleted(true);
      setTimeout(() => {
          nextPage();
      }, 800);
  }
  
  const restartBook = () => { 
      setCurrentLoc(1); 
      setIsCompleted(false);
  };

  const getBookTransform = () => {
    if (isMobile) return 'none';
    if (currentLoc === 1) return 'translateX(0%)'; 
    if (currentLoc === maxLoc) return 'translateX(0%)'; 
    return 'translateX(25%)'; 
  };

  const getZIndex = (pageNumber) => {
    if (isMobile) return 'auto';
    return pageNumber < currentLoc ? pageNumber : totalPages - pageNumber + 1;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
    }
  };
  
  const toggleLanguage = () => {
      setLang(prev => prev === 'en' ? 'ur' : 'en');
  }

  return (
    <div style={{
      direction: lang === 'ur' ? 'rtl' : 'ltr',
      fontFamily: lang === 'ur' ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.1) 1px, #0f172a 1px)`,
      backgroundSize: '30px 30px',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      maxWidth: '100%',
      overflowX: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet" />
        <title>{t[lang].brand}</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; max-width: 100vw; background-color: #0f172a; scroll-behavior: smooth; }

        .glass-navbar {
          width: 100%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; display: flex; flex-direction: column;
        }
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

        .mobile-search-wrapper { display: none; width: 100%; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 10px; }
        .desktop-search-wrapper { display: block; flex: 0.6; max-width: 400px; }
        .mobile-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 2rem; cursor: pointer; }

        .marquee-container { background: #1e3a8a; border-bottom: 1px solid rgba(56, 189, 248, 0.2); padding: 8px 0; overflow: hidden; white-space: nowrap; width: 100%; }
        .marquee-text { display: inline-block; padding-left: 100%; animation: marquee 25s linear infinite; font-size: 0.9rem; font-weight: 600; color: #bfdbfe; font-family: inherit; }
        @keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }

        :root { --book-bg: #1e293b; --border-color: #3b82f6; --accent: #60a5fa; }
        .book-wrapper { flex: 1; display: flex; justify-content: center; align-items: center; width: 100%; padding: 40px 10px; animation: scaleInBook 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: scale(0.92); }
        @keyframes scaleInBook { to { opacity: 1; transform: scale(1); } }

        .book-container { perspective: 2500px; display: flex; justify-content: center; align-items: center; width: 100%; max-width: 100vw; }
        .book { position: relative; width: 400px; height: 550px; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1); }
        
        .page { position: absolute; width: 100%; height: 100%; top: 0; left: 0; transform-style: preserve-3d; transform-origin: left center; transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1); }
        .front, .back { position: absolute; width: 100%; height: 100%; padding: 35px; backface-visibility: hidden; display: flex; flex-direction: column; border: 2px solid var(--border-color); box-shadow: 0 0 25px rgba(30, 64, 175, 0.5); border-radius: 8px 15px 15px 8px; background: var(--book-bg); }
        .front { z-index: 2; transform: rotateY(0deg); }
        .back { transform: rotateY(180deg); border-radius: 15px 8px 8px 15px; }
        .page.flipped { transform: rotateY(-180deg); }

        .book-title { font-size: 2rem; font-weight: 900; color: #fff; line-height: 1.2; text-shadow: 0 4px 15px rgba(56,189,248,0.4); font-family: inherit; }
        .book-subtitle { color: var(--accent); font-weight: 700; margin-top: 10px; font-size: 1.1rem; font-family: inherit; }
        .avatar-circle { width: 90px; height: 90px; border-radius: 50%; border: 3px solid var(--accent); display: flex; justify-content: center; align-items: center; margin: 0 auto 15px; font-size: 3.5rem; color: var(--accent); background: rgba(30, 64, 175, 0.3); }
        
        .standard-page h2 { font-size: 1.4rem; color: #fff; margin-bottom: 15px; border-bottom: 2px solid var(--accent); padding-bottom: 8px; font-family: inherit; }
        .timeline-item { border-left: 2px solid var(--accent); padding-left: 15px; position: relative; margin-bottom: 15px; }
        [dir="rtl"] .timeline-item { border-left: none; border-right: 2px solid var(--accent); padding-left: 0; padding-right: 15px; }
        .timeline-item::before { content: ''; position: absolute; width: 12px; height: 12px; background: var(--accent); border-radius: 50%; left: -7px; top: 5px; box-shadow: 0 0 10px var(--accent); }
        [dir="rtl"] .timeline-item::before { left: auto; right: -7px; }
        .timeline-item h3 { font-size: 1rem; color: #fff; margin: 5px 0; font-family: inherit; }
        .timeline-item p { font-size: 0.85rem; color: #94a3b8; font-family: inherit; }

        .btn { padding: 12px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; border: none; font-size: 0.95rem; text-align: center; width: 100%; margin-top: 10px; display: flex; justify-content: center; align-items: center; gap: 8px; font-family: inherit; }
        .btn-primary { background: #3b82f6; color: #fff; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); }
        .btn-primary:hover { background: #2563eb; }
        .btn-secondary { background: transparent; color: var(--accent); border: 2px solid var(--accent); }
        .btn-secondary:hover { background: var(--accent); color: #0f172a; }

        .page-footer-nav { margin-top: auto; display: flex; justify-content: space-between; width: 100%; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; }
        .nav-btn { background: transparent; border: none; color: var(--accent); font-weight: bold; cursor: pointer; font-size: 0.95rem; transition: 0.2s; display: flex; align-items: center; gap: 5px; font-family: inherit; }
        .nav-btn:hover { color: #fff; text-shadow: 0 0 10px var(--accent); }
        
        .lang-toggle-container { display: flex; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 4px; position: relative; cursor: pointer; width: 80px; height: 36px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); direction: ltr !important; }
        .lang-toggle-indicator { position: absolute; top: 4px; left: ${lang === 'en' ? '4px' : '40px'}; width: 34px; height: 26px; background: #38bdf8; border-radius: 14px; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); box-shadow: 0 2px 8px rgba(56, 189, 248, 0.5); }
        .lang-label { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; color: #fff; z-index: 1; user-select: none; transition: color 0.3s; font-family: 'Segoe UI', sans-serif; }

        .live-stats-wrapper { width: 100%; background: rgba(30, 58, 138, 0.3); border-top: 1px solid rgba(56, 189, 248, 0.1); border-bottom: 1px solid rgba(56, 189, 248, 0.1); backdrop-filter: blur(10px); padding: 40px 5%; display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 30px; margin-top: 20px; }
        .stat-card { text-align: center; }
        .stat-card h3 { font-size: 2.8rem; color: #38bdf8; margin: 0 0 5px 0; font-weight: 900; text-shadow: 0 0 20px rgba(56, 189, 248, 0.4); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .stat-card p { color: #e2e8f0; font-size: 1rem; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-family: inherit; }
        
        .auth-icon-btn { width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.4rem; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); transition: all 0.3s ease; }
        .profile-btn { color: #10b981; } .profile-btn:hover { background: rgba(16, 185, 129, 0.15); border-color: #10b9
