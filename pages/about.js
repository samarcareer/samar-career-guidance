import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- TEAM DATA ---
// Yahan aap apne hisaab se photos aur details change kar sakte hain
const teamMembers = [
  {
    id: 1,
    name: "Dr. Ashfaque Umar",
    role: "Founder & Director",
    image: "https://ui-avatars.com/api/?name=Ashfaque+Umar&background=0D8ABC&color=fff&size=200",
    color: "#fde047", // Yellow pastel border
    bio: "Visionary founder of Samar Guidance. Dedicated to shaping the careers of thousands of students through precise, analytical, and empathetic counseling.",
    email: "ashfaqueumar@gmail.com"
  },
  {
    id: 2,
    name: "Mohammed Junaid",
    role: "Lead Platform Architect",
    image: "https://ui-avatars.com/api/?name=Mohammed+Junaid&background=10B981&color=fff&size=200",
    color: "#93c5fd", // Blue pastel border
    bio: "The technical brain behind the Samar Guidance portal. Overseeing the enterprise-grade architecture, data protection, and seamless UI/UX from the Malegaon headquarters.",
    email: "mohammedjunaid5263@gmail.com"
  },
  {
    id: 3,
    name: "Mohammed Ozair",
    role: "Senior Academic Counselor",
    image: "https://ui-avatars.com/api/?name=MOHAMMED+OZAIR&background=F472B6&color=fff&size=200",
    color: "#f9a8d4", // Pink pastel border
    bio: "Expert in psychological profiling and student mentoring. Ozair helps students bridge the gap between their passions and real-world opportunities.",
    email: "Ozair@samarguidance.com"
  },
  {
    id: 4,
    name: "Naeem Ahmed",
    role: "Student Success Manager",
    image: "https://ui-avatars.com/api/?name=Naeem+Ahmed&background=F59E0B&color=fff&size=200",
    color: "#a7f3d0", // Green pastel border
    bio: "Ensures every student gets personalized attention. naeem manages the tracking matrices and post-assessment follow-ups.",
    email: "naeem@samarguidance.com"
  }
];

