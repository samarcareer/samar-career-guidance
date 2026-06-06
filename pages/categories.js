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
  const [activeTab, setActiveTab] = useState('science');
  const [dbData, setDbData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('matrix_content').select('*');
      if (data) {
        const formatted = { en: {}, ur: {} };
        data.forEach(item => {
          formatted.en[item.stream_key] = { title: item.title_en, scope: item.scope_en, duration: item.duration_en, items: item.courses_en };
          formatted.ur[item.stream_key] = { title: item.title_ur, scope: item.scope_ur, duration: item.duration_ur, items: item.courses_ur };
        });
        setDbData(formatted);
        if (stream && formatted.en[stream]) setActiveTab(stream);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [stream]);

  if (isLoading) return <div style={{background:'#0f172a', height:'100vh', color:'#fff', display:'flex', justifyContent:'center', alignItems:'center'}}>Loading Matrix...</div>;

  return (
    <div style={{ direction: lang === 'ur' ? 'rtl' : 'ltr', fontFamily: lang === 'ur' ? "'Noto Nastaliq Urdu', serif" : "'Segoe UI', Roboto, sans-serif", backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', padding: '50px 5%' }}>
      <Head><title>{t[lang].pageTitle}</title></Head>
      
      {/* Navbar Minimalistic for Content Page */}
      <button onClick={() => router.push('/')} style={{ background: '#1e3a8a', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>← {t[lang].navHome}</button>

      <h1 style={{ color: '#38bdf8' }}>{t[lang].pageTitle}</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {Object.keys(dbData.en).map(key => (
          <button key={key} onClick={() => setActiveTab(key)} style={{ padding: '10px 20px', background: activeTab === key ? '#3b82f6' : 'transparent', border: '1px solid #3b82f6', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(30,41,59,0.5)', padding: '30px', borderRadius: '15px' }}>
        <h2>{dbData[lang][activeTab]?.title}</h2>
        <p><strong>{t[lang].scope}</strong> {dbData[lang][activeTab]?.scope}</p>
        <p><strong>{t[lang].duration}</strong> {dbData[lang][activeTab]?.duration}</p>
        <div style={{ marginTop: '20px' }}>
          {dbData[lang][activeTab]?.items.map((course, i) => (
            <span key={i} style={{ display: 'inline-block', background: '#1e293b', margin: '5px', padding: '10px', borderRadius: '5px' }}>{course}</span>
          ))}
        </div>
      </div>
      
      <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} style={{ marginTop: '20px', padding: '10px', background: '#10b981', border: 'none', color: '#fff', borderRadius: '5px' }}>
        {lang === 'en' ? 'Switch to Urdu' : 'انگریزی میں دیکھیں'}
      </button>
    </div>
  );
}
