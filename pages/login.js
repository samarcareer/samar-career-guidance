import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function HomeLanding() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 3D Book State Logic (Exactly 3 Pages for Perfect Open/Close Mechanics)
  const totalPages = 3; 
  const maxLoc = totalPages + 1;
  const [currentLoc, setCurrentLoc] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Animated Counter States
  const [visitors, setVisitors] = useState(0);
  const [students, setStudents] = useState(0);
  const [careers, setCareers] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Count-Up Animation Logic
    const animateCounter = (target, setter, duration) => {
      let start = 0;
      const increment = target / (duration / 16); // 60fps
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    // Trigger animations on load
    animateCounter(645, setVisitors, 2000);     // 645+ Visitors
    animateCounter(12000, setStudents, 2500);   // 12,000+ Students
    animateCounter(150, setCareers, 1500);      // 150+ Career Stems

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextPage = () => {
    if (currentLoc < maxLoc) setCurrentLoc((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentLoc > 1) setCurrentLoc((prev) => prev - 1);
  };

  const restartBook = () => {
    setCurrentLoc(1); // Resets to Page 1 (Front Cover)
  };

  // Fixed the Transform logic to keep book strictly centered and prevent overflow
  const getBookTransform = () => {
    if (isMobile) return 'none';
    if (currentLoc === 1) return 'translateX(0%)'; 
    if (currentLoc === maxLoc) return 'translateX(0%)'; 
    return 'translateX(25%)'; // Keeps the open book safely within viewport
  };

  const getZIndex = (pageNumber) => {
    if (isMobile) return 'auto';
    return pageNumber < currentLoc ? pageNumber : totalPages - pageNumber + 1;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
    }
  };

  return (
    <div style={{
      direction: lang === 'ur' ? 'rtl' : 'ltr',
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
        <title>Samar Career Guidance</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        /* Strict Layout Enforcement */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow-x: hidden; width: 100%; max-width: 100vw; background-color: #0f172a; }

        /* Royal Blue Glassmorphism Header */
        .glass-header {
          width: 100%;
          background: rgba(30, 64, 175, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(147, 197, 253, 0.2);
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 15px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        /* Marquee specific deep blue */
        .marquee-container {
          background: #1e3a8a; 
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
          padding: 8px 0;
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }
        .marquee-text {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 25s linear infinite;
          font-size: 0.9rem;
          font-weight: 600;
          color: #bfdbfe;
        }
        @keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }

        /* Royal Blue Glass Dropdown */
        .glass-dropdown {
          position: absolute;
          top: 45px;
          left: 0;
          background: rgba(30, 64, 175, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(147, 197, 253, 0.2);
          border-radius: 8px;
          width: 260px;
          box-shadow: 0 15px 30px rgba(0,0,0,0.5);
          z-index: 200;
          padding: 10px 0;
          overflow: hidden;
        }
        .glass-dropdown button {
          display: block; width: 100%; padding: 12px 20px; background: transparent; border: none; color: #fff; font-weight: 600; cursor: pointer; text-align: left; font-size: 0.95rem; transition: 0.2s;
        }
        .glass-dropdown button:hover { background: rgba(56, 189, 248, 0.2); }

        /* 3D Book UI Variables & Engine */
        :root {
          --book-bg: #1e293b;
          --border-color: #3b82f6;
          --accent: #60a5fa;
        }
        .book-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 40px 10px;
          /* Soft Scale-In Animation */
          animation: scaleInBook 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: scale(0.92);
        }
        @keyframes scaleInBook {
          to { opacity: 1; transform: scale(1); }
        }

        .book-container { perspective: 2500px; display: flex; justify-content: center; align-items: center; width: 100%; max-width: 100vw; }
        
        /* Auto Scaling based on screen size */
        .book { 
          position: relative; 
          width: 400px; 
          height: 550px; 
          transform-style: preserve-3d; 
          transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1); 
        }
        
        @media (max-width: 1024px) {
           .book { width: 350px; height: 500px; }
        }

        .page { position: absolute; width: 100%; height: 100%; top: 0; left: 0; transform-style: preserve-3d; transform-origin: left center; transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1); }
        
        .front, .back {
          position: absolute; width: 100%; height: 100%; padding: 35px; backface-visibility: hidden; display: flex; flex-direction: column; 
          border: 2px solid var(--border-color); box-shadow: 0 0 25px rgba(30, 64, 175, 0.5); border-radius: 8px 15px 15px 8px; background: var(--book-bg);
        }
        .front { z-index: 2; transform: rotateY(0deg); }
        .back { transform: rotateY(180deg); border-radius: 15px 8px 8px 15px; }
        .page.flipped { transform: rotateY(-180deg); }

        .book-title { font-size: 2rem; font-weight: 900; color: #fff; line-height: 1.2; text-shadow: 0 4px 15px rgba(56,189,248,0.4); }
        .book-subtitle { color: var(--accent); font-weight: 700; margin-top: 10px; font-size: 1.1rem; }
        .avatar-circle { width: 90px; height: 90px; border-radius: 50%; border: 3px solid var(--accent); display: flex; justify-content: center; align-items: center; margin: 0 auto 15px; font-size: 3.5rem; color: var(--accent); background: rgba(30, 64, 175, 0.3); }
        
        .standard-page h2 { font-size: 1.4rem; color: #fff; margin-bottom: 15px; border-bottom: 2px solid var(--accent); padding-bottom: 8px; }
        .timeline-item { border-left: 2px solid var(--accent); padding-left: 15px; position: relative; margin-bottom: 15px; }
        .timeline-item::before { content: ''; position: absolute; width: 12px; height: 12px; background: var(--accent); border-radius: 50%; left: -7px; top: 5px; box-shadow: 0 0 10px var(--accent); }
        .timeline-item h3 { font-size: 1rem; color: #fff; margin: 5px 0; }
        .timeline-item p { font-size: 0.85rem; color: #94a3b8; }

        .btn { padding: 12px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; border: none; font-size: 0.95rem; text-align: center; width: 100%; margin-top: 10px; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .btn-primary { background: #3b82f6; color: #fff; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); }
        .btn-primary:hover { background: #2563eb; }
        .btn-secondary { background: transparent; color: var(--accent); border: 2px solid var(--accent); }
        .btn-secondary:hover { background: var(--accent); color: #0f172a; }

        .page-footer-nav { margin-top: auto; display: flex; justify-content: space-between; width: 100%; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; }
        .nav-btn { background: transparent; border: none; color: var(--accent); font-weight: bold; cursor: pointer; font-size: 0.95rem; transition: 0.2s; display: flex; align-items: center; gap: 5px; }
        .nav-btn:hover { color: #fff; text-shadow: 0 0 10px var(--accent); }

        /* Animated Counter Section Styles */
        .stats-container {
          width: 100%;
          background: rgba(30, 58, 138, 0.4);
          border-top: 1px solid rgba(56, 189, 248, 0.2);
          backdrop-filter: blur(8px);
          padding: 40px 5%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 30px;
          text-align: center;
        }
        .stat-box h3 {
          font-size: 2.5rem;
          color: #38bdf8;
          margin: 0 0 5px 0;
          font-weight: 800;
        }
        .stat-box p {
          color: #e2e8f0;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }

        @media (max-width: 768px) {
          .book-container { perspective: none; padding: 0 15px; }
          .book { width: 100%; height: auto; transform: none !important; }
          .page { position: relative; width: 100%; height: auto; transform: none !important; margin-bottom: 20px; z-index: auto !important; }
          .front, .back { position: relative; width: 100%; height: auto; backface-visibility: visible; transform: none !important; padding: 25px 20px; border-radius: 12px; margin-bottom: 20px; }
          .page-footer-nav, .nav-btn { display: none !important; }
          .glass-header { flex-direction: column; align-items: stretch; }
          .glass-header > div { justify-content: center; margin-bottom: 10px; }
          .stats-container { flex-direction: column; padding: 30px 5%; }
        }
      `}} />

      {/* ROYAL BLUE GLASS HEADER */}
      <nav className="glass-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '0.5px' }}>Samar Guidance</h1>
            <small style={{ color: '#93c5fd', fontWeight: 'bold', display: 'block' }}>Dr. Ashfaque Umar</small>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} style={{ flex: '1', maxWidth: '400px', margin: '0 15px' }}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..." 
            style={{ width: '100%', padding: '10px 18px', borderRadius: '25px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' }}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowCategoryMenu(!showCategoryMenu)} style={{ color: '#fff', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
              Categories ▾
            </button>
            {showCategoryMenu && (
              <div className="glass-dropdown">
                <button onClick={() => { router.push('/categories?stream=science'); setShowCategoryMenu(false); }}>🧪 Science Stems</button>
                <button onClick={() => { router.push('/categories?stream=commerce'); setShowCategoryMenu(false); }}>📊 Commerce Hub</button>
                <button onClick={() => { router.push('/categories?stream=paramedical'); setShowCategoryMenu(false); }}>🩺 Paramedical Fields</button>
                <button onClick={() => { router.push('/categories?stream=btech'); setShowCategoryMenu(false); }}>⚙️ Engineering Tech</button>
              </div>
            )}
          </div>
          <button onClick={() => setShowContactModal(true)} style={{ color: '#fff', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>Help Desk</button>
          <button onClick={() => router.push('/login')} style={{ padding: '8px 18px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Student Login</button>
        </div>
      </nav>

      <div className="marquee-container">
        <div className="marquee-text">
          🔥 Notification Alert: Government Approved Career Alignment Matrix Now Live! Explore Over 150+ Dynamic Strategic Stems.
        </div>
      </div>

      {/* 3D BOOK UI MAIN SECTION */}
      <main className="book-wrapper">
        <div className="book-container">
          <div className="book" style={{ transform: getBookTransform() }}>
            
            {/* PAGE 1: COVER PAGE & KNOWLEDGE BANK */}
            <div className={`page ${1 < currentLoc ? 'flipped' : ''}`} style={{ zIndex: getZIndex(1) }}>
              <div className="front cover-page" style={{ textAlign: 'center', justifyContent: 'center' }}>
                <div className="avatar-circle"><i className='bx bxs-book-reader'></i></div>
                <h1 className="book-title">Samar Career Guidance Platform</h1>
                <p className="book-subtitle">By Dr. Ashfaque Umar</p>
                <p style={{ margin: '15px 0', color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.9rem' }}>
                  Discover the perfect career path with enterprise-grade data protection and analytical student profiling matrices.
                </p>
                <div style={{ marginTop: '15px', width: '100%' }}>
                  <button className="btn btn-primary" onClick={nextPage}>Start Assessment <i className='bx bx-right-arrow-alt'></i></button>
                </div>
              </div>
              
              <div className="back standard-page">
                <h2>Our Knowledge Bank</h2>
                <div className="timeline-item">
                  <h3><i className='bx bx-atom' style={{ color: '#60a5fa' }}></i> Science & Technology</h3>
                  <p>BSc Physics, Chemistry, Data Analytics, Forensics, and Agriculture.</p>
                </div>
                <div className="timeline-item">
                  <h3><i className='bx bx-line-chart' style={{ color: '#60a5fa' }}></i> Commerce & Finance</h3>
                  <p>Chartered Accountancy, Banking, Corporate Laws, and Taxation.</p>
                </div>
                <div className="timeline-item">
                  <h3><i className='bx bx-plus-medical' style={{ color: '#60a5fa' }}></i> Medical & Paramedical</h3>
                  <p>MBBS, Pharmacy, Lab Technology, and Radiology fields.</p>
                </div>
                <div className="page-footer-nav">
                  <button className="nav-btn" onClick={nextPage}>Next Page <i className='bx bx-right-arrow-alt'></i></button>
                </div>
              </div>
            </div>

            {/* PAGE 2: ADVANCED ENGINEERING & PLATFORM FEATURES */}
            <div className={`page ${2 < currentLoc ? 'flipped' : ''}`} style={{ zIndex: getZIndex(2) }}>
              <div className="front standard-page">
                <h2>Advanced Engineering</h2>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                  <h3 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 5px 0' }}><i className='bx bx-chip'></i> B.Tech (4 Years)</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Computer Science, Robotics, Civil, Aerospace, and Mechanical Engineering.</p>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '8px', padding: '15px' }}>
                  <h3 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 5px 0' }}><i className='bx bx-briefcase'></i> Job Opportunities</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>BBA Aviation, Cargo Management, SAP Cloud Computing, and Logistics.</p>
                </div>
                <div className="page-footer-nav">
                  <button className="nav-btn" onClick={prevPage}><i className='bx bx-left-arrow-alt'></i> Back</button>
                  <button className="nav-btn" onClick={nextPage}>Next <i className='bx bx-right-arrow-alt'></i></button>
                </div>
              </div>
              
              <div className="back standard-page">
                <h2>Platform Features</h2>
                <div className="timeline-item">
                  <h3><i className='bx bx-lock-alt'></i> Secure Assessment</h3>
                  <p>End-to-end protected tracking profiles for students.</p>
                </div>
                <div className="timeline-item">
                  <h3><i className='bx bx-globe'></i> Multi-Language Support</h3>
                  <p>Seamlessly switch between English and Urdu.</p>
                </div>
                <div className="timeline-item">
                  <h3><i className='bx bx-bolt-circle'></i> Real-Time Analytics</h3>
                  <p>Get career scope, durations, and exact job profiles instantly.</p>
                </div>
                <div className="page-footer-nav">
                  <button className="nav-btn" onClick={prevPage}><i className='bx bx-left-arrow-alt'></i> Back</button>
                  <button className="nav-btn" onClick={nextPage}>Next <i className='bx bx-right-arrow-alt'></i></button>
                </div>
              </div>
            </div>

            {/* PAGE 3: ACTION PAGE & THE FINAL CLOSED BACK COVER */}
            <div className={`page ${3 < currentLoc ? 'flipped' : ''}`} style={{ zIndex: getZIndex(3) }}>
              <div className="front standard-page" style={{ justifyContent: 'center', textAlign: 'center' }}>
                <i className='bx bxs-rocket' style={{ fontSize: '4.5rem', color: '#3b82f6', marginBottom: '15px' }}></i>
                <h2 style={{ border: 'none', fontSize: '1.8rem' }}>Ready to Begin?</h2>
                <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '0.9rem' }}>Join the ultimate career roadmap system today.</p>
                
                <button className="btn btn-primary" onClick={() => router.push('/assessment')} style={{ marginBottom: '10px' }}>Take The Career Test</button>
                <button className="btn btn-secondary" onClick={() => router.push('/categories')}>Explore Categories</button>
                
                <div className="page-footer-nav" style={{ position: 'absolute', bottom: '35px', left: '35px', width: 'calc(100% - 70px)' }}>
                  <button className="nav-btn" onClick={prevPage}><i className='bx bx-left-arrow-alt'></i> Review Book</button>
                  
                  {/* FINISH BUTTON FLIPS THE BOOK CLOSED */}
                  <button className="nav-btn" onClick={nextPage} style={{ color: '#10b981' }}>Finish <i className='bx bx-check-circle'></i></button>
                </div>
              </div>

              {/* THIS IS THE PHYSICAL BACK COVER (SHOWN WHEN BOOK CLOSES) */}
              <div className="back standard-page" style={{ justifyContent: 'center', textAlign: 'center', background: 'rgba(30, 58, 138, 0.8)' }}>
                <i className='bx bx-check-shield' style={{ fontSize: '4rem', color: '#38bdf8', marginBottom: '10px' }}></i>
                <h2 style={{ border: 'none', fontSize: '2rem', margin: '0 0 10px 0' }}>Tour Completed</h2>
                <p style={{ color: '#93c5fd', marginBottom: '25px', fontSize: '0.9rem' }}>You have successfully navigated the platform guide.</p>
                
                <img src="/logo.jpg" alt="Samar Foundation Logo" style={{ width: '60px', height: '60px', borderRadius: '12px', margin: '0 auto 10px auto', display: 'block', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} />
                <p style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '30px' }}>Powered By Samar Foundation</p>
                
                {/* THE ONLY BUTTON ON THE CLOSED BOOK */}
                <button className="btn btn-primary" onClick={restartBook} style={{ padding: '14px 20px', fontSize: '1rem', background: '#3b82f6', width: 'auto', display: 'inline-flex', alignSelf: 'center' }}>
                   Restart Book <i className='bx bx-reset' style={{ fontSize: '1.2rem' }}></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* NEW ANIMATED STATS SECTION */}
      <section className="stats-container">
        <div className="stat-box">
          <h3>{visitors.toLocaleString()}+</h3>
          <p>Website Visitors</p>
        </div>
        <div className="stat-box">
          <h3>{students.toLocaleString()}+</h3>
          <p>Active Students</p>
        </div>
        <div className="stat-box">
          <h3>{careers}+</h3>
          <p>Career Stems</p>
        </div>
      </section>

      {showContactModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#60a5fa', fontSize: '1.5rem', fontWeight: '800' }}>Contact Professional Help Desk</h4>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 25px 0' }}>For analytical matrix guidelines, reach out directly to the developer desk:</p>
            <div style={{ background: 'rgba(30, 64, 175, 0.2)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginBottom: '30px' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>👨‍💻 Website Developer: Mohammed Junaid</p>
              <p style={{ margin: 0, fontWeight: '800', color: '#60a5fa', fontSize: '1.2rem' }}>📞 8484004636</p>
            </div>
            <button onClick={() => setShowContactModal(false)} style={{ width: '100%', padding: '14px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Close Window</button>
          </div>
        </div>
      )}

      {/* Royal Blue Glass Footer */}
      <footer style={{ width: '100%', background: 'rgba(30, 64, 175, 0.6)', backdropFilter: 'blur(16px)', padding: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#bfdbfe', fontWeight: '700' }}>
        © 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked.
      </footer>
    </div>
  );
}
