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
  TrendingUp, Tag, Download, FileDown, MessageSquare
} from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import AIChat from './components/AIChat';
import { RunEvent, UserTicket, User } from './types';
import { jsPDF } from 'jspdf';

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
  "Please take care of your belongings as GENRUN does not take any responsibility for the same.",
  "No refunds will be provided once registered for a GENRUN event.",
  "ZERO TOLERANCE POLICY against any complaints received from a female club member.",
  "By attending, you agree that GENRUN or the venue shall not be held responsible for any injuries, loss, or damage.",
  "The run is social and non-competitive — everyone is encouraged to move at their own pace.",
  "Photos and videos captured during the event may be used on our social platforms.",
  "GENRUN does not take responsibility for damage to your vehicle during the event."
];

interface TicketCardProps {
  ticket: UserTicket;
  events: RunEvent[];
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, events }) => {
  const run = events.find(e => e.id === ticket.runId);
  const [showPrep, setShowPrep] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // City-based color mapping
  const cityTheme = useMemo(() => {
    if (run?.city === 'Bhopal') {
      return {
        accent: '#ff00f7', // Fuchsia
        accentLight: 'rgba(255, 0, 247, 0.1)',
        accentBorder: 'rgba(255, 0, 247, 0.2)',
        text: 'text-[#ff00f7]',
        bg: 'bg-[#ff00f7]',
        rgb: [255, 0, 247]
      };
    }
    return {
      accent: '#d9ff00', // Volt
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
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [400, 640]
      });

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
      
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.id}&bgcolor=ffffff`;
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
      <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-tr-full -z-0 pointer-events-none opacity-5`} style={{ backgroundColor: cityTheme.accent }} />
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
                className={`p-2.5 bg-white/5 hover:text-black rounded-full transition-all text-gray-400 flex items-center gap-2 disabled:opacity-50`}
                title="Download Pass as PDF"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = cityTheme.accent}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
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
            <div 
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${ticket.checkInStatus ? 'w-full' : 'w-1/3'}`} 
              style={{ backgroundColor: cityTheme.accent }}
            />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 flex justify-between w-full px-0">
               {[1, 2, 3].map(i => (
                 <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full border-2 border-zinc-900 transition-colors duration-500`}
                  style={{ backgroundColor: i === 1 || (i === 2 && ticket.checkInStatus) || (i === 3 && ticket.checkInStatus) ? cityTheme.accent : 'rgba(255,255,255,0.1)' }}
                />
               ))}
            </div>
            <div className="absolute top-4 left-0 w-full flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-tighter">
               <span>Registered</span>
               <span>In-Run</span>
               <span>At Rave</span>
            </div>
          </div>

          <button 
            onClick={() => setShowPrep(!showPrep)}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all mt-4 mb-2`}
            style={{ color: cityTheme.accent }}
          >
            {showPrep ? <X size={12} /> : <Info size={12} />}
            {showPrep ? "Hide Preparation" : "How to prepare?"}
          </button>
          
          <AnimatePresence>
            {showPrep && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-black/40 rounded-xl p-4 border border-white/5"
              >
                <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                   {['Bring Water', 'Running Shoes', 'ID Card', 'Glow Gear'].map((item, idx) => (
                     <li key={idx} className="flex items-center gap-2 text-[10px] text-gray-400">
                       <div className="w-1 h-1 rounded-full" style={{ backgroundColor: cityTheme.accent }} /> {item}
                     </li>
                   ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// --- Live Ticker Component ---
const LiveTicker: React.FC<{ tickets: UserTicket[] }> = ({ tickets }) => {
  const checkedInUsers = useMemo(() => {
    return tickets
      .filter(t => t.checkInStatus)
      .reverse(); // Newest first
  }, [tickets]);

  if (checkedInUsers.length === 0) {
    return (
      <div className="bg-black/50 border-b border-white/5 py-2 overflow-hidden flex items-center">
        <div className="px-6 flex items-center gap-2 shrink-0 border-r border-white/10">
           <div className="w-2 h-2 rounded-full bg-gray-600" />
           <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Awaiting Live Feed...</span>
        </div>
        <div className="px-6 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] italic">
          Rave portal open. Get your pass verified to appear on the grid.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/80 backdrop-blur-md border-b border-[#d9ff00]/10 py-2.5 overflow-hidden flex items-center relative z-40">
      <div className="px-6 flex items-center gap-3 shrink-0 border-r border-white/10 bg-black z-10 shadow-[20px_0_20px_rgba(0,0,0,0.8)]">
         <div className="relative">
           <div className="w-2 h-2 rounded-full bg-[#d9ff00] animate-ping absolute inset-0" />
           <div className="w-2 h-2 rounded-full bg-[#d9ff00]" />
         </div>
         <span className="text-[10px] font-black uppercase text-[#d9ff00] tracking-[0.2em]">Live Collective Feed</span>
      </div>
      
      <div className="marquee-wrapper overflow-hidden flex-1">
        <motion.div 
          animate={{ x: [0, -2000] }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 whitespace-nowrap items-center px-10"
        >
          {[1, 2, 3].map((set) => (
            <React.Fragment key={set}>
              {checkedInUsers.map((user, i) => (
                <div key={`${set}-${i}`} className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{user.runnerName}</span>
                  <span className="text-[9px] font-black text-[#d9ff00]/60 uppercase tracking-tighter bg-[#d9ff00]/5 px-2 py-0.5 rounded border border-[#d9ff00]/10">Checked-In ⚡️</span>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const UserAvatar: React.FC<{ user: User | null; size?: string }> = ({ user, size = 'w-8 h-8' }) => {
  if (!user) return <div className={`${size} rounded-full bg-zinc-800 flex items-center justify-center`}><UserIcon size={16} /></div>;
  if (user.profilePic) return <img src={user.profilePic} alt={user.name} className={`${size} rounded-full object-cover border border-[#d9ff00]/30 shadow-lg`} />;
  return (
    <div className={`${size} rounded-full bg-[#d9ff00] flex items-center justify-center text-black font-black text-xs border border-white/10`}>
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
};

const App: React.FC = () => {
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupForm, setSignupForm] = useState<{ name: string; phone: string; city: 'Bhopal' | 'Indore'; password: string; confirmPassword: string; profilePic?: string }>({ 
    name: '', 
    phone: '', 
    city: 'Bhopal', 
    password: '',
    confirmPassword: '',
    profilePic: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);
  
  // App state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean, type: 'privacy' | 'terms' | 'refund' | 'contact' | null }>({ isOpen: false, type: null });
  const [adminTab, setAdminTab] = useState<'runs' | 'tickets' | 'checkin' | 'calendar'>('checkin');
  const [adminPass, setAdminPass] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [eventCityFilter, setEventCityFilter] = useState<'Bhopal' | 'Indore'>('Bhopal');
  const [checkInStatusMsg, setCheckInStatusMsg] = useState<{msg: string, name?: string, profilePic?: string, eventName?: string, type: 'success' | 'error'} | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recentScans, setRecentScans] = useState<UserTicket[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedRunToJoin, setSelectedRunToJoin] = useState<RunEvent | null>(null);
  const [isProcessingRegistration, setIsProcessingRegistration] = useState(false);
  
  // Run Management State
  const [editingRun, setEditingRun] = useState<Partial<RunEvent> | null>(null);
  const [isAddingRun, setIsAddingRun] = useState(false);

  // Settings state
  const [newPassword, setNewPassword] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const checkInTimeoutRef = useRef<number | null>(null);
  const autoInputRef = useRef<HTMLInputElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedEvents = localStorage.getItem('genrun_events');
    const savedTickets = localStorage.getItem('genrun_tickets');
    const savedUsers = localStorage.getItem('genrun_users');
    const savedCurrentUser = localStorage.getItem('genrun_current_user');
    
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    else {
      setEvents(INITIAL_RUNS);
      localStorage.setItem('genrun_events', JSON.stringify(INITIAL_RUNS));
    }
    
    if (savedTickets) setUserTickets(JSON.parse(savedTickets));
    if (savedUsers) setRegisteredUsers(JSON.parse(savedUsers));
    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      setCurrentUser(user);
      setEventCityFilter(user.city);
    }
  }, []);

  // --- Dynamic Pricing Logic ---
  const getDynamicPriceInfo = (run: RunEvent) => {
    const ticketCount = userTickets.filter(t => t.runId === run.id).length;
    const base = run.basePrice || 499;
    
    if (ticketCount < 10) {
      return { price: base - 100, label: 'Early Bird Phase', icon: <Tag size={12} />, color: 'text-emerald-400' };
    } else if (ticketCount > 40) {
      return { price: base + 150, label: 'High Demand Phase', icon: <TrendingUp size={12} />, color: 'text-orange-400' };
    }
    return { price: base, label: 'Standard Phase', icon: <Zap size={12} />, color: 'text-[#d9ff00]' };
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'signup' | 'settings') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (target === 'signup') {
          setSignupForm({ ...signupForm, profilePic: base64 });
        } else if (currentUser) {
          const updatedUser = { ...currentUser, profilePic: base64 };
          const updatedUsers = registeredUsers.map(u => u.id === currentUser.id ? updatedUser : u);
          setCurrentUser(updatedUser);
          setRegisteredUsers(updatedUsers);
          localStorage.setItem('genrun_current_user', JSON.stringify(updatedUser));
          localStorage.setItem('genrun_users', JSON.stringify(updatedUsers));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = signupForm.phone.trim().replace(/\D/g, '').slice(0, 10);
    const fullPhone = `+91${cleanPhone}`;
    if (signupForm.password !== signupForm.confirmPassword) {
      alert("Passwords do not match! Please check and try again.");
      return;
    }
    if (registeredUsers.some(u => u.phone === fullPhone)) {
      setAuthFeedback("Number already registered! Redirecting to login...");
      setTimeout(() => {
        setAuthMode('login');
        setLoginPhone(cleanPhone);
        setAuthFeedback(null);
      }, 1500);
      return;
    }
    if (cleanPhone.length !== 10) {
      alert("Please enter a valid 10-digit WhatsApp number!");
      return;
    }
    setIsAuthLoading(true);
    setAuthFeedback("Creating profile...");
    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: signupForm.name,
        phone: fullPhone,
        password: signupForm.password,
        city: signupForm.city,
        profilePic: signupForm.profilePic
      };
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      setCurrentUser(newUser);
      setEventCityFilter(newUser.city);
      localStorage.setItem('genrun_users', JSON.stringify(updatedUsers));
      localStorage.setItem('genrun_current_user', JSON.stringify(newUser));
      setIsAuthLoading(false);
      setAuthFeedback(null);
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = loginPhone.trim().replace(/\D/g, '').slice(0, 10);
    const fullPhone = `+91${cleanPhone}`;
    const user = registeredUsers.find(u => u.phone === fullPhone && u.password === loginPassword);
    setIsAuthLoading(true);
    setAuthFeedback("Verifying credentials...");
    setTimeout(() => {
      setIsAuthLoading(false);
      setAuthFeedback(null);
      if (user) {
        setCurrentUser(user);
        setEventCityFilter(user.city);
        localStorage.setItem('genrun_current_user', JSON.stringify(user));
      } else {
        alert("Invalid WhatsApp number or password. Check your details!");
      }
    }, 1200);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('genrun_current_user');
    setLoginPhone('');
    setLoginPassword('');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (newPassword.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }
    const updatedUser = { ...currentUser, password: newPassword };
    const updatedUsers = registeredUsers.map(u => u.id === currentUser.id ? updatedUser : u);
    setRegisteredUsers(updatedUsers);
    setCurrentUser(updatedUser);
    localStorage.setItem('genrun_users', JSON.stringify(updatedUsers));
    localStorage.setItem('genrun_current_user', JSON.stringify(updatedUser));
    setNewPassword('');
    setIsSettingsOpen(false);
    alert("Password updated successfully!");
  };

  const scrollToAuth = () => {
    setMobileMenuOpen(false);
    authRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initiateJoinRun = (run: RunEvent) => {
    if (!currentUser) {
      alert("Please sign in to join a run!");
      scrollToAuth();
      return;
    }
    setSelectedRunToJoin(run);
    setShowTermsModal(true);
  };

  const finalizeJoinRun = () => {
    if (!selectedRunToJoin || !currentUser) return;
    
    setIsProcessingRegistration(true);

    // Simulated verification/payment flow
    setTimeout(() => {
      const ticketId = `GR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const newTicket: UserTicket = {
        id: ticketId,
        runId: selectedRunToJoin.id,
        userId: currentUser.id,
        runnerName: currentUser.name,
        runnerPhone: currentUser.phone,
        checkInStatus: false
      };
      
      const updatedTickets = [...userTickets, newTicket];
      setUserTickets(updatedTickets);
      localStorage.setItem('genrun_tickets', JSON.stringify(updatedTickets));
      
      setShowTermsModal(false);
      setSelectedRunToJoin(null);
      setIsProcessingRegistration(false);
      
      window.scrollTo({ top: document.getElementById('tickets')?.offsetTop || 0, behavior: 'smooth' });
      alert(`Access Granted! Welcome to the Hub. Your Auth Token is: ${ticketId}`);
    }, 1500);
  };

  const handleAdminAuth = () => {
    if (adminPass === 'run2025') setIsAuth(true);
    else alert('Invalid Admin Passkey');
  };

  const toggleCheckIn = (ticketId: string) => {
    const ticket = userTickets.find(t => t.id === ticketId);
    if (!ticket) return;
    const updated = userTickets.map(t => t.id === ticketId ? { ...t, checkInStatus: true } : t);
    setUserTickets(updated);
    localStorage.setItem('genrun_tickets', JSON.stringify(updated));
    setRecentScans(prev => [{ ...ticket, checkInStatus: true }, ...prev].slice(0, 5));
    const runner = registeredUsers.find(u => u.id === ticket.userId);
    const run = events.find(e => e.id === ticket.runId);
    setCheckInStatusMsg({ 
      msg: 'ACCESS GRANTED', 
      name: ticket.runnerName,
      profilePic: runner?.profilePic,
      eventName: run?.title,
      type: 'success' 
    });
    if (checkInTimeoutRef.current) clearTimeout(checkInTimeoutRef.current);
    checkInTimeoutRef.current = window.setTimeout(() => setCheckInStatusMsg(null), 4000);
  };

  const handleManualCheckIn = (val: string) => {
    const cleanId = val.trim().toUpperCase();
    if (cleanId.length < 3) return false;
    const t = userTickets.find(ticket => ticket.id === cleanId);
    if (t) {
      if (t.checkInStatus) {
        setCheckInStatusMsg({ msg: "ALREADY VERIFIED", type: 'error' });
        if (checkInTimeoutRef.current) clearTimeout(checkInTimeoutRef.current);
        checkInTimeoutRef.current = window.setTimeout(() => setCheckInStatusMsg(null), 2000);
        return true; 
      } else {
        toggleCheckIn(t.id);
        return true;
      }
    }
    return false;
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleSaveRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRun) return;
    let updatedEvents;
    if (isAddingRun) {
      const newRun: RunEvent = {
        ...editingRun as RunEvent,
        id: `GR-RUN-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        basePrice: editingRun.basePrice || 499
      };
      updatedEvents = [...events, newRun];
    } else {
      updatedEvents = events.map(ev => ev.id === editingRun.id ? (editingRun as RunEvent) : ev);
    }
    setEvents(updatedEvents);
    localStorage.setItem('genrun_events', JSON.stringify(updatedEvents));
    setEditingRun(null);
    setIsAddingRun(false);
    alert(isAddingRun ? "Experience Published!" : "Session Updated!");
  };

  const handleDeleteRun = (id: string) => {
    if (confirm("Are you sure you want to scrub this session from the timeline? This action is permanent.")) {
      const updatedEvents = events.filter(ev => ev.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem('genrun_events', JSON.stringify(updatedEvents));
    }
  };

  const sendWhatsAppConfirmation = (ticket: UserTicket) => {
    const run = events.find(e => e.id === ticket.runId);
    if (!run) return;
    const cleanPhone = ticket.runnerPhone.replace(/\D/g, '');
    const message = `Hello *${ticket.runnerName}*! Greeting from *GENRUN Collective*! ⚡️%0A%0AYour registration for *${run.title}* is *CONFIRMED*.%0A%0A*Run Details:*%0A📅 Date: ${run.date}%0A📍 Meeting: ${run.meetingPoint}%0A🔑 Auth Token: *${ticket.id}*%0A%0APlease show your unique QR code at the entrance for verification. See you at the hub! 🏃‍♂️🕺`;
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const currentUserTickets = userTickets.filter(t => t.userId === currentUser?.id);
  const ticketsByCity = (city: string) => currentUserTickets.filter(ticket => events.find(e => e.id === ticket.runId)?.city === city);
  const filteredEvents = events.filter(e => e.city === eventCityFilter);
  const October2025Calendar = useMemo(() => {
    const daysInMonth = 31;
    const startDay = 3;
    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, []);
  const getEventsForDate = (dayNumber: number) => {
    const searchDate = `OCT ${dayNumber}`;
    return events.filter(ev => ev.date.toUpperCase() === searchDate);
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-[#d9ff00] selection:text-black overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      <AIChat currentUser={currentUser} />
      
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Trophy className="text-[#d9ff00] w-6 h-6" />
          <div className="font-heading text-xl font-black tracking-tighter text-white uppercase">GENRUN</div>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black tracking-[0.3em] uppercase items-center">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-[#d9ff00] transition-colors">Home</button>
          {currentUser && (
            <>
              <a href="#events" className="hover:text-[#d9ff00] transition-colors">Experience</a>
              <a href="#tickets" className="hover:text-[#d9ff00] transition-colors">Passes</a>
              <div className="h-4 w-px bg-white/20" />
              <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-3 hover:text-[#d9ff00]">
                <UserAvatar user={currentUser} size="w-6 h-6" /> Profile
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          )}
          {!currentUser && (
            <button onClick={scrollToAuth} className="hover:text-[#d9ff00] transition-colors uppercase tracking-widest">Join Collective</button>
          )}
          <button onClick={() => { setIsAdminOpen(true); setAdminTab('checkin'); }} className="bg-[#d9ff00] text-black px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 transition-transform font-bold">
            <Zap className="w-4 h-4" /> Scanner
          </button>
        </div>
        <button className="md:hidden text-white z-[70] p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden">
            {currentUser && (
              <div className="mb-4 flex flex-col items-center gap-3">
                 <UserAvatar user={currentUser} size="w-20 h-20" />
                 <span className="text-xl font-black uppercase text-[#d9ff00]">{currentUser.name}</span>
              </div>
            )}
            <button onClick={() => { window.scrollTo({top: 0, behavior: 'smooth'}); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase tracking-widest hover:text-[#d9ff00]">Home</button>
            {currentUser ? (
              <>
                <a href="#events" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest hover:text-[#d9ff00]">Experience</a>
                <a href="#tickets" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest hover:text-[#d9ff00]">Passes</a>
                <button onClick={() => { setIsSettingsOpen(true); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase tracking-widest hover:text-[#d9ff00]">Profile Settings</button>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase tracking-widest text-red-400">Logout</button>
              </>
            ) : (
              <button onClick={scrollToAuth} className="text-2xl font-black uppercase tracking-widest hover:text-[#d9ff00]">Join Collective</button>
            )}
            <button onClick={() => { setIsAdminOpen(true); setAdminTab('checkin'); setMobileMenuOpen(false); }} className="mt-4 bg-[#d9ff00] text-black px-8 py-4 rounded-full font-black uppercase tracking-widest">Open Scanner</button>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentUser ? (
        <section ref={authRef} className="relative min-h-screen flex items-center justify-center p-6 pt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl bg-zinc-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#d9ff00] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-[#d9ff00]/20"><Trophy className="w-8 h-8 text-black" /></div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white">GENRUN COLLECTIVE</h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-3 font-bold">Access Terminal</p>
            </div>
            <div className="flex bg-black p-1.5 rounded-2xl border border-white/5 mb-10">
              <button onClick={() => setAuthMode('signup')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'bg-[#d9ff00] text-black shadow-lg shadow-[#d9ff00]/10' : 'text-gray-500 hover:text-white'}`}>Sign Up</button>
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-[#d9ff00] text-black shadow-lg shadow-[#d9ff00]/10' : 'text-gray-500 hover:text-white'}`}>Login</button>
            </div>
            <AnimatePresence mode="wait">
              {authFeedback && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-[#d9ff00]/10 border border-[#d9ff00]/30 rounded-xl text-center">
                  <p className="text-[#d9ff00] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"><RefreshCcw size={14} className="animate-spin" /> {authFeedback}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {authMode === 'signup' ? (
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-black/50 group-hover:border-[#d9ff00] transition-colors">
                      {signupForm.profilePic ? (<img src={signupForm.profilePic} className="w-full h-full object-cover" />) : (<Camera size={24} className="text-gray-500 group-hover:text-[#d9ff00]" />)}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[#d9ff00] p-1.5 rounded-full text-black shadow-lg"><Plus size={14} /></div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleProfilePicUpload(e, 'signup')} />
                  <p className="text-[9px] uppercase font-black tracking-widest text-gray-500 mt-3">Upload Profile Image (Optional)</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" required value={signupForm.name} onChange={e => setSignupForm({...signupForm, name: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00] font-medium" />
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400 font-bold border-r border-white/10 pr-2 text-xs">+91</span>
                    <input type="tel" placeholder="9998887770" required value={signupForm.phone} onChange={e => setSignupForm({...signupForm, phone: e.target.value.replace(/\D/g, '').slice(0,10)})} className="w-full bg-black border border-white/10 p-4 pl-14 rounded-2xl outline-none focus:border-[#d9ff00] font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['Bhopal', 'Indore'].map(c => (<button key={c} type="button" onClick={() => setSignupForm({...signupForm, city: c as any})} className={`py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${signupForm.city === c ? 'border-[#d9ff00] bg-[#d9ff00]/5 text-[#d9ff00]' : 'border-white/5 bg-black/50 text-gray-500'}`}>{c}</button>))}
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="Set Password" required value={signupForm.password} onChange={e => setSignupForm({...signupForm, password: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00] font-medium" />
                    </div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" required value={signupForm.confirmPassword} onChange={e => setSignupForm({...signupForm, confirmPassword: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00] font-medium" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={isAuthLoading} className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                  {isAuthLoading ? <RefreshCcw size={18} className="animate-spin" /> : "Register Profile"}
                  {!isAuthLoading && <ArrowRight size={18} />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative flex items-center">
                  <span className="absolute left-5 text-gray-400 font-bold border-r border-white/10 pr-3">+91</span>
                  <input type="tel" placeholder="WhatsApp No." required value={loginPhone} onChange={e => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full bg-black border border-white/10 p-5 pl-[4.5rem] rounded-2xl outline-none focus:border-[#d9ff00] font-medium" />
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00] font-medium" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                <button type="submit" disabled={isAuthLoading} className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                  {isAuthLoading ? <RefreshCcw size={18} className="animate-spin" /> : "Access Hub"}
                  {!isAuthLoading && <ArrowRight size={18} />}
                </button>
              </form>
            )}
          </motion.div>
        </section>
      ) : (
        <>
          <div className="pt-[80px]"><LiveTicker tickets={userTickets} /></div>
          <header className="relative h-[85svh] flex flex-col items-center justify-center text-center px-4 pt-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="px-6 py-2 bg-zinc-900 border border-[#d9ff00]/30 rounded-full flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#d9ff00] rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Logged in: {currentUser.name} • {currentUser.city} Hub</span>
                </div>
              </div>
              <GradientText text="RUN THE" as="h1" className="text-[12vw] md:text-[8vw] leading-[0.85] font-black uppercase" />
              <GradientText text="RAVE" as="h1" className="text-[12vw] md:text-[8vw] leading-[0.85] font-black uppercase text-[#d9ff00]" />
              <div className="mt-12 flex flex-wrap gap-4 justify-center">
                <a href="#events" className="bg-[#d9ff00] text-black px-12 py-5 font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-[#d9ff00]/10">Browse Experience</a>
                <button onClick={() => { setIsAdminOpen(true); setAdminTab('runs'); }} className="border border-white/10 px-12 py-5 font-black uppercase tracking-widest text-xs backdrop-blur-md rounded-xl">Host Session</button>
              </div>
            </motion.div>
          </header>

          <section id="events" className="py-32 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-12">
              <h2 className="text-5xl md:text-7xl font-heading font-black uppercase leading-none mb-6">Upcoming <br/><span className="text-[#d9ff00]">Sessions</span></h2>
              <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
                 {['Bhopal', 'Indore'].map(city => (<button key={city} onClick={() => setEventCityFilter(city as any)} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${eventCityFilter === city ? 'bg-[#d9ff00] text-black shadow-lg shadow-[#d9ff00]/10' : 'text-gray-500 hover:text-white'}`}>{city}</button>))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((run) => {
                const dynamicInfo = getDynamicPriceInfo(run);
                return (
                <motion.div layout key={run.id} whileHover={{ y: -12 }} className="group bg-zinc-900/50 border border-white/5 overflow-hidden flex flex-col h-full rounded-[2rem] hover:border-[#d9ff00]/20 transition-all shadow-xl">
                  <div className="relative h-72 overflow-hidden">
                    <img src={run.image} alt={run.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                    <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-lg border border-white/10">{run.city} Hub</div>
                    <div className="absolute bottom-6 left-6 bg-[#d9ff00] text-black px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-lg">{dynamicInfo.icon} {dynamicInfo.label}</div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4"><CalendarIcon size={16} className="text-[#d9ff00]" /> {run.day} • {run.date}</div>
                    <h3 className="text-2xl font-black uppercase leading-tight mb-4 group-hover:text-[#d9ff00] transition-colors">{run.title}</h3>
                    <div className="space-y-3 mb-8">
                       <div className="flex gap-3 text-[10px] font-bold uppercase text-gray-400"><Flag size={16} className="text-[#d9ff00]" /> Meet: <span className="font-medium text-gray-500 normal-case">{run.meetingPoint}</span></div>
                       <div className="flex gap-3 text-[10px] font-bold uppercase text-gray-400"><Music size={16} className="text-fuchsia-500" /> Rave: <span className="font-medium text-gray-500 normal-case">{run.raveLocation}</span></div>
                       <div className={`flex gap-3 text-[10px] font-bold uppercase ${dynamicInfo.color}`}><Zap size={16} /> Status: <span className="font-medium normal-case">{dynamicInfo.label}</span></div>
                    </div>
                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 line-clamp-3">{run.description}</p>
                    <button onClick={() => initiateJoinRun(run)} className="mt-auto w-full py-5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#d9ff00] hover:text-black transition-all rounded-2xl flex items-center justify-center gap-3 group/btn">
                       <span>Join Collective</span> <span className="opacity-40 px-2">|</span><span className="text-[#d9ff00] group-hover/btn:text-black font-black">₹{dynamicInfo.price}</span><ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
                );
              })}
              {filteredEvents.length === 0 && (<div className="col-span-full py-20 text-center border border-white/5 border-dashed rounded-[2rem] bg-zinc-900/20"><p className="text-gray-500 font-bold uppercase tracking-widest">No sessions scheduled for this hub.</p></div>)}
            </div>
          </section>

          <section id="tickets" className="py-32 px-6 bg-black/40 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-24">
                <span className="text-[#d9ff00] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Personal Access Hub</span>
                <h2 className="text-4xl md:text-6xl font-black uppercase">Active <span className="text-[#d9ff00]">Passes</span></h2>
              </div>
              <div className="grid grid-cols-1 gap-16">
                {['Bhopal', 'Indore'].map(city => {
                  const cityTickets = ticketsByCity(city);
                  if (cityTickets.length === 0) return null;
                  return (
                    <div key={city} className="space-y-10">
                      <div className="flex items-center gap-4 pb-4 border-b border-white/10"><MapPin className="text-[#d9ff00]" size={20} /><h3 className="text-xl font-black uppercase tracking-tighter">{city} Hub</h3></div>
                      <div className="grid grid-cols-1 gap-8">{cityTickets.map(t => <TicketCard key={t.id} ticket={t} events={events} />)}</div>
                    </div>
                  );
                })}
                {currentUserTickets.length === 0 && (<div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed"><ZapOff className="w-12 h-12 text-gray-700 mx-auto mb-4" /><p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active passes found. Sign up for an experience above.</p></div>)}
              </div>
            </div>
          </section>
        </>
      )}

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl">
              <div className="flex justify-between items-center mb-10"><h3 className="text-2xl font-black uppercase tracking-tighter">Profile Hub</h3><button onClick={() => setIsSettingsOpen(false)} className="hover:rotate-90 transition-transform p-2 bg-white/5 rounded-full"><X size={20} /></button></div>
              <div className="flex flex-col items-center mb-10">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                   <UserAvatar user={currentUser} size="w-32 h-32" />
                   <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload size={24} /></div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleProfilePicUpload(e, 'settings')} />
                <h4 className="mt-4 text-xl font-black uppercase">{currentUser?.name}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{currentUser?.phone} • {currentUser?.city} Collective</p>
                <button onClick={() => { if (!currentUser) return; const updatedUser = { ...currentUser, profilePic: '' }; const updatedUsers = registeredUsers.map(u => u.id === currentUser.id ? updatedUser : u); setCurrentUser(updatedUser); setRegisteredUsers(updatedUsers); localStorage.setItem('genrun_current_user', JSON.stringify(updatedUser)); localStorage.setItem('genrun_users', JSON.stringify(updatedUsers)); }} className="mt-2 text-red-500 text-[9px] uppercase font-black tracking-widest flex items-center gap-1 hover:brightness-110"><Trash2 size={10} /> Remove Picture</button>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-3 block">Update Password</label><input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter New Password" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00] font-medium" /></div>
                <button type="submit" className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-all">Save Changes</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-zinc-900 border border-white/10 p-10 my-auto shadow-2xl rounded-[3rem] min-h-[85vh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-10 shrink-0">
                <div className="flex items-center gap-4"><div className="p-3 bg-black rounded-xl border border-white/5"><Lock className="text-[#d9ff00]" size={24} /></div><h3 className="text-2xl font-black uppercase tracking-tighter">GENRUN TERMINAL</h3></div>
                <button onClick={() => { setIsAdminOpen(false); setIsAuth(false); stopCamera(); setEditingRun(null); }} className="hover:rotate-90 transition-transform p-3 bg-white/5 rounded-full"><X size={24} /></button>
              </div>
              {!isAuth ? (
                <div className="space-y-8 py-10 max-w-md mx-auto w-full text-center">
                  <input type="password" placeholder="ADMIN ACCESS KEY" autoFocus className="w-full bg-black border border-white/10 p-6 text-white font-mono text-center text-2xl focus:border-[#d9ff00] outline-none rounded-2xl tracking-widest" value={adminPass} onChange={e => setAdminPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdminAuth()} />
                  <button onClick={handleAdminAuth} className="w-full bg-[#d9ff00] text-black py-6 rounded-2xl font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all">Unlock Terminal</button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  <AnimatePresence>
                    {checkInStatusMsg && (
                      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -20 }} className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none p-6">
                        <motion.div className={`max-w-md w-full p-12 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] border-4 flex flex-col items-center gap-4 text-center backdrop-blur-3xl overflow-hidden relative ${checkInStatusMsg.type === 'success' ? 'bg-[#d9ff00] border-black text-black' : 'bg-red-500 border-white text-white'}`}>
                          {checkInStatusMsg.type === 'success' && (<motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-white rounded-full scale-150 -z-10" />)}
                          {checkInStatusMsg.type === 'success' ? (<div className="relative mb-2"><div className="absolute inset-0 bg-black/20 rounded-full blur-2xl animate-pulse" />{checkInStatusMsg.profilePic ? (<img src={checkInStatusMsg.profilePic} className="w-32 h-32 rounded-full object-cover border-4 border-black shadow-2xl relative z-10" />) : (<div className="w-32 h-32 rounded-full bg-black flex items-center justify-center border-4 border-black shadow-2xl relative z-10"><UserIcon size={48} className="text-[#d9ff00]" /></div>)}<div className="absolute -bottom-2 -right-2 bg-black text-[#d9ff00] p-2 rounded-full border-2 border-[#d9ff00] z-20"><CheckCircle size={24} /></div></div>) : (<div className={`p-4 rounded-full ${checkInStatusMsg.type === 'success' ? 'bg-black/10' : 'bg-white/10'}`}><AlertCircle size={80} /></div>)}
                          <div className="space-y-1"><h4 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60">{checkInStatusMsg.msg}</h4>{checkInStatusMsg.name && (<motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-black uppercase leading-none tracking-tighter">{checkInStatusMsg.name}</motion.h2>)}{checkInStatusMsg.eventName && (<p className="text-[10px] font-black uppercase tracking-widest text-black/70 mt-2">{checkInStatusMsg.eventName}</p>)}<div className="pt-4 flex items-center justify-center gap-2"><Sparkles size={16} /><span className="text-[9px] font-black uppercase tracking-widest">Entry Verified by Admin</span><Sparkles size={16} /></div></div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex gap-2 p-1.5 bg-black rounded-[1.2rem] mb-8 overflow-x-auto border border-white/5 shrink-0">
                    {[{ id: 'checkin', label: 'Scanner', icon: <Zap size={14} /> }, { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={14} /> }, { id: 'runs', label: 'Sessions', icon: <LayoutGrid size={14} /> }, { id: 'tickets', label: 'Records', icon: <FileText size={14} /> }].map(tab => (<button key={tab.id} onClick={() => { setAdminTab(tab.id as any); stopCamera(); setEditingRun(null); }} className={`flex-1 py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all min-w-max ${adminTab === tab.id ? 'bg-[#d9ff00] text-black' : 'text-gray-500 hover:text-white'}`}>{tab.icon} {tab.label}</button>))}
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {adminTab === 'checkin' && (
                      <div className="space-y-10 relative">
                        <div className="bg-[#d9ff00] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">{isCameraActive && (<div className="absolute inset-0 z-10 bg-black"><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 border-2 border-[#d9ff00] m-10 rounded-3xl animate-pulse flex items-center justify-center"><div className="w-full h-0.5 bg-[#d9ff00] absolute animate-scan" /></div><button onClick={stopCamera} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[10px]">Close Cam</button></div>)}<div className="flex justify-between items-center mb-6"><h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">Verification System</h4>{!isCameraActive && <button onClick={startCamera} className="bg-black text-[#d9ff00] px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><Camera size={16} /> Scan QR</button>}</div><div className="flex flex-col md:flex-row gap-6"><input ref={autoInputRef} type="text" placeholder="AWAITING GR-CODE..." className="flex-1 bg-black/10 border-2 border-black/10 p-6 outline-none rounded-3xl text-black font-mono font-bold text-xl placeholder-black/30" autoFocus onChange={e => { if (handleManualCheckIn(e.target.value)) e.target.value = ''; }} /><div className="bg-black text-[#d9ff00] px-12 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"><RefreshCcw size={16} className="animate-spin-slow" /> Auto</div></div></div>
                        <div className="space-y-4"><h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Entry Queue</h4><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{recentScans.map((t, idx) => { const runner = registeredUsers.find(u => u.id === t.userId); return (<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={idx} className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between"><div className="flex items-center gap-3"><UserAvatar user={runner || null} size="w-8 h-8" /><div><div className="text-xs font-black uppercase text-emerald-400">{t.runnerName}</div><div className="text-[9px] text-gray-600 font-mono">{t.id}</div></div></div><CheckCircle size={20} className="text-emerald-500" /></motion.div>); })}{recentScans.length === 0 && <div className="col-span-full py-10 text-center text-gray-700 uppercase font-black tracking-widest text-[10px]">Awaiting entry scan...</div>}</div></div>
                      </div>
                    )}
                    {adminTab === 'calendar' && (
                      <div className="space-y-8 pb-10">
                        <div className="flex justify-between items-center mb-6"><h4 className="text-lg font-black uppercase text-white tracking-tighter">OCTOBER 2025</h4><div className="flex gap-4"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-fuchsia-500 rounded-full" /><span className="text-[9px] font-black uppercase text-gray-500">Bhopal</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#d9ff00] rounded-full" /><span className="text-[9px] font-black uppercase text-gray-500">Indore</span></div></div></div>
                        <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (<div key={day} className="p-4 bg-zinc-900 text-center text-[10px] font-black text-gray-500 border-b border-white/5">{day}</div>))}{October2025Calendar.map((day, idx) => { const dateEvents = day ? getEventsForDate(day) : []; return (<div key={idx} className={`min-h-[120px] p-2 bg-zinc-900 relative group ${!day ? 'bg-black/20' : ''}`}>{day && <span className="text-xs font-bold text-gray-600 mb-2 block">{day}</span>}<div className="space-y-1">{dateEvents.map(ev => (<motion.button whileHover={{ x: 2 }} key={ev.id} onClick={() => { setEditingRun(ev); setIsAddingRun(false); setAdminTab('runs'); }} className={`w-full text-left p-1.5 rounded-lg text-[9px] font-black uppercase truncate border border-transparent hover:border-white/20 transition-all ${ev.city === 'Bhopal' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-[#d9ff00]/20 text-[#d9ff00]'}`}>{ev.title}</motion.button>))}</div>{day && (<button onClick={() => { setEditingRun({ city: 'Bhopal', date: `OCT ${day}`, basePrice: 499 } as RunEvent); setIsAddingRun(true); setAdminTab('runs'); }} className="absolute bottom-2 right-2 p-1 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"><Plus size={10} /></button>)}</div>); })}</div>
                      </div>
                    )}
                    {adminTab === 'runs' && (
                      <div className="space-y-8 pb-10">{editingRun ? (<motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSaveRun} className="bg-black/50 border border-white/10 p-8 rounded-[2rem] space-y-6"><div className="flex justify-between items-center mb-4"><h4 className="text-lg font-black uppercase text-[#d9ff00]">{isAddingRun ? "Create New Experience" : "Edit Session Details"}</h4><button type="button" onClick={() => { setEditingRun(null); setIsAddingRun(false); }} className="text-gray-500 hover:text-white uppercase font-black text-[10px]">Cancel</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">Title</label><input required value={editingRun.title || ''} onChange={e => setEditingRun({...editingRun, title: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00]" placeholder="Run Name" /></div><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">City Hub</label><select value={editingRun.city || 'Bhopal'} onChange={e => setEditingRun({...editingRun, city: e.target.value as any})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00]"><option value="Bhopal">Bhopal</option><option value="Indore">Indore</option></select></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">Day</label><input value={editingRun.day || ''} onChange={e => setEditingRun({...editingRun, day: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00]" placeholder="SUN" /></div><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">Date</label><input value={editingRun.date || ''} onChange={e => setEditingRun({...editingRun, date: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00]" placeholder="OCT 26" /></div><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">Distance</label><input value={editingRun.distance || ''} onChange={e => setEditingRun({...editingRun, distance: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00]" placeholder="10K" /></div><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">Start Time</label><input value={editingRun.startTime || ''} onChange={e => setEditingRun({...editingRun, startTime: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00]" placeholder="6:00 AM" /></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">Meeting Point</label><input value={editingRun.meetingPoint || ''} onChange={e => setEditingRun({...editingRun, meetingPoint: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00]" placeholder="Boat Club Entrance" /></div><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">Rave Site</label><input value={editingRun.raveLocation || ''} onChange={e => setEditingRun({...editingRun, raveLocation: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00]" placeholder="The Glass House" /></div><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">Base Price (₹)</label><input type="number" value={editingRun.basePrice || 499} onChange={e => setEditingRun({...editingRun, basePrice: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00]" placeholder="499" /></div></div><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">Image URL</label><input value={editingRun.image || ''} onChange={e => setEditingRun({...editingRun, image: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00]" placeholder="https://..." /></div><div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-500 px-2">Description</label><textarea value={editingRun.description || ''} onChange={e => setEditingRun({...editingRun, description: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-[#d9ff00] h-24" placeholder="Experience story..." /></div><button type="submit" className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-[#d9ff00]/10"><Zap size={18} /> {isAddingRun ? "Deploy Session" : "Update Records"}</button></motion.form>) : (<><div className="flex justify-between items-center mb-6"><h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Managed Sessions</h4><button onClick={() => { setIsAddingRun(true); setEditingRun({ city: 'Bhopal', basePrice: 499 }); }} className="bg-[#d9ff00] text-black px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"><Plus size={16} /> New Session</button></div><div className="grid grid-cols-1 gap-4">{events.map(ev => (<div key={ev.id} className="bg-black/50 border border-white/5 p-6 rounded-[1.5rem] flex items-center justify-between group hover:border-[#d9ff00]/30 transition-all"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all"><img src={ev.image} className="w-full h-full object-cover" /></div><div><div className="text-xs font-black uppercase text-[#d9ff00]">{ev.city} • {ev.date}</div><div className="text-sm font-black uppercase">{ev.title}</div><div className="text-[9px] text-gray-600 font-mono">{ev.id} • ₹{ev.basePrice} Base</div></div></div><div className="flex items-center gap-3"><button onClick={() => { setIsAddingRun(false); setEditingRun(ev); }} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-[#d9ff00] transition-all"><Edit2 size={16} /></button><button onClick={() => handleDeleteRun(ev.id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button></div></div>))}</div></>)}</div>
                    )}
                    {adminTab === 'tickets' && (
                       <div className="grid grid-cols-1 gap-6">
                         {userTickets.map((t) => {
                           const runner = registeredUsers.find(u => u.id === t.userId);
                           const run = events.find(e => e.id === t.runId);
                           return (
                            <div key={t.id} className="bg-black/50 border border-white/5 p-6 rounded-3xl flex justify-between items-center group">
                              <div className="flex items-center gap-4">
                                <UserAvatar user={runner || null} size="w-12 h-12" />
                                <div>
                                  <div className="text-sm font-black uppercase flex items-center gap-2">
                                    {t.runnerName} 
                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-white/5 rounded text-gray-500">{run?.city}</span>
                                  </div>
                                  <div className="text-[9px] text-gray-600 font-mono">{t.id} • {t.runnerPhone}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => sendWhatsAppConfirmation(t)}
                                  className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all flex items-center gap-2 border border-emerald-500/10"
                                  title="Send Confirmation via WhatsApp"
                                >
                                  <MessageSquare size={16} />
                                  <span className="text-[8px] font-black uppercase tracking-widest hidden md:inline">Notify</span>
                                </button>
                                <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${t.checkInStatus ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{t.checkInStatus ? 'Verified' : 'Waitlist'}</div>
                              </div>
                            </div>
                           );
                         })}
                         {userTickets.length === 0 && (<div className="py-20 text-center text-gray-700 uppercase font-black tracking-widest text-[10px] border border-white/5 border-dashed rounded-3xl">No registrations on file.</div>)}
                       </div>
                    )}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center shrink-0">
                    <button type="button" onClick={() => { setIsAuth(false); setAdminPass(''); stopCamera(); setEditingRun(null); }} className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><LogOut size={16} /> Exit Terminal</button>
                    <p className="text-[8px] font-mono text-gray-700 uppercase tracking-tighter">System Version: V2.5.0-LATEST</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTermsModal && selectedRunToJoin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="bg-[#d9ff00] p-8 shrink-0"><div className="flex items-center gap-3 mb-2"><ShieldCheck size={28} className="text-black" /><h3 className="text-2xl font-black uppercase text-black tracking-tighter">Collective Safety</h3></div><p className="text-black/60 text-[10px] font-black uppercase tracking-widest">Mandatory Agreement for {selectedRunToJoin.title}</p></div>
              <div className="p-8 overflow-y-auto space-y-4 text-sm font-medium leading-relaxed custom-scrollbar bg-black/20">{TERMS_AND_CONDITIONS.map((line, i) => (<div key={i} className="flex gap-4 group"><span className="text-[#d9ff00] font-black text-xs pt-1">{i + 1}.</span><p className="text-gray-300 group-hover:text-white transition-colors">{line}</p></div>))}</div>
              <div className="p-8 border-t border-white/5 bg-zinc-900 flex flex-col md:flex-row gap-4 shrink-0">
                <button onClick={() => { setShowTermsModal(false); setSelectedRunToJoin(null); }} className="flex-1 py-5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">Decline</button>
                <button 
                  onClick={finalizeJoinRun} 
                  disabled={isProcessingRegistration}
                  className="flex-1 py-5 bg-[#d9ff00] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingRegistration ? <RefreshCcw size={16} className="animate-spin" /> : <CheckCircle size={16} />} 
                  {isProcessingRegistration ? "Verifying..." : `Confirm Registration (₹${getDynamicPriceInfo(selectedRunToJoin).price})`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {legalModal.isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10 overflow-hidden">
             <div className="w-full max-w-4xl h-full bg-zinc-900/50 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative">
                <button onClick={() => setLegalModal({ isOpen: false, type: null })} className="absolute top-8 right-8 z-20 p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={24} /></button>
                <div className="p-12 md:p-16 overflow-y-auto custom-scrollbar flex-1">
                   {legalModal.type === 'privacy' && (<div className="space-y-8 font-light text-gray-300 leading-relaxed max-w-3xl"><div className="flex items-center gap-4 mb-12"><div className="p-3 bg-[#d9ff00] rounded-2xl shadow-xl shadow-[#d9ff00]/10"><ShieldCheck className="text-black" size={32} /></div><h2 className="text-4xl font-black uppercase tracking-tighter text-white">Privacy Policy</h2></div><p className="text-[#d9ff00] font-black uppercase text-xs tracking-widest mb-4">Effective Date: October 2025</p><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">1. Information We Collect</h3><p>We collect information you provide directly to us when you register for GENRUN, including your name, WhatsApp number, city, and payment details. We also collect usage data to improve our services.</p></section><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">2. How We Use Information</h3><p>Your information is used to process registrations, send event details via WhatsApp, verify entries at events, and improve the GENRUN experience. We do not sell your personal data to third parties.</p></section><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">3. Data Security</h3><p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, no data transmission over the internet can be guaranteed as 100% secure.</p></section><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">4. Third-Party Services</h3><p>We use Google Gemini API for AI coaching assistance.</p></section></div>)}
                   {legalModal.type === 'terms' && (<div className="space-y-8 font-light text-gray-300 leading-relaxed max-w-3xl"><div className="flex items-center gap-4 mb-12"><div className="p-3 bg-[#d9ff00] rounded-2xl shadow-xl shadow-[#d9ff00]/10"><FileText className="text-black" size={32} /></div><h2 className="text-4xl font-black uppercase tracking-tighter text-white">Terms of Service</h2></div><p className="text-[#d9ff00] font-black uppercase text-xs tracking-widest mb-4">Last Updated: October 2025</p><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">1. Acceptance of Terms</h3><p>By accessing or using the GENRUN platform, you agree to be bound by these Terms. If you do not agree, please do not use our services.</p></section><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">2. Member Eligibility</h3><p>Members must be 18 years or older or have parental consent. Members must be physically fit to participate in high-intensity running activities.</p></section><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">3. Event Participation</h3><p>GENRUN events involve physical activity and loud music. Participants assume all risks associated with participation, including but not limited to falls, contact with other participants, and the effects of weather.</p></section><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">4. Intellectual Property</h3><p>All content on the GENRUN platform, including logos, designs, and AI coaching logic, is the property of GENRUN Collective.</p></section></div>)}
                   {legalModal.type === 'refund' && (<div className="space-y-8 font-light text-gray-300 leading-relaxed max-w-3xl"><div className="flex items-center gap-4 mb-12"><div className="p-3 bg-[#d9ff00] rounded-2xl shadow-xl shadow-[#d9ff00]/10"><RefreshCw className="text-black" size={32} /></div><h2 className="text-4xl font-black uppercase tracking-tighter text-white">Refund Policy</h2></div><p className="text-[#d9ff00] font-black uppercase text-xs tracking-widest mb-4">Standard Operational Policy</p><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">1. No Refund Policy</h3><p>Due to the community nature and overheads of organizing high-energy events, GENRUN follows a strict NO REFUND policy once a registration is confirmed.</p></section><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">2. Event Cancellation</h3><p>In the rare case of an event being cancelled by GENRUN due to unforeseen circumstances (e.g., severe weather or government restrictions), members will be offered a priority pass for the next scheduled session. No cash refunds will be issued.</p></section><section className="space-y-4"><h3 className="text-xl font-black uppercase text-white tracking-tight">3. Transfer of Pass</h3><p>Members may transfer their pass to another registered member up to 24 hours before the event start time. Please contact support via WhatsApp to process a transfer.</p></section></div>)}
                   {legalModal.type === 'contact' && (<div className="space-y-8 font-light text-gray-300 leading-relaxed max-w-3xl"><div className="flex items-center gap-4 mb-12"><div className="p-3 bg-[#d9ff00] rounded-2xl shadow-xl shadow-[#d9ff00]/10"><Mail className="text-black" size={32} /></div><h2 className="text-4xl font-black uppercase tracking-tighter text-white">Contact Us</h2></div><p className="text-[#d9ff00] font-black uppercase text-xs tracking-widest mb-4">Reach the Crew</p><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4"><h4 className="text-white font-black uppercase tracking-widest text-sm">Main Office</h4><p className="text-gray-400 text-sm">GENRUN HQ<br/>Arera Colony, Bhopal<br/>Madhya Pradesh - 462016</p></div><div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4"><h4 className="text-white font-black uppercase tracking-widest text-sm">Direct Support</h4><p className="text-gray-400 text-sm">Email: help@genrun.club<br/>WhatsApp: +91 9334220235</p></div></div><div className="pt-8"><p>Our support crew is available from Monday to Saturday, 10 AM to 6 PM IST. For urgent event-day queries, please head to the meeting point early.</p></div></div>)}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-24 border-t border-white/5 bg-black/50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3 mb-12"><div className="p-2 bg-white/5 rounded-lg"><Trophy size={20} className="text-[#d9ff00]" /></div><span className="font-heading font-bold text-white text-xl tracking-tighter uppercase">GENRUN</span></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mb-16 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500"><button onClick={() => setLegalModal({ isOpen: true, type: 'privacy' })} className="hover:text-[#d9ff00] transition-colors">Privacy Policy</button><button onClick={() => setLegalModal({ isOpen: true, type: 'terms' })} className="hover:text-[#d9ff00] transition-colors">Terms of Service</button><button onClick={() => setLegalModal({ isOpen: true, type: 'refund' })} className="hover:text-[#d9ff00] transition-colors">Refund Policy</button><button onClick={() => setLegalModal({ isOpen: true, type: 'contact' })} className="hover:text-[#d9ff00] transition-colors">Contact Us</button></div>
          <div className="mb-12"><p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Official Community Support</p><a href="https://wa.me/919334220235" target="_blank" className="inline-flex items-center gap-2 bg-[#d9ff00]/10 text-[#d9ff00] px-8 py-3 rounded-full border border-[#d9ff00]/20 hover:bg-[#d9ff00]/20 transition-all font-bold text-sm"><MessageCircle size={16} /> Whatsapp +91 9334220235</a></div>
          <p className="text-sm max-w-xl leading-relaxed font-light text-gray-600 mb-12">Madhya Pradesh's premiere collective for high-energy weekend runs and industrial electronic music. Join the rhythm.</p>
          <div className="text-[9px] text-gray-800 uppercase tracking-widest font-black flex items-center gap-4"><span>© 2025 GENRUN COLLECTIVE</span><span className="w-1 h-1 bg-gray-900 rounded-full" /><span>BHOPAL / INDORE HUB</span></div>
        </div>
      </footer>

      <style>{`
        @keyframes scan { 0% { top: 10%; } 100% { top: 90%; } }
        .animate-scan { animation: scan 2s linear infinite; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;