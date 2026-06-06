import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- TRANSLATION DICTIONARY (AS PER OLD UI) ---
const t = {
  en: {
    brand: "Samar Guidance", doctor: "Dr. Ashfaque Umar", searchPlaceholder: "Search matrix...",
    navHome: "Home", navAbout: "About Us", navCareer: "Career Guidance",
    courses10: "Courses After 10th", courses12: "Courses After 12th", coursesGrad: "Courses After Graduation",
    coursesPost: "Courses After Post Graduation", coursesOther: "Other Specializations",
    navAssess: "Career Assessment", navPersonality: "Personality Development", navGallery: "Gallery", navContact: "Contact Us",
    footer: "© 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked.",
    pageTitle: "Samar Course Knowledge Bank",
    pageSub: "Explore comprehensive global dynamic study stems instantly.",
    matrix: " Matrix", scope: "Scope:", duration: "Standard Course Duration:", coursesIncluded: "Courses Included Under This Scope:"
  },
  ur: {
    brand: "ثمر گائیڈنس", doctor: "ڈاکٹر اشفاق عمر", searchPlaceholder: "تلاش کریں...",
    navHome: "ہوم", navAbout: "ہمارے بارے میں", navCareer: "کیریئر گائیڈنس",
    courses10: "دسویں کے بعد کورسز", courses12: "بارہویں کے بعد کورسز", coursesGrad: "گریجویشن کے بعد",
    coursesPost: "پوسٹ گریجویشن کے بعد", coursesOther: "دیگر مہارتیں",
    navAssess: "کیریئر اسسمنٹ", navPersonality: "شخصیت سازی", navGallery: "گیلری", navContact: "ہم سے رابطہ کریں",
    footer: "© 2026 ثمر فاؤنڈیشن۔ انٹرپرائز گریڈ آرکیٹیکچر کے ذریعے محفوظ۔",
    pageTitle: "ثمر کورس نالج بینک",
    pageSub: "جامع عالمی کیریئر کے اختیارات فوری طور پر دریافت کریں۔",
    matrix: " میٹرکس", scope: "دائرہ کار:", duration: "کورس کی معیاری مدت:", coursesIncluded: "اس دائرہ کار میں شامل کورسز:"
  }
};

export default function CourseCategories() {
  const router = useRouter();
  const { stream, search } = router.query;
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('science');
  const [dbData, setDbData] = useState(null); // CMS Data will load here
  const [loading, setLoading] = useState(true);

  // States for UI
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Fetch CMS Data
    const fetchMatrix = async () => {
      const { data } = await supabase.from('matrix_content').select('*');
      if (data) {
        const formatted = { en: {}, ur: {} };
        data.forEach(item => {
          formatted.en[item.stream_key] = { title: item.title_en, scope: item.scope_en, duration: item.duration_en, items: item.courses_en };
          formatted.ur[item.stream_key] = { title: item.title_ur, scope: item.scope_ur, duration: item.duration_ur, items: item.courses_ur };
        });
        setDbData(formatted);
      }
      setLoading(false);
    };
    fetchMatrix();

    // 2. Existing Handlers
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync Tab Logic
  useEffect(() => {
    if (dbData && stream && dbData.en[stream]) setActiveTab(stream);
  }, [stream, dbData]);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ur' : 'en');
  
  if (loading) return <div style={{background:'#0f172a', color:'#fff', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading...</div>;

  return (
    <div style={{
      direction: lang === 'ur' ? 'rtl' : 'ltr',
      fontFamily: lang === 'ur' ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a', backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.1) 1px, #0f172a 1px)`,
      minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column', width: '100vw', maxWidth: '100%'
    }}>
      <Head><link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" /></Head>

      {/* Copy paste your CSS from the old file exactly as it was into the style tag here */}
      <style dangerouslySetInnerHTML={{__html: `
        /* YAHAN WAHI PURANA CSS STYLE BLOCK PASTE KARO JO TUMHARE PURANE CODE MEIN THA */
      `}} />

      {/* NAVBAR AND CONTENT REMAIN EXACTLY SAME - JUST DATA MAPPING CHANGED BELOW */}
      <main className="category-main">
        {/* Tab Buttons */}
        <div className="tab-container">
          {Object.keys(dbData[lang]).map((tabKey) => (
            <button key={tabKey} onClick={() => setActiveTab(tabKey)} className="tab-btn"
               style={{ background: activeTab === tabKey ? '#1e3a8a' : 'rgba(30,41,59,0.5)', border: `1px solid ${activeTab === tabKey ? '#38bdf8' : 'rgba(255,255,255,0.1)'}` }}>
              {tabKey.toUpperCase()} {t[lang].matrix}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="content-card">
          <h3 className="content-title">{dbData[lang][activeTab].title}</h3>
          <p className="content-desc"><strong>{t[lang].scope}</strong> {dbData[lang][activeTab].scope}</p>
          <p className="content-desc"><strong>{t[lang].duration}</strong> {dbData[lang][activeTab].duration}</p>
          <div className="course-grid">
            {dbData[lang][activeTab].items.map((item, idx) => (
              <span key={idx} className="course-item">{item}</span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
