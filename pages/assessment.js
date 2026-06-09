import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

export default function CareerAssessment() {
  const router = useRouter();
  
  // States for dynamic workflow
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1 to N = Questions, N+1 = Lead Capture, N+2 = Result
  const [answers, setAnswers] = useState([]); // Will store the selected streams (e.g., ['science', 'commerce', ...])
  
  // Lead Data
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedStream, setCalculatedStream] = useState('');
  
  const [loading, setLoading] = useState(true);

  // Fetch Questions from Supabase (Only active ones)
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('diagnostic_questions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (data) setQuestions(data);
      if (error) console.error("Error fetching questions:", error);
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  // Handle Option Click
  const handleOptionSelect = (selectedStream) => {
    const newAnswers = [...answers, selectedStream];
    setAnswers(newAnswers);
    
    // Move to next question or lead capture form
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Calculate Result & Submit Lead
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Tally the scores (Which stream got the most selections?)
    const streamCounts = answers.reduce((acc, stream) => {
      acc[stream] = (acc[stream] || 0) + 1;
      return acc;
    }, {});

    // Find the highest scoring stream
    const targetStream = Object.keys(streamCounts).reduce((a, b) => streamCounts[a] > streamCounts[b] ? a : b);
    setCalculatedStream(targetStream);

    // 2. Save to Supabase (CRM)
    const { error } = await supabase.from('user_assessments').insert([{
      email: email,
      interest_area: targetStream,
      status: 'Completed' // or 'new' based on your DB rules
    }]);

    setIsSubmitting(false);

    if (error) {
      alert("Something went wrong! Please try again.");
      console.error(error);
    } else {
      // Move to Result Step
      setCurrentStep(questions.length + 2);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#38bdf8' }}>
        <h2>Loading Assessment...</h2>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f172a', 
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px)`,
      backgroundSize: '30px 30px', 
      minHeight: '100vh', 
      color: '#f8fafc', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px'
    }}>
      <Head>
        <title>Career Discovery Assessment | Samar Guidance</title>
      </Head>

      <div style={{
        background: 'rgba(30, 41, 59, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(56,189,248,0.3)',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        
        {/* STEP 0: INTRODUCTION */}
        {currentStep === 0 && (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚀</div>
            <h1 style={{ color: '#fff', marginBottom: '10px' }}>Discover Your True Potential</h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px', lineHeight: '1.6' }}>
              We won't test your memory. We will test your personality, problem-solving skills, and behavioral traits to suggest the absolute best career path for you.
            </p>
            {questions.length > 0 ? (
              <button 
                onClick={() => setCurrentStep(1)}
                style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '15px 40px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}
              >
                Start Assessment
              </button>
            ) : (
              <p style={{ color: '#ef4444' }}>No questions available right now. Please contact the administrator.</p>
            )}
          </div>
        )}

        {/* STEP 1 to N: GAMIFIED QUESTIONS */}
        {currentStep > 0 && currentStep <= questions.length && (
          <div>
            {/* Progress Bar */}
            <div style={{ width: '100%', background: '#1e293b', borderRadius: '10px', height: '8px', marginBottom: '30px' }}>
              <div style={{ width: `${(currentStep / questions.length) * 100}%`, background: '#38bdf8', height: '8px', borderRadius: '10px', transition: 'width 0.3s ease' }}></div>
            </div>
            
            <h4 style={{ color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
              Question {currentStep} of {questions.length}
            </h4>
            <h2 style={{ color: '#fff', marginBottom: '30px', fontSize: '1.4rem' }}>
              {questions[currentStep - 1].q_text_en}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Render the 4 dynamic options */}
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => handleOptionSelect(questions[currentStep - 1][`opt${num}_stream`])}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#e2e8f0',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.paddingLeft = '25px'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)'; e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'; e.currentTarget.style.paddingLeft = '20px'; }}
                >
                  {questions[currentStep - 1][`opt${num}_en`]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP N+1: LEAD CAPTURE (Gated Content) */}
        {currentStep === questions.length + 1 && (
          <div>
             <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔒</div>
             <h2 style={{ color: '#fff', marginBottom: '10px' }}>Analyzing Your Responses...</h2>
             <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
               Your career profile is ready! Enter your email to unlock your AI-calculated target stream and send the report to our counselors.
             </p>
             
             <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input 
                  type="email" 
                  placeholder="Enter your Email ID" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{ padding: '15px', borderRadius: '8px', border: '1px solid #38bdf8', background: '#0f172a', color: '#fff', fontSize: '1rem', textAlign: 'center' }}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ background: '#10b981', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Unlocking...' : 'Unlock My Result'}
                </button>
             </form>
          </div>
        )}

        {/* STEP N+2: FINAL RESULT & CTA */}
        {currentStep === questions.length + 2 && (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '15px', color: '#10b981' }}>🎯</div>
            <h2 style={{ color: '#fff', marginBottom: '10px' }}>Assessment Complete!</h2>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Based on your behavioral and logical mapping, your strongest aptitude aligns with:</p>
            
            <div style={{ background: 'rgba(56,189,248,0.1)', border: '1px dashed #38bdf8', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
               <h1 style={{ color: '#38bdf8', textTransform: 'uppercase', margin: 0 }}>{calculatedStream}</h1>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '30px' }}>
              Your profile has been saved. Dr. Ashfaque Umar's team will review your report and guide you further.
            </p>

            <button 
              onClick={() => router.push(`/categories?search=${calculatedStream}`)}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Explore {calculatedStream} Courses
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
