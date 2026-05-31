import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CourseCategories() {
  const router = useRouter();
  const { stream, search } = router.query;
  const [activeTab, setActiveTab] = useState('science');

  const database = {
    science: {
      title: "Science & Technology Domain",
      scope: "Research, Advanced Data Science, Labs, Agriculture systems aur professional engineering branches.",
      duration: "3 to 4 Years Degree Modules",
      items: ["Bsc Physics", "Bsc Chemistry", "Bsc Botany", "Bsc Zoology", "Bsc Computer science", "Bsc Mathematics", "Bsc PCM", "Bsc CBZ", "Bsc Forensic Science", "Bsc Food technology"]
    },
    commerce: {
      title: "Commerce & Strategic Finance Hub",
      scope: "Corporate accounting, banking, management systems, taxation laws aur professional financial audits.",
      duration: "3 Years Standard Graduation Route",
      items: ["CA Chartered Account", "CMA Cost Management Account", "CS Company Secretary", "B.Com Regular", "B.Com Taxation", "BBA / BBM Regular", "BFM Financial Management"]
    },
    paramedical: {
      title: "Paramedical & Healthcare Allied Science",
      scope: "Clinical pharmacy solutions, pathology laboratory expertise, radiology metrics, medical scanning aur nursing fields.",
      duration: "2 to 4 Years (Diploma / Degrees)",
      items: ["Nursing", "Pharm D", "B.Pharm", "D.Pharm", "Anesthesia technical", "Cardiac Care technical", "Clinical Optometry", "Medical Lab technician", "PHYSIOTHERAPY"]
    },
    btech: {
      title: "Advanced Engineering Framework",
      scope: "Software development pipelines, robotic architectures, automation engineering, infrastructure mapping, system configurations.",
      duration: "4 Years Professional Engineering Degree",
      items: ["Computer Science Engi.", "Electronics & Comm.Engi.", "Mechanical Engineering", "Civil Engineering", "Automation & Robotics Eng.", "Biomedical Engineering"]
    }
  };

  useEffect(() => {
    if (stream && database[stream]) {
      setActiveTab(stream);
    } else if (search) {
      const query = decodeURIComponent(search).toLowerCase();
      for (const [key, val] of Object.entries(database)) {
        if (val.items.some(i => i.toLowerCase().includes(query)) || key.includes(query)) {
          setActiveTab(key);
          break;
        }
      }
    }
  }, [stream, search]);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Segoe UI', sans-serif", color: '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#38bdf8', margin: 0, fontWeight: 800 }}>Samar Course Knowledge Bank</h2>
            <p style={{ color: '#94a3b8', margin: '5px 0 0 0', fontSize: '0.95rem' }}>Explore comprehensive global dynamic study stems instantly.</p>
          </div>
          <button onClick={() => router.push('/')} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid #ff7a00', color: '#ff7a00', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Back to Home</button>
        </header>

        {/* Tab Switch Selectors */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
          {Object.keys(database).map((tabKey) => (
            <button 
              key={tabKey} 
              onClick={() => setActiveTab(tabKey)}
              style={{ padding: '12px 20px', background: activeTab === tabKey ? '#1e3a8a' : 'rgba(30,41,59,0.5)', border: `1px solid ${activeTab === tabKey ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.85rem' }}
            >
              {tabKey} Matrix
            </button>
          ))}
        </div>

        {/* Active Information Box Render */}
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '35px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
          <h3 style={{ color: '#38bdf8', margin: '0 0 15px 0', fontSize: '1.6rem', fontWeight: 800 }}>{database[activeTab].title}</h3>
          
          <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 20px 0' }}>
            <strong style={{ color: '#ff7a00' }}>Scope Scope:</strong> {database[activeTab].scope}
          </p>
          
          <p style={{ color: '#cbd5e1', margin: '0 0 30px 0' }}>
            <strong style={{ color: '#ff7a00' }}>Standard Course Duration:</strong> {database[activeTab].duration}
          </p>

          <h4 style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', color: '#fff', fontSize: '1.1rem', marginBottom: '15px', fontWeight: 700 }}>Courses Included Under This Scope:</h4>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {database[activeTab].items.map((item, idx) => (
              <span key={idx} style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>
                📖 {item}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}