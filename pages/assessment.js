import { useState } from 'react';
import { supabase } from '../utils/supabase';

export default function AssessmentWizard() {
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const streams = {
    science: {
      en: "Science Courses (3 Years)", ur: "سائنس کورسز (3 سالہ)",
      items: ["Bsc Physics", "Bsc Chemistry", "Bsc Botany", "Bsc Zoology", "Bsc Computer science", "Bsc Mathematics", "Bsc PCM", "Bsc CBZ", "Bsc Forestry", "Bsc Dietician & Nutritionist", "Bsc Home Science", "Bsc Agriculture Science", "Bsc Horticulture", "Bsc Sericulture", "Bsc Oceanography", "Bsc Melsorology", "Bsc Arthopology", "Bsc Forensic Science", "Bsc Food technology", "Bsc Diary Technology", "Bsc Hotel Management", "Bsc Fashion Design", "Bsc Mass Communication", "Bsc Electronic Media", "Bsc Multimedia", "Bsc 3D Animation"]
    },
    commerce: {
      en: "Commerce Courses", ur: "کامرس کورسز",
      items: ["CA Chartered Account", "CMA Cost Management Account", "CS Company Secretary (Foundation)", "B.Com Regular", "B.Com Taxation & Tax Procedure", "B.Com Travel & Tourism", "B.Com Bank Management", "B.Com Professional", "BBA / BBM Regular", "BFM Bachelor of Financial Management", "BMS", "BAF"]
    },
    humanities: {
      en: "Humanities Courses", ur: "آرٹس اور ہیومینٹیز",
      items: ["Advertising", "BS General", "Criminology", "Economics", "Fine Arts", "Foreign languages", "Home Science", "Interior Design", "Journalism", "Library Science", "Physical Education", "Political Science", "Psychology", "Social Work", "Sociology", "Travel and Tourism"]
    },
    management: {
      en: "Management Courses", ur: "مینجمنٹ کورسز",
      items: ["Business Management", "Bank Management", "Event Management", "Hospital Management", "Hotel Management", "Human Resources Management", "Logistics Management"]
    },
    law: {
      en: "Law Courses (3/5 Years)", ur: "قانون کے کورسز (3/5 سالہ)",
      items: ["LLB", "BA + LLB", "B.Com + LLB", "BBM + LLB", "BBA + LLB"]
    },
    medical: {
      en: "Medical Courses", ur: "میڈیکل کورسز",
      items: ["MBBS", "BUMS Unani", "BHMS Homeopathy", "BAMS Ayurveda", "BSMS Sidha", "BNYS Naturopathy", "BDS Dental", "BVSc Veterinary"]
    },
    paramedical: {
      en: "Paramedical Courses", ur: "پیرامیڈیکل کورسز",
      items: ["Nursing", "Pharm D", "B.Pharm", "D.Pharm", "M. Pharm", "Anesthesia technical", "Cardiac Care technical", "Perfusion technology", "Cathllab technology", "Clinical Optometry", "Dental Hygiene", "Dental Mechanic", "Dental Technician", "Health Inspector", "Medical imaging & Tech", "Medical Lab technician", "Medical Records tech", "Medical X Ray Technician", "Nuclear Medicine Tech", "Occupational Therapist", "Operation theater Tech", "Ophthalmic Assistant", "PHYSIOTHERAPY", "Radiographic Assistant", "Radiotherapy Technician", "Rehabilitation Therapy", "Respiratory Therapy Tech", "Blood Transfusion Tech", "Bsc Renal Dialysis"]
    },
    btech: {
      en: "B.Tech Engineering (4 Years)", ur: "بی ٹیک انجینئرنگ (4 سالہ)",
      items: ["Petro chemical Engineering", "Petroleum Engineering", "Civil Engineering", "Mechanical Engineering", "Aeronautical Engineering", "Aerospace Engineering", "Agricultural Engineering", "Architecture Engineering", "Automobile Engineering", "Automation & Robotics Eng.", "Avionics Engineering", "Biomedical Engineering", "Bio technological Eng.", "Chemical Engineering", "Ceramics Engineering", "Computer Science Engi.", "Electronics & Comm.Engi.", "Electrical & Electronics Engi.", "Environmental Science Engi.", "Information Science Engi", "Industrial Engineering", "Industrial Production Engi.", "Instrumental Technology", "Marine Engineering", "Medical Electronics Engi.", "Mining Engineering", "Manufacturing Science Engi.", "Naval Architecture Engi.", "Nanotechnology Engi.", "Polymer Technology Engi.", "Silk Polymar Engi.", "Carpet Technology Engi.", "Textile engineering", "Robotics", "Genetic"]
    },
    polytechnic: {
      en: "Polytechnic (10th Class)", ur: "پولی ٹیکنک (دسویں کے بعد)",
      items: ["Civil engineering", "Mechanical engineering", "Automobile engineering", "Computer science engi.", "Electronics and communication Engineering", "Electrical engineering", "Petro chemical engineering"]
    },
    newJobMgmt: {
      en: "New Job Opportunity Courses (2/3/5 Years)", ur: "جدید ملازمت کے مواقع والے کورسز",
      items: ["BBA / BBM", "BBA Aviation", "BBA Air Cargo Management", "BBA Aeronautical", "BBA Retail Marketing", "BBA Customer Care Management", "BBA Airline & Airport Management", "BBA Cargo Management", "BBA Office Management", "BBA Store Management", "BBA Mall Management", "BBA Logistics", "BCA SAP", "BCA Cloud Computing", "MBA Logistics", "MBA Aviation", "MBA HR", "MBA Management"]
    },
    architecture: {
      en: "Architecture (5 Years + 2)", ur: "آرکیٹیکچر کورسز",
      items: ["B.Arch (NATA is Compulsory)", "M.Arch"]
    }
  };

  const content = {
    en: {
      brand: "Samar Career Guidance",
      founder: "Founder: Ashfaque Umar",
      title: "Secure Academic Assessment Wizard",
      emailLabel: "Enter Email to Bind Secure Session Token:",
      chooseStream: "Select an Educational Stream to Explore:",
      nextBtn: "Continue Next",
      backBtn: "Go Back",
      homeBtn: "Return to Home Page",
      finishBtn: "Submit & Create Account Profile"
    },
    ur: {
      brand: "ثمر کیریئر رہنمائی",
      founder: "بانی: اشفاق عمر",
      title: "محفوظ کیریئر اسیسمنٹ وزرڈ",
      emailLabel: "سیشن ٹوکن محفوظ کرنے کے لیے ای میل درج کریں:",
      chooseStream: "تعلیمی شعبہ (Stream) منتخب کریں:",
      nextBtn: "اگلا مرحلہ",
      backBtn: "پیچھے جائیں",
      homeBtn: "ہوم پیج پر جائیں",
      finishBtn: "پروفائل اکاؤنٹ بنائیں"
    }
  };

  const t = content[lang];
  const urduFont = "'AlviNastaleeq', 'Tahoma', sans-serif";
  const englishFont = "'Segoe UI', sans-serif";

  const handleSubmit = async () => {
    if (!email || !selectedStream) {
      alert(lang === 'ur' ? 'براہ کرم سیشن کی تفصیلات مکمل کریں!' : 'Please complete all details.');
      return;
    }
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('user_assessments')
        .insert([
          { 
            email: email.trim().toLowerCase(), 
            interest_area: selectedStream, 
            preferred_language: lang 
          }
        ]);

      if (error) {
        alert("Database Connection Sync Error: " + error.message);
      } else {
        alert(lang === 'ur' ? 'کامیابی! آپ کا کیریئر پروفائل اکاؤنٹ تیار ہو چکا ہے۔' : 'Success! Your tracking profile account has been created.');
        // Code redirection to user tracking dashboard
        window.location.href = `/profile?email=${encodeURIComponent(email.trim().toLowerCase())}`;
      }
    } catch (err) {
      alert("Network Error: " + err.message);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ 
      direction: lang === 'ur' ? 'rtl' : 'ltr', 
      fontFamily: lang === 'ur' ? urduFont : englishFont, 
      padding: '20px', 
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
        .list-row { padding: 14px 18px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; font-weight: bold; color: #cbd5e1; display: block; width: 100%; box-sizing: border-box; }
        .list-row:hover { border-color: #ff7a00; background-color: rgba(255,122,0,0.05); color: #fff; }
        .list-row.selected { border-color: #38bdf8; background-color: #1e3a8a; color: #fff; box-shadow: 0 4px 12px rgba(56,189,248,0.2); }
        .course-chip { display: inline-block; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255,255,255,0.1); padding: 8px 14px; border-radius: 4px; font-size: 0.95rem; font-weight: 600; margin: 5px; color: #cbd5e1; }
      `}</style>

      <div style={{ maxWidth: '800px', width: '100%', margin: '40px auto', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '35px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)' }} />
            <div>
              <h3 style={{ margin: 0, color: '#38bdf8', fontWeight: '800' }}>{t.brand}</h3>
              <small style={{ color: '#ff7a00', fontWeight: 'bold' }}>{t.founder}</small>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} style={{ padding: '6px 14px', cursor: 'pointer', background: '#ff7a00', border: 'none', color: '#fff', borderRadius: '6px', font... }}>{lang === 'en' ? 'اردو' : 'English'}</button>
        </header>

        <main style={{ minHeight: '320px', flex: 1 }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '25px', fontWeight: '800' }}>{t.title}</h2>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#94a3b8' }}>{t.emailLabel}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '20px', fontWeight: '800' }}>{t.chooseStream}</h3>
              <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
                {Object.keys(streams).map((key) => (
                  <button 
                    key={key} 
                    onClick={() => setSelectedStream(key)}
                    className={`list-row ${selectedStream === key ? 'selected' : ''}`}
                    style={{ textAlign: lang === 'ur' ? 'right' : 'left' }}
                  >
                    {lang === 'ur' ? streams[key].ur : streams[key].en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && selectedStream && (
            <div>
              <h3 style={{ fontSize: '1.4rem', color: '#38bdf8', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', fontWeight: '800' }}>
                {lang === 'ur' ? streams[selectedStream].ur : streams[selectedStream].en}
              </h3>
              <div style={{ background: 'transparent', padding: '10px 0' }}>
                {streams[selectedStream].items.map((item) => (
                  <span key={item} className="course-chip">{item}</span>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px', display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>{t.backBtn}</button>
            )}
            <a href="/" style={{ textDecoration: 'none' }}>
              <button type="button" style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                {t.homeBtn}
              </button>
            </a>
          </div>
          
          {step < 3 ? (
            <button onClick={() => { if (step === 1 && !email) { alert(lang === 'ur' ? 'ای میل درج کرنا ضروری ہے!' : 'Email token validation required.'); return; } setStep(step + 1); }} style={{ padding: '10px 24px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{t.nextBtn}</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} style={{ padding: '10px 26px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
              {submitting ? '...' : t.finishBtn}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
