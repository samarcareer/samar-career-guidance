import { useState } from 'react';
import { useRouter } from 'next/router';

// Data object moved outside to prevent Vercel Build Errors
const uiContent = {
  en: {
    brand: "Samar Career Guidance",
    founder: "Founder: Dr. Ashfaque Umar",
    alertText: "🔥 Notification Alert: Government Approved Career Alignment Matrix Now Live! Explore Over 150+ Dynamic Strategic Stems.",
    heroTitle: "Samar Career Guidance Platform",
    heroSub: "Discover the perfect career path with enterprise-grade data protection and analytical student profiling matrices.",
    btnStart: "Start Assessment Test",
    btnLogin: "Student Login",
    navHome: "Home",
    navAbout: "About Us",
    navCategory: "Explore Categories",
    navContact: "Contact Us",
    searchPlaceholder: "Search courses instantly...",
    footerNote: "© 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked.",
    contactTitle: "Contact Professional Help Desk",
    contactDetails: "For analytical matrix guidelines, reach out directly to the developer desk:",
    ownerLabel: "Website Developer: Mohammed Junaid",
    contactPhone: "Contact Line: +91 8484004636"
  },
  ur: {
    brand: "ثمر کیریئر رہنمائی",
    founder: "بانی: ڈاکٹر اشفاق عمر",
    alertText: "🔥 نوٹیفکیشن الرٹ: گورنمنٹ منظور شدہ کیریئر الائنمنٹ میٹرکس اب لائیو ہے! 150 سے زیادہ تعلیمی شعبے دریافت کریں۔",
    heroTitle: "ثمر کیریئر رہنمائی پلیٹ فارم",
    heroSub: "انٹرپرائز گریڈ ڈیٹا پروٹیکشن اور اینالیٹیکل اسٹوڈنٹ پروفائلنگ میٹرکس کے ساتھ کامل تعلیمی راستے تلاش کریں۔",
    btnStart: "کیریئر اسیسمنٹ ٹیسٹ شروع کریں",
    btnLogin: "اسٹوڈنٹ لاگ ان",
    navHome: "ہوم پیج",
    navAbout: "ہمارے بارے میں",
    navCategory: "تعلیمی زمرے",
    navContact: "رابطہ کریں",
    searchPlaceholder: "فوری طور پر کورسز تلاش کریں...",
    footerNote: "© 2026 ثمر فاؤنڈیشن۔ انٹرپرائز گریڈ آرکیٹیکچر پروٹیکشن لاکڈ۔",
    contactTitle: "پروفیشنل ہیلپ ڈیسک سے رابطہ کریں",
    contactDetails: "اینالیٹیکل میٹرکس گائیڈ لائنز کے لیے، براہ راست ڈیولپر ڈیسک سے رابطہ کریں:",
    ownerLabel: "ویب سائٹ ڈیولپر: محمد جنید",
    contactPhone: "رابطہ لائن: 8484004636 91+"
  }
};

