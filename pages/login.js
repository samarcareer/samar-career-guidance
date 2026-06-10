import React, { useState, useEffect, Component } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{color:'white', background:'#0f172a', padding:'50px', textAlign:'center'}}>Page Error. Please refresh.</div>;
    return this.props.children;
  }
}

// ... (Translations mapping keep the same as before) ...
const t = {
  en: { brand: "Samar Guidance", doctor: "Dr. Ashfaque Umar", navHome: "Home", navAbout: "About Us", navAssess: "Career Assessment", navProfile: "My Profile", profileTitle: "Student Dashboard", profileSub: "Manage your career profile.", step1: "Basic Details", step2: "Academic Info", step3: "Career Goals", fullName: "Full Name", phone: "WhatsApp / Phone", gender: "Gender", city: "City / Town", photo: "Profile Photo (Optional)", eduLevel: "Education Level", stream: "Current Stream", college: "School / College Name", goal: "Career Goal", struggle: "Main struggle?", saveBtn: "Save Profile", saving: "Saving...", nextBtn: "Next", prevBtn: "Previous", assessmentCardTitle: "Diagnostic Career Assessment", assessmentCardSubLocked: "Complete profile to unlock.", assessmentCardSubUnlocked: "Profile verified! Take the test now.", takeTestBtn: "Take Assessment Now", lockedBtn: "Profile Incomplete", selectOption: "-- Select Option --" },
  ur: { brand: "ثمر گائیڈنس", doctor: "ڈاکٹر اشفاق عمر", navHome: "ہوم", navAbout: "ہمارے بارے میں", navAssess: "کیریئر اسسمنٹ", navProfile: "میری پروفائل", profileTitle: "طالب علم ڈیش بورڈ", profileSub: "اپنی کیریئر پروفائل کا انتظام کریں۔", step1: "بنیادی تفصیلات", step2: "تعلیمی معلومات", step3: "کیریئر کے اہداف", fullName: "پورا نام", phone: "واٹس ایپ / فون نمبر", gender: "جنس", city: "شہر / قصبہ", photo: "پروفائل فوٹو (اختیاری)", eduLevel: "موجودہ تعلیم", stream: "موجودہ شعبہ", college: "اسکول / کالج کا نام", goal: "کیریئر کا ہدف", struggle: "سب سے بڑا مسئلہ؟", saveBtn: "محفوظ کریں", saving: "محفوظ ہو رہا ہے...", nextBtn: "اگلا", prevBtn: "پچھلا", assessmentCardTitle: "ڈائگنوسٹک کیریئر اسسمنٹ", assessmentCardSubLocked: "ٹیسٹ انلاک کرنے کے لیے پروفائل مکمل کریں۔", assessmentCardSubUnlocked: "پروفائل مکمل ہے! ٹیسٹ دیں۔", takeTestBtn: "اسسمنٹ دیں", lockedBtn: "نامکمل", selectOption: "-- منتخب کریں --" }
};

