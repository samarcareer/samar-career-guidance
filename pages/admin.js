import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminPass, setAdminPass] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⚠️ Master Password for Dr. Ashfaque Sir (Aap ise baad mein change kar sakte hain)
  const MASTER_PASS = "samar@2026";

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPass === MASTER_PASS) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("Incorrect Security PIN. Access Denied!");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetching all data from user_assessments table
      const { data, error } = await supabase
        .from('user_assessments')
        .select('*')
        .order('created_at', { ascending: false }); // Latest entry sabse upar

      if (error) throw error;
      if (data) setStudentsData(data);
    } catch (err) {
      alert("Error fetching data: " + err.message);
    }
    setLoading(false);
  };

  // Function to download data as Excel/CSV
  const downloadCSV = () => {
    if (studentsData.length === 0) {
      alert("No data to download!");
      return;
    }
    const headers = "Date,Email,Selected Stream,Language\n";
    const rows = studentsData.map(s => {
      const date = new Date(s.created_at).toLocaleDateString('en-IN');
      return `"${date}","${s.email}","${s.interest_area}","${s.preferred_language}"`;
    }).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Samar_Students_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px)`,
      backgroundSize: '30px 30px',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 5%'
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <title>Admin Dashboard | Samar Career Guidance</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        .admin-card { background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); width: 100%; max-width: 450px; text-align: center; }
        .dashboard-container { width: 100%; max-width: 1200px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; text-align: left; }
        .data-table th { background: rgba(56, 189, 248, 0.15); padding: 15px; color: #38bdf8; border-bottom: 2px solid #38bdf8; font-size: 1.1rem; }
        .data-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-size: 0.95rem; }
        .data-table tr:hover { background: rgba(255,255,255,0.05); }
        .input-box { width: 100%; padding: 15px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid rgba(56,189,248,0.4); color: #fff; font-size: 1.1rem; outline: none; margin-bottom: 20px; text-align: center; letter-spacing: 2px; }
        .btn-primary { background: #3b82f6; color: #fff; padding: 12px 25px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1.1rem; width: 100%; transition: 0.3s; }
        .btn-primary:hover { background: #2563eb; }
        .action-btn { background: transparent; border: 1px solid #10b981; color: #10b981; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.3s; display: flex; align-items: center; gap: 5px; }
        .action-btn:hover { background: #10b981; color: #0f172a; }
        .table-responsive { overflow-x: auto; }
      `}} />

      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img src="/logo.jpg" alt="Logo" style={{ width: '70px', height: '70px', borderRadius: '12px', marginBottom: '15px' }} />
        <h1 style={{ color: '#38bdf8', margin: '0 0 5px 0', fontSize: '2.2rem' }}>Director's Dashboard</h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>Samar Foundation • Dr. Ashfaque Umar</p>
      </header>

      {!isAuthenticated ? (
        // --- LOGIN SCREEN FOR ADMIN ---
        <div className="admin-card">
          <i className='bx bxs-lock-alt' style={{ fontSize: '4rem', color: '#3b82f6', marginBottom: '20px' }}></i>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.5rem' }}>Restricted Access</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter Master PIN" 
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="input-box"
              required
            />
            <button type="submit" className="btn-primary">Unlock Dashboard <i className='bx bx-check-shield'></i></button>
          </form>
          <button onClick={() => router.push('/')} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}>
            Return to Home Page
          </button>
        </div>
      ) : (
        // --- SECURE DASHBOARD DATA SCREEN ---
        <div className="dashboard-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
            <div>
              <h2 style={{ color: '#fff', margin: '0 0 5px 0' }}>Student Assessments Database</h2>
              <p style={{ color: '#94a3b8', margin: 0 }}>Total Registered Students: <strong>{studentsData.length}</strong></p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={fetchData} className="action-btn" style={{ borderColor: '#3b82f6', color: '#3b82f6' }}>
                <i className='bx bx-refresh'></i> Refresh
              </button>
              <button onClick={downloadCSV} className="action-btn">
                <i className='bx bx-download'></i> Download Excel
              </button>
              <button onClick={() => setIsAuthenticated(false)} className="action-btn" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                <i className='bx bx-log-out'></i> Lock
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#38bdf8' }}>
              <i className='bx bx-loader-alt bx-spin' style={{ fontSize: '3rem' }}></i>
              <p>Fetching Secure Data...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Registration Date</th>
                    <th>Student Email ID</th>
                    <th>Selected Stream</th>
                    <th>Language</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.length > 0 ? (
                    studentsData.map((student, index) => (
                      <tr key={student.id || index}>
                        <td style={{ fontWeight: 'bold', color: '#38bdf8' }}>{index + 1}</td>
                        <td>{new Date(student.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td style={{ color: '#fff' }}>{student.email}</td>
                        <td><span style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '5px 10px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>{student.interest_area}</span></td>
                        <td>{student.preferred_language === 'ur' ? 'اردو (Urdu)' : 'English'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No student records found in the database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