export default function HomeLanding() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const t = uiContent[lang];
  const urduFont = "'AlviNastaleeq', 'UrduFont', 'Tahoma', sans-serif";
  const englishFont = "'Segoe UI', Roboto, sans-serif";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
    }
  };

  return (
    <div style={{
      direction: lang === 'ur' ? 'rtl' : 'ltr',
      fontFamily: lang === 'ur' ? urduFont : englishFont,
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.15) 1px, #0f172a 1px)`,
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0, 12px 12px',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflowX: 'hidden'
    }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @font-face { font-family: 'AlviNastaleeq'; src: url('/alvi-nastaleeq.ttf') format('truetype'); font-display: swap; }
        @font-face { font-family: 'UrduFont'; src: url('https://fonts.gstatic.com/ea/notonastaleequrdu/v5/NotoNastaleeqUrdu-Regular.woff2') format('woff2'); font-display: swap; }
        .marquee-container { background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 10px 0; overflow: hidden; white-space: nowrap; width: 100%; }
        .marquee-text { display: inline-block; padding-left: 100%; animation: marquee 25s linear infinite; font-size: 0.9rem; font-weight: 600; color: #cbd5e1; }
        @keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
      `}} />
      
      <nav style={{ width: '100%', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 100, padding: '15px 5%' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
            <div>
              <h1 style={{ margin: 0, color: '#38bdf8', fontSize: '1.4rem', fontWeight: '800' }}>{t.brand}</h1>
              <small style={{ color: '#ff7a00', fontWeight: 'bold', display: 'block', marginTop: '-2px' }}>{t.founder}</small>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} style={{ flex: '1', maxWidth: '500px', minWidth: '200px', margin: '0 20px' }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder} 
              style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative' }}>
            <button onClick={() => router.push('/')} style={{ color: '#38bdf8', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>{t.navHome}</button>
            <button onClick={() => router.push('/about')} style={{ color: '#94a3b8', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>{t.navAbout}</button>
            
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowCategoryMenu(!showCategoryMenu)} style={{ color: '#94a3b8', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                {t.navCategory} ▾
              </button>
              {showCategoryMenu && (
                <div style={{ position: 'absolute', top: '40px', left: lang === 'ur' ? 'auto' : '0', right: lang === 'ur' ? '0' : 'auto', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', width: '260px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 200, padding: '10px 0' }}>
                  <button onClick={() => { router.push('/categories?stream=science'); setShowCategoryMenu(false); }} style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', textAlign: lang === 'ur' ? 'right' : 'left' }}>🧪 Science Stems</button>
                  <button onClick={() => { router.push('/categories?stream=commerce'); setShowCategoryMenu(false); }} style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', textAlign: lang === 'ur' ? 'right' : 'left' }}>📊 Commerce Hub</button>
                  <button onClick={() => { router.push('/categories?stream=paramedical'); setShowCategoryMenu(false); }} style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', textAlign: lang === 'ur' ? 'right' : 'left' }}>🩺 Paramedical & Medical</button>
                  <button onClick={() => { router.push('/categories?stream=btech'); setShowCategoryMenu(false); }} style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', textAlign: lang === 'ur' ? 'right' : 'left' }}>⚙️ Engineering Tech</button>
                </div>
              )}
            </div>

            <button onClick={() => setShowContactModal(true)} style={{ color: '#94a3b8', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>{t.navContact}</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => router.push('/login')} style={{ padding: '10px 20px', background: '#38bdf8', border: 'none', color: '#0f172a', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(56,189,248,0.3)' }}>{t.btnLogin}</button>
            <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} style={{ padding: '8px 16px', background: '#ff7a00', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>{lang === 'en' ? 'اردو' : 'English'}</button>
          </div>

        </div>
      </nav>

      <div className="marquee-container">
        <div className="marquee-text" style={{ paddingLeft: lang === 'ur' ? '0' : '100%', paddingRight: lang === 'ur' ? '100%' : '0', animationDirection: lang === 'ur' ? 'reverse' : 'normal' }}>
          {t.alertText}
        </div>
      </div>

      <main style={{ flex: 1, width: '100%', padding: '100px 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h2 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#fff', margin: '0 0 25px 0', letterSpacing: '-1px', lineHeight: '1.1' }}>
          {t.heroTitle}
        </h2>
        <p style={{ fontSize: '1.4rem', color: '#94a3b8', maxWidth: '800px', margin: '0 auto 50px auto', lineHeight: '1.6', fontWeight: '500' }}>
          {t.heroSub}
        </p>
        <button onClick={() => router.push('/assessment')} style={{ padding: '18px 50px', background: '#00b074', border: 'none', color: '#fff', borderRadius: '10px', fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0, 176, 116, 0.4)', transition: '0.2s' }}>
          {t.btnStart}
        </button>
      </main>

      {showContactModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '40px', maxWidth: '550px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', textAlign: lang === 'ur' ? 'right' : 'left' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#38bdf8', fontSize: '1.5rem', fontWeight: '800' }}>{t.contactTitle}</h4>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 25px 0' }}>{t.contactDetails}</p>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '20px', borderRadius: '8px', borderLeft: lang === 'en' ? '4px solid #ff7a00' : 'none', borderRight: lang === 'ur' ? '4px solid #ff7a00' : 'none', marginBottom: '30px' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#fff', fontSize: '1rem' }}>📍 {t.ownerLabel}</p>
              <p style={{ margin: 0, fontWeight: '800', color: '#ff7a00', fontSize: '1.1rem' }}>📞 {t.contactPhone}</p>
            </div>
            <button onClick={() => setShowContactModal(false)} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Close Window</button>
          </div>
        </div>
      )}

      <footer style={{ width: '100%', background: '#090d16', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '25px', textAlign: 'center', fontSize: '0.9rem', color: '#475569', fontWeight: '700' }}>
        {t.footerNote}
      </footer>
    </div>
  );
}
