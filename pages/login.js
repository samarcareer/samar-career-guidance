import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- INDIA STATES LIST ---
const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function StudentLogin() {
  const router = useRouter();
  
  // --- SamarUI Navbar States ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // --- Form States ---
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    education: '',
    state: '',
    city: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Photo Upload Handler ---
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  // --- Form Submit (Trigger OTP) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // 1. Send OTP to the provided email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: formData.email.trim().toLowerCase(),
        options: {
          // You can pass the profile data as metadata if needed
          data: {
            full_name: formData.fullName,
            phone: formData.mobile,
            education: formData.education,
            state: formData.state,
            city: formData.city
          }
        }
      });

      if (otpError) throw otpError;

      setMessage("Registration Data Saved! A 6-Digit Secure OTP has been sent to your email.");
      // Note: In a full flow, you would now show the OTP input field step here.
      
    } catch (err) {
      setError(err.message || 'Failed to process registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.1) 1px, #0f172a 1px)`,
      backgroundSize: '30px 30px',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      maxWidth: '100%',
      overflowX: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <title>Student Registration & Login | Samar Guidance</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }

        /* --- NAVBAR STYLES (SamarUI) --- */
        .glass-navbar { width: 100%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; display: flex; flex-direction: column; }
        .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; border-bottom: 1px solid rgba(147, 197, 253, 0.1); }
        .nav-brand-container { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .desktop-menu { display: flex; align-items: center; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
        .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; position: relative; background: none; border: none; padding: 5px 0; white-space: nowrap; }
        .nav-link:hover { color: #38bdf8; }
        .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: 0; left: 0; background-color: #38bdf8; transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }

        /* --- FORM STYLES --- */
        .login-main { flex: 1; display: flex; justify-content: center; align-items: center; padding: 60px 5%; width: 100%; }
        .auth-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); width: 100%; max-width: 600px; backdrop-filter: blur(10px); }
        
        /* Stylish Photo Upload */
        .photo-upload-wrapper { display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; }
        .photo-circle {
          width: 110px; height: 110px; border-radius: 50%; border: 2px dashed #38bdf8; 
          background: rgba(56, 189, 248, 0.05); display: flex; justify-content: center; align-items: center;
          cursor: pointer; position: relative; overflow: hidden; transition: 0.3s;
          box-shadow: 0 10px 25px rgba(56, 189, 248, 0.2);
        }
        .photo-circle:hover { background: rgba(56, 189, 248, 0.15); transform: scale(1.05); }
        .camera-icon { font-size: 2.5rem; color: #38bdf8; transition: 0.3s; }
        .photo-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; opacity: 0; transition: 0.3s; }
        .photo-circle:hover .photo-overlay { opacity: 1; }
        .photo-preview-img { width: 100%; height: 100%; object-fit: cover; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .input-group { margin-bottom: 20px; text-align: left; }
        .input-group.full-width { grid-column: span 2; }
        .input-group label { display: block; color: #93c5fd; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; }
        .input-group input, .input-group select {
          width: 100%; padding: 14px 18px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.3);
          background: rgba(15, 23, 42, 0.6); color: #fff; font-size: 1rem; outline: none; transition: 0.3s;
          font-family: inherit;
        }
        .input-group select option { background: #0f172a; color: #fff; }
        .input-group input:focus, .input-group select:focus { border-color: #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }

        .btn-primary { background: #3b82f6; color: #fff; padding: 16px 25px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1.1rem; width: 100%; transition: 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px; grid-column: span 2; margin-top: 10px; }
        .btn-primary:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
        
        .alert-box { padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 500; display: flex; align-items: center; gap: 8px; text-align: left; }
        .alert-error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; }
        .alert-success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #6ee7b7; }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
          .input-group.full-width { grid-column: span 1; }
          .btn-primary { grid-column: span 1; }
        }
      `}} />

      {/* --- MASTER NAVBAR --- */}
      <nav className="glass-navbar">
        <div className="nav-top-row">
          <div className="nav-brand-container" onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '0.5px' }}>Samar Guidance</h1>
              <small style={{ color: '#93c5fd', fontWeight: 'bold', display: 'block' }}>Dr. Ashfaque Umar</small>
            </div>
          </div>
        </div>
      </nav>

      {/* --- FORM SECTION --- */}
      <main className="login-main">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '8px' }}>Student Registration</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Create your secure profile to begin your career assessment.</p>
          </div>

          {error && <div className="alert-box alert-error"><i className='bx bx-error-circle'></i> {error}</div>}
          {message && <div className="alert-box alert-success"><i className='bx bx-check-circle'></i> {message}</div>}

          <form onSubmit={handleSubmit} className="form-grid">
            
            {/* 7. Stylish Photo Upload */}
            <div className="photo-upload-wrapper full-width">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                style={{ display: 'none' }} 
              />
              <div className="photo-circle" onClick={handlePhotoClick}>
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Profile Preview" className="photo-preview-img" />
                    <div className="photo-overlay"><i className='bx bx-pencil camera-icon' style={{ color: '#fff' }}></i></div>
                  </>
                ) : (
                  <i className='bx bx-camera camera-icon'></i>
                )}
              </div>
              <small style={{ color: '#94a3b8' }}>Profile Photo (Optional)</small>
            </div>

            {/* 1. Full Name */}
            <div className="input-group full-width">
              <label><i className='bx bx-user'></i> Full Name</label>
              <input type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleInputChange} required />
            </div>

            {/* 2. Mobile Number */}
            <div className="input-group">
              <label><i className='bx bx-phone'></i> Mobile Number</label>
              <input type="tel" name="mobile" placeholder="10-digit mobile number" pattern="[0-9]{10}" value={formData.mobile} onChange={handleInputChange} required />
            </div>

            {/* 3. Email Address */}
            <div className="input-group">
              <label><i className='bx bx-envelope'></i> Email Address</label>
              <input type="email" name="email" placeholder="student@example.com" value={formData.email} onChange={handleInputChange} required />
            </div>

            {/* 4. Current Education */}
            <div className="input-group full-width">
              <label><i className='bx bxs-graduation'></i> Current Education Level</label>
              <select name="education" value={formData.education} onChange={handleInputChange} required>
                <option value="" disabled>Select your education level</option>
                <option value="10th">10th Standard / SSC</option>
                <option value="12th">12th Standard / HSC</option>
                <option value="Undergraduate">Undergraduate (Degree/Diploma)</option>
                <option value="Postgraduate">Postgraduate (Master's)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* 5. State (Dropdown) */}
            <div className="input-group">
              <label><i className='bx bx-map-alt'></i> Location (State)</label>
              <select name="state" value={formData.state} onChange={handleInputChange} required>
                <option value="" disabled>Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* 6. City */}
            <div className="input-group">
              <label><i className='bx bx-buildings'></i> City</label>
              <input type="text" name="city" placeholder="e.g. Malegaon" value={formData.city} onChange={handleInputChange} required />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <i className='bx bx-loader-alt bx-spin'></i> : <i className='bx bx-user-plus'></i>}
              {loading ? 'Processing...' : 'Register & Send OTP'}
            </button>
          </form>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer style={{ width: '100%', background: 'rgba(30, 64, 175, 0.6)', backdropFilter: 'blur(16px)', padding: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#bfdbfe', fontWeight: '700', marginTop: 'auto' }}>
        © 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked.
      </footer>
    </div>
  );
}
