
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, MapPin, Menu, X, Calendar, 
  Plus, Camera, Lock, Trophy, Timer, 
  Map, User as UserIcon, CheckCircle, Info, LogOut, ArrowRight,
  MessageCircle, LayoutDashboard, UserCheck, ClipboardList, Phone,
  ChevronRight, Building2, Zap, RefreshCcw, ShieldCheck, AlertCircle,
  Music, Flag, Settings, Eye, EyeOff, Share2, Clipboard, ZapOff
} from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import AIChat from './components/AIChat';
import { RunEvent, UserTicket, User } from './types';

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
    description: 'Bhopal\'s most scenic route. Feel the lake breeze as we conquer the curves of VIP road followed by a high-energy lakefront rave.'
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
    description: 'Flat, fast, and futuristic. Join the Indore speedsters for a Saturday morning PB attempt and an industrial techno rave.'
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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative bg-zinc-900 border border-white/10 overflow-hidden rounded-[2rem] group shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#d9ff00]/5 rounded-bl-[4rem] -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-fuchsia-500/5 rounded-tr-full -z-0 pointer-events-none" />
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
            <div className="text-[11px] font-black text-[#d9ff00] font-mono tracking-widest">{ticket.id}</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#d9ff00]/10 text-[#d9ff00] text-[9px] font-black uppercase tracking-widest rounded-full border border-[#d9ff00]/20 flex items-center gap-1.5">
                <Zap size={10} /> RUN + RAVE ACCESS
              </span>
              {ticket.checkInStatus && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle size={10} /> VERIFIED
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={shareTicket} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                <Share2 size={14} />
              </button>
            </div>
          </div>

          <h4 className="text-2xl font-black uppercase tracking-tight group-hover:text-[#d9ff00] transition-colors leading-none mb-6">
            {run?.title}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Flag size={14} className="text-[#d9ff00]" />
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
            <div className={`absolute top-0 left-0 h-full bg-[#d9ff00] rounded-full ${ticket.checkInStatus ? 'w-full' : 'w-1/3'}`} />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 flex justify-between w-full px-0">
               {[1, 2, 3].map(i => (
                 <div key={i} className={`w-3 h-3 rounded-full border-2 border-zinc-900 ${i === 1 || (i === 2 && ticket.checkInStatus) || (i === 3 && ticket.checkInStatus) ? 'bg-[#d9ff00]' : 'bg-white/10'}`} />
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
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#d9ff00] hover:opacity-80 transition-all mt-4 mb-2"
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
                       <div className="w-1 h-1 bg-[#d9ff00] rounded-full" /> {item}
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

const App: React.FC = () => {
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupForm, setSignupForm] = useState({ name: '', phone: '', city: 'Bhopal' as 'Bhopal' | 'Indore', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  // App state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'runs' | 'tickets' | 'checkin'>('checkin');
  const [adminPass, setAdminPass] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [eventCityFilter, setEventCityFilter] = useState<'Bhopal' | 'Indore'>('Bhopal');
  const [checkInStatusMsg, setCheckInStatusMsg] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recentScans, setRecentScans] = useState<UserTicket[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedRunToJoin, setSelectedRunToJoin] = useState<RunEvent | null>(null);
  
  // Settings state
  const [newPassword, setNewPassword] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const checkInTimeoutRef = useRef<number | null>(null);
  const autoInputRef = useRef<HTMLInputElement>(null);
  const authRef = useRef<HTMLDivElement>(null);

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

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `+91${signupForm.phone}`;
    if (registeredUsers.some(u => u.phone === fullPhone)) {
      alert("This WhatsApp number is already registered. Try logging in!");
      return;
    }
    if (signupForm.phone.length !== 10) {
      alert("Please enter a valid 10-digit WhatsApp number!");
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...signupForm,
      phone: fullPhone
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    setCurrentUser(newUser);
    setEventCityFilter(newUser.city);
    localStorage.setItem('genrun_users', JSON.stringify(updatedUsers));
    localStorage.setItem('genrun_current_user', JSON.stringify(newUser));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `+91${loginPhone}`;
    const user = registeredUsers.find(u => u.phone === fullPhone && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setEventCityFilter(user.city);
      localStorage.setItem('genrun_current_user', JSON.stringify(user));
    } else {
      alert("Invalid WhatsApp number or password. Check your details!");
    }
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
    window.scrollTo({ top: document.getElementById('tickets')?.offsetTop || 0, behavior: 'smooth' });
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
    setCheckInStatusMsg({ msg: `Verified: ${ticket.runnerName}`, type: 'success' });
    if (checkInTimeoutRef.current) clearTimeout(checkInTimeoutRef.current);
    checkInTimeoutRef.current = window.setTimeout(() => setCheckInStatusMsg(null), 3000);
  };

  const handleManualCheckIn = (val: string) => {
    const cleanId = val.trim().toUpperCase();
    if (cleanId.length < 3) return false;
    const t = userTickets.find(ticket => ticket.id === cleanId);
    if (t) {
      if (t.checkInStatus) {
        setCheckInStatusMsg({ msg: "Already Verified", type: 'error' });
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

  const currentUserTickets = userTickets.filter(t => t.userId === currentUser?.id);
  const ticketsByCity = (city: string) => currentUserTickets.filter(ticket => events.find(e => e.id === ticket.runId)?.city === city);
  const filteredEvents = events.filter(e => e.city === eventCityFilter);

  return (
    <div className="relative min-h-screen text-white selection:bg-[#d9ff00] selection:text-black overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      <AIChat />
      
      {/* Navigation */}
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
              <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 hover:text-[#d9ff00]">
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300">
                <LogOut className="w-3.5 h-3.5" /> {currentUser.name}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button onClick={() => { window.scrollTo({top: 0, behavior: 'smooth'}); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase tracking-widest hover:text-[#d9ff00]">Home</button>
            {currentUser ? (
              <>
                <a href="#events" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest hover:text-[#d9ff00]">Experience</a>
                <a href="#tickets" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest hover:text-[#d9ff00]">Passes</a>
                <button onClick={() => { setIsSettingsOpen(true); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase tracking-widest hover:text-[#d9ff00]">Settings</button>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase tracking-widest text-red-400">Logout</button>
              </>
            ) : (
              <button onClick={scrollToAuth} className="text-2xl font-black uppercase tracking-widest hover:text-[#d9ff00]">Join Collective</button>
            )}
            <button 
              onClick={() => { setIsAdminOpen(true); setAdminTab('checkin'); setMobileMenuOpen(false); }} 
              className="mt-4 bg-[#d9ff00] text-black px-8 py-4 rounded-full font-black uppercase tracking-widest"
            >
              Open Scanner
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Screen */}
      {!currentUser ? (
        <section ref={authRef} className="relative min-h-screen flex items-center justify-center p-6 pt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl bg-zinc-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#d9ff00] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-[#d9ff00]/20">
                <Trophy className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white">GENRUN COLLECTIVE</h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-3 font-bold">Access Terminal</p>
            </div>

            <div className="flex bg-black p-1.5 rounded-2xl border border-white/5 mb-10">
              <button onClick={() => setAuthMode('signup')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'bg-[#d9ff00] text-black shadow-lg shadow-[#d9ff00]/10' : 'text-gray-500 hover:text-white'}`}>Sign Up</button>
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-[#d9ff00] text-black shadow-lg shadow-[#d9ff00]/10' : 'text-gray-500 hover:text-white'}`}>Login</button>
            </div>

            {authMode === 'signup' ? (
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" required value={signupForm.name} onChange={e => setSignupForm({...signupForm, name: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00] font-medium" />
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400 font-bold border-r border-white/10 pr-2 text-xs">+91</span>
                    <input type="tel" placeholder="9998887770" required value={signupForm.phone} onChange={e => setSignupForm({...signupForm, phone: e.target.value.replace(/\D/g, '').slice(0,10)})} className="w-full bg-black border border-white/10 p-4 pl-14 rounded-2xl outline-none focus:border-[#d9ff00] font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['Bhopal', 'Indore'].map(c => (
                    <button key={c} type="button" onClick={() => setSignupForm({...signupForm, city: c as any})} className={`py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${signupForm.city === c ? 'border-[#d9ff00] bg-[#d9ff00]/5 text-[#d9ff00]' : 'border-white/5 bg-black/50 text-gray-500'}`}>{c}</button>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="Set Password" required value={signupForm.password} onChange={e => setSignupForm({...signupForm, password: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00] font-medium" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">Register Profile <ArrowRight size={18} /></button>
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
                <button type="submit" className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">Access Hub <ArrowRight size={18} /></button>
              </form>
            )}
          </motion.div>
        </section>
      ) : (
        <>
          <header className="relative h-[90svh] flex flex-col items-center justify-center text-center px-4 pt-20">
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
                 {['Bhopal', 'Indore'].map(city => (
                   <button key={city} onClick={() => setEventCityFilter(city as any)} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${eventCityFilter === city ? 'bg-[#d9ff00] text-black shadow-lg shadow-[#d9ff00]/10' : 'text-gray-500 hover:text-white'}`}>{city}</button>
                 ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((run) => (
                <motion.div layout key={run.id} whileHover={{ y: -12 }} className="group bg-zinc-900/50 border border-white/5 overflow-hidden flex flex-col h-full rounded-[2rem] hover:border-[#d9ff00]/20 transition-all shadow-xl">
                  <div className="relative h-72 overflow-hidden">
                    <img src={run.image} alt={run.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                    <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-lg border border-white/10">{run.city} Hub</div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4"><Calendar size={16} className="text-[#d9ff00]" /> {run.day} • {run.date}</div>
                    <h3 className="text-2xl font-black uppercase leading-tight mb-4 group-hover:text-[#d9ff00] transition-colors">{run.title}</h3>
                    <div className="space-y-3 mb-8">
                       <div className="flex gap-3 text-[10px] font-bold uppercase text-gray-400"><Flag size={16} className="text-[#d9ff00]" /> Meet: <span className="font-medium text-gray-500 normal-case">{run.meetingPoint}</span></div>
                       <div className="flex gap-3 text-[10px] font-bold uppercase text-gray-400"><Music size={16} className="text-fuchsia-500" /> Rave: <span className="font-medium text-gray-500 normal-case">{run.raveLocation}</span></div>
                    </div>
                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 line-clamp-3">{run.description}</p>
                    <button onClick={() => initiateJoinRun(run)} className="mt-auto w-full py-5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#d9ff00] hover:text-black transition-all rounded-2xl flex items-center justify-center gap-3">Join Collective <ChevronRight size={16} /></button>
                  </div>
                </motion.div>
              ))}
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
                      <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                        <MapPin className="text-[#d9ff00]" size={20} />
                        <h3 className="text-xl font-black uppercase tracking-tighter">{city} Hub</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-8">
                        {cityTickets.map(t => <TicketCard key={t.id} ticket={t} events={events} />)}
                      </div>
                    </div>
                  );
                })}
                {currentUserTickets.length === 0 && (
                  <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
                    <ZapOff className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active passes found. Sign up for an experience above.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Account Settings</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="hover:rotate-90 transition-transform p-2 bg-white/5 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-3 block">Update Password</label>
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter New Password" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00] font-medium" />
                </div>
                <button type="submit" className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-all">Save Changes</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Terminal */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 p-10 my-auto shadow-2xl rounded-[3rem] min-h-[70vh] flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4"><div className="p-3 bg-black rounded-xl border border-white/5"><Lock className="text-[#d9ff00]" size={24} /></div><h3 className="text-2xl font-black uppercase tracking-tighter">GENRUN TERMINAL</h3></div>
                <button onClick={() => { setIsAdminOpen(false); setIsAuth(false); stopCamera(); }} className="hover:rotate-90 transition-transform p-3 bg-white/5 rounded-full"><X size={24} /></button>
              </div>
              {!isAuth ? (
                <div className="space-y-8 py-10 max-w-md mx-auto w-full text-center">
                  <input type="password" placeholder="ADMIN ACCESS KEY" autoFocus className="w-full bg-black border border-white/10 p-6 text-white font-mono text-center text-2xl focus:border-[#d9ff00] outline-none rounded-2xl tracking-widest" value={adminPass} onChange={e => setAdminPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdminAuth()} />
                  <button onClick={handleAdminAuth} className="w-full bg-[#d9ff00] text-black py-6 rounded-2xl font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all">Unlock Terminal</button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex gap-2 p-1.5 bg-black rounded-[1.2rem] mb-12 overflow-x-auto border border-white/5 shrink-0">
                    {['checkin', 'tickets', 'runs'].map(tab => (
                      <button key={tab} onClick={() => { setAdminTab(tab as any); stopCamera(); }} className={`flex-1 py-4 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${adminTab === tab ? 'bg-[#d9ff00] text-black' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {adminTab === 'checkin' && (
                      <div className="space-y-10 relative">
                        <AnimatePresence>{checkInStatusMsg && (<motion.div initial={{ opacity: 0, scale: 0.8, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] px-12 py-8 rounded-[2rem] border-2 shadow-2xl flex flex-col items-center gap-4 backdrop-blur-xl ${checkInStatusMsg.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-red-500 border-red-400 text-white'}`}>{checkInStatusMsg.type === 'success' ? <CheckCircle size={64} /> : <AlertCircle size={64} />}<span className="font-black uppercase tracking-widest text-xl">{checkInStatusMsg.msg}</span></motion.div>)}</AnimatePresence>
                        <div className="bg-[#d9ff00] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                          {isCameraActive && (<div className="absolute inset-0 z-10 bg-black"><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 border-2 border-[#d9ff00] m-10 rounded-3xl animate-pulse flex items-center justify-center"><div className="w-full h-0.5 bg-[#d9ff00] absolute animate-scan" /></div><button onClick={stopCamera} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[10px]">Close Cam</button></div>)}
                          <div className="flex justify-between items-center mb-6"><h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">Verification System</h4>{!isCameraActive && <button onClick={startCamera} className="bg-black text-[#d9ff00] px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><Camera size={16} /> Scan QR</button>}</div>
                          <div className="flex flex-col md:flex-row gap-6"><input ref={autoInputRef} type="text" placeholder="AWAITING GR-CODE..." className="flex-1 bg-black/10 border-2 border-black/10 p-6 outline-none rounded-3xl text-black font-mono font-bold text-xl placeholder-black/30" autoFocus onChange={e => { if (handleManualCheckIn(e.target.value)) e.target.value = ''; }} /><div className="bg-black text-[#d9ff00] px-12 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"><RefreshCcw size={16} className="animate-spin-slow" /> Auto</div></div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Entry Queue</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {recentScans.map((t, idx) => (<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={idx} className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between"><div><div className="text-xs font-black uppercase text-emerald-400">{t.runnerName}</div><div className="text-[9px] text-gray-600 font-mono">{t.id}</div></div><CheckCircle size={20} className="text-emerald-500" /></motion.div>))}
                             {recentScans.length === 0 && <div className="col-span-full py-10 text-center text-gray-700 uppercase font-black tracking-widest text-[10px]">Awaiting entry scan...</div>}
                          </div>
                        </div>
                      </div>
                    )}
                    {adminTab === 'runs' && (
                      <div className="text-gray-500 text-center py-20 font-black uppercase tracking-widest">Experience Publishing System Locked</div>
                    )}
                    {adminTab === 'tickets' && (
                       <div className="grid grid-cols-1 gap-6">
                         {userTickets.map((t) => (
                           <div key={t.id} className="bg-black/50 border border-white/5 p-6 rounded-3xl flex justify-between items-center"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-[#d9ff00]/10 rounded-xl flex items-center justify-center text-[#d9ff00] font-black">{t.runnerName.charAt(0)}</div><div><div className="text-sm font-black uppercase">{t.runnerName}</div><div className="text-[9px] text-gray-600 font-mono">{t.id} • {t.runnerPhone}</div></div></div><div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${t.checkInStatus ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{t.checkInStatus ? 'Verified' : 'Waitlist'}</div></div>
                         ))}
                       </div>
                    )}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center shrink-0">
                    <button type="button" onClick={() => { setIsAuth(false); setAdminPass(''); stopCamera(); }} className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><LogOut size={16} /> Exit Terminal</button>
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
              <div className="bg-[#d9ff00] p-8 shrink-0">
                <div className="flex items-center gap-3 mb-2"><ShieldCheck size={28} className="text-black" /><h3 className="text-2xl font-black uppercase text-black tracking-tighter">Collective Safety</h3></div>
                <p className="text-black/60 text-[10px] font-black uppercase tracking-widest">Mandatory Agreement for {selectedRunToJoin.title}</p>
              </div>
              <div className="p-8 overflow-y-auto space-y-4 text-sm font-medium leading-relaxed custom-scrollbar bg-black/20">
                {TERMS_AND_CONDITIONS.map((line, i) => (<div key={i} className="flex gap-4 group"><span className="text-[#d9ff00] font-black text-xs pt-1">{i + 1}.</span><p className="text-gray-300 group-hover:text-white transition-colors">{line}</p></div>))}
              </div>
              <div className="p-8 border-t border-white/5 bg-zinc-900 flex flex-col md:flex-row gap-4 shrink-0">
                <button onClick={() => { setShowTermsModal(false); setSelectedRunToJoin(null); }} className="flex-1 py-5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">Decline</button>
                <button onClick={finalizeJoinRun} className="flex-1 py-5 bg-[#d9ff00] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all">I Agree & Accept</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-24 border-t border-white/5 text-center text-gray-600 px-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2 bg-white/5 rounded-lg"><Trophy size={20} className="text-[#d9ff00]" /></div>
          <span className="font-heading font-bold text-white text-xl tracking-tighter uppercase">GENRUN</span>
        </div>
        <div className="mb-8"><p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Member Support</p><a href="https://wa.me/919334220235" target="_blank" className="inline-flex items-center gap-2 bg-[#d9ff00]/10 text-[#d9ff00] px-6 py-2 rounded-full border border-[#d9ff00]/20 hover:bg-[#d9ff00]/20 transition-all font-bold text-sm"><MessageCircle size={16} /> Whatsapp @+91 9334220235</a></div>
        <p className="text-sm max-w-xl mx-auto leading-relaxed font-light text-gray-500 mb-8">MP's premiere high-energy collective for weekend runners and electronic enthusiasts. Redefine your rhythm.</p>
        <div className="text-[10px] text-gray-800 uppercase tracking-widest font-black">© 2025 GENRUN COLLECTIVE</div>
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
