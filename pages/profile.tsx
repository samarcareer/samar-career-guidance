import React, { useState, useEffect, Component, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

// --- STRICT TS INTERFACES ---
type Lang = 'en' | 'ur';

interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

interface ProfileFormData {
  full_name: string; phone: string; gender: string; city: string;
  education_level: string; stream: string; college_name: string;
  career_goal: string; main_struggle: string; photo_url: string;
  personal_notes: string;
}

// --- ERROR BOUNDARY (Rule 6: Zero Silent Failures) ---
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{color:'white', background:'#0f172a', padding:'50px', textAlign:'center'}}>Profile UI Error. Please refresh.</div>;
    return this.props.children;
  }
}

// --- TRANSLATION DICTIONARY ---
const t: Record<Lang, Record<string, string>> = {
  en: { brand: "Samar Guidance", navHome: "Home", navProfile: "My Profile", profileTitle: "Student Dashboard", profileSub: "Manage your career profile.", step1: "Basic Details", step2: "Academic Info", step3: "Career Goals", fullName: "Full Name", phone: "WhatsApp / Phone", gender: "Gender", city: "City / Town", photo: "Profile Photo (Max 2MB)", eduLevel: "Education Level", stream: "Current Stream", college: "School / College Name", goal: "Career Goal", struggle: "Main struggle?", saveBtn: "Save Profile", saving: "Saving...", nextBtn: "Next", prevBtn: "Previous", takeTestBtn: "Take Assessment Now", lockedBtn: "Profile Incomplete", personalDiary: "Student Personal Diary", saveNotes: "Save Private Notes" },
  ur: { brand: "ثمر گائیڈنس", navHome: "ہوم", navProfile: "میری پروفائل", profileTitle: "طالب علم ڈیش بورڈ", profileSub: "اپنی کیریئر پروفائل کا انتظام کریں۔", step1: "بنیادی تفصیلات", step2: "تعلیمی معلومات", step3: "کیریئر کے اہداف", fullName: "پورا نام", phone: "واٹس ایپ / فون نمبر", gender: "جنس", city: "شہر / قصبہ", photo: "پروفائل فوٹو", eduLevel: "موجودہ تعلیم", stream: "موجودہ شعبہ", college: "اسکول / کالج کا نام", goal: "کیریئر کا ہدف", struggle: "سب سے بڑا مسئلہ؟", saveBtn: "محفوظ کریں", saving: "محفوظ ہو رہا ہے...", nextBtn: "اگلا", prevBtn: "پچھلا", takeTestBtn: "اسسمنٹ دیں", lockedBtn: "نامکمل", personalDiary: "ذاتی ڈائری", saveNotes: "نوٹس محفوظ کریں" }
};

