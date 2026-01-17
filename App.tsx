
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
  TrendingUp, Tag, Download, FileDown, MessageSquare, Search, Database, Globe, Scan, Terminal,
  ShieldAlert, Truck, HelpCircle, Ban, UserX
} from 'lucide-react';
import jsQR from 'jsqr';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import AIChat from './components/AIChat';
import { RunEvent, UserTicket, User } from './types';
import { jsPDF } from 'jspdf';

// --- Shared Hub Configuration ---
const SHARED_HUB_API = "https://67bc8651ed715aa51711202e.mockapi.io/api/v1/tickets";

const DEFAULT_RUNS: RunEvent[] = [
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
        text: 'text-[#ff00f7]',
        bg: 'bg-[#ff00f7]',
        rgb: [255, 0, 247]
      };
    }
    return {
      accent: '#d9ff00',
      accentLight: 'rgba(217, 255, 0, 0.1)',
      text: 'text-[#d9ff00]',
      bg: 'bg-[#d9ff00]',
      rgb: [217, 255, 0]
    };
  }, [run?.city]);

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
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('RUNNER IDENTITY', 20, 130);
      doc.setFontSize(18);
      doc.text(ticket.runnerName.toUpperCase(), 20, 150);
      doc.setFontSize(8);
      doc.text('EXPERIENCE', 20, 185);
      doc.setFontSize(16);
      doc.text(run?.title.toUpperCase() || 'COLLECTIVE SESSION', 20, 205);
      doc.setTextColor(r, g, b);
      doc.setFontSize(8);
      doc.text('UNIQUE AUTH TOKEN', 25, 395);
      doc.setFontSize(14);
      doc.text(ticket.id, 25, 412);
      
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${ticket.id}&bgcolor=ffffff&qzone=2&ecc=H`;
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = qrUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      doc.addImage(img, 'PNG', 125, 440, 150, 150);
      doc.save(`GENRUN_Pass_${ticket.id}.pdf`);
    } catch (err) {
      alert('PDF Error: Use screenshot if download fails.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="relative bg-zinc-900 border border-white/10 overflow-hidden rounded-[2rem] shadow-2xl group"
    >
      <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
        <div className="bg-white p-3 rounded-2xl shrink-0 shadow-lg">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.id}&bgcolor=ffffff&qzone=2&ecc=H`} alt="QR" className="w-28 h-28" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10 ${cityTheme.text}`} style={{ backgroundColor: cityTheme.accentLight }}>
              Run + Rave Access
            </span>
            {ticket.checkInStatus && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">Verified Hub Entry</span>}
          </div>
          <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">{run?.title}</h4>
          <p className="text-xs text-gray-500 font-mono tracking-widest mb-6">AUTH: {ticket.id}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button onClick={downloadTicketAsPDF} disabled={isDownloading} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-[#d9ff00] transition-colors">
              {isDownloading ? <RefreshCcw size={14} className="animate-spin" /> : <Download size={14} />} Download Pass
            </button>
            <button onClick={() => setShowPrep(!showPrep)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <Info size={14} /> {showPrep ? "Hide Guide" : "Prep Guide"}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showPrep && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-black/50 border-t border-white/5 overflow-hidden">
            <div className="p-8 grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
               <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${cityTheme.bg}`} /> Bring Hydration</div>
               <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${cityTheme.bg}`} /> Running Shoes</div>
               <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${cityTheme.bg}`} /> ID Proof</div>
               <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${cityTheme.bg}`} /> Charge Phone</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const [signupForm, setSignupForm] = useState({ name: '', phone: '', city: 'Bhopal', password: '', confirmPassword: '' });
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'records' | 'scanner' | 'sessions'>('records');
  const [isAuth, setIsAuth] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<number>(Date.now());
  const [searchQuery, setSearchQuery] = useState('');
  const [scanResult, setScanResult] = useState<{status: 'success' | 'error' | 'pending' | 'duplicate', msg: string, name?: string} | null>(null);

  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState<'terms' | 'privacy' | 'refund' | 'shipping' | 'contact'>('terms');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedRunToJoin, setSelectedRunToJoin] = useState<RunEvent | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<RunEvent | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scannerRequestRef = useRef<number | null>(null);

  // --- Cloud Sync Logic ---
  const syncHub = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const response = await fetch(`${SHARED_HUB_API}?nocache=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const sortedData = data.sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
          setUserTickets(sortedData);
          localStorage.setItem('genrun_tickets', JSON.stringify(sortedData));
          setLastSync(Date.now());
        }
      }
    } catch (err) {
      const cached = localStorage.getItem('genrun_tickets');
      if (cached) setUserTickets(JSON.parse(cached));
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  useEffect(() => {
    const savedEvents = localStorage.getItem('genrun_events');
    const savedUsers = localStorage.getItem('genrun_users');
    const savedCurrentUser = localStorage.getItem('genrun_current_user');
    
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    else {
      setEvents(DEFAULT_RUNS);
      localStorage.setItem('genrun_events', JSON.stringify(DEFAULT_RUNS));
    }
    
    if (savedUsers) setRegisteredUsers(JSON.parse(savedUsers));
    if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));
    
    syncHub();
    const interval = setInterval(() => syncHub(true), 15000);
    return () => clearInterval(interval);
  }, []);

  // --- Member Auth Logic ---
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) { alert("Passwords don't match."); return; }
    const fullPhone = `+91${signupForm.phone.slice(-10)}`;
    const newUser: User = { 
      id: Math.random().toString(36).substr(2, 9), 
      name: signupForm.name, 
      phone: fullPhone, 
      password: signupForm.password, 
      city: signupForm.city as any 
    };
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    setCurrentUser(newUser);
    localStorage.setItem('genrun_users', JSON.stringify(updated));
    localStorage.setItem('genrun_current_user', JSON.stringify(newUser));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `+91${loginPhone.slice(-10)}`;
    const user = registeredUsers.find(u => u.phone === fullPhone && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('genrun_current_user', JSON.stringify(user));
    } else {
      alert("Invalid credentials.");
    }
  };

  // --- Session Registration ---
  const finalizeJoin = async () => {
    if (!selectedRunToJoin || !currentUser) return;
    setIsProcessing(true);
    const ticketId = `GR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newTicket: UserTicket = {
      id: ticketId,
      runId: selectedRunToJoin.id,
      userId: currentUser.id,
      runnerName: currentUser.name,
      runnerPhone: currentUser.phone,
      checkInStatus: false
    };
    try {
      const resp = await fetch(SHARED_HUB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      });
      if (!resp.ok) throw new Error("API Failure");
      await syncHub(true);
      setShowTermsModal(false);
      setSelectedRunToJoin(null);
      alert(`Success! Pass ID: ${ticketId}`);
    } catch (err) {
      const updated = [...userTickets, newTicket];
      setUserTickets(updated);
      localStorage.setItem('genrun_tickets', JSON.stringify(updated));
      setShowTermsModal(false);
      setSelectedRunToJoin(null);
      alert("Local Pass Created. ID: " + ticketId);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Admin Logic ---
  const handleAdminAuth = () => {
    if (adminPass === 'run2025') setIsAuth(true);
    else alert("Access Denied.");
  };

  const toggleVerify = async (ticket: UserTicket) => {
    // SECURITY: Immediate cloud check
    const cloudRecord = userTickets.find((r: any) => r.id === ticket.id || (r as any).id === (ticket as any).id);
    const internalId = (cloudRecord as any)?.id;
    if (!internalId) return false;

    // SECURITY: Double scan check
    if (cloudRecord?.checkInStatus) {
       return 'DUPLICATE';
    }

    const updatedTicket = { ...ticket, checkInStatus: true };
    try {
      const resp = await fetch(`${SHARED_HUB_API}/${internalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTicket)
      });
      if (!resp.ok) throw new Error("Update failed");
      
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      await syncHub(true);
      return true;
    } catch (err) {
      const updated = userTickets.map(t => t.id === ticket.id ? updatedTicket : t);
      setUserTickets(updated);
      localStorage.setItem('genrun_tickets', JSON.stringify(updated));
      return true;
    }
  };

  const handleAutoScan = async (code: string) => {
    if (!code || scanResult) return;
    
    setScanResult({ status: 'pending', msg: 'VALIDATING...' });
    
    // Find matching ticket in sync cache
    const ticket = userTickets.find(t => t.id.toUpperCase() === code.trim().toUpperCase());
    
    if (ticket) {
      if (ticket.checkInStatus) {
        if (navigator.vibrate) navigator.vibrate(500);
        setScanResult({ status: 'duplicate', msg: 'TICKET ALREADY REDEEMED', name: ticket.runnerName });
      } else {
        const success = await toggleVerify(ticket);
        if (success === 'DUPLICATE') {
          setScanResult({ status: 'duplicate', msg: 'SECURE BLOCK: ALREADY IN HUB', name: ticket.runnerName });
        } else if (success) {
          setScanResult({ status: 'success', msg: 'ACCESS GRANTED', name: ticket.runnerName });
        } else {
          setScanResult({ status: 'error', msg: 'UPLINK FAILURE' });
        }
      }
    } else {
      if (navigator.vibrate) navigator.vibrate(300);
      setScanResult({ status: 'error', msg: 'UNKNOWN IDENTITY' });
    }
    
    // Clear overlay after short delay to resume scanning
    setTimeout(() => {
      setScanResult(null);
    }, 4000);
  };

  // --- Managed QR Engine ---
  const startScanner = async () => {
    setIsCameraActive(true);
    setScanResult(null);
    try {
      const constraints = { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      alert("Scanner Failure: Camera permissions missing.");
      setIsCameraActive(false);
    }
  };

  const stopScanner = () => {
    setIsCameraActive(false);
    if (scannerRequestRef.current) cancelAnimationFrame(scannerRequestRef.current);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    const tick = () => {
      if (!isCameraActive || !videoRef.current || !canvasRef.current || scanResult) {
        scannerRequestRef.current = requestAnimationFrame(tick);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });

      if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
          if (code && code.data) {
            handleAutoScan(code.data);
          }
        }
      }
      scannerRequestRef.current = requestAnimationFrame(tick);
    };

    if (isCameraActive) {
      scannerRequestRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (scannerRequestRef.current) cancelAnimationFrame(scannerRequestRef.current);
    };
  }, [isCameraActive, scanResult]);

  const saveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const eventData: Partial<RunEvent> = Object.fromEntries(formData.entries());
    let updated;
    if (editingEvent) {
      updated = events.map(ev => ev.id === editingEvent.id ? { ...ev, ...eventData } : ev);
    } else {
      const newEv = { ...eventData, id: `ev-${Math.random().toString(36).substr(2, 4)}`, basePrice: 499 } as RunEvent;
      updated = [...events, newEv];
    }
    setEvents(updated);
    localStorage.setItem('genrun_events', JSON.stringify(updated));
    setIsEventFormOpen(false);
    setEditingEvent(null);
  };

  const sendWhatsApp = (ticket: UserTicket) => {
    const run = events.find(r => r.id === ticket.runId);
    const cleanPhone = ticket.runnerPhone.replace(/\D/g, '').slice(-10);
    const msg = `*GENRUN HUB CONFIRMATION* %0A%0AHey ${ticket.runnerName}, your entry for *${run?.title}* is verified! %0A%0A*Auth ID:* ${ticket.id} %0A*Hub:* ${run?.city} %0A%0ASee you at the hub! 🏁`;
    window.open(`https://wa.me/91${cleanPhone}?text=${msg}`, '_blank');
  };

  const filteredTickets = userTickets.filter(t => 
    t.runnerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.runnerPhone.includes(searchQuery)
  );

  const currentUserTickets = userTickets.filter(t => t.userId === currentUser?.id);

  const renderPolicyContent = () => {
    switch (activePolicyTab) {
      case 'terms':
        return (
          <div className="space-y-6 text-gray-400">
            <h4 className="text-[#d9ff00] font-black uppercase tracking-widest text-lg">Terms & Conditions</h4>
            <p className="text-sm leading-relaxed">By accessing the GENRUN Hub and participating in our sessions, you agree to abide by the Collective Ethics protocol. Participation is voluntary, and you assume all risks associated with endurance running and event participation.</p>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6 text-gray-400">
            <h4 className="text-[#d9ff00] font-black uppercase tracking-widest text-lg">Privacy Policy</h4>
            <p className="text-sm leading-relaxed">Your privacy is a core tenet of the collective. We collect minimal data solely for identity verification and hub synchronization.</p>
          </div>
        );
      case 'refund':
        return (
          <div className="space-y-6 text-gray-400">
            <h4 className="text-[#d9ff00] font-black uppercase tracking-widest text-lg">Refund & Cancellation</h4>
            <div className="bg-white/5 border border-[#d9ff00]/20 p-6 rounded-2xl">
              <p className="text-sm font-black text-white uppercase tracking-widest mb-4">Zero Refund Policy</p>
              <p className="text-sm leading-relaxed text-gray-400">Once an Access Pass is booked and an Auth ID is generated, no refunds will be issued under any circumstances.</p>
            </div>
          </div>
        );
      case 'shipping':
        return (
          <div className="space-y-6 text-gray-400">
            <h4 className="text-[#d9ff00] font-black uppercase tracking-widest text-lg">Shipping & Delivery</h4>
            <p className="text-sm leading-relaxed">GENRUN operates on a digital-first fulfillment model. We do not ship physical merchandise to home addresses.</p>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6 text-gray-400">
            <h4 className="text-[#d9ff00] font-black uppercase tracking-widest text-lg">Contact Us</h4>
            <p className="text-sm leading-relaxed">Need hub support? Reach out to our ops team.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <Mail className="text-[#d9ff00]" size={18} />
                <span className="text-xs font-mono">ops@genrun.collective</span>
              </div>
            </div>
          </div>
        );
    }
  };

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
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-[#d9ff00] transition-colors">Home</button>
          {currentUser && (
            <>
              <a href="#events" className="hover:text-[#d9ff00] transition-colors">Experiences</a>
              <a href="#tickets" className="hover:text-[#d9ff00] transition-colors">Passes</a>
              <button onClick={() => { setCurrentUser(null); localStorage.removeItem('genrun_current_user'); }} className="text-red-400 hover:text-red-300">Exit Hub</button>
            </>
          )}
          <button onClick={() => { setIsAdminOpen(true); setIsAuth(false); }} className="bg-[#d9ff00] text-black px-5 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all">
            <Terminal size={14} /> Admin Dashboard
          </button>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#d9ff00]">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden">
            <button onClick={() => { setMobileMenuOpen(false); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-2xl font-black uppercase">Home</button>
            {currentUser && (
              <>
                <a href="#events" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase">Experiences</a>
                <a href="#tickets" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase">Passes</a>
                <button onClick={() => { setCurrentUser(null); localStorage.removeItem('genrun_current_user'); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase text-red-500">Exit Hub</button>
              </>
            )}
            <button onClick={() => { setIsAdminOpen(true); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase text-[#d9ff00]">Admin Dashboard</button>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentUser ? (
        <section className="relative min-h-screen flex items-center justify-center p-6 pt-32">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl bg-zinc-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#d9ff00]/20" />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-center mb-10">Collective <span className="text-[#d9ff00]">Entry</span></h2>
            <div className="flex bg-black p-1.5 rounded-2xl border border-white/5 mb-8">
              <button onClick={() => setAuthMode('signup')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'bg-[#d9ff00] text-black shadow-lg shadow-[#d9ff00]/10' : 'text-gray-500'}`}>New Runner</button>
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-[#d9ff00] text-black shadow-lg shadow-[#d9ff00]/10' : 'text-gray-500'}`}>Link ID</button>
            </div>
            {authMode === 'signup' ? (
              <form onSubmit={handleSignup} className="space-y-6">
                <input type="text" placeholder="Full Name" required value={signupForm.name} onChange={e => setSignupForm({...signupForm, name: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00]" />
                <input type="tel" placeholder="WhatsApp Number" required value={signupForm.phone} onChange={e => setSignupForm({...signupForm, phone: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00]" />
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setSignupForm({...signupForm, city: 'Bhopal'})} className={`py-4 rounded-2xl border-2 text-[10px] font-black uppercase transition-all ${signupForm.city === 'Bhopal' ? 'border-[#d9ff00] text-[#d9ff00]' : 'border-white/5 text-gray-500'}`}>Bhopal Hub</button>
                  <button type="button" onClick={() => setSignupForm({...signupForm, city: 'Indore'})} className={`py-4 rounded-2xl border-2 text-[10px] font-black uppercase transition-all ${signupForm.city === 'Indore' ? 'border-[#d9ff00] text-[#d9ff00]' : 'border-white/5 text-gray-500'}`}>Indore Hub</button>
                </div>
                <input type="password" placeholder="Passphrase" required value={signupForm.password} onChange={e => setSignupForm({...signupForm, password: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00]" />
                <input type="password" placeholder="Confirm Passphrase" required value={signupForm.confirmPassword} onChange={e => setSignupForm({...signupForm, confirmPassword: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9ff00]" />
                <button type="submit" className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Join Collective</button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                <input type="tel" placeholder="WhatsApp Number" required value={loginPhone} onChange={e => setLoginPhone(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00]" />
                <input type="password" placeholder="Passphrase" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00]" />
                <button type="submit" className="w-full bg-[#d9ff00] text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Link ID</button>
              </form>
            )}
          </motion.div>
        </section>
      ) : (
        <>
          <header className="relative h-[90svh] flex flex-col items-center justify-center text-center px-4 pt-10">
            <GradientText text="RUN THE" as="h1" className="text-[12vw] leading-[0.9] font-black uppercase" />
            <GradientText text="RAVE" as="h1" className="text-[12vw] leading-[0.9] font-black uppercase text-[#d9ff00]" />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-gray-500 font-black uppercase tracking-[0.4rem] text-[10px] md:text-xs">Bhopal • Indore • Weekend Collective</motion.p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <a href="#events" className="bg-[#d9ff00] text-black px-12 py-5 font-black uppercase tracking-widest text-xs rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all">Link Experience</a>
              <button onClick={() => syncHub()} className="border border-white/10 px-8 py-5 font-black uppercase tracking-widest text-xs backdrop-blur-md rounded-xl flex items-center gap-3 hover:bg-white/5 transition-all">
                <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} /> Sync Hub
              </button>
            </div>
          </header>

          <section id="events" className="py-40 px-6 max-w-7xl mx-auto scroll-mt-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20">
              <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Live <span className="text-[#d9ff00]">Nodes</span></h2>
              <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-white/5">
                {['Bhopal', 'Indore'].map(c => (<button key={c} className="px-8 py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">{c}</button>))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {events.map((run) => (
                <motion.div key={run.id} whileHover={{ y: -10 }} className="bg-zinc-900 border border-white/5 overflow-hidden flex flex-col rounded-[3rem] shadow-2xl">
                  <div className="relative h-80">
                    <img src={run.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    <div className="absolute top-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black tracking-widest uppercase">{run.city} Hub</div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col">
                    <h3 className="text-3xl font-black uppercase mb-6 leading-none tracking-tighter">{run.title}</h3>
                    <div className="space-y-4 mb-10 text-xs font-black uppercase tracking-widest text-gray-500">
                      <div className="flex items-center gap-3"><Flag size={14} className="text-[#d9ff00]" /> {run.meetingPoint}</div>
                      <div className="flex items-center gap-3"><Music size={14} className="text-fuchsia-500" /> {run.raveLocation}</div>
                    </div>
                    <button onClick={() => { setSelectedRunToJoin(run); setShowTermsModal(true); }} className="mt-auto w-full py-6 bg-[#d9ff00] text-black font-black uppercase rounded-2xl text-[11px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">Secure Entry Pass</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="tickets" className="py-40 px-6 bg-black/40 scroll-mt-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-24">
                <h2 className="text-5xl font-black uppercase tracking-tighter">Active <span className="text-[#d9ff00]">Passes</span></h2>
                <p className="text-gray-600 font-bold uppercase tracking-[0.5rem] text-[10px] mt-4">Authorized collective credentials</p>
              </div>
              <div className="grid grid-cols-1 gap-12">
                {currentUserTickets.map(t => <TicketCard key={t.id} ticket={t} events={events} />)}
                {currentUserTickets.length === 0 && <div className="text-center py-20 text-gray-800 font-black uppercase text-xs border-2 border-dashed border-white/5 rounded-[3rem] tracking-widest">No active sessions linked to your node.</div>}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Admin Dashboard Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-[#09090b] border border-white/10 p-8 md:p-12 rounded-[4rem] min-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#d9ff00] rounded-2xl flex items-center justify-center"><Lock size={24} className="text-black" /></div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Admin Secure Terminal</h3>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                       <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">System Link: {isSyncing ? 'Syncing Hub...' : 'Verified Live'}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setIsAdminOpen(false); stopScanner(); }} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X size={24} /></button>
              </div>

              {!isAuth ? (
                <div className="max-w-md mx-auto w-full space-y-8 py-32 text-center">
                  <h4 className="text-xl font-black uppercase tracking-widest text-gray-500">Security Authorization</h4>
                  <input type="password" placeholder="Enter Admin Token" className="w-full bg-black border border-white/10 p-8 rounded-3xl text-center text-4xl font-mono tracking-widest focus:border-[#d9ff00] outline-none" value={adminPass} onChange={e => setAdminPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdminAuth()} />
                  <button onClick={handleAdminAuth} className="w-full bg-[#d9ff00] text-black py-7 rounded-2xl font-black uppercase tracking-widest">Initialize Admin Uplink</button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex gap-4 mb-10 shrink-0">
                    {[
                      { id: 'records', label: 'Directory', icon: <Database size={14} /> },
                      { id: 'scanner', label: 'Auto-Scanner', icon: <Scan size={14} /> },
                      { id: 'sessions', label: 'Session Hub', icon: <CalendarIcon size={14} /> }
                    ].map(t => (
                      <button key={t.id} onClick={() => { setAdminTab(t.id as any); if(t.id !== 'scanner') stopScanner(); }} className={`flex-1 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${adminTab === t.id ? 'bg-[#d9ff00] text-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                        {t.icon} {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-12">
                    {adminTab === 'records' && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-black border border-white/10 p-6 rounded-3xl mb-8">
                          <Search size={20} className="text-gray-500" />
                          <input type="text" placeholder="Search by Runner, Phone or ID..." className="bg-transparent flex-1 outline-none font-black text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                        {filteredTickets.length > 0 ? filteredTickets.map(t => (
                          <div key={t.id} className="bg-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center group gap-6 border border-transparent hover:border-white/5 transition-all">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center font-black text-[#d9ff00]">{t.runnerName.charAt(0)}</div>
                              <div>
                                <div className="font-black uppercase text-xl flex items-center gap-4">
                                  {t.runnerName} 
                                  <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-gray-500">#{t.id}</span>
                                </div>
                                <div className="text-[10px] text-gray-600 mt-2 uppercase font-black tracking-widest flex items-center gap-3">
                                  {t.runnerPhone} <div className="w-1 h-1 bg-zinc-800 rounded-full" /> {events.find(r => r.id === t.runId)?.city} Hub
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                               <button onClick={() => sendWhatsApp(t)} className="flex-1 md:flex-none p-5 bg-emerald-500/10 text-emerald-500 rounded-3xl hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-3">
                                 <MessageSquare size={20} /> <span className="md:hidden">WhatsApp</span>
                               </button>
                               <div className={`flex-1 md:flex-none px-8 py-4 rounded-3xl text-[10px] font-black uppercase border-2 transition-all ${t.checkInStatus ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                                 {t.checkInStatus ? 'Verified Entry' : 'Access Required'}
                               </div>
                               {!t.checkInStatus && (
                                 <button onClick={() => toggleVerify(t)} className="p-5 bg-[#d9ff00] text-black rounded-3xl hover:scale-110 transition-transform">
                                   <CheckCircle size={20} />
                                 </button>
                               )}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-20 text-gray-700 font-black uppercase tracking-widest border border-dashed border-white/5 rounded-3xl">Hub Directory is Empty</div>
                        )}
                      </div>
                    )}

                    {adminTab === 'scanner' && (
                      <div className="space-y-12">
                        <div className="bg-zinc-900 border border-white/5 p-12 rounded-[3.5rem] text-center relative overflow-hidden">
                          {!isCameraActive ? (
                            <button onClick={startScanner} className="w-40 h-40 bg-[#d9ff00] rounded-full flex items-center justify-center mx-auto mb-10 hover:scale-110 active:scale-90 transition-all shadow-2xl">
                              <Camera size={52} className="text-black" />
                            </button>
                          ) : (
                            <div className="relative w-full max-w-sm mx-auto aspect-square bg-black rounded-[2.5rem] overflow-hidden mb-10 border-4 border-[#d9ff00] shadow-2xl">
                              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                              <canvas ref={canvasRef} className="hidden" />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 border-2 border-[#d9ff00]/40 rounded-3xl animate-pulse" />
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-[#d9ff00] shadow-[0_0_15px_rgba(217,255,0,0.8)] animate-scan-line" />
                              </div>
                              <button onClick={stopScanner} className="absolute top-6 right-6 p-3 bg-black/60 rounded-full hover:bg-black/80"><X size={20} /></button>
                              <div className="absolute bottom-6 left-0 w-full text-center">
                                <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-[#d9ff00]">Smart Auto-Redeem Active</span>
                              </div>
                            </div>
                          )}
                          <div className="max-w-xs mx-auto">
                            <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Secure Pass Validation</h4>
                            <div className="flex gap-2 bg-black/50 p-2 rounded-2xl border border-white/10 mb-6">
                              <input 
                                type="text" 
                                placeholder="MANUAL CODE OVERRIDE..." 
                                className="bg-transparent flex-1 text-xs font-mono uppercase p-2 outline-none" 
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAutoScan((e.target as HTMLInputElement).value);
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }}
                              />
                              <button className="bg-[#d9ff00] text-black p-2 rounded-xl"><ArrowRight size={16}/></button>
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3rem]">Instant Redemption Engine</p>
                          </div>

                          <AnimatePresence>
                            {scanResult && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-10 backdrop-blur-xl ${
                                  scanResult.status === 'success' ? 'bg-emerald-500/90' : 
                                  scanResult.status === 'duplicate' ? 'bg-amber-600/95' :
                                  scanResult.status === 'error' ? 'bg-red-500/90' : 'bg-black/90'
                                }`}
                              >
                                {scanResult.status === 'success' && <CheckCircle size={100} className="text-white mb-6" />}
                                {scanResult.status === 'duplicate' && <ShieldAlert size={100} className="text-white mb-6" />}
                                {scanResult.status === 'error' && <UserX size={100} className="text-white mb-6" />}
                                {scanResult.status === 'pending' && <RefreshCcw size={100} className="text-white mb-6 animate-spin" />}
                                
                                <h5 className="text-4xl font-black uppercase text-white tracking-tighter text-center">{scanResult.msg}</h5>
                                {scanResult.name && (
                                  <p className="text-white font-black uppercase tracking-widest text-sm mt-4 bg-black/30 px-6 py-2 rounded-full">
                                    Runner: {scanResult.name}
                                  </p>
                                )}
                                {scanResult.status === 'duplicate' && (
                                  <p className="text-white/80 text-[10px] font-black uppercase mt-4 tracking-widest">Security: Ticket ID Locked & Verified</p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {adminTab === 'sessions' && (
                      <div className="space-y-8">
                         <div className="flex justify-between items-center px-4">
                           <h4 className="text-xl font-black uppercase tracking-widest text-[#d9ff00]">Managed Hubs</h4>
                           <button onClick={() => { setEditingEvent(null); setIsEventFormOpen(true); }} className="px-6 py-3 bg-[#d9ff00] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                              <Plus size={16} /> New Node
                           </button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {events.map(ev => (
                             <div key={ev.id} className="bg-zinc-900 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between group">
                                <div className="flex gap-4 items-center">
                                   <img src={ev.image} className="w-16 h-16 rounded-2xl object-cover" />
                                   <div>
                                      <h5 className="text-lg font-black uppercase truncate">{ev.title}</h5>
                                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{ev.city} Collective Hub</div>
                                   </div>
                                </div>
                                <div className="flex gap-2">
                                   <button onClick={() => { setEditingEvent(ev); setIsEventFormOpen(true); }} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Edit2 size={16} /></button>
                                   <button onClick={() => { if(confirm("Terminate this hub?")) { const updated = events.filter(e => e.id !== ev.id); setEvents(updated); localStorage.setItem('genrun_events', JSON.stringify(updated)); } }} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"><Trash2 size={16} /></button>
                                </div>
                             </div>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center shrink-0">
                    <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">Last Cloud Pulse: {new Date(lastSync).toLocaleTimeString()}</span>
                    <button onClick={() => { setIsAuth(false); setAdminPass(''); stopScanner(); }} className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><LogOut size={16} /> Secure Termination</button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Policy Modal */}
      <AnimatePresence>
        {isPolicyOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4">
            <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-4xl bg-[#09090b] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col md:flex-row h-[80vh] shadow-2xl">
              <div className="w-full md:w-64 bg-black/50 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto shrink-0 scrollbar-hide">
                {[
                  { id: 'terms', label: 'Terms', icon: <Scale size={16} /> },
                  { id: 'privacy', label: 'Privacy', icon: <Lock size={16} /> },
                  { id: 'refund', label: 'Refunds', icon: <ShieldAlert size={16} /> },
                  { id: 'shipping', label: 'Delivery', icon: <Truck size={16} /> },
                  { id: 'contact', label: 'Contact', icon: <HelpCircle size={16} /> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePolicyTab(tab.id as any)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activePolicyTab === tab.id ? 'bg-[#d9ff00] text-black shadow-lg shadow-[#d9ff00]/10' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar relative">
                <button onClick={() => setIsPolicyOpen(false)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                <div className="max-w-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePolicyTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderPolicyContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTermsModal && selectedRunToJoin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4">
            <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-[4rem] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
              <div className="bg-[#d9ff00] p-12 shrink-0 flex items-center gap-6">
                <div className="bg-black p-4 rounded-2xl shadow-xl"><Scale size={32} className="text-[#d9ff00]" /></div>
                <div>
                  <h3 className="text-4xl font-black uppercase text-black leading-none tracking-tighter">Hub Ethics</h3>
                  <p className="text-[10px] text-black/40 font-black uppercase tracking-[0.3rem] mt-2">One-Time Access Protocol</p>
                </div>
              </div>
              <div className="p-12 overflow-y-auto space-y-8 text-sm font-medium bg-black/40 custom-scrollbar">
                {TERMS_AND_CONDITIONS.map((line, i) => (
                  <div key={i} className="flex gap-8 group">
                    <span className="text-[#d9ff00] font-black text-xs h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-[#d9ff00]/10 transition-colors">{i + 1}</span>
                    <p className="text-gray-500 group-hover:text-gray-200 transition-colors leading-relaxed text-base">{line}</p>
                  </div>
                ))}
              </div>
              <div className="p-12 border-t border-white/5 bg-[#09090b] flex flex-col sm:flex-row gap-5">
                <button onClick={() => { setShowTermsModal(false); setSelectedRunToJoin(null); }} className="flex-1 py-6 border-2 border-white/5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={finalizeJoin} disabled={isProcessing} className="flex-1 py-6 bg-[#d9ff00] text-black rounded-2xl font-black uppercase text-[11px] tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                  {isProcessing ? <RefreshCcw size={20} className="animate-spin" /> : <ShieldCheck size={20} />} 
                  {isProcessing ? "SECURE UPLOAD..." : `PAY & JOIN (₹${selectedRunToJoin.basePrice})`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-40 border-t border-white/5 bg-black/60 px-6 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center justify-center gap-5 mb-16">
            <div className="w-16 h-16 bg-[#d9ff00] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#d9ff00]/20"><Trophy size={32} className="text-black" /></div>
            <span className="font-heading font-black text-white text-5xl uppercase tracking-tighter">GENRUN</span>
          </motion.div>
          <p className="text-lg max-w-3xl leading-relaxed text-gray-500 font-medium tracking-tight">Madhya Pradesh's first integrated hub for running and electronic music. One ID. One Session. One Community.</p>
          
          <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 border-y border-white/5 py-8 w-full">
            {[
              { id: 'terms', label: 'Terms' },
              { id: 'privacy', label: 'Privacy' },
              { id: 'refund', label: 'Refunds' },
              { id: 'shipping', label: 'Delivery' },
              { id: 'contact', label: 'Contact' }
            ].map(link => (
              <button 
                key={link.id}
                onClick={() => { setActivePolicyTab(link.id as any); setIsPolicyOpen(true); }}
                className="text-[9px] font-black uppercase tracking-[0.2rem] text-gray-500 hover:text-[#d9ff00] transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="mt-24 space-y-6">
            <div className="text-[10px] text-gray-900 uppercase font-black tracking-[0.8rem]">© 2025 GENRUN COLLECTIVE • PRODUCTION HUB NODE 01</div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scan-line { 0% { top: 20%; } 100% { top: 80%; } }
        .animate-scan-line { animation: scan-line 2s ease-in-out infinite alternate; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
