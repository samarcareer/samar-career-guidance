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
  const [session, setSession] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [currentLoc, setCurrentLoc] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [visitors, setVisitors] = useState(0);
  const [students, setStudents] = useState(0);
  const [careers, setCareers] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Counter animations
    const animateCounter = (target, setter, duration) => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) { setter(target); clearInterval(timer); }
            else { setter(Math.floor(start)); }
        }, 16);
    };
    animateCounter(645, setVisitors, 2000);
    animateCounter(12000, setStudents, 2500);
    animateCounter(150, setCareers, 1500);

    return () => {
      window.removeEventListener('resize', handleResize);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };
  const nextPage = () => { if (currentLoc < 4) setCurrentLoc((prev) => prev + 1); };
  const prevPage = () => { if (currentLoc > 1) setCurrentLoc((prev) => prev - 1); };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
  };

  return (
    <div style={{
      direction: lang === 'ur' ? 'rtl' : 'ltr',
      fontFamily: lang === 'ur' ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column', width: '100vw', overflowX: 'hidden'
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <title>{t[lang].brand}</title>
      </Head>

      {/* --- MASTER NAVBAR --- */}
      <nav style={{ width: '100%', background: 'rgba(30, 64, 175, 0.7)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 1000, padding: '15px 5%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: '1.2rem' }}>{t[lang].brand}</h1>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div onClick={() => setLang(prev => prev === 'en' ? 'ur' : 'en')} style={{ cursor: 'pointer', background: '#1e3a8a', padding: '5px 15px', borderRadius: '20px' }}>
                {lang === 'en' ? 'EN' : 'UR'}
            </div>
            {session ? (
              <button onClick={handleLogout} style={{ background: '#ef4444', border: 'none', padding: '5px 15px', borderRadius: '5px', color: '#fff' }}>Logout</button>
            ) : (
              <button onClick={() => router.push('/login')} style={{ background: '#3b82f6', border: 'none', padding: '5px 15px', borderRadius: '5px', color: '#fff' }}>{t[lang].studentLogin}</button>
            )}
          </div>
        </div>

        {/* --- FIXED DROPDOWN LINKS --- */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#fff' }}>{t[lang].navHome}</button>
          
          <div className="nav-dropdown-container">
            <button style={{ background: 'none', border: 'none', color: '#fff' }}>{t[lang].navCareer} ▼</button>
            <div className="nav-dropdown-menu">
              <button className="dropdown-item" onClick={() => router.push('/categories?search=10th')}>{t[lang].courses10}</button>
              <button className="dropdown-item" onClick={() => router.push('/categories?search=12th')}>{t[lang].courses12}</button>
              <button className="dropdown-item" onClick={() => router.push('/categories?search=graduation')}>{t[lang].coursesGrad}</button>
              <button className="dropdown-item" onClick={() => router.push('/categories?search=postgrad')}>{t[lang].coursesPost}</button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- CONTENT --- */}
      <main style={{ padding: '50px 5%', textAlign: 'center' }}>
        <h1>{t[lang].bookTitle}</h1>
        <p>{t[lang].bookDesc}</p>
        <button onClick={() => router.push('/assessment')} style={{ padding: '15px 30px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}>{t[lang].startAssess}</button>
      </main>

      {/* --- LIVE STATS --- */}
      <section style={{ display: 'flex', justifyContent: 'space-around', padding: '40px', background: 'rgba(30,58,138,0.2)' }}>
        <div><h3>{visitors}+</h3><p>{t[lang].liveVisitors}</p></div>
        <div><h3>{students}+</h3><p>{t[lang].activeStudents}</p></div>
        <div><h3>{careers}+</h3><p>{t[lang].careerStems}</p></div>
      </section>

      <footer style={{ textAlign: 'center', padding: '20px' }}>{t[lang].footer}</footer>
    </div>
  );
}
