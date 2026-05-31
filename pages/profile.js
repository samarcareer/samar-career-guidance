import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

export default function StudentProfile() {
  const router = useRouter();
  const { email } = router.query;

  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [streamDetails, setStreamDetails] = useState(null);

  // Deep Analytics Data - Har category ki details jo student ko show hogi
  const careerKnowledgeBank = {
    science: {
      title: "Science & Technology Framework",
      scope: "Bsc aur technical courses ke baad aap Research, Data Analytics, Space Science, Laboratory Tech, aur Civil Services mein ja sakte hain.",
      duration: "3 Years Standard Graduation",
      jobs: ["Data Scientist", "Lab Researcher", "Content Developer", "Forest Officer", "Forensic Expert"]
    },
    commerce: {
      title: "Commerce & Financial Management",
      scope: "Finance, Auditing, Corporate Laws, Investment Banking aur Taxation sector mein commerce students ki high demand rehti hai.",
      duration: "3 to 5 Years Professional Route",
      jobs: ["Chartered Accountant (CA)", "Financial Analyst", "Company Secretary", "Tax Consultant", "Bank Manager"]
    },
    humanities: {
      title: "Arts & Humanities Stream",
      scope: "Media, Journalism, Psychology, Economics, Social Work aur Civil Services examinations ke liye yeh best domain hai.",
      duration: "3 Years Graduation",
      jobs: ["Journalist", "Public Relations Specialist", "Psychologist", "Social Activist", "HR Executive"]
    },
    management: {
      title: "Corporate Management & Logistics",
      scope: "Business administration, Event Management, Supply Chain management aur HR solutions ke corporate sectors mein career options hain.",
      duration: "3 Years (BBA) / 2 Years (MBA)",
      jobs: ["Operations Manager", "HR Specialist", "Logistics Planner", "Event Coordinator"]
    },
    law: {
      title: "Legal Studies & Judiciary",
      scope: "Corporate law, Criminal litigation, Legal advisory panels aur Judiciary competitive exams ke raste khulte hain.",
      duration: "3 Years (After Graduation) / 5 Years (Integrated)",
      jobs: ["Corporate Lawyer", "Legal Advisor", "Public Prosecutor", "Judicial Magistrate"]
    },
    medical: {
      title: "Core Medical & Healthcare Sciences",
      scope: "Clinical practice, Healthcare administration, Hospitals management aur personal clinics chalane ke behtareen mauqe hain.",
      duration: "4.5 to 5.5 Years Professional Degree",
      jobs: ["General Physician", "Unani Practitioner (BUMS)", "Ayurvedic Doctor", "Dental Surgeon"]
    },
    paramedical: {
      title: "Paramedical & Nursing Allied Sciences",
      scope: "Hospitals, Diagnostics labs, Radiology centers aur Pharmacy lines mein immediate job placements milti hain.",
      duration: "2 to 4 Years (Diploma / Degree)",
      jobs: ["Pharmacist (D.Pharm/B.Pharm)", "Lab Technician", "X-Ray/Radiology Expert", "Physiotherapist"]
    },
    btech: {
      title: "Engineering & Advanced Automation",
      scope: "Software industries, Automation & Robotics, Infrastructure developers aur Aerospace corporations mein high-paying tech jobs.",
      duration: "4 Years Professional Degree",
      jobs: ["Software Engineer", "Robotics Specialist", "Civil Engineer", "Automobile Designer"]
    },
    polytechnic: {
      title: "Technical Diploma (Polytechnic)",
      scope: "10th ke baad direct technical experience gain karke Junior Engineer roles aur industries mein entry level jobs milti hain.",
      duration: "3 Years Technical Diploma",
      jobs: ["Junior Engineer (JE)", "Technical Supervisor", "Production In-charge", "CAD Designer"]
    },
    newJobMgmt: {
      title: "Modern Job-Oriented Aviation & SAP Logistics",
      scope: "Aviation sectors, Air Cargo Management, Cloud Computing, System tracking aur specialized modern corporate profiles.",
      duration: "2 to 3 Years Advanced Framework",
      jobs: ["Aviation Operations Specialist", "Airport Manager", "SAP Cloud Consultant", "Logistics Planner"]
    },
    architecture: {
      title: "Architecture & Structural Designing",
      scope: "Urban planning, Interior designing firms, Infrastructure building aur independent construction planning maps work.",
      duration: "5 Years Professional Degree (NATA Required)",
      jobs: ["Architectural Designer", "Urban Planner", "Structural Consultant", "Interior Architect"]
    }
  };

  useEffect(() => {
    if (!email) return;

    async function fetchStudentProfile() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_assessments')
          .select('*')
          .eq('email', email.trim().toLowerCase())
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching data:", error);
        } else if (data && data.length > 0) {
          const currentStudent = data[0];
          setStudentData(currentStudent);

          // Stream match karke metadata information load karna
          const streamKey = currentStudent.interest_area;
          if (careerKnowledgeBank[streamKey]) {
            setStreamDetails(careerKnowledgeBank[streamKey]);
          }
        }
      } catch (err) {
        console.error("System catch error:", err);
      }
      setLoading(false);
    }

    fetchStudentProfile();
  }, [email]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38bdf8', fontFamily: "'Segoe UI', sans-serif", fontWeight: 'bold' }}>
        System Profile Syncing... Please Wait...
      </div>
    );
  }

  if (!studentData) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#ef4444', fontFamily: "'Segoe UI', sans-serif", padding: '20px', textAlign: 'center' }}>
        <h3>No Student Tracking Profile Found!</h3>
        <p style={{ color: '#94a3b8' }}>Pehle Career Assessment Wizard test complete kijiye.</p>
        <button onClick={() => router.push('/assessment')} style={{ marginTop: '15px', padding: '10px 20px', background: '#38bdf8', border: 'none', color: '#0f172a', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Take Assessment Test</button>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: "'Segoe UI', sans-serif", 
      padding: '20px', 
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.1) 1px, #0f172a 1px)`,
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0, 12px 12px',
      minHeight: '100vh',
      color: '#f8fafc'
    }}>
      
      {/* Top Brand Banner Header */}
      <header style={{ maxWidth: '1000px', margin: '0 auto 30px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.jpg" alt="Samar Logo" style={{ width: '45px', height: '45px', borderRadius: '6px' }} />
          <div>
            <h3 style={{ margin: 0, color: '#38bdf8', fontWeight: '800', letterSpacing: '0.5px' }}>Samar Career Guidance</h3>
            <small style={{ color: '#ff7a00', fontWeight: 'bold' }}>Student Tracking Portal</small>
          </div>
        </div>
        <button onClick={() => router.push('/')} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>Back to Home</button>
      </header>

      {/* Main Grid Layout Container */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        
        {/* ROW 1: Student Identity Verified Card */}
        <section style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', display: 'flex', flexWrap: 'wrap', gap: '25px', alignItems: 'center' }}>
          
          {/* Avatar Area with Verification Badge */}
          <div style={{ position: 'relative', width: '110px', height: '110px', backgroundColor: '#1e293b', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '3px solid #38bdf8', padding: '4px' }}>
            <span style={{ fontSize: '2.5rem' }}>🎓</span>
            <div style={{ position: 'absolute', bottom: '0', right: '5px', backgroundColor: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '3px 7px', borderRadius: '10px', border: '2px solid #0f172a' }}>VERIFIED</div>
          </div>

          {/* Core Profile Parameters Metadata */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <span style={{ fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>STUDENT ACCOUNT PROFILE</span>
            <h2 style={{ fontSize: '1.7rem', color: '#fff', margin: '10px 0 5px 0', fontWeight: '800' }}>{studentData.email.split('@')[0].toUpperCase()}</h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', fontWeight: '600' }}>Verified Email ID Token: <span style={{ color: '#cbd5e1' }}>{studentData.email}</span></p>
            <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>Tracking Activation: {new Date(studentData.created_at).toLocaleDateString('en-IN')} | Language Selected: <span style={{ textTransform: 'uppercase', color: '#ff7a00', fontWeight: 'bold' }}>{studentData.preferred_language}</span></p>
          </div>
        </section>

        {/* ROW 2: Core Course Stream Analysis Report */}
        <section style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '35px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '25px' }}>
            <small style={{ color: '#ff7a00', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Roadmap Matrix</small>
            <h3 style={{ margin: '5px 0 0 0', fontSize: '1.5rem', color: '#fff', fontWeight: '800' }}>Selected Educational Domain Stream</h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', marginBottom: '30px', background: '#1e293b', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #38bdf8' }}>
            <div style={{ fontSize: '2rem' }}>🎯</div>
            <div>
              <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '1.25rem', fontWeight: '800', textTransform: 'uppercase' }}>{studentData.interest_area}</h4>
              <p style={{ margin: '3px 0 0 0', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '600' }}>Yeh stream aapke profile metrics ke mutabiq database mein mapped hai.</p>
            </div>
          </div>

          {/* Dynamic Information Display Engine Block */}
          {streamDetails ? (
            <div>
              <div style={{ marginBottom: '25px' }}>
                <h5 style={{ color: '#38bdf8', fontSize: '1.05rem', margin: '0 0 8px 0', fontWeight: 'bold' }}>1. Scope & Industrial Future:</h5>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>{streamDetails.scope}</p>
              </div>

              <div style={{ marginBottom: '25px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                <div>
                  <h5 style={{ color: '#38bdf8', fontSize: '1.05rem', margin: '0 0 5px 0', fontWeight: 'bold' }}>2. Standard Academic Duration:</h5>
                  <p style={{ color: '#fff', fontSize: '0.95rem', margin: 0, fontWeight: 'bold' }}>{streamDetails.duration}</p>
                </div>
              </div>

              <div>
                <h5 style={{ color: '#ff7a00', fontSize: '1.05rem', margin: '0 0 12px 0', fontWeight: 'bold' }}>3. High-Priority Professional Career Roles:</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {streamDetails.jobs.map((job, idx) => (
                    <span key={idx} style={{ background: 'rgba(255,122,0,0.1)', border: '1px solid rgba(255,122,0,0.3)', padding: '8px 14px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>
                      💼 {job}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#94a3b8', margin: 0 }}>Is stream ki deep technical analytics jald hi update hogi.</p>
          )}
        </section>

        {/* ROW 3: Educational Retention & Info Message */}
        <section style={{ textAlign: 'center', padding: '20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px dashed rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
          <p style={{ color: '#10b981', margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>
            💡 Smart Career Tip: Is page ki URL link ko safe rakhein ya bookmark kar lein, taaki aap kabhi bhi apni details aur tracking check kar sakein!
          </p>
        </section>

      </div>
    </div>
  );
}