export default function AboutUs() {
  const router = useRouter();
  
  // --- SamarUI Navbar States ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [session, setSession] = useState(null);

  // --- Modal State ---
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
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
        <title>About Us | Samar Guidance</title>
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
        .nav-dropdown-container { position: relative; }
        .nav-dropdown-menu { position: absolute; top: 100%; left: 0; background: rgba(30, 64, 175, 0.95); backdrop-filter: blur(16px); border: 1px solid rgba(147, 197, 253, 0.2); border-radius: 8px; min-width: 260px; box-shadow: 0 15px 30px rgba(0,0,0,0.6); padding: 10px 0; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s ease; z-index: 200; }
        .nav-dropdown-container:hover .nav-dropdown-menu, .nav-dropdown-menu.active { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-item { padding: 12px 20px; color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left; background: transparent; border-left: none; border-right: none; border-top: none; width: 100%; cursor: pointer; }
        .dropdown-item:hover { background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding-left: 25px; }
        .mobile-search-wrapper { display: none; width: 100%; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 10px; }
        .desktop-search-wrapper { display: block; flex: 0.6; max-width: 400px; }
        .mobile-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 2rem; cursor: pointer; }

        @media (max-width: 1024px) {
          .desktop-search-wrapper { display: none !important; }
          .mobile-search-wrapper { display: block; }
          .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; align-items: flex-start; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); border-bottom: 1px solid rgba(56,189,248,0.3); padding: 20px 5%; gap: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .mobile-toggle { display: block; }
          .nav-dropdown-menu { position: static; box-shadow: none; border: none; background: rgba(0,0,0,0.2); margin-top: 10px; width: 100%; display: ${showGuidanceDropdown ? 'flex' : 'none'}; opacity: 1; visibility: visible; transform: none; }
          .nav-link { width: 100%; text-align: left; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .nav-link::after { display: none; }
        }

        /* --- ABOUT US SPECIFIC STYLES --- */
        .about-main { flex: 1; padding: 60px 5%; width: 100%; max-width: 1200px; margin: 0 auto; text-align: center; }
        .section-title { font-size: 2.5rem; color: #fff; font-weight: 900; margin-bottom: 15px; text-shadow: 0 4px 15px rgba(56,189,248,0.4); }
        .section-subtitle { color: #93c5fd; font-size: 1.1rem; max-width: 800px; margin: 0 auto 50px auto; line-height: 1.6; }
        
        /* Team Grid & Reference Badge Style */
        .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; padding: 20px 0; justify-items: center; }
        
        .team-card { display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.3s ease; }
        .team-card:hover { transform: translateY(-10px); }
        
        /* The Scalloped/Badge Border Effect */
        .badge-wrapper {
          width: 160px; height: 160px;
          display: flex; justify-content: center; align-items: center;
          /* Advanced polygon for wavy badge look */
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
          margin-bottom: 15px;
          transition: 0.3s ease;
        }
        .team-card:hover .badge-wrapper { transform: scale(1.05) rotate(5deg); }
        
        .badge-image {
          width: 146px; height: 146px;
          object-fit: cover;
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
        }

        .team-name { color: #fff; font-size: 1.1rem; font-weight: 700; margin: 0 0 5px 0; }
        .team-role { color: #cbd5e1; font-size: 0.9rem; margin: 0; }

        /* Modal Styles */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 2000; padding: 20px; opacity: 0; animation: fadeIn 0.3s forwards; }
        .modal-content { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 20px; padding: 40px; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.6); position: relative; transform: translateY(20px); animation: slideUp 0.3s forwards; }
        .close-btn { position: absolute; top: 15px; right: 15px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; width: 35px; height: 35px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; cursor: pointer; transition: 0.2s; }
        .close-btn:hover { background: #ef4444; color: #fff; }
        
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes slideUp { to { transform: translateY(0); } }
      `}} />

      {/* --- MASTER NAVBAR (SAMAR UI) --- */}
      <nav className="glass-navbar">
        <div className="nav-top-row">
          <div className="nav-brand-container" onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '0.5px' }}>Samar Guidance</h1>
              <small style={{ color: '#93c5fd', fontWeight: 'bold', display: 'block' }}>Dr. Ashfaque Umar</small>
            </div>
          </div>

          <form className="desktop-search-wrapper" onSubmit={handleSearchSubmit}>
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matrix..." 
              style={{ width: '100%', padding: '10px 18px', borderRadius: '25px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' }}
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {session ? (
              <>
                <button onClick={() => router.push('/profile')} style={{ padding: '8px 20px', background: '#10b981', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.4)' }}>
                  My Profile
                </button>
                <button onClick={handleLogout} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => router.push('/login')} style={{ padding: '8px 20px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59,130,246,0.4)' }}>
                Student Login
              </button>
            )}
            
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <i className='bx bx-x'></i> : <i className='bx bx-menu'></i>}
            </button>
          </div>
        </div>

        <div className="desktop-menu">
          <form className="mobile-search-wrapper" onSubmit={handleSearchSubmit}>
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matrix..." 
              style={{ width: '100%', padding: '10px 18px', borderRadius: '8px', border: '1px solid rgba(147,197,253,0.3)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' }}
            />
          </form>

          <button className="nav-link" onClick={() => router.push('/')}>Home</button>
          <button className="nav-link" onClick={() => router.push('/about')} style={{ color: '#38bdf8' }}>About Us</button>
          
          <div className="nav-dropdown-container" onMouseEnter={() => !isMobile && setShowGuidanceDropdown(true)} onMouseLeave={() => !isMobile && setShowGuidanceDropdown(false)}>
            <button className="nav-link" onClick={() => setIsMobile && setShowGuidanceDropdown(!showGuidanceDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              Career Guidance <i className='bx bx-chevron-down'></i>
            </button>
            
            <div className={`nav-dropdown-menu ${showGuidanceDropdown ? 'active' : ''}`}>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=10th')}>Courses After 10th</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=12th')}>Courses After 12th</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=graduation')}>Courses After Graduation</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=postgrad')}>Courses After Post Graduation</button>
              <button className="dropdown-item" onClick={() => router.push('/guidance?level=other')}>Other Specializations</button>
            </div>
          </div>

          <button className="nav-link" onClick={() => router.push('/assessment')}>Career Assessment</button>
          <button className="nav-link" onClick={() => router.push('/personality')}>Personality Development</button>
          <button className="nav-link" onClick={() => router.push('/gallery')}>Gallery</button>
        </div>
      </nav>

      {/* --- ABOUT US MAIN CONTENT --- */}
      <main className="about-main">
        <h1 className="section-title">The Foundation Behind The Vision</h1>
        <p className="section-subtitle">
          Rooted in Malegaon, Samar Guidance is an enterprise-level platform committed to transforming student aspirations into strategic, achievable roadmaps through data-driven academic counseling.
        </p>

        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '30px', borderBottom: '2px solid rgba(56, 189, 248, 0.3)', display: 'inline-block', paddingBottom: '10px' }}>
          Meet Our Experts
        </h2>

        {/* TEAM GRID */}
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card" onClick={() => setSelectedMember(member)}>
              {/* Colored Badge Wrapper */}
              <div className="badge-wrapper" style={{ backgroundColor: member.color }}>
                <img src={member.image} alt={member.name} className="badge-image" />
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </main>

      {/* --- DETAILS MODAL --- */}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedMember(null)}><i className='bx bx-x'></i></button>
            
            <div className="badge-wrapper" style={{ backgroundColor: selectedMember.color, margin: '0 auto 20px auto', width: '120px', height: '120px' }}>
              <img src={selectedMember.image} alt={selectedMember.name} className="badge-image" style={{ width: '110px', height: '110px' }} />
            </div>
            
            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '5px' }}>{selectedMember.name}</h2>
            <h4 style={{ color: selectedMember.color, margin: '0 0 20px 0', fontSize: '1.1rem' }}>{selectedMember.role}</h4>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: `4px solid ${selectedMember.color}` }}>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, textAlign: 'left' }}>
                {selectedMember.bio}
              </p>
            </div>

            <a href={`mailto:${selectedMember.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '25px', fontWeight: 'bold', transition: '0.3s' }} onMouseOver={(e) => e.target.style.background = '#38bdf8'} onMouseOut={(e) => e.target.style.background = 'rgba(56, 189, 248, 0.1)'}>
              <i className='bx bx-envelope'></i> Contact directly
            </a>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer style={{ width: '100%', background: 'rgba(30, 64, 175, 0.6)', backdropFilter: 'blur(16px)', padding: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#bfdbfe', fontWeight: '700', marginTop: 'auto', position: 'relative' }}>
        © 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked.
        
        <i 
          className='bx bxs-shield-alt-2' 
          onClick={() => router.push('/admin')} 
          style={{ position: 'absolute', right: '20px', bottom: '20px', cursor: 'pointer', opacity: 0.3, fontSize: '1.2rem', transition: '0.3s' }}
          title="Security Protected"
        ></i>
      </footer>
    </div>
  );
}
