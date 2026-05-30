import { useState } from 'react';

export default function Home() {
  const [lang, setLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  const UIContent = {
    en: {
      brand: "Samar Career Guidance",
      founder: "Founder: Ashfaque Umar",
      title: "Secure Career Guidance Platform",
      subtitle: "Discover the perfect career path with enterprise-grade data protection.",
      marquee: "🔥 Notification Alert: Government Approved Career Alignment Matrix Now Live! Explore Over 150+ Dynamic Strategic Stems.",
      searchPlaceholder: "Search courses instantly...",
      btnText: "Start Assessment Test",
      loginText: "Student Login",
      footerTitle: "Samar Career Guidance Platform Engine",
      footerRights: "© 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked."
    },
    ur: {
      brand: "ثمر کیریئر رہنمائی",
      founder: "بانی: اشفاق عمر",
      title: "ثمر کیریئر گائیڈنس پلیٹ فارم",
      subtitle: "انٹرپرائز گریڈ ڈیٹا تحفظ کے ساتھ اپنے بہترین کیریئر کا انتخاب کریں۔",
      marquee: "🔥 اہم اطلاع: جدید ترین کیریئر کونسلنگ سسٹم لائیو ہے! اپنی صلاحیتوں کے مطابق صحیح کورس کا انتخاب کریں۔",
      searchPlaceholder: "کورسز تلاش کریں...",
      btnText: "ٹیسٹ شروع کریں",
      loginText: "اسٹوڈنٹ لاگ ان",
      footerTitle: "ثمر کیریئر گائیڈنس کونسلنگ پورٹل",
      footerRights: "© 2026 ثمر فاؤنڈیشن۔ تمام حقوق محفوظ ہیں۔"
    }
  };

  const ui = UIContent[lang];
  const urduFont = "'AlviNastaleeq', 'Tahoma', sans-serif";
  const englishFont = "'Segoe UI', 'Arial', sans-serif";

  return (
    <div style={{ 
      direction: lang === 'ur' ? 'rtl' : 'ltr', 
      fontFamily: lang === 'ur' ? urduFont : englishFont,
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.15) 1px, #0f172a 1px)`,
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0, 12px 12px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style jsx global>{`
        @font-face { font-family: 'AlviNastaleeq'; src: url('/alvi-nastaleeq.ttf') format('truetype'); }
        @keyframes marqueeMovement {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .motion-marquee-text {
          display: inline-block;
          white-space: nowrap;
          animation: marqueeMovement 25s linear infinite;
          padding-left: 50px;
        }
      `}</style>

      {/* 1. Header with Student Login Option */}
      <header style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', sticky: 'top', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 style={{ margin: 0, color: '#38bdf8', fontSize: '1.25rem', fontWeight: '800' }}>{ui.brand}</h1>
              <span style={{ color: '#ff7a00', fontWeight: 'bold', fontSize: '0.75rem' }}>{ui.founder}</span>
            </div>
          </div>

          <div style={{ flex: 1, maxWidth: '400px', margin: '0 15px' }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              style={{ width: '100%', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => alert('Student Login System Active.')}
              style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
            >
              {ui.loginText}
            </button>
            <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} style={{ padding: '8px 14px', backgroundColor: '#ff7a00', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {lang === 'en' ? 'اردو' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Moving Text Headline */}
      <div style={{ background: 'rgba(30, 41, 59, 0.9)', color: '#38bdf8', overflow: 'hidden', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <span className="motion-marquee-text">{ui.marquee}</span>
        </div>
      </div>

      {/* 3. Original Green Button Module */}
      <main style={{ maxWidth: '800px', margin: 'auto', textAlign: 'center', padding: '40px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2.6rem', color: '#fff', fontWeight: '800', marginBottom: '15px' }}>{ui.title}</h2>
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '35px' }}>{ui.subtitle}</p>
        
        <a href="/assessment" style={{ textDecoration: 'none' }}>
          <button style={{ 
            padding: '12px 35px', 
            fontSize: '1rem', 
            backgroundColor: '#10b981', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}>
            {ui.btnText}
          </button>
        </a>
      </main>

      {/* 4. Footer */}
      <footer style={{ background: '#090d16', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '30px 20px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: '0', color: '#fff', fontSize: '1rem' }}>{ui.footerTitle}</h4>
            <span style={{ fontSize: '0.8rem', color: '#ff7a00', fontWeight: 'bold' }}>{ui.founder}</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{ui.footerRights}</p>
        </div>
      </footer>
    </div>
  );
}