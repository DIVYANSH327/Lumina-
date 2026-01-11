
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, MapPin, Menu, X, Calendar as CalendarIcon, 
  Plus, Camera, Lock, Trophy, Timer, 
  Map, User as UserIcon, CheckCircle, Info, LogOut, ArrowRight,
  MessageCircle, LayoutDashboard, UserCheck, ClipboardList, Phone,
  ChevronRight, Building2, Zap, RefreshCcw, ShieldCheck, AlertCircle,
  Music, Flag, Settings, Eye, EyeOff, Share2, Clipboard, ZapOff, Scale, FileText, RefreshCw, Mail,
  Rss, Smartphone, ArrowLeft, Upload, Trash2, Edit2, Bell, LayoutGrid, Sparkles, CreditCard,
  TrendingUp, Tag, Download, FileDown, MessageSquare, Database, Copy, Save,
  Users, Globe, Wifi, WifiOff, Scan
} from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import AIChat from './components/AIChat';
import { RunEvent, UserTicket, User } from './types';
import { jsPDF } from 'jspdf';

// --- Shared Hub Configuration ---
const SHARED_HUB_API = "https://67bc8651ed715aa51711202e.mockapi.io/api/v1/tickets";

const INITIAL_RUNS: RunEvent[] = [
  { 
    id: 'bho-1', 
    title: 'Upper Lake Sunrise Dash', 
    city: 'Bhopal', 
    day: 'SUN', 
    date: 'OCT 26',
    distance: '10K',
    startTime: '6:00 AM',
    location: 'VIP Road, Boat Club',
    meetingPoint: 'Upper Lake Boat Club Entrance (Main Gate)',
    raveLocation: 'Lakeview Deck - Post Run Rave & Smoothies',
    image: 'https://images.pexels.com/photos/1555351/pexels-photo-1555351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Bhopal\'s most scenic route. Feel the lake breeze as we conquer the curves of VIP road followed by a high-energy lakefront rave.',
    basePrice: 499
  },
  { 
    id: 'ind-1', 
    title: 'Super Corridor Sprint', 
    city: 'Indore', 
    day: 'SAT', 
    date: 'OCT 25',
    distance: '5K',
    startTime: '6:30 AM',
    location: 'TCS Square, Super Corridor',
    meetingPoint: 'TCS Square Clock Tower',
    raveLocation: 'The Glass House - Neon After-party',
    image: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Flat, fast, and futuristic. Join the Indore speedsters for a Saturday morning PB attempt and an industrial techno rave.',
    basePrice: 499
  }
];

const TERMS_AND_CONDITIONS = [
  "Be extremely Respectful & Supportive towards your fellow runners.",
  "Stay hydrated & listen to your body.",
  "If you feel unwell, inform the Gen Run Crew immediately and take rest.",
  "Arrive on time for all scheduled runs.",
  "Use of any kind of SMOKES / VAPES / substances is STRICTLY PROHIBITED.",
  "No refunds will be provided once registered for a GENRUN event.",
  "ZERO TOLERANCE POLICY against any complaints received from a female club member.",
  "By attending, you agree that GENRUN or the venue shall not be held responsible for any injuries, loss, or damage.",
  "The run is social and non-competitive — everyone is encouraged to move at their own pace.",
  "Photos and videos captured during the event may be used on our social platforms."
];

