import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function HomeLanding() {
  const router = useRouter();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const totalPages = 3; 
  const maxLoc = totalPages + 1;
  const [currentLoc, setCurrentLoc] = useState(1);

  const nextPage = () => { if (currentLoc < maxLoc) setCurrentLoc((prev) => prev + 1); };
  const prevPage = () => { if (currentLoc > 1) setCurrentLoc((prev) => prev - 1); };
  const restartBook = () => { setCurrentLoc(1); };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a',
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <title>Samar Career Guidance</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; }
        
        /* Centered Adaptive Book Container */
        .main-stage {
          flex: 1;
          display: grid;
          place-items: center;
          width: 100%;
          padding: 20px;
          perspective: 3000px;
        }

        .book {
          position: relative;
          width: 80vmin;
          height: 60vmin;
          max-width: 440px;
          max-height: 600px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .page { position: absolute; width: 100%; height: 100%; top: 0; left: 0; transform-style: preserve-3d; transform-origin: left center; transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .front, .back { position: absolute; width: 100%; height: 100%; padding: 30px; backface-visibility: hidden; display: flex; flex-direction: column; border: 2px solid #3b82f6; border-radius: 8px 15px 15px 8px; background: #1e293b; }
        .front { z-index: 2; transform: rotateY(0deg); }
        .back { transform: rotateY(180deg); border-radius: 15px 8px 8px 15px; }
        .page.flipped { transform: rotateY(-180deg); }

        .btn { padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; border: none; font-size: 0.9rem; width: 100%; margin-top: 10px; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .btn-primary { background: #3b82f6; color: #fff; }
      `}} />

      <nav className="glass-header" style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', background: 'rgba(30, 64, 175, 0.6)', backdropFilter: 'blur(10px)' }}>
         <h1 style={{ color: '#fff', fontSize: '1.2rem' }}>Samar Guidance</h1>
         <button onClick={() => router.push('/login')} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px' }}>Login</button>
      </nav>

      <main className="main-stage">
        <div className="book" style={{ transform: currentLoc === 1 ? 'translateX(0)' : currentLoc === 4 ? 'translateX(0)' : 'translateX(0)' }}>
          
          {/* Page 1 */}
          <div className={`page ${1 < currentLoc ? 'flipped' : ''}`} style={{ zIndex: 4 }}>
            <div className="front" style={{ justifyContent: 'center', textAlign: 'center' }}>
              <h2>Samar Career Guidance</h2>
              <button className="btn btn-primary" onClick={nextPage}>Start Assessment</button>
            </div>
            <div className="back"><h2>Our Knowledge Bank</h2><button className="btn" onClick={nextPage}>Next</button></div>
          </div>

          {/* Page 2 */}
          <div className={`page ${2 < currentLoc ? 'flipped' : ''}`} style={{ zIndex: 3 }}>
            <div className="front"><h2>Advanced Engineering</h2><button className="btn" onClick={nextPage}>Next</button></div>
            <div className="back"><h2>Platform Features</h2><button className="btn" onClick={nextPage}>Finish</button></div>
          </div>

          {/* Page 3: Finish & Restart Logic */}
          <div className={`page ${3 < currentLoc ? 'flipped' : ''}`} style={{ zIndex: 2 }}>
            <div className="front"><h2>Ready to Begin?</h2><button className="btn" onClick={nextPage}>Finish</button></div>
            <div className="back" style={{ justifyContent: 'center', textAlign: 'center', background: '#1e3a8a' }}>
              <h2>Tour Completed</h2>
              <button className="btn btn-primary" onClick={restartBook}>Restart Book <i className='bx bx-reset'></i></button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
