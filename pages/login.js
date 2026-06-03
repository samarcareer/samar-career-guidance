import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase'; // Ensure this matches your path

export default function StudentLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // STEP 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          // Allow creating a new user if they don't exist yet
          shouldCreateUser: true, 
        }
      });

      if (error) throw error;
      
      setMessage('A secure 6-digit OTP has been sent. Please check your Inbox and Spam folder.');
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email'
      });

      if (error) throw error;

      if (data?.session) {
        // Success! User is authenticated. Redirect to dashboard/profile
        router.push('/dashboard'); 
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setStep(1);
    setOtp('');
    setError('');
    setMessage('');
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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <title>Secure Login | Samar Guidance</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .login-glass-card {
          background: rgba(30, 64, 175, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(147, 197, 253, 0.2);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          text-align: center;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .input-group {
          margin-bottom: 20px;
          text-align: left;
        }

        .input-group label {
          display: block;
          color: #93c5fd;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .input-group input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid rgba(56, 189, 248, 0.3);
          background: rgba(15, 23, 42, 0.6);
          color: #fff;
          font-size: 1rem;
          outline: none;
          transition: 0.3s;
        }

        .input-group input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          background: #3b82f6;
          color: #fff;
          font-size: 1.05rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-2px);
        }

        .btn-primary:disabled {
          background: #64748b;
          cursor: not-allowed;
          box-shadow: none;
        }

        .alert-box {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          text-align: left;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        .back-link {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 0.9rem;
          margin-top: 20px;
          cursor: pointer;
          transition: 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .back-link:hover {
          color: #38bdf8;
        }
      `}} />

      <div className="login-glass-card">
        <img 
          src="/logo.jpg" 
          alt="Logo" 
          style={{ width: '70px', height: '70px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} 
        />
        
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '5px', color: '#fff' }}>
          {step === 1 ? 'Student Portal' : 'Verify Identity'}
        </h2>
        
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '25px' }}>
          {step === 1 
            ? 'Enter your email to receive a secure login code.' 
            : `OTP sent to ${email}`
          }
        </p>

        {error && (
          <div className="alert-box alert-error">
            <i className='bx bx-error-circle' style={{ fontSize: '1.2rem' }}></i> {error}
          </div>
        )}
        
        {message && step === 2 && !error && (
          <div className="alert-box alert-success">
            <i className='bx bx-check-circle' style={{ fontSize: '1.2rem' }}></i> {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <label><i className='bx bx-envelope'></i> Email Address</label>
              <input 
                type="email" 
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <i className='bx bx-loader-alt bx-spin'></i> : <i className='bx bx-send'></i>}
              {loading ? 'Sending...' : 'Send Secure OTP'}
            </button>
            <button type="button" className="back-link" onClick={() => router.push('/')}>
              <i className='bx bx-left-arrow-alt'></i> Return to Homepage
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="input-group">
              <label><i className='bx bx-dialpad-alt'></i> 6-Digit OTP Code</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading || otp.length < 6}>
              {loading ? <i className='bx bx-loader-alt bx-spin'></i> : <i className='bx bx-check-shield'></i>}
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" className="back-link" onClick={goBackToEmail}>
              <i className='bx bx-edit-alt'></i> Change Email Address
            </button>
          </form>
        )}
      </div>

      <footer style={{ marginTop: '40px', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
        <p><i className='bx bx-lock-alt'></i> Secured by Enterprise-Grade Authentication</p>
      </footer>
    </div>
  );
}