interface TicketCardProps {
  ticket: UserTicket;
  events: RunEvent[];
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, events }) => {
  const run = events.find(e => e.id === ticket.runId);
  const [showPrep, setShowPrep] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const cityTheme = useMemo(() => {
    if (run?.city === 'Bhopal') {
      return {
        accent: '#ff00f7',
        accentLight: 'rgba(255, 0, 247, 0.1)',
        accentBorder: 'rgba(255, 0, 247, 0.2)',
        text: 'text-[#ff00f7]',
        bg: 'bg-[#ff00f7]',
        rgb: [255, 0, 247]
      };
    }
    return {
      accent: '#d9ff00',
      accentLight: 'rgba(217, 255, 0, 0.1)',
      accentBorder: 'rgba(217, 255, 0, 0.2)',
      text: 'text-[#d9ff00]',
      bg: 'bg-[#d9ff00]',
      rgb: [217, 255, 0]
    };
  }, [run?.city]);

  const shareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My GENRUN Pass',
        text: `I'm attending ${run?.title}! See you there.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Ticket Link Copied: " + ticket.id);
    }
  };

  const downloadTicketAsPDF = async () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: [400, 640] });
      const [r, g, b] = cityTheme.rgb;
      doc.setFillColor(9, 9, 11);
      doc.rect(0, 0, 400, 640, 'F');
      doc.setFillColor(r, g, b);
      doc.rect(0, 0, 400, 100, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.text('GENRUN', 20, 50);
      doc.setFontSize(10);
      doc.text(`${run?.city.toUpperCase()} HUB ACCESS PASS`, 20, 70);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('RUNNER IDENTITY', 20, 130);
      doc.setFontSize(18);
      doc.text(ticket.runnerName.toUpperCase(), 20, 150);
      doc.setFontSize(8);
      doc.text('EXPERIENCE', 20, 185);
      doc.setFontSize(16);
      doc.text(run?.title.toUpperCase() || 'COLLECTIVE SESSION', 20, 205);
      doc.setFontSize(8);
      doc.text('HUB & DATE', 20, 240);
      doc.setFontSize(14);
      doc.text(`${run?.city || ''} Hub • ${run?.day || ''} ${run?.date || ''}`, 20, 260);
      doc.setFontSize(8);
      doc.text('MEETING POINT', 20, 295);
      doc.setFontSize(11);
      doc.text(run?.meetingPoint || 'Check terminal for updates', 20, 310);
      doc.setFontSize(8);
      doc.text('RAVE SITE', 20, 340);
      doc.setFontSize(11);
      doc.text(run?.raveLocation || 'Follow the rhythm', 20, 355);
      doc.setFillColor(r, g, b, 0.1);
      doc.rect(15, 380, 370, 40, 'F');
      doc.setTextColor(r, g, b);
      doc.setFontSize(8);
      doc.text('UNIQUE AUTH TOKEN', 25, 395);
      doc.setFontSize(14);
      doc.text(ticket.id, 25, 412);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${ticket.id}&bgcolor=ffffff`;
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = qrUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(125, 440, 150, 150, 10, 10, 'F');
      doc.addImage(img, 'PNG', 135, 450, 130, 130);
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(7);
      doc.text('THIS PASS IS VALID FOR RUN + RAVE ENTRY. DO NOT SHARE THE AUTH TOKEN.', 20, 620);
      doc.text('© 2025 GENRUN COLLECTIVE', 310, 620);
      doc.save(`GENRUN_Pass_${ticket.id}.pdf`);
    } catch (err) {
      console.error('PDF Generation Failed:', err);
      alert('Could not generate PDF. Please screenshot the pass for now.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative bg-zinc-900 border border-white/10 overflow-hidden rounded-[2rem] group shadow-2xl"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[4rem] -z-0 pointer-events-none opacity-5`} style={{ backgroundColor: cityTheme.accent }} />
      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#09090b] rounded-full -translate-y-1/2 border-r border-white/10 hidden md:block" />
      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#09090b] rounded-full -translate-y-1/2 border-l border-white/10 hidden md:block" />

      <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-stretch">
        <div className="flex flex-col items-center justify-center gap-4 shrink-0">
          <div className="bg-white p-3 rounded-2xl shadow-xl shadow-black/50 group-hover:scale-105 transition-transform duration-500">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}&bgcolor=ffffff`} 
              alt="Pass QR" 
              className="w-28 h-28"
            />
          </div>
          <div className="text-center">
            <div className="text-[10px] font-mono text-gray-500 tracking-tighter mb-1">AUTH TOKEN</div>
            <div className={`text-[11px] font-black font-mono tracking-widest ${cityTheme.text}`}>{ticket.id}</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border flex items-center gap-1.5`} style={{ backgroundColor: cityTheme.accentLight, color: cityTheme.accent, borderColor: cityTheme.accentBorder }}>
                <Zap size={10} /> RUN + RAVE ACCESS
              </span>
              {ticket.checkInStatus && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle size={10} /> VERIFIED
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={downloadTicketAsPDF} 
                disabled={isDownloading}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400 flex items-center gap-2 disabled:opacity-50"
                title="Download Pass as PDF"
              >
                {isDownloading ? <RefreshCcw size={14} className="animate-spin" /> : <FileDown size={14} />}
                <span className="text-[9px] font-black uppercase tracking-widest pr-1">PDF</span>
              </button>
              <button onClick={shareTicket} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                <Share2 size={14} />
              </button>
            </div>
          </div>

          <h4 className={`text-2xl font-black uppercase tracking-tight transition-colors leading-none mb-6 group-hover:${cityTheme.text}`}>
            {run?.title}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Flag size={14} style={{ color: cityTheme.accent }} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Meeting Point</p>
                <p className="text-[11px] text-gray-300 font-medium truncate">{run?.meetingPoint}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Music size={14} className="text-fuchsia-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Rave Site</p>
                <p className="text-[11px] text-gray-300 font-medium truncate">{run?.raveLocation}</p>
              </div>
            </div>
          </div>

          <div className="relative h-1 bg-white/5 rounded-full mb-8">
            <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${ticket.checkInStatus ? 'w-full' : 'w-1/3'}`} style={{ backgroundColor: cityTheme.accent }} />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 flex justify-between w-full px-0">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-3 h-3 rounded-full border-2 border-zinc-900 transition-colors duration-500" style={{ backgroundColor: i === 1 || (i === 2 && ticket.checkInStatus) || (i === 3 && ticket.checkInStatus) ? cityTheme.accent : 'rgba(255,255,255,0.1)' }} />
               ))}
            </div>
          </div>

          <button onClick={() => setShowPrep(!showPrep)} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all mt-4`} style={{ color: cityTheme.accent }}>
            {showPrep ? <X size={12} /> : <Info size={12} />} {showPrep ? "Hide Preparation" : "How to prepare?"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupForm, setSignupForm] = useState({ name: '', phone: '', city: 'Bhopal', password: '', confirmPassword: '', profilePic: '' });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'runs' | 'tickets' | 'checkin'>('checkin');
  const [adminPass, setAdminPass] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<number>(Date.now());
  const [hubError, setHubError] = useState<boolean>(false);
  
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedRunToJoin, setSelectedRunToJoin] = useState<RunEvent | null>(null);
  const [isProcessingRegistration, setIsProcessingRegistration] = useState(false);
  const [checkInStatusMsg, setCheckInStatusMsg] = useState<{msg: string, name?: string, type: 'success' | 'error'} | null>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoInputRef = useRef<HTMLInputElement>(null);

  // --- Cloud Sync Logic ---
  const fetchCloudData = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const response = await fetch(SHARED_HUB_API);
      
      if (response.status === 404) {
        setUserTickets([]);
        setHubError(false);
        return;
      }

      const textData = await response.text();
      if (textData.trim().startsWith('[') || textData.trim().startsWith('{')) {
        const data = JSON.parse(textData);
        if (Array.isArray(data)) {
          setUserTickets(data);
          localStorage.setItem('genrun_tickets', JSON.stringify(data));
          setLastSync(Date.now());
          setHubError(false);
        }
      }
    } catch (err) {
      console.warn("Hub offline mode active.", err);
      setHubError(true);
      const savedTickets = localStorage.getItem('genrun_tickets');
      if (savedTickets) {
        try { setUserTickets(JSON.parse(savedTickets)); } catch (e) {}
      }
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  useEffect(() => {
    setEvents(INITIAL_RUNS);
    const savedUsers = localStorage.getItem('genrun_users');
    const savedCurrentUser = localStorage.getItem('genrun_current_user');
    if (savedUsers) setRegisteredUsers(JSON.parse(savedUsers));
    if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));
    
    fetchCloudData();
    const interval = setInterval(() => fetchCloudData(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePhoneFilter = (val: string) => val.replace(/\D/g, '').slice(0, 10);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.phone.length !== 10) {
      alert("Validation failed: Please enter exactly 10 digits.");
      return;
    }
    const fullPhone = `+91${signupForm.phone}`;
    
    if (signupForm.password !== signupForm.confirmPassword) { 
      alert("Verification failed: Passwords do not match!"); 
      return; 
    }

    setIsAuthLoading(true);
    setAuthFeedback("Establishing identity...");
    
    setTimeout(() => {
      const newUser: User = { 
        id: Math.random().toString(36).substr(2, 9), 
        name: signupForm.name, 
        phone: fullPhone, 
        password: signupForm.password, 
        city: signupForm.city as any, 
        profilePic: signupForm.profilePic 
      };
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      setCurrentUser(newUser);
      localStorage.setItem('genrun_users', JSON.stringify(updatedUsers));
      localStorage.setItem('genrun_current_user', JSON.stringify(newUser));
      setIsAuthLoading(false);
      setAuthFeedback(null);
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone.length !== 10) {
      alert("Validation failed: Please enter exactly 10 digits.");
      return;
    }
    const fullPhone = `+91${loginPhone}`;
    const user = registeredUsers.find(u => u.phone === fullPhone && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('genrun_current_user', JSON.stringify(user));
    } else { 
      alert("Identification Error: Invalid credentials."); 
    }
  };

  const generateUniqueId = () => {
    const now = new Date();
    const datePart = `${now.getMonth() + 1}${now.getDate()}`;
    const randPart = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `GR-${datePart}-${randPart}`;
  };

  const finalizeJoinRun = async () => {
    if (!selectedRunToJoin || !currentUser) return;
    setIsProcessingRegistration(true);
    
    const ticketId = generateUniqueId();
    const newTicket: UserTicket = { 
      id: ticketId, 
      runId: selectedRunToJoin.id, 
      userId: currentUser.id, 
      runnerName: currentUser.name, 
      runnerPhone: currentUser.phone, 
      checkInStatus: false, 
      timestamp: Date.now() 
    };

    try {
      const response = await fetch(SHARED_HUB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      });
      
      if (!response.ok) throw new Error("Cloud push failed.");
      
      await fetchCloudData(true);
      setShowTermsModal(false);
      setSelectedRunToJoin(null);
      setIsProcessingRegistration(false);
      alert(`Access Key Generated: ${ticketId}. Data saved to Collective Hub.`);
    } catch (err) {
      const updated = [...userTickets, newTicket];
      setUserTickets(updated);
      localStorage.setItem('genrun_tickets', JSON.stringify(updated));
      setShowTermsModal(false);
      setSelectedRunToJoin(null);
      setIsProcessingRegistration(false);
      alert(`Local Access Granted: ${ticketId}. Cloud sync pending.`);
    }
  };

  const toggleCheckIn = async (ticketId: string, cloudId?: string) => {
    try {
      const targetId = cloudId || userTickets.find(t => t.id === ticketId)?.id; 
      
      const response = await fetch(`${SHARED_HUB_API}/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkInStatus: true })
      });
      
      if (!response.ok) throw new Error("Sync failure.");
      
      fetchCloudData(true);
      const ticket = userTickets.find(t => t.id === ticketId);
      setCheckInStatusMsg({ msg: 'ACCESS GRANTED', name: ticket?.runnerName, type: 'success' });
      setTimeout(() => setCheckInStatusMsg(null), 3000);
    } catch (err) {
      const updated = userTickets.map(t => t.id === ticketId ? { ...t, checkInStatus: true } : t);
      setUserTickets(updated);
      localStorage.setItem('genrun_tickets', JSON.stringify(updated));
      setCheckInStatusMsg({ msg: 'LOCAL VERIFICATION', type: 'error' });
      setTimeout(() => setCheckInStatusMsg(null), 3000);
    }
  };

  const startScanner = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      alert("Scanner failed. Please allow camera permissions in terminal.");
      setIsCameraActive(false);
    }
  };

  const handleManualCheckIn = (val: string) => {
    const cleanId = val.trim().toUpperCase();
    const t = userTickets.find(ticket => ticket.id === cleanId);
    if (t) {
       toggleCheckIn(t.id, (t as any).id);
       return true;
    }
    return false;
  };

  const sendWhatsAppConfirmation = (ticket: UserTicket) => {
    const cleanPhone = ticket.runnerPhone.replace(/\D/g, '');
    const message = `Hey ${ticket.runnerName}! Your GENRUN Hub Entry is verified. Welcome to the session! Auth: ${ticket.id}. 🏁`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const currentUserTickets = userTickets.filter(t => t.userId === currentUser?.id);

  return (
    <div className="relative min-h-screen text-white selection:bg-[#d9ff00] selection:text-black overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      <AIChat currentUser={currentUser} />
      
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Trophy className="text-[#d9ff00] w-6 h-6" />
          <div className="font-heading text-xl font-black tracking-tighter uppercase">GENRUN</div>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-black tracking-widest uppercase items-center">
          {currentUser && (
            <>
              <a href="#events" className="hover:text-[#d9ff00]">Experience</a>
              <a href="#tickets" className="hover:text-[#d9ff00]">Passes</a>
              <button onClick={() => { setCurrentUser(null); localStorage.removeItem('genrun_current_user'); }} className="text-red-400">Logout</button>
            </>
          )}
          <button onClick={() => setIsAdminOpen(true)} className="bg-[#d9ff00] text-black px-4 py-2 rounded-full font-bold">Terminal</button>
        </div>
      </nav>

      {!currentUser ? (
        <section className="relative min-h-screen flex items-center justify-center p-6 pt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl bg-zinc-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-center mb-10">GEN-HUB ACCESS</h2>
            <div className="flex bg-black p-1.5 rounded-2xl border border-white/5 mb-8">
              <button onClick={() => setAuthMode('signup')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase ${authMode === 'signup' ? 'bg-[#d9ff00] text-black' : 'text-gray-500'}`}>Sign Up</button>
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase ${authMode === 'login' ? 'bg-[#d9ff00] text-black' : 'text-gray-500'}`}>Login</button>
            </div>
            {authMode === 'signup' ? (
              <form onSubmit={handleSignup} className="space-y-6">
                <input type="text" placeholder="Full Name" required value={signupForm.name} onChange={e => setSignupForm({...signupForm, name: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00]" />
                
                {/* Phone Input with +91 Prefix */}
                <div className="flex bg-black border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#d9ff00] transition-colors">
                  <div className="px-4 flex items-center bg-white/5 border-r border-white/10 text-gray-400 font-black text-sm">+91</div>
                  <input 
                    type="tel" 
                    placeholder="10-Digit WhatsApp No." 
                    required 
                    value={signupForm.phone} 
                    maxLength={10}
                    inputMode="numeric"
                    onChange={e => setSignupForm({...signupForm, phone: handlePhoneFilter(e.target.value)})} 
                    className="flex-1 bg-transparent p-4 outline-none text-white placeholder-gray-600" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {['Bhopal', 'Indore'].map(c => (<button key={c} type="button" onClick={() => setSignupForm({...signupForm, city: c})} className={`py-4 rounded-2xl border-2 text-[10px] font-black uppercase ${signupForm.city === c ? 'border-[#d9ff00] text-[#d9ff00]' : 'border-white/5 text-gray-500'}`}>{c}</button>))}
                </div>
                <div className="space-y-4">
                  <input type="password" placeholder="Set Passphrase" required value={signupForm.password} onChange={e => setSignupForm({...signupForm, password: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00]" />
                  <input type="password" placeholder="Confirm Passphrase" required value={signupForm.confirmPassword} onChange={e => setSignupForm({...signupForm, confirmPassword: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00]" />
                </div>
                <button type="submit" className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-widest">Register Identity</button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Phone Input with +91 Prefix for Login */}
                <div className="flex bg-black border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#d9ff00] transition-colors">
                  <div className="px-5 flex items-center bg-white/5 border-r border-white/10 text-gray-400 font-black text-sm">+91</div>
                  <input 
                    type="tel" 
                    placeholder="10-Digit No." 
                    required 
                    value={loginPhone} 
                    maxLength={10}
                    inputMode="numeric"
                    onChange={e => setLoginPhone(handlePhoneFilter(e.target.value))} 
                    className="flex-1 bg-transparent p-5 outline-none text-white placeholder-gray-600" 
                  />
                </div>
                <input type="password" placeholder="Passphrase" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00]" />
                <button type="submit" className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-widest">Authorize Access</button>
              </form>
            )}
          </motion.div>
        </section>
      ) : (
        <>
          <header className="relative h-[85svh] flex flex-col items-center justify-center text-center px-4 pt-10">
            <GradientText text="RUN THE" as="h1" className="text-[12vw] leading-none font-black uppercase" />
            <GradientText text="RAVE" as="h1" className="text-[12vw] leading-none font-black uppercase text-[#d9ff00]" />
            <div className="mt-12 flex gap-4">
              <a href="#events" className="bg-[#d9ff00] text-black px-12 py-5 font-black uppercase tracking-widest text-xs rounded-xl shadow-xl">Join Next Session</a>
              <button onClick={() => fetchCloudData()} className="border border-white/10 px-8 py-5 font-black uppercase tracking-widest text-xs backdrop-blur-md rounded-xl flex items-center gap-2"><RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} /> Sync Hub</button>
            </div>
          </header>

          <section id="events" className="py-32 px-6 max-w-7xl mx-auto">
            <h2 className="text-5xl font-black uppercase leading-none mb-16">Active <span className="text-[#d9ff00]">Experiences</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((run) => (
                <div key={run.id} className="bg-zinc-900 border border-white/5 overflow-hidden flex flex-col rounded-[2.5rem]">
                  <img src={run.image} className="h-72 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase mb-4"><CalendarIcon size={14} /> {run.date} • {run.startTime}</div>
                    <h3 className="text-2xl font-black uppercase mb-6 leading-tight">{run.title}</h3>
                    <p className="text-sm text-gray-400 mb-8 flex-1">{run.description}</p>
                    <button onClick={() => { setSelectedRunToJoin(run); setShowTermsModal(true); }} className="mt-auto w-full py-5 bg-[#d9ff00] text-black font-black uppercase rounded-2xl text-[10px] tracking-widest">Secure Entry • ₹{run.basePrice}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="tickets" className="py-32 px-6 bg-black/40">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-black uppercase text-center mb-16">Identified <span className="text-[#d9ff00]">Passes</span></h2>
              <div className="grid grid-cols-1 gap-8">
                {currentUserTickets.map(t => <TicketCard key={t.id} ticket={t} events={events} />)}
                {currentUserTickets.length === 0 && <div className="text-center py-20 text-gray-700 font-black uppercase text-[10px] border border-dashed border-white/10 rounded-[2rem]">No active credentials found in the hub.</div>}
              </div>
            </div>
          </section>
        </>
      )}

      <AnimatePresence>
        {isAdminOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-[#09090b] border border-white/10 p-10 rounded-[3rem] min-h-[85vh] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(217,255,0,0.05)]">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#d9ff00] rounded-xl flex items-center justify-center"><Lock size={20} className="text-black" /></div>
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-none">ADMIN TERMINAL</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Collective Oversight Mode</p>
                  </div>
                </div>
                <button onClick={() => { setIsAdminOpen(false); setIsAuth(false); setIsCameraActive(false); }} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={24} /></button>
              </div>

              {!isAuth ? (
                <div className="max-w-md mx-auto w-full space-y-8 py-20 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck size={40} className="text-[#d9ff00]/40" /></div>
                  <h4 className="text-lg font-black uppercase tracking-widest">Restricted Access</h4>
                  <input type="password" placeholder="TERMINAL KEY" className="w-full bg-black border-2 border-white/10 p-8 rounded-3xl text-center text-3xl font-mono tracking-[1rem] focus:border-[#d9ff00] outline-none transition-all" value={adminPass} onChange={e => setAdminPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && (adminPass === 'run2025' ? setIsAuth(true) : alert('Incorrect terminal key.'))} />
                  <button onClick={() => adminPass === 'run2025' ? setIsAuth(true) : alert('Incorrect terminal key.')} className="w-full bg-[#d9ff00] text-black py-6 rounded-2xl font-black uppercase tracking-widest">Initialize Uplink</button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 px-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : hubError ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                         {hubError ? <ZapOff size={12} className="text-red-500" /> : <Globe size={12} className="text-emerald-500" />} 
                         {hubError ? "Local Hub Cache Active" : "Collective Hub Online"}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter">Last Polling Pulse: {new Date(lastSync).toLocaleTimeString()}</span>
                  </div>

                  <div className="flex gap-4 mb-8">
                    {['checkin', 'tickets'].map(t => (<button key={t} onClick={() => { setAdminTab(t as any); setIsCameraActive(false); }} className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${adminTab === t ? 'bg-[#d9ff00] text-black shadow-lg shadow-[#d9ff00]/10' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>{t === 'checkin' ? 'Scanner Mode' : 'Collective Records'}</button>))}
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {adminTab === 'checkin' ? (
                      <div className="space-y-8">
                        <div className="bg-zinc-900 border border-white/5 p-10 rounded-[3rem] text-center">
                          {!isCameraActive ? (
                            <button onClick={startScanner} className="w-32 h-32 bg-[#d9ff00] rounded-full flex items-center justify-center mx-auto mb-8 hover:scale-105 transition-transform shadow-xl shadow-[#d9ff00]/10">
                              <Scan size={40} className="text-black" />
                            </button>
                          ) : (
                            <div className="relative w-full max-w-sm mx-auto aspect-square bg-black rounded-3xl overflow-hidden mb-8 border-4 border-[#d9ff00]">
                              <video ref={videoRef} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-48 h-48 border-2 border-[#d9ff00]/50 rounded-2xl animate-pulse" />
                              </div>
                              <button onClick={() => setIsCameraActive(false)} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full"><X size={16} /></button>
                            </div>
                          )}
                          <h4 className="text-xl font-black uppercase tracking-tighter mb-4">{isCameraActive ? "Align Pass to Lens" : "Initialize Scanner Pipeline"}</h4>
                          <input ref={autoInputRef} type="text" placeholder="OR ENTER AUTH TOKEN MANUALLY" className="w-full bg-black border-2 border-white/10 p-6 rounded-2xl text-2xl font-mono text-center outline-none focus:border-[#d9ff00] transition-colors" onChange={e => { if (handleManualCheckIn(e.target.value)) e.target.value = ''; }} />
                        </div>
                        {checkInStatusMsg && (
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-10 rounded-[2.5rem] font-black uppercase text-center text-2xl border-2 ${checkInStatusMsg.type === 'success' ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-amber-500 text-black border-amber-400'}`}>
                            <div className="text-sm opacity-60 mb-2">{checkInStatusMsg.type === 'success' ? 'PASS VERIFIED' : 'LOCAL OVERRIDE'}</div>
                            {checkInStatusMsg.msg}
                            {checkInStatusMsg.name && <div className="mt-2 text-3xl">{checkInStatusMsg.name}</div>}
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userTickets.sort((a,b) => b.timestamp - a.timestamp).map(t => (
                          <div key={t.id} className="bg-white/5 p-8 rounded-[2rem] flex justify-between items-center group hover:bg-white/[0.08] transition-all border border-transparent hover:border-white/5">
                            <div>
                              <div className="font-black uppercase text-lg flex items-center gap-3">
                                {t.runnerName} 
                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 font-mono">#{t.id}</span>
                              </div>
                              <div className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-widest">{t.runnerPhone} • {INITIAL_RUNS.find(r => r.id === t.runId)?.city} Hub</div>
                            </div>
                            <div className="flex items-center gap-4">
                               <button onClick={() => sendWhatsAppConfirmation(t)} className="p-4 bg-[#25D366]/10 text-[#25D366] rounded-2xl hover:bg-[#25D366]/20 transition-all"><MessageSquare size={20} /></button>
                               <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${t.checkInStatus ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                 {t.checkInStatus ? 'Verified Entry' : 'Pending Entry'}
                               </div>
                            </div>
                          </div>
                        ))}
                        {userTickets.length === 0 && <div className="text-center py-32 text-gray-700 uppercase font-black text-[11px] tracking-widest border border-dashed border-white/5 rounded-[3rem]">No records retrieved from hub.</div>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTermsModal && selectedRunToJoin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col max-h-[85vh] shadow-[0_0_100px_rgba(0,0,0,1)]">
              <div className="bg-[#d9ff00] p-10 shrink-0 flex items-center gap-4">
                <div className="bg-black p-3 rounded-2xl"><Scale size={24} className="text-[#d9ff00]" /></div>
                <div>
                  <h3 className="text-3xl font-black uppercase text-black leading-none">Hub Ethics</h3>
                  <p className="text-[10px] text-black/50 font-bold uppercase tracking-widest mt-1">Accept Collective Responsibility</p>
                </div>
              </div>
              <div className="p-10 overflow-y-auto space-y-6 text-sm font-medium bg-black/40 custom-scrollbar">
                {TERMS_AND_CONDITIONS.map((line, i) => (
                  <div key={i} className="flex gap-6 group">
                    <span className="text-[#d9ff00] font-black text-xs h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">{i + 1}</span>
                    <p className="text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">{line}</p>
                  </div>
                ))}
              </div>
              <div className="p-10 border-t border-white/5 bg-[#09090b] flex flex-col sm:flex-row gap-4">
                <button onClick={() => { setShowTermsModal(false); setSelectedRunToJoin(null); }} className="flex-1 py-5 border-2 border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">Reject Hub Entry</button>
                <button onClick={finalizeJoinRun} disabled={isProcessingRegistration} className="flex-1 py-5 bg-[#d9ff00] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-[#d9ff00]/10">
                  {isProcessingRegistration ? <RefreshCcw size={18} className="animate-spin" /> : <ShieldCheck size={18} />} 
                  {isProcessingRegistration ? "UPLOADING..." : `ACCEPT & CONFIRM (₹${selectedRunToJoin.basePrice})`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-32 border-t border-white/5 bg-black/60 px-6 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 bg-[#d9ff00] rounded-2xl flex items-center justify-center shadow-lg shadow-[#d9ff00]/10"><Trophy size={24} className="text-black" /></div>
            <span className="font-heading font-black text-white text-3xl uppercase tracking-tighter">GENRUN</span>
          </div>
          <p className="text-sm max-w-2xl leading-relaxed text-gray-500 font-medium">Madhya Pradesh's unified collective for endurance and electronics. Bridging the hubs of Bhopal and Indore through shared movement and sound.</p>
          <div className="mt-16 text-[9px] text-gray-800 uppercase font-black tracking-[0.5rem]">© 2025 GENRUN COLLECTIVE • INTEGRATED CLOUD HUB NODE</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
