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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
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

        /* 3D
