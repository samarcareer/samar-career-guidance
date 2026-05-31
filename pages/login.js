import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

export default function StudentLoginPortal() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  
  // Detailed registration form state fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [streamInterest, setStreamInterest] = useState('science');
  const [loading, setLoading] = useState(false);

  const handlePortalAction = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert("Please provide a valid credential email token.");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // Detailed Extended Profiles Insertion
        const { error } = await supabase
          .from('user_assessments')
          .insert([
            { 
              email: email.trim().toLowerCase(),
              interest_area: streamInterest,
              preferred_language: 'en'
            }
          ]);

        if (error) {
          alert("Database Registration Sync Error: " + error.message);
        } else {
          alert("Registration Success! Welcome to Samar Tracking Network.");
          router.push(`/profile?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        }
      } else {
        // Direct profile dashboard verification check logic
        const { data, error } = await supabase
          .from('user_assessments')
          .select('email')
          .eq('email', email.trim().toLowerCase());

        if (data && data.length > 0) {
          router.push(`/profile?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        } else {
          alert("No registered account found with this Token ID. Switch to signup tab below.");
        }
      }
    } catch (err) {
      alert("System Authentication Latency: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Segoe UI', sans-serif", padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '480px', width: '100%', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '35px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        
        <div style={{ textCenter: 'center', textAlign: 'center', marginBottom: '30px' }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '50px', height: '50px', borderRadius: '8px', marginBottom: '10px' }} />
          <h2 style={{ color: '#fff', margin: 0, fontWeight: 800 }}>Samar Student Hub</h2>
          <p style={{ color: '#94a3b8', margin: '5px 0 0 0', fontSize: '0.9rem' }}>{isRegister ? "Create detailed verified tracking credentials" : "Access your active tracking career charts"}</p>
        </div>

        <form onSubmit={handlePortalAction} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem', marginBottom: '6px' }}>Student Email Token (Required):</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {isRegister && (
            <>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem', marginBottom: '6px' }}>Full Name:</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Mohammed Junaid" style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem', marginBottom: '6px' }}>Active WhatsApp Contact Line:</label>
                <input type="tel" required value={contactNo} onChange={(e) => setContactNo(e.target.value)} placeholder="9270323128" style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem', marginBottom: '6px' }}>Current Institute / School Name:</label>
                <input type="text" required value={collegeName} onChange={(e) => setCollegeName(e.target.value)} placeholder="Malegaon Higher Secondary School" style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem', marginBottom: '6px' }}>Academic Stream Hub Target:</label>
                <select value={streamInterest} onChange={(e) => setStreamInterest(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.95rem', outline: 'none' }}>
                  <option value="science">Science Matrix</option>
                  <option value="commerce">Commerce Hub</option>
                  <option value="paramedical">Paramedical Field</option>
                  <option value="btech">B.Tech Engineering</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#38bdf8', border: 'none', color: '#0f172a', fontWeight: 'bold', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 12px rgba(56,189,248,0.2)' }}>
            {loading ? "Processing Sync..." : isRegister ? "Complete Detailed Sign Up" : "Secure Log In"}
          </button>

        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'transparent', border: 'none', color: '#ff7a00', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
            {isRegister ? "Already registered parameters? Log In Here" : "New student token? Create Detailed Form Profile Here"}
          </button>
          <button onClick={() => router.push('/')} style={{ display: 'block', margin: '15px auto 0 auto', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel & Return Home</button>
        </div>

      </div>
    </div>
  );
}