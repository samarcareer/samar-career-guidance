import React, { useState, useEffect, Component } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabase';

// --- ERROR BOUNDARY (CRASH PROTECTOR) ---
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, errorMsg: '' }; }
  static getDerivedStateFromError(error) { return { hasError: true, errorMsg: error.toString() }; }
  componentDidCatch(error, errorInfo) { console.error("Admin UI Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#fff', background: '#0f172a', minHeight: '100vh' }}>
          <h1 style={{ color: '#ef4444' }}><i className='bx bx-error-alt'></i> UI Render Blocked</h1>
          <p style={{ color: '#94a3b8' }}>Don't worry, your data is safe. A specific row from database caused a render conflict.</p>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', marginTop: '20px', color: '#f87171', fontFamily: 'monospace' }}>
            {this.state.errorMsg}
          </div>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', background: '#38bdf8', color: '#000', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Reload Dashboard</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- TRANSLATION DICTIONARY ---
const t = {
  en: {
    brand: "Samar Guidance", doctor: "Dr. Ashfaque Umar", searchPlaceholder: "Search matrix...",
    navHome: "Home", navAbout: "About Us", navCareer: "Career Guidance", navAssess: "Career Assessment",
    courses10: "Courses After 10th", courses12: "Courses After 12th", coursesGrad: "Courses After Graduation", coursesPost: "Courses After Post Graduation", coursesOther: "Other Specializations",
    adminTitle: "Director's Dashboard", adminSub: "Samar Foundation • Advanced CRM & Operations", 
    tabCrm: "CRM & Lead Management", tabCms: "Study Material & Matrix Manager", tabQna: "Assessment Q&A Manager",
    totalLeads: "Total Leads", science: "Science", commerce: "Commerce", otherStreams: "Other Streams",
    searchEmail: "Search by Email...", allStreams: "All Streams", refresh: "Refresh", exportCsv: "Export CSV", lock: "Lock",
    date: "Date", studentId: "Student Identity (Email)", matrix: "Matrix (Stream)", lang: "Interface Lang", crmStatus: "CRM Status", action: "Action", noRecords: "No records found matching your filters.", syncing: "Syncing Database...",
    cmsTitle: "Knowledge Bank Management", cmsSub: "Add, edit, or remove study domains and career streams.", addNew: "+ Add New Matrix", edit: "Edit", scope: "Scope", duration: "Duration", jobs: "Key Careers",
    qnaTitle: "Diagnostic Test Manager", qnaSub: "Manage the interactive assessment questions and their mapping.", addQuestion: "+ Add New Question", reportTitle: "Student Diagnostic Report"
  },
  ur: {
    brand: "ثمر گائیڈنس", doctor: "ڈاکٹر اشفاق عمر", searchPlaceholder: "تلاش کریں...",
    navHome: "ہوم", navAbout: "ہمارے بارے میں", navCareer: "کیریئر گائیڈنس", navAssess: "کیریئر اسسمنٹ",
    courses10: "دسویں کے بعد کورسز", courses12: "بارہویں کے بعد کورسز", coursesGrad: "گریجویشن کے بعد", coursesPost: "پوسٹ گریجویشن کے بعد", coursesOther: "دیگر مہارتیں",
    adminTitle: "ڈائریکٹر ڈیش بورڈ", adminSub: "ثمر فاؤنڈیشن • ایڈوانسڈ سی آر ایم اور آپریشنز", 
    tabCrm: "لیڈ مینجمنٹ", tabCms: "اسٹڈی میٹریل مینیجر", tabQna: "اسسمنٹ سوالات مینیجر",
    totalLeads: "کل لیڈز", science: "سائنس", commerce: "کامرس", otherStreams: "دیگر شعبے",
    searchEmail: "ای میل سے تلاش کریں...", allStreams: "تمام شعبے", refresh: "ریفریش", exportCsv: "CSV ڈاؤن لوڈ", lock: "لاک کریں",
    date: "تاریخ", studentId: "طالب علم (ای میل)", matrix: "میٹرکس (شعبہ)", lang: "زبان", crmStatus: "سٹیٹس", action: "ایکشن", noRecords: "آپ کے فلٹرز کے مطابق کوئی ریکارڈ نہیں ملا۔", syncing: "ڈیٹا بیس سنک ہو رہا ہے...",
    cmsTitle: "نالج بینک مینجمنٹ", cmsSub: "مطالعاتی ڈومینز اور کیریئر اسٹریمز شامل کریں، ترمیم کریں یا ہٹائیں۔", addNew: "+ نیا میٹرکس شامل کریں", edit: "ترمیم", scope: "دائرہ کار", duration: "مدت", jobs: "اہم کیریئر",
    qnaTitle: "ڈائگنوسٹک ٹیسٹ مینیجر", qnaSub: "انٹرایکٹو اسسمنٹ سوالات اور ان کی ترتیبات کا انتظام کریں۔", addQuestion: "+ نیا سوال شامل کریں", reportTitle: "طالب علم کی تفصیلی رپورٹ"
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGuidanceDropdown, setShowGuidanceDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [session, setSession] = useState(null);

  // AUTH STATE
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const [adminTab, setAdminTab] = useState('crm'); 

  // CRM STATE
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState('');
  const [statusMap, setStatusMap] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  // CMS LIVE DATABASE STATE
  const [matrixContent, setMatrixContent] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCmsSubmitting, setIsCmsSubmitting] = useState(false);
  
  // Q&A MANAGER STATE
  const [questionsData, setQuestionsData] = useState([]);
  const [isQnaModalOpen, setIsQnaModalOpen] = useState(false);
  const [isQnaSubmitting, setIsQnaSubmitting] = useState(false);

  const blankForm = {
    id: null, stream_key: '', title_en: '', title_ur: '', scope_en: '', scope_ur: '',
    duration_en: '', duration_ur: '', courses_en: '', courses_ur: '', details_en: '', details_ur: '' 
  };
  const [formData, setFormData] = useState(blankForm);

  const blankQnaForm = {
    id: null, q_text_en: '', q_text_ur: '',
    opt1_en: '', opt1_ur: '', opt1_stream: 'science',
    opt2_en: '', opt2_ur: '', opt2_stream: 'commerce',
    opt3_en: '', opt3_ur: '', opt3_stream: 'arts',
    opt4_en: '', opt4_ur: '', opt4_stream: 'polytechnic',
    is_active: true
  };
  const [qnaFormData, setQnaFormData] = useState(blankQnaForm);

  // INITIAL LOAD & AUTO-LOGIN CHECK
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('email')
            .eq('email', session.user.email)
            .single();
            
          if (adminUser) {
            setSession(session);
            setIsAuthenticated(true);
            fetchData();
            fetchCMSData();
            fetchQnaData();
          } else {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error("Session verification failed:", err);
      }
    };
    checkSession();

    return () => { window.removeEventListener('resize', handleResize); };
  }, []);

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    setIsAuthenticated(false);
    setOtpSent(false);
    setOtp('');
    setEmail('');
    router.push('/'); 
  };
  
  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ur' : 'en');

  // --- SECURE OTP LOGIN FLOW ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingAuth(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data: adminUser, error: dbError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', cleanEmail)
        .single();

      if (dbError || !adminUser) {
        setError("Access Denied! Your email is not authorized for Admin Access.");
        setLoadingAuth(false);
        return;
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({ email: cleanEmail });
      if (otpError) throw otpError;

      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please check your network.");
    }
    setLoadingAuth(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingAuth(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: otp,
        type: 'email'
      });

      if (verifyError) throw verifyError;

      if (data?.session) {
        setSession(data.session);
        setIsAuthenticated(true);
        fetchData();
        fetchCMSData();
        fetchQnaData();
      }
    } catch (err) {
      setError("Invalid or expired OTP. Please try again.");
    }
    setLoadingAuth(false);
  };

  // --- SAFE DATA FETCHING ---
  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('user_assessments').select('*').order('created_at', { ascending: false }); 
      if (error) console.error("DB Error:", error);
      setStudentsData(Array.isArray(data) ? data : []); 
    } catch (err) { console.error("Error fetching CRM data"); }
  };

  const fetchCMSData = async () => {
    try {
      const { data, error } = await supabase.from('matrix_content').select('*').order('created_at', { ascending: true });
      if (error) console.error("CMS read error:", error);
      setMatrixContent(Array.isArray(data) ? data : []); 
    } catch (err) { console.error("Error fetching CMS data"); }
  };

  const fetchQnaData = async () => {
    try {
      const { data, error } = await supabase.from('diagnostic_questions').select('*').order('created_at', { ascending: true });
      if (error) console.error("QNA read error:", error);
      setQuestionsData(Array.isArray(data) ? data : []); 
    } catch (err) { console.error("Error fetching QNA data"); }
  };

  // --- CMS Handlers ---
  const handleOpenEdit = (item) => {
    setFormData({
      ...item,
      courses_en: item.courses_en ? item.courses_en.join(', ') : '',
      courses_ur: item.courses_ur ? item.courses_ur.join(', ') : ''
    });
    setIsModalOpen(true);
  };
  const handleOpenAdd = () => { setFormData(blankForm); setIsModalOpen(true); };

  const handleCmsSave = async (e) => {
    e.preventDefault();
    setIsCmsSubmitting(true);
    const payload = { ...formData, stream_key: String(formData.stream_key).toLowerCase().trim(), courses_en: String(formData.courses_en).split(',').map(s => s.trim()).filter(s => s), courses_ur: String(formData.courses_ur).split(',').map(s => s.trim()).filter(s => s) };
    
    if (formData.id) {
      await supabase.from('matrix_content').update(payload).eq('id', formData.id);
    } else {
      await supabase.from('matrix_content').insert([payload]);
    }
    setIsCmsSubmitting(false);
    setIsModalOpen(false); 
    fetchCMSData();
  };

  const handleCmsDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this matrix?")) {
      await supabase.from('matrix_content').delete().eq('id', id);
      fetchCMSData();
    }
  };

  // --- Q&A Handlers (FIXED ID CREATION LOGIC) ---
  const handleOpenQnaEdit = (item) => { setQnaFormData(item); setIsQnaModalOpen(true); };
  const handleOpenQnaAdd = () => { setQnaFormData(blankQnaForm); setIsQnaModalOpen(true); };

  const handleQnaSave = async (e) => {
    e.preventDefault();
    setIsQnaSubmitting(true);

    // Create a clean payload, remove 'id' if it's a new question so DB auto-generates it
    const payload = { ...qnaFormData };
    if (!payload.id) {
      delete payload.id; 
    }

    try {
      if (qnaFormData.id) {
        // Edit existing question
        const { error } = await supabase.from('diagnostic_questions').update(payload).eq('id', qnaFormData.id);
        if (error) throw error;
      } else {
        // Insert new question
        const { error } = await supabase.from('diagnostic_questions').insert([payload]);
        if (error) throw error;
      }
      
      setIsQnaModalOpen(false); 
      fetchQnaData();
    } catch (error) {
      alert("Database Error: " + error.message);
      console.error("Save Error:", error);
    }
    
    setIsQnaSubmitting(false);
  };

  const toggleQuestionStatus = async (id, currentStatus) => {
    await supabase.from('diagnostic_questions').update({ is_active: !currentStatus }).eq('id', id);
    fetchQnaData();
  };

  // --- EXTREME SANITIZED VARIABLES FOR RENDERING ---
  const handleStatusChange = (studentEmail, newStatus) => { setStatusMap(prev => ({ ...prev, [studentEmail]: newStatus })); };

  const safeStudentsData = Array.isArray(studentsData) ? studentsData : [];
  const safeMatrixContent = Array.isArray(matrixContent) ? matrixContent : [];
  const safeQuestionsData = Array.isArray(questionsData) ? questionsData : [];

  const filteredData = safeStudentsData.filter(s => {
    const safeEmail = String(s?.email || '').toLowerCase();
    const safeStream = String(s?.interest_area || '').toLowerCase();
    const safeSearch = String(searchTerm || '').toLowerCase();
    const safeFilter = String(filterStream || '').toLowerCase();
    
    const matchesSearch = safeEmail.includes(safeSearch);
    const matchesStream = safeFilter ? safeStream === safeFilter : true;
    return matchesSearch && matchesStream;
  });

  const downloadCSV = () => {
    if (filteredData.length === 0) return alert("No data to download!");
    const headers = "Date,Email,Selected Stream,Lead Status\n";
    const rows = filteredData.map(s => {
      const date = new Date(s?.created_at || Date.now()).toLocaleDateString('en-IN');
      const safeEmail = String(s?.email || 'N/A');
      const safeStream = String(s?.interest_area || 'N/A');
      const status = statusMap[safeEmail] || 'New Lead';
      return `"${date}","${safeEmail}","${safeStream}","${status}"`;
    }).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri); link.setAttribute("download", `Samar_Leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const totalStudents = safeStudentsData.length;
  const scienceCount = safeStudentsData.filter(s => String(s?.interest_area || '').toLowerCase() === 'science').length;
  const commerceCount = safeStudentsData.filter(s => String(s?.interest_area || '').toLowerCase() === 'commerce').length;
  const otherCount = totalStudents - scienceCount - commerceCount;

  return (
    <ErrorBoundary>
      <div style={{
        direction: lang === 'ur' ? 'rtl' : 'ltr',
        fontFamily: lang === 'ur' ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Segoe UI', Roboto, sans-serif",
        backgroundColor: '#0f172a', backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.1) 1px, #0f172a 1px)`,
        backgroundSize: '30px 30px', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column', width: '100vw', maxWidth: '100%', overflowX: 'hidden', margin: 0, padding: 0
      }}>
        <Head>
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet" />
          <title>{t[lang].adminTitle} | {t[lang].brand}</title>
        </Head>

        <style dangerouslySetInnerHTML={{__html: `
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body, html { overflow-x: hidden; width: 100%; background-color: #0f172a; scroll-behavior: smooth; }
          .en-text { font-family: 'Segoe UI', Roboto, sans-serif !important; direction: ltr !important; display: inline-block; }
          .glass-navbar { width: 100%; background: rgba(30, 64, 175, 0.7); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(147, 197, 253, 0.2); position: sticky; top: 0; z-index: 1000; display: flex; flex-direction: column; }
          .nav-top-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; border-bottom: 1px solid rgba(147, 197, 253, 0.1); }
          .nav-brand-container { display: flex; align-items: center; gap: 12px; cursor: pointer; }
          .desktop-menu { display: flex; align-items: center; justify-content: center; gap: 25px; padding: 12px 5%; background: rgba(15, 23, 42, 0.4); }
          .nav-link { color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; position: relative; background: none; border: none; padding: 5px 0; white-space: nowrap; font-family: inherit; }
          .nav-link:hover { color: #38bdf8; }
          .nav-dropdown-container { position: relative; }
          .nav-dropdown-menu { position: absolute; top: 100%; left: 0; background: rgba(30, 64, 175, 0.95); backdrop-filter: blur(16px); border: 1px solid rgba(147, 197, 253, 0.2); border-radius: 8px; min-width: 260px; box-shadow: 0 15px 30px rgba(0,0,0,0.6); padding: 10px 0; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s ease; z-index: 200; }
          .nav-dropdown-container:hover .nav-dropdown-menu, .nav-dropdown-menu.active { opacity: 1; visibility: visible; transform: translateY(0); }
          .dropdown-item { padding: 12px 20px; color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left; background: transparent; border-left: none; border-right: none; border-top: none; width: 100%; cursor: pointer; font-family: inherit; }
          .dropdown-item:hover { background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding-left: 25px; }
          .lang-toggle-container { display: flex; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 4px; position: relative; cursor: pointer; width: 80px; height: 36px; direction: ltr !important; }
          .lang-toggle-indicator { position: absolute; top: 4px; left: ${lang === 'en' ? '4px' : '40px'}; width: 34px; height: 26px; background: #38bdf8; border-radius: 14px; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); }
          .lang-label { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; color: #fff; z-index: 1; user-select: none; font-family: 'Segoe UI', sans-serif; }
          .auth-icon-btn { width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.4rem; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(15, 23, 42, 0.6); }
          .logout-btn { color: #ef4444; } .logout-btn:hover { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; }
          .mobile-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 2rem; }
          .admin-main { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 40px 5%; width: 100%; }
          .admin-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 40px; width: 100%; max-width: 480px; text-align: center; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .dashboard-container { width: 100%; max-width: 1400px; margin: 0 auto; }
          .admin-tabs { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
          .tab-btn { flex: 1; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; border: 1px solid rgba(56, 189, 248, 0.3); transition: 0.3s; font-family: inherit; font-size: 1rem; }
          .tab-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4); }
          .tab-btn.inactive { background: rgba(15, 23, 42, 0.6); color: #94a3b8; }
          .tab-btn.inactive:hover { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
          .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .kpi-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.2); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 15px; }
          .kpi-icon { width: 50px; height: 50px; border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 1.8rem; flex-shrink: 0; }
          .kpi-info h3 { margin: 0; font-size: 1.8rem; font-weight: 900; color: #fff; font-family: inherit; }
          .kpi-info p { margin: 0; color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; font-family: inherit; }
          .tools-bar { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
          .filter-input { padding: 10px 15px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.6); color: #fff; font-family: inherit; }
          .table-container { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56,189,248,0.3); border-radius: 12px; padding: 20px; overflow-x: auto; }
          .data-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 700px; font-family: inherit; }
          .data-table th { background: rgba(56, 189, 248, 0.15); padding: 12px; color: #38bdf8; border-bottom: 2px solid #38bdf8; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; }
          .data-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e2e8f0; font-size: 0.9rem; }
          .status-select { padding: 6px 10px; border-radius: 6px; border: 1px solid #38bdf8; background: #0f172a; color: #fff; font-size: 0.85rem; cursor: pointer; }
          .action-btn { background: transparent; border: 1px solid #10b981; color: #10b981; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-family: inherit; font-size: 0.85rem; }
          .view-btn { background: rgba(56,189,248,0.1); border: 1px solid #38bdf8; color: #38bdf8; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: 0.2s; }
          .view-btn:hover { background: #38bdf8; color: #0f172a; }
          .cms-card { background: rgba(30, 41, 59, 0.6); border: 1px dashed rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
          .cms-info h4 { margin: 0 0 5px 0; color: #fff; font-size: 1.2rem; font-family: inherit; }
          .cms-info p { margin: 0; color: #94a3b8; font-size: 0.9rem; font-family: inherit; }
          @media (max-width: 1024px) {
            .desktop-menu { display: ${isMobileMenuOpen ? 'flex' : 'none'}; flex-direction: column; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(30, 64, 175, 0.98); padding: 20px 5%; gap: 15px; z-index: 999; }
            .mobile-toggle { display: block; }
          }
        `}} />

        <nav className="glass-navbar">
          <div className="nav-top-row">
            <div className="nav-brand-container" onClick={() => router.push('/')}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
              <div>
                <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '900' }}>{t[lang].brand}</h1>
                <small style={{ color: '#93c5fd', fontWeight: 'bold', display: 'block' }}>{t[lang].doctor}</small>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div className="lang-toggle-container" onClick={toggleLanguage} title="Switch Language">
                  <div className="lang-toggle-indicator"></div>
                  <span className="lang-label" style={{ color: lang === 'en' ? '#fff' : '#94a3b8' }}>EN</span>
                  <span className="lang-label" style={{ color: lang === 'ur' ? '#fff' : '#94a3b8' }}>UR</span>
              </div>
              {isAuthenticated && <button onClick={handleLogout} className="auth-icon-btn logout-btn"><i className='bx bx-log-out'></i></button>}
              <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <i className='bx bx-x'></i> : <i className='bx bx-menu'></i>}
              </button>
            </div>
          </div>
          <div className="desktop-menu">
              <button className="nav-link" onClick={() => router.push('/')}>{t[lang].navHome}</button>
              <button className="nav-link" onClick={() => router.push('/about')}>{t[lang].navAbout}</button>
              <div className="nav-dropdown-container" onMouseEnter={() => !isMobile && setShowGuidanceDropdown(true)} onMouseLeave={() => !isMobile && setShowGuidanceDropdown(false)}>
                  <button className="nav-link" onClick={() => isMobile && setShowGuidanceDropdown(!showGuidanceDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {t[lang].navCareer} <i className='bx bx-chevron-down'></i>
                  </button>
                  <div className={`nav-dropdown-menu ${showGuidanceDropdown ? 'active' : ''}`}>
                      <button className="dropdown-item" onClick={() => router.push('/categories?search=10th')}>{t[lang].courses10}</button>
                      <button className="dropdown-item" onClick={() => router.push('/categories?search=12th')}>{t[lang].courses12}</button>
                  </div>
              </div>
              <button className="nav-link" onClick={() => router.push('/assessment')}>{t[lang].navAssess}</button>
          </div>
        </nav>

        <main className="admin-main">
          <header style={{ textAlign: 'center', marginBottom: '30px' }}>
            <i className='bx bxs-pie-chart-alt-2' style={{ fontSize: '3.5rem', color: '#38bdf8', marginBottom: '10px' }}></i>
            <h1 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '2.2rem', fontWeight: '900', fontFamily: 'inherit' }}>{t[lang].adminTitle}</h1>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '1rem', fontFamily: 'inherit' }}>{t[lang].adminSub}</p>
          </header>

          {/* --- OTP LOGIN SYSTEM UI --- */}
          {!isAuthenticated ? (
            <div className="admin-card">
              <h2 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.5rem', fontFamily: 'inherit' }}>Secure Authorization</h2>
              {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}><i className='bx bx-error-circle'></i> {error}</div>}
              
              {!otpSent ? (
                  <form onSubmit={handleSendOtp}>
                    <div style={{ marginBottom: '20px', textAlign: 'left' }} dir="ltr">
                      <label style={{ color: '#93c5fd', display: 'block', marginBottom: '5px' }}>Authorized Admin Email</label>
                      <input type="email" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(15,23,42,0.6)', border: '1px solid #38bdf8', color: '#fff', fontSize: '1rem' }} placeholder="Enter registered email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={loadingAuth} style={{ width: '100%', padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: '0.3s' }}>
                      {loadingAuth ? <><i className='bx bx-loader-alt bx-spin'></i> Verifying...</> : 'Send Access OTP'}
                    </button>
                  </form>
              ) : (
                  <form onSubmit={handleVerifyOtp}>
                    <div style={{ marginBottom: '20px', textAlign: 'left' }} dir="ltr">
                      <label style={{ color: '#10b981', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Enter 6-Digit Security PIN</label>
                      <p style={{color: '#94a3b8', fontSize: '0.85rem', marginBottom: '15px'}}>OTP sent securely to <strong>{email}</strong></p>
                      <input type="text" maxLength="6" style={{ width: '100%', padding: '15px', borderRadius: '8px', background: 'rgba(15,23,42,0.6)', border: '1px solid #10b981', color: '#fff', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '8px', fontWeight: 'bold' }} placeholder="••••••" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={loadingAuth} style={{ width: '100%', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      {loadingAuth ? <><i className='bx bx-loader-alt bx-spin'></i> Authenticating...</> : 'Verify & Access Dashboard'}
                    </button>
                    <button type="button" onClick={() => {setOtpSent(false); setOtp(''); setError('');}} style={{ width: '100%', padding: '10px', background: 'transparent', color: '#94a3b8', border: '1px solid #475569', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', transition: '0.3s' }}>
                      Change Email
                    </button>
                  </form>
              )}
            </div>
          ) : (
            <div className="dashboard-container">
              <div className="admin-tabs">
                  <button onClick={() => setAdminTab('crm')} className={`tab-btn ${adminTab === 'crm' ? 'active' : 'inactive'}`}><i className='bx bx-line-chart'></i> {t[lang].tabCrm}</button>
                  <button onClick={() => setAdminTab('cms')} className={`tab-btn ${adminTab === 'cms' ? 'active' : 'inactive'}`}><i className='bx bx-data'></i> {t[lang].tabCms}</button>
                  <button onClick={() => setAdminTab('qna')} className={`tab-btn ${adminTab === 'qna' ? 'active' : 'inactive'}`}><i className='bx bx-task'></i> {t[lang].tabQna}</button>
              </div>

              {/* TAB 1: CRM SYSTEM */}
              {adminTab === 'crm' && (
                  <>
                  <div className="kpi-grid">
                    <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><i className='bx bx-group'></i></div><div className="kpi-info"><h3 className="en-text">{totalStudents}</h3><p>{t[lang].totalLeads}</p></div></div>
                    <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className='bx bx-atom'></i></div><div className="kpi-info"><h3 className="en-text" style={{ color: '#10b981' }}>{scienceCount}</h3><p>{t[lang].science}</p></div></div>
                    <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><i className='bx bx-line-chart'></i></div><div className="kpi-info"><h3 className="en-text" style={{ color: '#f59e0b' }}>{commerceCount}</h3><p>{t[lang].commerce}</p></div></div>
                  </div>
                  <div className="tools-bar">
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
                      <input type="text" placeholder={t[lang].searchEmail} className="filter-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      <select className="filter-input" value={filterStream} onChange={(e) => setFilterStream(e.target.value)}>
                        <option value="">{t[lang].allStreams}</option><option value="science">Science</option><option value="commerce">Commerce</option><option value="arts">Arts</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button onClick={fetchData} className="action-btn" style={{ borderColor: '#38bdf8', color: '#38bdf8' }}><i className='bx bx-refresh'></i> {t[lang].refresh}</button>
                      <button onClick={downloadCSV} className="action-btn"><i className='bx bx-download'></i> {t[lang].exportCsv}</button>
                    </div>
                  </div>
                  
                  <div className="table-container">
                    <table className="data-table">
                      <thead><tr><th>{t[lang].date}</th><th>{t[lang].studentId}</th><th>{t[lang].matrix}</th><th>{t[lang].crmStatus}</th><th>{t[lang].action}</th></tr></thead>
                      <tbody>
                        {filteredData.length > 0 ? filteredData.map((s, idx) => {
                          const safeEmail = String(s?.email || 'Unknown');
                          const safeStream = String(s?.interest_area || 'Pending');
                          const currentStatus = statusMap[safeEmail] || 'new';
                          return (
                            <tr key={idx}>
                              <td className="en-text">{new Date(s?.created_at || Date.now()).toLocaleDateString('en-IN')}</td><td className="en-text">{safeEmail}</td><td className="en-text" style={{ color: '#38bdf8', fontWeight: 'bold' }}>{safeStream}</td>
                              <td><select className={`status-select ${currentStatus}`} value={currentStatus} onChange={(e) => handleStatusChange(safeEmail, e.target.value)}><option value="new">🔴 New</option><option value="counseled">🟡 Counseled</option><option value="admitted">🟢 Admitted</option></select></td>
                              <td><button className="view-btn" onClick={() => setSelectedStudent(s)} title="View Report"><i className='bx bx-show'></i></button></td>
                            </tr>
                          );
                        }) : <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>{t[lang].noRecords}</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  </>
              )}

              {/* TAB 2: CMS SYSTEM */}
              {adminTab === 'cms' && (
                  <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                          <div><h2 style={{ color: '#fff', margin: '0 0 5px 0' }}>{t[lang].cmsTitle}</h2><p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>{t[lang].cmsSub}</p></div>
                          <button onClick={handleOpenAdd} className="action-btn" style={{ background: '#38bdf8', color: '#0f172a', borderColor: '#38bdf8' }}>{t[lang].addNew}</button>
                      </div>
                      <div>
                          {safeMatrixContent.map(item => (
                              <div key={item?.id || Math.random()} className="cms-card">
                                  <div className="cms-info">
                                      <h4><span className="en-text">{item?.title_en || 'Untitled'}</span> <span style={{fontSize:'0.8rem', color:'#38bdf8', background:'rgba(56,189,248,0.1)', padding:'2px 8px', borderRadius:'10px', marginLeft:'10px'}}>{item?.stream_key || 'No Key'}</span></h4>
                                  </div>
                                  <div style={{display:'flex', gap:'10px'}}>
                                    <button onClick={() => handleOpenEdit(item)} className="action-btn" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}><i className='bx bx-edit'></i></button>
                                    <button onClick={() => handleCmsDelete(item.id)} className="action-btn" style={{ borderColor: '#ef4444', color: '#ef4444' }}><i className='bx bx-trash'></i></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* TAB 3: Q&A MANAGER */}
              {adminTab === 'qna' && (
                  <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                          <div><h2 style={{ color: '#fff', margin: '0 0 5px 0' }}>{t[lang].qnaTitle}</h2><p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>{t[lang].qnaSub}</p></div>
                          <button onClick={handleOpenQnaAdd} className="action-btn" style={{ background: '#a855f7', color: '#fff', borderColor: '#a855f7' }}>{t[lang].addQuestion}</button>
                      </div>
                      <div>
                          {safeQuestionsData.map((q, i) => (
                              <div key={q?.id || Math.random()} className="cms-card" style={{ opacity: q?.is_active ? 1 : 0.5, borderLeft: `4px solid ${q?.is_active ? '#10b981' : '#ef4444'}` }}>
                                  <div className="cms-info" style={{ flex: 1 }}>
                                      <h4 className="en-text" style={{ fontSize: '1rem' }}>Q{i+1}: {lang === 'ur' ? (q?.q_text_ur || '') : (q?.q_text_en || '')}</h4>
                                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1' }}>A ➔ {q?.opt1_stream || ''}</span>
                                        <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1' }}>B ➔ {q?.opt2_stream || ''}</span>
                                        <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1' }}>C ➔ {q?.opt3_stream || ''}</span>
                                        <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1' }}>D ➔ {q?.opt4_stream || ''}</span>
                                      </div>
                                  </div>
                                  <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
                                    <button onClick={() => toggleQuestionStatus(q.id, q.is_active)} className="action-btn" style={{ borderColor: q?.is_active ? '#ef4444' : '#10b981', color: q?.is_active ? '#ef4444' : '#10b981', fontSize: '0.75rem' }}>{q?.is_active ? 'Deactivate' : 'Activate'}</button>
                                    <button onClick={() => handleOpenQnaEdit(q)} className="action-btn" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}><i className='bx bx-edit'></i></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>
          )}
        </main>

        {/* INDIVIDUAL STUDENT REPORT MODAL */}
        {selectedStudent && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', backdropFilter:'blur(5px)' }}>
            <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '600px', position: 'relative' }} dir="ltr">
              <button onClick={() => setSelectedStudent(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }}><i className='bx bx-x'></i></button>
              <h2 style={{ marginTop: 0, color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px' }}><i className='bx bx-user-circle'></i> {t[lang].reportTitle}</h2>
              
              <div style={{ display: 'grid', gap: '15px', color: '#e2e8f0' }}>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Student Email ID</p>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{String(selectedStudent?.email || 'N/A')}</h3>
                </div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>AI Suggested Target Stream</p>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#10b981', textTransform: 'capitalize' }}>{String(selectedStudent?.interest_area || 'Not finalized yet')}</h3>
                </div>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Registration Date</p>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{new Date(selectedStudent?.created_at || Date.now()).toLocaleString('en-IN')}</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Q&A MODAL */}
        {isQnaModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', backdropFilter:'blur(5px)' }}>
            <div style={{ background: '#1e293b', border: '1px solid #a855f7', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }} dir="ltr">
              <h2 style={{ marginTop: 0, color: '#a855f7', marginBottom:'20px' }}>{qnaFormData.id ? 'Edit Diagnostic Question' : 'Add New Question'}</h2>
              <form onSubmit={handleQnaSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div><label style={{ color: '#cbd5e1' }}>Question (English)</label><textarea required rows="2" value={qnaFormData.q_text_en} onChange={(e) => setQnaFormData({...qnaFormData, q_text_en: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', marginTop: '5px' }} /></div>
                  <div><label style={{ color: '#cbd5e1' }}>Question (Urdu)</label><textarea required rows="2" value={qnaFormData.q_text_ur} onChange={(e) => setQnaFormData({...qnaFormData, q_text_ur: e.target.value})} dir="rtl" style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', marginTop: '5px' }} /></div>
                </div>

                {[1, 2, 3, 4].map(num => (
                  <div key={num} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>Option {num}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                      <input type="text" placeholder="English Option" value={qnaFormData[`opt${num}_en`]} onChange={(e) => setQnaFormData({...qnaFormData, [`opt${num}_en`]: e.target.value})} style={{ padding: '8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }} required />
                      <input type="text" placeholder="Urdu Option" value={qnaFormData[`opt${num}_ur`]} onChange={(e) => setQnaFormData({...qnaFormData, [`opt${num}_ur`]: e.target.value})} dir="rtl" style={{ padding: '8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }} required />
                      <select value={qnaFormData[`opt${num}_stream`]} onChange={(e) => setQnaFormData({...qnaFormData, [`opt${num}_stream`]: e.target.value})} style={{ padding: '8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }}>
                        <option value="science">Science</option><option value="commerce">Commerce</option><option value="arts">Arts</option><option value="polytechnic">Polytechnic / ITI</option><option value="paramedical">Paramedical</option>
                      </select>
                    </div>
                  </div>
                ))}
                
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsQnaModalOpen(false)} style={{ background: 'transparent', border: '1px solid #64748b', color: '#cbd5e1', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={isQnaSubmitting} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{isQnaSubmitting ? 'Saving...' : 'Save Question'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
