import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Data object moved outside to prevent Vercel Build Errors
const database = {
  science: { title: "Science & Technology Domain", scope: "Research, Advanced Data Science, Labs, Agriculture systems aur professional engineering branches.", duration: "3 to 4 Years Degree Modules", items: ["Bsc Physics", "Bsc Chemistry", "Bsc Botany", "Bsc Zoology", "Bsc Computer science", "Bsc Mathematics", "Bsc PCM", "Bsc CBZ", "Bsc Forensic Science", "Bsc Food technology"] },
  commerce: { title: "Commerce & Strategic Finance Hub", scope: "Corporate accounting, banking, management systems, taxation laws aur professional financial audits.", duration: "3 Years Standard Graduation Route", items: ["CA Chartered Account", "CMA Cost Management Account", "CS Company Secretary", "B.Com Regular", "B.Com Taxation", "BBA / BBM Regular", "BFM Financial Management"] },
  paramedical: { title: "Paramedical & Healthcare Allied Science", scope: "Clinical pharmacy solutions, pathology laboratory expertise, radiology metrics, medical scanning aur nursing fields.", duration: "2 to 4 Years (Diploma / Degrees)", items: ["Nursing", "Pharm D", "B.Pharm", "D.Pharm", "Anesthesia technical", "Cardiac Care technical", "Clinical Optometry", "Medical Lab technician", "PHYSIOTHERAPY"] },
  btech: { title: "Advanced Engineering Framework", scope: "Software development pipelines, robotic architectures, automation engineering, infrastructure mapping, system configurations.", duration: "4 Years Professional Engineering Degree", items: ["Computer Science Engi.", "Electronics & Comm.Engi.", "Mechanical Engineering", "Civil Engineering", "Automation & Robotics Eng.", "Biomedical Engineering"] }
};

export default function CourseCategories() {
  const router = useRouter();
  const { stream, search } = router.query;
  const [activeTab, setActiveTab] = useState('science');

  useEffect(() => {
    if (stream && database[stream]) setActiveTab(stream);
    else if (search) {
      const query = decodeURIComponent(search).toLowerCase();
      for (const [key, val] of Object.entries(database)) {
        if (val.items.some(i => i.toLowerCase().includes(query)) || key.includes(query)) { setActiveTab(key); break; }
      }
    }
  }, [stream, search]);

  return (
    <div style={{ width: '100%', backgroundColor: '#0f172a', minHeight: '100vh', padding: '50px 5%', fontFamily: "'Segoe UI', sans-serif", color: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '25px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#38bdf8', margin: 0, fontWeight: 800, fontSize: '2rem' }}>Samar Course Knowledge Bank</h2>
            <p style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: '1.1rem' }}>Explore comprehensive global dynamic study stems instantly.</p>
          </div>
          <button onClick={() => router.push('/')} style={{ padding: '12px 25px', background: 'transparent', border: '2px solid #ff7a00', color: '#ff7a00', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Back to Home</button>
        </header>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {Object.keys(database).map((tabKey) => (
            <button key={tabKey} onClick={() => setActiveTab(tabKey)} style={{ padding: '15px 30px', background: activeTab === tabKey ? '#1e3a8a' : 'rgba(30,41,59,0.5)', border: `1px solid ${activeTab === tabKey ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', fontSize: '1rem', flex: 1, minWidth: '200px' }}>
              {tabKey} Matrix
            </button>
          ))}
        </div>

        <div style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '50px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <h3 style={{ color: '#38bdf8', margin: '0 0 20px 0', fontSize: '2.2rem', fontWeight: 800 }}>{database[activeTab].title}</h3>
          <p style={{ color: '#cbd5e1', lineHeight: '1.8', margin: '0 0 25px 0', fontSize: '1.1rem' }}><strong style={{ color: '#ff7a00' }}>Scope:</strong> {database[activeTab].scope}</p>
          <p style={{ color: '#cbd5e1', margin: '0 0 40px 0', fontSize: '1.1rem' }}><strong style={{ color: '#ff7a00' }}>Standard Course Duration:</strong> {database[activeTab].duration}</p>
          <h4 style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px', color: '#fff', fontSize: '1.3rem', marginBottom: '20px', fontWeight: 700 }}>Courses Included Under This Scope:</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            {database[activeTab].items.map((item, idx) => (
              <span key={idx} style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px 20px', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', color: '#cbd5e1' }}>📖 {item}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
