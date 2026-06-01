import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

export default function StudentProfile() {
  const router = useRouter();
  const { email } = router.query;

  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [streamDetails, setStreamDetails] = useState(null);

  const careerKnowledgeBank = {
    science: { title: "Science & Technology Framework", scope: "Bsc aur technical courses ke baad aap Research, Data Analytics, Space Science, Laboratory Tech, aur Civil Services mein ja sakte hain.", duration: "3 Years Standard Graduation", jobs: ["Data Scientist", "Lab Researcher", "Content Developer", "Forest Officer", "Forensic Expert"] },
    commerce: { title: "Commerce & Financial Management", scope: "Finance, Auditing, Corporate Laws, Investment Banking aur Taxation sector mein commerce students ki high demand rehti hai.", duration: "3 to 5 Years Professional Route", jobs: ["Chartered Accountant (CA)", "Financial Analyst", "Company Secretary", "Tax Consultant", "Bank Manager"] },
    paramedical: { title: "Paramedical & Nursing Allied Sciences", scope: "Hospitals, Diagnostics labs, Radiology centers aur Pharmacy lines mein immediate job placements milti hain.", duration: "2 to 4 Years (Diploma / Degree)", jobs: ["Pharmacist (D.Pharm/B.Pharm)", "Lab Technician", "X-Ray/Radiology Expert", "Physiotherapist"] },
    btech: { title: "Engineering & Advanced Automation", scope: "Software industries, Automation & Robotics, Infrastructure developers aur Aerospace corporations mein high-paying tech jobs.", duration: "4 Years Professional Degree", jobs: ["Software Engineer", "Robotics Specialist", "Civil Engineer", "Automobile Designer"] }
  };

  useEffect(() => {
    if (!email) return;
    async function fetchStudentProfile() {
      setLoading(true);
      try {
        const { data } = await supabase.from('user_assessments').select('*').eq('email', email.trim().toLowerCase()).order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setStudentData(data[0]);
          if (careerKnowledgeBank[data[0].interest_area]) setStreamDetails(careerKnowledgeBank[data[0].interest_area]);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    fetchStudentProfile();
  }, [email]);

  if (loading) return <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38bdf8', fontSize: '1.5rem', fontWeight: 'bold' }}>Syncing Profile Data...</div>;

  if (!studentData) return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#ef4444', padding: '20px' }}>
      <h3 style={{ fontSize: '2rem' }}>No Account Found!</h3>
      <button onClick={() => router.push('/assessment')} style={{ marginTop: '20px', padding: '15px 30px', background: '#38bdf8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>Take Assessment</button>
    </div>
  );

  return (
    <div style={{ width: '100%', fontFamily: "'Segoe UI', sans-serif", padding: '40px 5%', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      
      <header style={{ width: '100%', maxWidth: '1400px', margin: '0 auto 40px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '10px' }} />
          <div>
            <h3 style={{ margin: 0, color: '#38bdf8', fontWeight: '800', fontSize: '1.8rem' }}>Samar Career Guidance</h3>
            <small style={{ color: '#ff7a00', fontWeight: 'bold', fontSize: '1rem' }}>Student Tracking Portal</small>
          </div>
        </div>
        <button onClick={() => router.push('/')} style={{ padding: '12px 25px', background: 'transparent', border: '2px solid #38bdf8', color: '#38bdf8', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>Back to Home</button>
      </header>

      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
        
        <section style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center' }}>
          <div style={{ width: '130px', height: '130px', backgroundColor: '#1e293b', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '4px solid #38bdf8', overflow: 'hidden', position: 'relative' }}>
            <img src="/logo.jpg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '0', width: '100%', background: '#10b981', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center', padding: '4px 0' }}>VERIFIED</div>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.9rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>STUDENT ACCOUNT PROFILE</span>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', margin: '15px 0 5px 0', fontWeight: '900' }}>{studentData.email.split('@')[0].toUpperCase()}</h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '1.1rem' }}>Registered Token: <span style={{ color: '#cbd5e1' }}>{studentData.email}</span></p>
          </div>
        </section>

        <section style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', boxShadow: '0 15px 35px rgba(0,0,0,0.4)' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0', fontSize: '2rem', color: '#fff', fontWeight: '900' }}>Roadmap Matrix: {studentData.interest_area.toUpperCase()}</h3>
          </div>

          {streamDetails ? (
            <div>
              <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '25px' }}><strong style={{ color: '#38bdf8' }}>Scope:</strong> {streamDetails.scope}</p>
              <p style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '30px' }}><strong style={{ color: '#38bdf8' }}>Duration:</strong> {streamDetails.duration}</p>
              <h5 style={{ color: '#ff7a00', fontSize: '1.3rem', marginBottom: '15px' }}>Priority Careers:</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {streamDetails.jobs.map((job, idx) => <span key={idx} style={{ background: 'rgba(255,122,0,0.1)', border: '1px solid rgba(255,122,0,0.3)', padding: '12px 20px', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 'bold', color: '#fff' }}>💼 {job}</span>)}
              </div>
            </div>
          ) : <p style={{ color: '#94a3b8' }}>Analytics fetching pending...</p>}
        </section>

      </div>
    </div>
  );
}