export default function StudentProfile() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '', phone: '', gender: '', city: '',
    education_level: '', stream: '', college_name: '',
    career_goal: '', main_struggle: '', photo_url: '', personal_notes: '', lead_status: 'New'
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); window.addEventListener('resize', handleResize);

    const initProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUser(session.user);

      const { data: pData } = await supabase.from('student_profiles').select('*').eq('id', session.user.id).single();
      if (pData) {
        setFormData({
          full_name: pData.full_name || '', phone: pData.phone || '', gender: pData.gender || '', city: pData.city || '',
          education_level: pData.education_level || '', stream: pData.stream || '', college_name: pData.college_name || '',
          career_goal: pData.career_goal || '', main_struggle: pData.main_struggle || '', photo_url: pData.photo_url || '',
          personal_notes: pData.personal_notes || '', lead_status: pData.lead_status || 'New'
        });
        setIsComplete(pData.is_complete || false);
      }
      setLoading(false);
    };
    initProfile();
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // SAFE IMAGE COMPRESSOR (Prevents Crash)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if(file.size > 5000000) { alert("File too large! Max 5MB allowed."); return; } // Safety limit
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', 0.5); // 50% quality
          setFormData({ ...formData, photo_url: compressed });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateProgress = () => {
    let f = 0;
    if (formData.full_name) f++; if (formData.phone) f++; if (formData.gender) f++; if (formData.city) f++;
    if (formData.education_level) f++; if (formData.stream || ['8th', '9th', '10th'].includes(formData.education_level)) f++;
    if (formData.college_name) f++; if (formData.career_goal) f++;
    return Math.min(Math.round((f / 8) * 100), 100);
  };
  const progress = calculateProgress();

  const handleSaveProfile = async (e) => {
    if(e) e.preventDefault();
    setSaving(true);
    const isFullyFilled = progress === 100;
    const payload = { id: user.id, email: user.email, ...formData, is_complete: isFullyFilled };
    
    try {
      const { error } = await supabase.from('student_profiles').upsert([payload]);
      if (error) throw error;
      setIsComplete(isFullyFilled);
      window.scrollTo(0,0);
    } catch(err) {
      alert("Error saving. Image might be too large, try a smaller photo.");
      console.error(err);
    }
    setSaving(false);
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    await supabase.from('student_profiles').update({ personal_notes: formData.personal_notes }).eq('id', user.id);
    setSavingNotes(false);
    alert("Notes saved!");
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#38bdf8' }}><h2>Loading Dashboard...</h2></div>;

  return (
    <ErrorBoundary>
      <div style={{ backgroundColor: '#0f172a', backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px)`, backgroundSize: '30px 30px', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <title>{t[lang].navProfile}</title>
        </Head>

        {/* Global Styles here... */}
        <style dangerouslySetInnerHTML={{__html: `
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
          .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; }
          .desktop-menu { display: flex; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
          .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; cursor: pointer; background: none; border: none; }
          .profile-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 35px; margin-bottom: 25px; width: 100%; max-width: 800px; }
          .input-field { width: 100%; padding: 12px; border-radius: 8px; background: rgba(15,23,42,0.6); border: 1px solid rgba(56,189,248,0.3); color: #fff; margin-top: 5px; outline: none; }
          .btn-primary { background: #38bdf8; color: #0f172a; padding: 12px 25px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        `}} />

        <nav>
          <div className="nav-top-row">
            <h1 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900', cursor:'pointer' }} onClick={() => router.push('/')}>Samar Guidance</h1>
            <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }} onClick={()=>supabase.auth.signOut().then(()=>router.push('/login'))}><i className='bx bx-log-out'></i></button>
          </div>
          <div className="desktop-menu">
              <button className="nav-link" onClick={() => router.push('/')}>Home</button>
              <button className="nav-link active">My Profile</button>
          </div>
        </nav>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 5%' }}>
          <header style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '3rem', color: '#38bdf8', marginBottom: '10px' }}>
              {formData.photo_url ? <img src={formData.photo_url} alt="Profile" style={{width:'80px', height:'80px', borderRadius:'50%', objectFit:'cover', border:'3px solid #38bdf8'}} /> : <i className='bx bx-user-circle'></i>}
            </div>
            <h1 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '5px' }}>{t[lang].profileTitle}</h1>
            <p style={{ background: 'rgba(15,23,42,0.8)', padding: '5px 15px', borderRadius: '20px', color: '#10b981', border: '1px solid #334155' }}>{user?.email}</p>
          </header>

          {!isComplete && (
            <form className="profile-card" onSubmit={handleSaveProfile}>
              <div style={{ display: 'flex', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
                <button type="button" onClick={()=>setCurrentStep(1)} style={{ flex: 1, padding: '10px', background: currentStep===1 ? 'rgba(56,189,248,0.1)' : 'transparent', color: currentStep===1 ? '#38bdf8' : '#64748b', border: 'none', borderBottom: currentStep===1 ? '2px solid #38bdf8' : 'none' }}>1. Basic</button>
                <button type="button" onClick={()=>setCurrentStep(2)} style={{ flex: 1, padding: '10px', background: currentStep===2 ? 'rgba(56,189,248,0.1)' : 'transparent', color: currentStep===2 ? '#38bdf8' : '#64748b', border: 'none', borderBottom: currentStep===2 ? '2px solid #38bdf8' : 'none' }}>2. Academic</button>
                <button type="button" onClick={()=>setCurrentStep(3)} style={{ flex: 1, padding: '10px', background: currentStep===3 ? 'rgba(56,189,248,0.1)' : 'transparent', color: currentStep===3 ? '#38bdf8' : '#64748b', border: 'none', borderBottom: currentStep===3 ? '2px solid #38bdf8' : 'none' }}>3. Goals</button>
              </div>

              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   <label>Full Name *<input type="text" name="full_name" className="input-field" value={formData.full_name} onChange={handleChange} required /></label>
                   <label>Profile Photo <input type="file" accept="image/*" onChange={handlePhotoChange} className="input-field" /></label>
                   <label>Phone / WhatsApp *<input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleChange} required /></label>
                   <label>Gender *<select name="gender" className="input-field" value={formData.gender} onChange={handleChange} required><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select></label>
                   <label>City *<input type="text" name="city" className="input-field" value={formData.city} onChange={handleChange} required /></label>
                </div>
              )}
              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   <label>Education Level *<select name="education_level" className="input-field" value={formData.education_level} onChange={handleChange} required><option value="">Select</option><option value="8th">8th</option><option value="9th">9th</option><option value="10th">10th</option><option value="11th">11th</option><option value="12th">12th</option><option value="Graduate">Graduate</option></select></label>
                   <label>Stream <select name="stream" className="input-field" value={formData.stream} onChange={handleChange} disabled={['8th', '9th', '10th'].includes(formData.education_level)}><option value="">Select</option><option value="Science">Science</option><option value="Commerce">Commerce</option><option value="Arts">Arts</option><option value="Polytechnic">Polytechnic</option></select></label>
                   <label>School/College Name *<input type="text" name="college_name" className="input-field" value={formData.college_name} onChange={handleChange} required /></label>
                </div>
              )}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   <label>Career Goal *<select name="career_goal" className="input-field" value={formData.career_goal} onChange={handleChange} required><option value="">Select</option><option value="Engineering">Engineering / IT</option><option value="Medical">Medical / Pharmacy</option><option value="Business">Business / CA</option><option value="Arts">Arts / Design</option><option value="Govt">Government Jobs</option><option value="Undecided">Undecided</option></select></label>
                   <label>Main Struggle<textarea name="main_struggle" className="input-field" rows="3" value={formData.main_struggle} onChange={handleChange}></textarea></label>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                {currentStep > 1 ? <button type="button" onClick={()=>setCurrentStep(currentStep - 1)} style={{padding:'10px', background:'transparent', color:'#fff', border:'1px solid #475569', borderRadius:'8px'}}>Previous</button> : <div></div>}
                {currentStep < 3 ? <button type="button" className="btn-primary" onClick={()=>setCurrentStep(currentStep + 1)}>Next</button> : <button type="submit" className="btn-primary" style={{background:'#10b981', color:'#fff'}} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>}
              </div>
            </form>
          )}

          <div className="profile-card" style={{ textAlign: 'center', borderColor: isComplete ? '#10b981' : '#ef4444' }}>
            <i className={isComplete ? 'bx bx-rocket' : 'bx bxs-lock'} style={{ fontSize: '4rem', color: isComplete ? '#10b981' : '#ef4444' }}></i>
            <h2 style={{ color: '#fff', margin: '10px 0' }}>Career Assessment</h2>
            {isComplete ? (
               <button onClick={() => router.push('/assessment')} style={{ background: '#10b981', color: '#fff', padding: '15px 30px', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', marginTop: '10px', cursor: 'pointer' }}>Take Assessment Now</button>
            ) : (
               <p style={{ color: '#ef4444' }}>Complete your profile to unlock.</p>
            )}
            {isComplete && <div style={{ marginTop: '20px' }}><button onClick={() => setIsComplete(false)} style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>Edit My Info</button></div>}
          </div>

          {isComplete && (
            <div className="profile-card" style={{ padding: '20px' }}>
              <h2 style={{ color: '#f59e0b', marginBottom: '10px' }}><i className='bx bx-notepad'></i> Digital Diary / Notes</h2>
              <textarea className="input-field" rows="5" value={formData.personal_notes} onChange={handleChange} name="personal_notes" style={{ background: '#0f172a' }}></textarea>
              <button onClick={handleSaveNotes} className="btn-primary" style={{ background: '#f59e0b', color: '#0f172a', marginTop: '10px' }} disabled={savingNotes}>{savingNotes ? 'Saving...' : 'Save Notes'}</button>
            </div>
          )}

        </main>
      </div>
    </ErrorBoundary>
  );
}
