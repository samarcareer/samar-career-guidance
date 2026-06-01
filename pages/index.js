import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
  };

  return (
    <div style={{ direction: lang === 'ur' ? 'rtl' : 'ltr', fontFamily: lang === 'ur' ? "'AlviNastaleeq', 'Tahoma', sans-serif" : "'Segoe UI', Roboto, sans-serif", backgroundColor: '#0f0a1a', backgroundImage: `radial-gradient(rgba(147, 51, 234, 0.15) 1px, transparent 1px)`, backgroundSize: '24px 24px', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @font-face { font-family: 'AlviNastaleeq'; src: url('/alvi-nastaleeq.ttf') format('truetype'); font-display: swap; }
        
        /* Glassmorphism Purple Header/Footer */
        .glass-purple { background: rgba(88, 28, 135, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.1); }
        .marquee-bar { background: rgba(126, 34, 206, 0.85); padding: 10px 0; overflow: hidden; white-space: nowrap; width: 100%; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .marquee-text { display: inline-block; padding-left: 100%; animation: marquee 25s linear infinite; font-size: 0.95rem; font-weight: 600; color: #fff; }
        @keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }

        /* Open Book UI Animation */
        @keyframes softScaleIn { 0% { transform: scale(0.92); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .book-spread { display: flex; width: 100%; max-width: 1200px; margin: 60px auto; background: rgba(46, 16, 101, 0.4); border-radius: 16px; box-shadow: 0 30px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(168, 85, 247, 0.2); animation: softScaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; position: relative; border: 1px solid rgba(168, 85, 247, 0.3); }
        .book-spread::after { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 4px; background: linear-gradient(to right, rgba(0,0,0,0.6), rgba(255,255,255,0.1), rgba(0,0,0,0.6)); transform: translateX(-50%); z-index: 10; }
        .page-left, .page-right { flex: 1; padding: 50px; position: relative; display: flex; flexDirection: column; justify-content: center; }
        .page-left { border-radius: 16px 0 0 16px; background: linear-gradient(135deg, rgba(59, 7, 100, 0.9), rgba(88, 28, 135, 0.8)); }
        .page-right { border-radius: 0 16px 16px 0; background: rgba(30, 27, 75, 0.9); }
        
        /* Dropdown Glass */
        .glass-dropdown { background: rgba(88, 28, 135, 0.85); backdrop-filter: blur(10px); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }

        @media (max-width: 768px) {
          .book-spread { flexDirection: column; margin: 30px auto; }
          .book-spread::after { display: none; }
          .page-left { border-radius: 16px 16px 0 0; padding: 40px 20px; }
          .page-right { border-radius: 0 0 16px 16px; padding: 40px 20px; }
        }
      `}} />
      
      {/* HEADER */}
      <nav className="glass-purple" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 100, padding: '15px 5%' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '6px', border: '2px solid #a855f7' }} />
            <div>
              <h1 style={{ margin: 0, color: '#e9d5ff', fontSize: '1.4rem', fontWeight: '800' }}>{t.brand}</h1>
              <small style={{ color: '#d8b4fe', fontWeight: 'bold', display: 'block', marginTop: '-2px' }}>{t.founder}</small>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} style={{ flex: '1', maxWidth: '500px', minWidth: '200px', margin: '0 20px' }}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: '1px solid rgba(168, 85, 247, 0.5)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.95rem', outline: 'none' }} />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative' }}>
            <button onClick={() => router.push('/')} style={{ color: '#e9d5ff', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>{t.navHome}</button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowCategoryMenu(!showCategoryMenu)} style={{ color: '#c084fc', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>{t.navCategory} ▾</button>
              {showCategoryMenu && (
                <div className="glass-dropdown" style={{ position: 'absolute', top: '40px', left: lang === 'ur' ? 'auto' : '0', right: lang === 'ur' ? '0' : 'auto', width: '260px', padding: '10px 0', zIndex: 200 }}>
                  {['science', 'commerce', 'paramedical', 'btech'].map(stream => (
                    <button key={stream} onClick={() => { router.push(`/categories?stream=${stream}`); setShowCategoryMenu(false); }} style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#e9d5ff', fontWeight: '600', cursor: 'pointer', textAlign: lang === 'ur' ? 'right' : 'left', textTransform: 'capitalize' }}>{stream} Matrix</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setShowContactModal(true)} style={{ color: '#c084fc', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>{t.navContact}</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => router.push('/login')} style={{ padding: '10px 20px', background: '#a855f7', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)' }}>{t.btnLogin}</button>
            <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} style={{ padding: '8px 16px', background: '#d8b4fe', border: 'none', color: '#4c1d95', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{lang === 'en' ? 'اردو' : 'English'}</button>
          </div>

        </div>
      </nav>

      {/* MARQUEE */}
      <div className="marquee-bar">
        <div className="marquee-text" style={{ animationDirection: lang === 'ur' ? 'reverse' : 'normal' }}>{t.alertText}</div>
      </div>

      {/* BOOK SPREAD HERO */}
      <main style={{ flex: 1, width: '100%', padding: '20px 5%' }}>
        <div className="book-spread">
          <div className="page-left" style={{ textAlign: 'center' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '100px', height: '100px', borderRadius: '15px', margin: '0 auto 20px', border: '3px solid #d8b4fe', boxShadow: '0 0 20px rgba(216, 180, 254, 0.5)' }} />
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', margin: '0 0 15px 0', lineHeight: '1.2' }}>{t.heroTitle}</h2>
            <h4 style={{ color: '#d8b4fe', fontSize: '1.2rem', margin: 0 }}>{t.founder}</h4>
          </div>
          <div className="page-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: '1.4rem', color: '#c084fc', margin: '0 0 40px 0', lineHeight: '1.6', fontWeight: '500' }}>{t.heroSub}</p>
            <button onClick={() => router.push('/assessment')} style={{ padding: '18px 50px', background: 'linear-gradient(90deg, #9333ea, #a855f7)', border: 'none', color: '#fff', borderRadius: '10px', fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 30px rgba(168, 85, 247, 0.5)', transition: '0.2s' }}>
              {t.btnStart}
            </button>
          </div>
        </div>
      </main>

      {/* CONTACT MODAL */}
      {showContactModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#3b0764', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '16px', padding: '40px', maxWidth: '550px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#e9d5ff', fontSize: '1.5rem', fontWeight: '800' }}>{t.contactTitle}</h4>
            <p style={{ color: '#c084fc', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 25px 0' }}>{t.contactDetails}</p>
            <div style={{ background: 'rgba(88, 28, 135, 0.6)', padding: '20px', borderRadius: '8px', borderLeft: lang === 'en' ? '4px solid #d8b4fe' : 'none', borderRight: lang === 'ur' ? '4px solid #d8b4fe' : 'none', marginBottom: '30px' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#fff', fontSize: '1rem' }}>📍 {t.ownerLabel}</p>
              <p style={{ margin: 0, fontWeight: '800', color: '#d8b4fe', fontSize: '1.1rem' }}>📞 {t.contactPhone}</p>
            </div>
            <button onClick={() => setShowContactModal(false)} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Close Window</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="glass-purple" style={{ width: '100%', padding: '25px', textAlign: 'center', fontSize: '0.9rem', color: '#d8b4fe', fontWeight: '700' }}>
        {t.footerNote}
      </footer>
    </div>
  );
}
