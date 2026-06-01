import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

export default function StudentLoginPortal() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [streamInterest, setStreamInterest] = useState('science');
  const [loading, setLoading] = useState(false);

  const handlePortalAction = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return alert("Valid email required.");
    setLoading(true);
    try {
      if (isRegister) {
        const { error } = await supabase.from('user_assessments').insert([{ email: email.trim().toLowerCase(), interest_area: streamInterest, preferred_language: 'en' }]);
        if (error) alert("Registration Error: " + error.message);
        else router.push(`/profile?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      } else {
        const { data } = await supabase.from('user_assessments').select('email').eq('email', email.trim().toLowerCase());
        if (data && data.length > 0) router.push(`/profile?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        else alert("No registered account found. Switch to signup.");
      }
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Segoe UI', sans-serif", padding: '40px 5%' }}>
      <div style={{ maxWidth: '600px', width: '100%', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '50px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '10px', marginBottom: '15px' }} />
          <h2 style={{ color: '#fff', margin: 0, fontWeight: 800, fontSize: '2rem' }}>Samar Student Hub</h2>
          <p style={{ color: '#94a3b8', margin: '10px 0 0 0', fontSize: '1.1rem' }}>{isRegister ? "Create detailed verified tracking credentials" : "Access your active tracking career charts"}</p>
        </div>

        <form onSubmit={handlePortalAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontWeight: '600', fontSize: '1rem', marginBottom: '8px' }}>Student Email Token (Required):</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '1.1rem', outline: 'none' }} />
          </div>

          {isRegister && (
            <>
              <div><label style={{ display: 'block', color: '#94a3b8', fontWeight: '600', fontSize: '1rem', marginBottom: '8px' }}>Full Name:</label><input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '1.1rem', outline: 'none' }} /></div>
              <div><label style={{ display: 'block', color: '#94a3b8', fontWeight: '600', fontSize: '1rem', marginBottom: '8px' }}>Active WhatsApp Contact Line:</label><input type="tel" required value={contactNo} onChange={(e) => setContactNo(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '1.1rem', outline: 'none' }} /></div>
              <div><label style={{ display: 'block', color: '#94a3b8', fontWeight: '600', fontSize: '1rem', marginBottom: '8px' }}>Current Institute / School Name:</label><input type="text" required value={collegeName} onChange={(e) => setCollegeName(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '1.1rem', outline: 'none' }} /></div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontWeight: '600', fontSize: '1rem', marginBottom: '8px' }}>Academic Stream Hub Target:</label>
                <select value={streamInterest} onChange={(e) => setStreamInterest(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '1.1rem', outline: 'none' }}>
                  <option value="science">Science Matrix</option><option value="commerce">Commerce Hub</option><option value="paramedical">Paramedical Field</option><option value="btech">B.Tech Engineering</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '18px', background: '#38bdf8', border: 'none', color: '#0f172a', fontWeight: 'bold', fontSize: '1.2rem', borderRadius: '8px', cursor: 'pointer', marginTop: '15px' }}>
            {loading ? "Processing Sync..." : isRegister ? "Complete Detailed Sign Up" : "Secure Log In"}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px' }}>
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'transparent', border: 'none', color: '#ff7a00', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            {isRegister ? "Already registered parameters? Log In Here" : "New student token? Create Detailed Form Profile Here"}
          </button>
          <button onClick={() => router.push('/')} style={{ display: 'block', margin: '20px auto 0 auto', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer' }}>Cancel & Return Home</button>
        </div>
      </div>
    </div>
  );
}