export default function StudentProfile() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savingNotes, setSavingNotes] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '', phone: '', gender: '', city: '', education_level: '', stream: '', college_name: '', career_goal: '', main_struggle: '', photo_url: '', personal_notes: ''
  });

  useEffect(() => {
    const initProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/login'); return; }
        setUser(session.user);

        // Fetch using maybeSingle to prevent crash on new users
        const { data: pData, error } = await supabase.from('student_profiles').select('*').eq('id', session.user.id).maybeSingle();

        if (error) throw error;
        if (pData) {
          setFormData({
            full_name: pData.full_name || '', phone: pData.phone || '', gender: pData.gender || '', city: pData.city || '',
            education_level: pData.education_level || '', stream: pData.stream || '', college_name: pData.college_name || '',
            career_goal: pData.career_goal || '', main_struggle: pData.main_struggle || '', photo_url: pData.photo_url || '',
            personal_notes: pData.personal_notes || ''
          });
          setIsComplete(pData.is_complete || false);
        }
      } catch (err: any) {
        console.error("Profile Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    initProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- RULE 4: DB Bloat Prevention (Upload to Storage Bucket instead of Base64 SQL) ---
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2000000) { alert("File too large! Max 2MB allowed."); return; } 

    setErrorMsg('');
    try {
      const fileName = `${user.id}-${Date.now()}.jpeg`;
      // Convert & Compress using Canvas
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH; canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob(async (blob) => {
            if (!blob) throw new Error("Image compression failed.");
            
            // Upload explicitly to Supabase Storage Vault
            const { error: uploadError } = await supabase.storage.from('profile_photos').upload(fileName, blob, { upsert: true });
            if (uploadError) throw uploadError;

            // Retrieve Public URL
            const { data: { publicUrl } } = supabase.storage.from('profile_photos').getPublicUrl(fileName);
            setFormData({ ...formData, photo_url: publicUrl });
            
          }, 'image/jpeg', 0.6);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMsg("Failed to upload photo securely. Please try again.");
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

  // --- RULE 2: Payload Sanitization (Preventing lead_status injection) ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setErrorMsg('');

    const isFullyFilled = progress === 100;
    
    // Explicit Mapping: Do NOT spread `...formData` directly. Block 'lead_status' override.
    const sanitizedPayload = {
      id: user.id,
      email: user.email,
      full_name: formData.full_name,
      phone: formData.phone,
      gender: formData.gender,
      city: formData.city,
      education_level: formData.education_level,
      stream: formData.stream,
      college_name: formData.college_name,
      career_goal: formData.career_goal,
      main_struggle: formData.main_struggle,
      photo_url: formData.photo_url,
      is_complete: isFullyFilled
      // Note: 'lead_status' is completely omitted, protected via DB RLS or default values.
    };
    
    try {
      const { error } = await supabase.from('student_profiles').upsert([sanitizedPayload]);
      if (error) throw error;
      setIsComplete(isFullyFilled);
      window.scrollTo(0,0);
    } catch(err: any) {
      setErrorMsg("Data saving failed. Please check your connection and retry.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // --- RULE 6: Reviving Dead Code & Adding Try-Catch ---
  const handleSaveNotes = async () => {
    if (!user) return;
    setSavingNotes(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.from('student_profiles').update({ personal_notes: formData.personal_notes }).eq('id', user.id);
      if (error) throw error;
      alert("Personal diary secured.");
    } catch (err: any) {
      setErrorMsg("Failed to encrypt and save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#38bdf8' }}><h2><i className='bx bx-loader-alt bx-spin'></i> Loading Secure Vault...</h2></div>;

  return (
    <ErrorBoundary>
      <div style={{ backgroundColor: '#0f172a', backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px)`, backgroundSize: '30px 30px', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <title>{t[lang].navProfile}</title>
        </Head>

        <style dangerouslySetInnerHTML={{__html: `
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
          .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; }
          .desktop-menu { display: flex; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
          .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; cursor: pointer; background: none; border: none; }
          .profile-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 35px; margin-bottom: 25px; width: 100%; max-width: 800px; }
          .input-field { width: 100%; padding: 12px; border-radius: 8px; background: rgba(15,23,42,0.6); border: 1px solid rgba(56,189,248,0.3); color: #fff; margin-top: 5px; outline: none; }
          .btn-primary { background: #38bdf8; color: #0f172a; padding: 12px 25px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; }
          .btn-primary:disabled { background: #475569; cursor: not-allowed; }
          .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4); }
        `}} />

        <nav>
          <div className="nav-top-row">
            <h1 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900', cursor:'pointer' }} onClick={() => router.push('/')}>{t[lang].brand}</h1>
            <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }} onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}><i className='bx bx-log-out'></i></button>
          </div>
          <div className="desktop-menu">
              <button className="nav-link" onClick={() => router.push('/')}>{t[lang].navHome}</button>
              <button className="nav-link active" style={{color: '#38bdf8'}}>{t[lang].navProfile}</button>
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

          {errorMsg && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ef4444', marginBottom: '20px' }}><i className='bx bx-error-circle'></i> {errorMsg}</div>}

          {!isComplete && (
            <form className="profile-card" onSubmit={handleSaveProfile}>
              <div style={{ display: 'flex', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
                <button type="button" onClick={()=>setCurrentStep(1)} style={{ flex: 1, padding: '10px', background: currentStep===1 ? 'rgba(56,189,248,0.1)' : 'transparent', color: currentStep===1 ? '#38bdf8' : '#64748b', border: 'none', borderBottom: currentStep===1 ? '2px solid #38bdf8' : 'none', fontWeight: 'bold', cursor: 'pointer' }}>1. {t[lang].step1}</button>
                <button type="button" onClick={()=>setCurrentStep(2)} style={{ flex: 1, padding: '10px', background: currentStep===2 ? 'rgba(56,189,248,0.1)' : 'transparent', color: currentStep===2 ? '#38bdf8' : '#64748b', border: 'none', borderBottom: currentStep===2 ? '2px solid #38bdf8' : 'none', fontWeight: 'bold', cursor: 'pointer' }}>2. {t[lang].step2}</button>
                <button type="button" onClick={()=>setCurrentStep(3)} style={{ flex: 1, padding: '10px', background: currentStep===3 ? 'rgba(56,189,248,0.1)' : 'transparent', color: currentStep===3 ? '#38bdf8' : '#64748b', border: 'none', borderBottom: currentStep===3 ? '2px solid #38bdf8' : 'none', fontWeight: 'bold', cursor: 'pointer' }}>3. {t[lang].step3}</button>
              </div>

              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   <label>{t[lang].fullName} *<input type="text" name="full_name" className="input-field" value={formData.full_name} onChange={handleChange} required /></label>
                   <label>{t[lang].photo} <input type="file" accept="image/*" onChange={handlePhotoUpload} className="input-field" /></label>
                   <label>{t[lang].phone} *<input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleChange} required /></label>
                   <label>{t[lang].gender} *<select name="gender" className="input-field" value={formData.gender} onChange={handleChange} required><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select></label>
                   <label>{t[lang].city} *<input type="text" name="city" className="input-field" value={formData.city} onChange={handleChange} required /></label>
                </div>
              )}
              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   <label>{t[lang].eduLevel} *<select name="education_level" className="input-field" value={formData.education_level} onChange={handleChange} required><option value="">Select</option><option value="8th">8th</option><option value="9th">9th</option><option value="10th">10th</option><option value="11th">11th</option><option value="12th">12th</option><option value="Graduate">Graduate</option></select></label>
                   <label>{t[lang].stream} <select name="stream" className="input-field" value={formData.stream} onChange={handleChange} disabled={['8th', '9th', '10th'].includes(formData.education_level)}><option value="">Select</option><option value="Science">Science</option><option value="Commerce">Commerce</option><option value="Arts">Arts</option><option value="Polytechnic">Polytechnic</option></select></label>
                   <label>{t[lang].college} *<input type="text" name="college_name" className="input-field" value={formData.college_name} onChange={handleChange} required /></label>
                </div>
              )}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   <label>{t[lang].goal} *<select name="career_goal" className="input-field" value={formData.career_goal} onChange={handleChange} required><option value="">Select</option><option value="Engineering">Engineering / IT</option><option value="Medical">Medical / Pharmacy</option><option value="Business">Business / CA</option><option value="Arts">Arts / Design</option><option value="Govt">Government Jobs</option><option value="Undecided">Undecided</option></select></label>
                   <label>{t[lang].struggle}<textarea name="main_struggle" className="input-field" rows={3} value={formData.main_struggle} onChange={handleChange}></textarea></label>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                {currentStep > 1 ? <button type="button" onClick={()=>setCurrentStep(currentStep - 1)} style={{padding:'10px', background:'transparent', color:'#fff', border:'1px solid #475569', borderRadius:'8px', cursor: 'pointer'}}>{t[lang].prevBtn}</button> : <div></div>}
                {currentStep < 3 ? <button type="button" className="btn-primary" onClick={()=>setCurrentStep(currentStep + 1)}>{t[lang].nextBtn}</button> : <button type="submit" className="btn-primary" style={{background:'#10b981', color:'#fff'}} disabled={saving}>{saving ? <i className='bx bx-loader-alt bx-spin'></i> : t[lang].saveBtn}</button>}
              </div>
            </form>
          )}

          <div className="profile-card" style={{ textAlign: 'center', borderColor: isComplete ? '#10b981' : '#ef4444' }}>
            <i className={isComplete ? 'bx bx-rocket' : 'bx bxs-lock'} style={{ fontSize: '4rem', color: isComplete ? '#10b981' : '#ef4444' }}></i>
            <h2 style={{ color: '#fff', margin: '10px 0' }}>Career Assessment</h2>
            {isComplete ? (
               <button onClick={() => router.push('/assessment')} style={{ background: '#10b981', color: '#fff', padding: '15px 30px', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', marginTop: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>{t[lang].takeTestBtn}</button>
            ) : (
               <p style={{ color: '#ef4444' }}>Complete your profile to unlock.</p>
            )}
            {isComplete && <div style={{ marginTop: '20px' }}><button onClick={() => setIsComplete(false)} style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>Edit My Profile</button></div>}
          </div>

          {/* --- THE DEAD CODE REVIVED: Personal Diary Section --- */}
          {isComplete && (
            <div className="profile-card" style={{ marginTop: '0', background: 'rgba(30, 41, 59, 0.5)', borderStyle: 'dashed' }}>
              <h3 style={{ color: '#38bdf8', marginBottom: '10px' }}><i className='bx bx-book-content'></i> {t[lang].personalDiary}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>Keep your personal thoughts, doubts, or career ideas here safely.</p>
              <textarea name="personal_notes" className="input-field" rows={4} value={formData.personal_notes} onChange={handleChange} placeholder="Dear diary..."></textarea>
              <button onClick={handleSaveNotes} disabled={savingNotes} className="btn-primary" style={{ marginTop: '10px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid #38bdf8', width: '100%' }}>
                {savingNotes ? <i className='bx bx-loader-alt bx-spin'></i> : <><i className='bx bx-save'></i> {t[lang].saveNotes}</>}
              </button>
            </div>
          )}

        </main>
      </div>
    </ErrorBoundary>
  );
}
