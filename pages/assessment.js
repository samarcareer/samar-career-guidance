import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

export default function AssessmentWizard() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const streams = {
    science: { en: "Science Courses (3 Years)", ur: "سائنس کورسز (3 سالہ)", items: ["Bsc Physics", "Bsc Chemistry", "Bsc Botany", "Bsc Zoology", "Bsc Computer science", "Bsc Mathematics", "Bsc PCM", "Bsc CBZ", "Bsc Forestry", "Bsc Dietician & Nutritionist", "Bsc Home Science", "Bsc Agriculture Science", "Bsc Horticulture", "Bsc Sericulture", "Bsc Oceanography", "Bsc Melsorology", "Bsc Arthopology", "Bsc Forensic Science", "Bsc Food technology", "Bsc Diary Technology", "Bsc Hotel Management", "Bsc Fashion Design", "Bsc Mass Communication", "Bsc Electronic Media", "Bsc Multimedia", "Bsc 3D Animation"] },
    commerce: { en: "Commerce Courses", ur: "کامرس کورسز", items: ["CA Chartered Account", "CMA Cost Management Account", "CS Company Secretary (Foundation)", "B.Com Regular", "B.Com Taxation & Tax Procedure", "B.Com Travel & Tourism", "B.Com Bank Management", "B.Com Professional", "BBA / BBM Regular", "BFM Bachelor of Financial Management", "BMS", "BAF"] },
    humanities: { en: "Humanities Courses", ur: "آرٹس اور ہیومینٹیز", items: ["Advertising", "BS General", "Criminology", "Economics", "Fine Arts", "Foreign languages", "Home Science", "Interior Design", "Journalism", "Library Science", "Physical Education", "Political Science", "Psychology", "Social Work", "Sociology", "Travel and Tourism"] },
    management: { en: "Management Courses", ur: "مینجمنٹ کورسز", items: ["Business Management", "Bank Management", "Event Management", "Hospital Management", "Hotel Management", "Human Resources Management", "Logistics Management"] },
    law: { en: "Law Courses (3/5 Years)", ur: "قانون کے کورسز (3/5 سالہ)", items: ["LLB", "BA + LLB", "B.Com + LLB", "BBM + LLB", "BBA + LLB"] },
    medical: { en: "Medical Courses", ur: "میڈیکل کورسز", items: ["MBBS", "BUMS Unani", "BHMS Homeopathy", "BAMS Ayurveda", "BSMS Sidha", "BNYS Naturopathy", "BDS Dental", "BVSc Veterinary"] },
    paramedical: { en: "Paramedical Courses", ur: "پیرامیڈیکل کورسز", items: ["Nursing", "Pharm D", "B.Pharm", "D.Pharm", "M. Pharm", "Anesthesia technical", "Cardiac Care technical", "Perfusion technology", "Cathllab technology", "Clinical Optometry", "Dental Hygiene", "Dental Mechanic", "Dental Technician", "Health Inspector", "Medical imaging & Tech", "Medical Lab technician", "Medical Records tech", "Medical X Ray Technician", "Nuclear Medicine Tech", "Occupational Therapist", "Operation theater Tech", "Ophthalmic Assistant", "PHYSIOTHERAPY", "Radiographic Assistant", "Radiotherapy Technician", "Rehabilitation Therapy", "Respiratory Therapy Tech", "Blood Transfusion Tech", "Bsc Renal Dialysis"] },
    btech: { en: "B.Tech Engineering (4 Years)", ur: "بی ٹیک انجینئرنگ (4 سالہ)", items: ["Petro chemical Engineering", "Petroleum Engineering", "Civil Engineering", "Mechanical Engineering", "Aeronautical Engineering", "Aerospace Engineering", "Agricultural Engineering", "Architecture Engineering", "Automobile Engineering", "Automation & Robotics Eng.", "Avionics Engineering", "Biomedical Engineering", "Bio technological Eng.", "Chemical Engineering", "Ceramics Engineering", "Computer Science Engi.", "Electronics & Comm.Engi.", "Electrical & Electronics Engi.", "Environmental Science Engi.", "Information Science Engi", "Industrial Engineering", "Industrial Production Engi.", "Instrumental Technology", "Marine Engineering", "Medical Electronics Engi.", "Mining Engineering", "Manufacturing Science Engi.", "Naval Architecture Engi.", "Nanotechnology Engi.", "Polymer Technology Engi.", "Silk Polymar Engi.", "Carpet Technology Engi.", "Textile engineering", "Robotics", "Genetic"] },
    polytechnic: { en: "Polytechnic (10th Class)", ur: "پولی ٹیکنک (دسویں کے بعد)", items: ["Civil engineering", "Mechanical engineering", "Automobile engineering", "Computer science engi.", "Electronics and communication Engineering", "Electrical engineering", "Petro chemical engineering"] },
    newJobMgmt: { en: "New Job Opportunity Courses (2/3/5 Years)", ur: "جدید ملازمت کے مواقع والے کورسز", items: ["BBA / BBM", "BBA Aviation", "BBA Air Cargo Management", "BBA Aeronautical", "BBA Retail Marketing", "BBA Customer Care Management", "BBA Airline & Airport Management", "BBA Cargo Management", "BBA Office Management", "BBA Store Management", "BBA Mall Management", "BBA Logistics", "BCA SAP", "BCA Cloud Computing", "MBA Logistics", "MBA Aviation", "MBA HR", "MBA Management"] },
    architecture: { en: "Architecture (5 Years + 2)", ur: "آرکیٹیکچر کورسز", items: ["B.Arch (NATA is Compulsory)", "M.Arch"] }
  };

  const t = {
    brand: "Samar Career Guidance",
    founder: "Founder: Dr. Ashfaque Umar",
    title: lang === 'ur' ? "محفوظ کیریئر اسیسمنٹ وزرڈ" : "Secure Academic Assessment Wizard",
    emailLabel: lang === 'ur' ? "سیشن ٹوکن محفوظ کرنے کے لیے ای میل درج کریں:" : "Enter Email to Bind Secure Session Token:",
    chooseStream: lang === 'ur' ? "تعلیمی شعبہ (Stream) منتخب کریں:" : "Select an Educational Stream to Explore:",
    nextBtn: lang === 'ur' ? "اگلا مرحلہ" : "Continue Next",
    backBtn: lang === 'ur' ? "پیچھے جائیں" : "Go Back",
    homeBtn: lang === 'ur' ? "ہوم پیج پر جائیں" : "Return to Home Page",
    finishBtn: lang === 'ur' ? "پروفائل اکاؤنٹ بنائیں" : "Submit & Create Account Profile"
  };

  const handleSubmit = async () => {
    if (!email) {
      const inputEmail = prompt(lang === 'ur' ? "ڈیٹا محفوظ کرنے کے لیے ای میل درج کریں:" : "Please provide your Email to store validation data:");
      if (inputEmail && inputEmail.includes('@')) {
        setEmail(inputEmail.trim().toLowerCase());
        executeDbInsert(inputEmail.trim().toLowerCase(), selectedStream);
      } else {
        alert(lang === 'ur' ? "درست ای میل لازمی ہے!" : "Valid Email is required.");
      }
      return;
    }
    executeDbInsert(email.trim().toLowerCase(), selectedStream);
  };

  const executeDbInsert = async (userEmail, targetStream) => {
    if (!userEmail || !targetStream) return;
    setSubmitting(true);
    try {
      const { data: existingEntries } = await supabase.from('user_assessments').select('email').eq('email', userEmail);
      if (existingEntries && existingEntries.length > 0) {
        alert(lang === 'ur' ? "یہ ای میل پہلے سے موجود ہے!" : "Error: Email already exists.");
        router.push(`/profile?email=${encodeURIComponent(userEmail)}`);
        setSubmitting(false);
        return;
      }
      const { error: insertError } = await supabase.from('user_assessments').insert([{ email: userEmail, interest_area: targetStream, preferred_language: lang }]);
      if (insertError) {
        alert("Database Error: " + insertError.message);
      } else {
        router.push(`/profile?email=${encodeURIComponent(userEmail)}`);
      }
    } catch (err) { alert(err.message); }
    setSubmitting(false);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0f172a', backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.15) 1px, #0f172a 1px)`, backgroundSize: '24px 24px', display: 'flex', flexDirection: 'column', padding: '40px 5%', fontFamily: lang === 'ur' ? "'AlviNastaleeq', 'Tahoma', sans-serif" : "'Segoe UI', sans-serif", direction: lang === 'ur' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        @font-face { font-family: 'AlviNastaleeq'; src: url('/alvi-nastaleeq.ttf') format('truetype'); }
        .course-chip { display: inline-block; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255,255,255,0.1); padding: 8px 14px; border-radius: 4px; font-size: 0.95rem; font-weight: 600; margin: 5px; color: #cbd5e1; }
        .list-row { padding: 16px 20px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 12px; cursor: pointer; font-weight: bold; color: #cbd5e1; display: block; width: 100%; box-sizing: border-box; font-size: 1.05rem; }
        .list-row:hover { border-color: #ff7a00; background-color: rgba(255,122,0,0.05); color: #fff; }
        .list-row.selected { border-color: #38bdf8; background-color: #1e3a8a; color: #fff; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '50px', height: '50px', borderRadius: '8px' }} />
            <div>
              <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.4rem' }}>{t.brand}</h3>
              <small style={{ color: '#ff7a00', fontWeight: 'bold' }}>{t.founder}</small>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} style={{ padding: '8px 20px', background: '#ff7a00', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{lang === 'en' ? 'اردو' : 'English'}</button>
        </header>

        <main style={{ flex: 1 }}>
          {step === 1 && (
            <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
              <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '30px' }}>{t.title}</h2>
              <label style={{ display: 'block', marginBottom: '15px', color: '#94a3b8', fontSize: '1.1rem' }}>{t.emailLabel}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" style={{ width: '100%', padding: '16px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '1.1rem', outline: 'none' }} />
            </div>
          )}

          {step === 2 && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '30px' }}>{t.chooseStream}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                {Object.keys(streams).map((key) => (
                  <button key={key} onClick={() => setSelectedStream(key)} className={`list-row ${selectedStream === key ? 'selected' : ''}`} style={{ textAlign: lang === 'ur' ? 'right' : 'left' }}>
                    {lang === 'ur' ? streams[key].ur : streams[key].en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && selectedStream && (
            <div>
              <h3 style={{ fontSize: '1.8rem', color: '#38bdf8', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                {lang === 'ur' ? streams[selectedStream].ur : streams[selectedStream].en}
              </h3>
              <div>
                {streams[selectedStream].items.map((item) => <span key={item} className="course-chip">{item}</span>)}
              </div>
            </div>
          )}
        </main>

        <footer style={{ marginTop: '50px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            {step > 1 && <button onClick={() => setStep(step - 1)} style={{ padding: '12px 25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t.backBtn}</button>}
            <button onClick={() => router.push('/')} style={{ padding: '12px 25px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t.homeBtn}</button>
          </div>
          {step < 3 ? (
            <button onClick={() => { if (step === 1 && !email) { alert('Email is required!'); return; } setStep(step + 1); }} style={{ padding: '12px 35px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>{t.nextBtn}</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} style={{ padding: '12px 40px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>{submitting ? '...' : t.finishBtn}</button>
          )}
        </footer>
      </div>
    </div>
  );
}
