
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
  ChevronRight, Building2, Zap, RefreshCcw, ShieldCheck, AlertCircle
} from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import AIChat from './components/AIChat';
import { RunEvent, UserTicket, User } from './types';

// Initial Mock Data
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
    image: 'https://images.pexels.com/photos/1555351/pexels-photo-1555351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Bhopal\'s most scenic route. Feel the lake breeze as we conquer the curves of VIP road.'
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
    image: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Flat, fast, and futuristic. Join the Indore speedsters for a Saturday morning PB attempt.'
  }
];

const TERMS_AND_CONDITIONS = [
  "Be extremely Respectful & Supportive towards your fellow runners",
  "Stay hydrated & listen to your body",
  "If you feel unwell, inform the Gen Run Crew and take rest",
  "Arrive on time for scheduled runs",
  "Use of any kind of SMOKES / VAPES / substances is STRICTLY NOT PERMITTED",
  "Please take care of your belongings as GenRunClub don't take any responsibility for the same",
  "No Refunds could be provided once registered for the RunClub event.",
  "ZERO TOLERANCE POLICY against any complaints received from a female club member during the RunClub",
  "By attending this event, you agree that Gen Run Club or the event venue shall not be held responsible for any injuries, loss, or damage during the event.",
  "The run is social and non-competitive — everyone is encouraged to run/jog/walk at their own pace.",
  "Photos and videos will be captured during the event and may be used on our social platforms. If you're uncomfortable being featured, please inform the crew at the start.",
  "GenRunClub don't take any responsibility towards the damage of your vehicle during the course of event."
];

interface TicketCardProps {
  ticket: UserTicket;
  events: RunEvent[];
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, events }) => {
  const run = events.find(e => e.id === ticket.runId);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 p-6 flex flex-col md:flex-row gap-6 items-center border border-white/10 relative overflow-hidden rounded-xl"
    >
      <div className="bg-white p-2 shrink-0 rounded-lg">
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}&bgcolor=ffffff`} 
          alt="Ticket QR" 
          className="w-24 h-24"
        />
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="text-[9px] font-black text-[#d9ff00] uppercase mb-1 tracking-widest">Entry Pass</div>
        <h4 className="text-xl font-black uppercase">{run?.title || 'Community Run'}</h4>
        <p className="text-gray-500 text-[10px] font-mono mt-1 bg-black/30 px-2 py-1 inline-block rounded">ID: {ticket.id}</p>
        <div className="mt-3 flex items-center justify-center md:justify-start gap-4 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {run?.city}</span>
          <span className="flex items-center gap-1"><Timer className="w-3 h-3"/> {run?.startTime}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        {ticket.checkInStatus ? (
          <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-[9px] font-black uppercase border border-emerald-500/20 flex items-center gap-2">
            <CheckCircle className="w-3 h-3" /> Checked In
          </div>
        ) : (
          <div className="bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full text-[9px] font-black uppercase border border-amber-500/20">
            Pending
          </div>
        )}
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState(''); // Stores only the 10 digits
  const [loginCity, setLoginCity] = useState<'Bhopal' | 'Indore' | ''>('');
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'runs' | 'tickets' | 'checkin'>('runs');
  const [adminPass, setAdminPass] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  
  const [eventCityFilter, setEventCityFilter] = useState<'Bhopal' | 'Indore'>('Bhopal');
  const [checkInStatusMsg, setCheckInStatusMsg] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recentScans, setRecentScans] = useState<UserTicket[]>([]);
  
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedRunToJoin, setSelectedRunToJoin] = useState<RunEvent | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const checkInTimeoutRef = useRef<number | null>(null);
  const autoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedEvents = localStorage.getItem('stride_events');
    const savedTickets = localStorage.getItem('stride_tickets');
    const savedUser = localStorage.getItem('stride_user');
    
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    else {
      setEvents(INITIAL_RUNS);
      localStorage.setItem('stride_events', JSON.stringify(INITIAL_RUNS));
    }
    
    if (savedTickets) setUserTickets(JSON.parse(savedTickets));
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setEventCityFilter(user.city);
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setLoginPhone(val);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) {
      alert("Please enter your name!");
      return;
    }
    if (loginPhone.length !== 10) {
      alert("Please enter a valid 10-digit WhatsApp number!");
      return;
    }
    if (!loginCity) {
      alert("Please select your city!");
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: loginName.trim(),
      phone: `+91${loginPhone}`, // Automatically add +91 Indian prefix
      city: loginCity as 'Bhopal' | 'Indore'
    };
    setCurrentUser(newUser);
    setEventCityFilter(newUser.city);
    localStorage.setItem('stride_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('stride_user');
  };

  const initiateJoinRun = (run: RunEvent) => {
    if (!currentUser) {
      alert("Please sign in to join a run!");
      return;
    }
    setSelectedRunToJoin(run);
    setShowTermsModal(true);
  };

  const finalizeJoinRun = () => {
    if (!selectedRunToJoin || !currentUser) return;
    
    const ticketId = `T-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
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
    localStorage.setItem('stride_tickets', JSON.stringify(updatedTickets));
    setShowTermsModal(false);
    setSelectedRunToJoin(null);
    window.scrollTo({ top: document.getElementById('tickets')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleAdminAuth = () => {
    if (adminPass === 'run2025') {
      setIsAuth(true);
    } else {
      alert('Invalid Passkey');
    }
  };

  const addEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const city = formData.get('city') as 'Bhopal' | 'Indore';
    const distance = formData.get('distance') as string;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;

    const newEvent: RunEvent = {
      id: `run-${Date.now()}`,
      title,
      city,
      day: city === 'Bhopal' ? 'SUN' : 'SAT',
      date: date || 'TBD',
      distance: distance || '5K',
      startTime: startTime || '6:00 AM',
      location: location || 'TBD',
      description: description || 'Community organized event.',
      image: image || 'https://images.pexels.com/photos/1555351/pexels-photo-1555351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('stride_events', JSON.stringify(updatedEvents));
    e.currentTarget.reset();
    setCheckInStatusMsg({ msg: 'Event Published!', type: 'success' });
    setTimeout(() => setCheckInStatusMsg(null), 2000);
  };

  const toggleCheckIn = (ticketId: string, silent: boolean = false) => {
    const ticket = userTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const updated = userTickets.map(t => 
      t.id === ticketId ? { ...t, checkInStatus: true } : t
    );
    setUserTickets(updated);
    localStorage.setItem('stride_tickets', JSON.stringify(updated));
    
    const updatedTicket = { ...ticket, checkInStatus: true };
    setRecentScans(prev => [updatedTicket, ...prev].slice(0, 5));
    
    if (!silent) {
      setCheckInStatusMsg({ msg: `Checked in: ${ticket.runnerName}`, type: 'success' });
      if (checkInTimeoutRef.current) clearTimeout(checkInTimeoutRef.current);
      checkInTimeoutRef.current = window.setTimeout(() => setCheckInStatusMsg(null), 3000);
    }
  };

  const handleManualCheckIn = (val: string) => {
    const cleanId = val.trim().toUpperCase();
    if (cleanId.length < 3) return false;

    const t = userTickets.find(ticket => ticket.id === cleanId);
    if (t) {
      if (t.checkInStatus) {
        setCheckInStatusMsg({ msg: "Already Checked In", type: 'error' });
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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or not available.");
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

  const sendWhatsAppTicket = (ticket: UserTicket) => {
    const run = events.find(e => e.id === ticket.runId);
    if (!run) return;
    const message = `*STRIDE RUNNERS - ENTRY PASS*%0A%0AHello ${ticket.runnerName},%0AHere is your ticket for the upcoming run:%0A%0A*Event:* ${run.title}%0A*City:* ${run.city}%0A*Date:* ${run.date} (${run.day})%0A*Time:* ${run.startTime}%0A*Distance:* ${run.distance}%0A*Location:* ${run.location}%0A%0A*Ticket ID:* ${ticket.id}%0A%0ASee you at the starting line! 🏃‍♂️⚡️`;
    // Brunner phone is already formatted as +91XXXXXXXXXX
    const whatsappUrl = `https://wa.me/${ticket.runnerPhone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
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
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-6 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Trophy className="text-[#d9ff00] w-6 h-6" />
          <div className="font-heading text-xl font-black tracking-tighter text-white">STRIDE</div>
        </div>
        
        <div className="hidden md:flex gap-10 text-[10px] font-black tracking-[0.3em] uppercase items-center">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-[#d9ff00] transition-colors">Home</button>
          <a href="#events" className="hover:text-[#d9ff00] transition-colors">Runs</a>
          <a href="#tickets" className="hover:text-[#d9ff00] transition-colors">Tickets</a>
          <div className="h-4 w-px bg-white/20" />
          {currentUser ? (
            <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-400 group">
              <LogOut className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> {currentUser.name}
            </button>
          ) : (
             <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center gap-2 hover:text-[#d9ff00]">
               <UserIcon className="w-3 h-3" /> Login
             </button>
          )}
          <button onClick={() => { setIsAdminOpen(true); setAdminTab('checkin'); }} className="bg-[#d9ff00] text-black px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 transition-transform font-bold">
            <Zap className="w-4 h-4" /> Scanner
          </button>
          <button onClick={() => { setIsAdminOpen(true); setAdminTab('runs'); }} className="flex items-center gap-2 hover:text-[#d9ff00]">
            <Lock className="w-3 h-3" /> Admin
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Hero / Login */}
      {!currentUser ? (
        <section className="relative min-h-screen flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl bg-zinc-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
             <div className="text-center mb-12">
              <div className="w-16 h-16 bg-[#d9ff00] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-[#d9ff00]/20">
                <Trophy className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Join the Pack</h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-3 font-bold">Madhya Pradesh Elite Running Community</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Your Name</label>
                  <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Full Name" required className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00] transition-colors font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">10-Digit WhatsApp No.</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-5 text-gray-400 font-bold border-r border-white/10 pr-3">+91</span>
                    <input 
                      type="tel" 
                      value={loginPhone} 
                      onChange={handlePhoneChange} 
                      placeholder="9998887770" 
                      required 
                      className="w-full bg-black border border-white/10 p-5 pl-[4.5rem] rounded-2xl outline-none focus:border-[#d9ff00] transition-colors font-medium" 
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setLoginCity('Bhopal')} className={`py-10 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${loginCity === 'Bhopal' ? 'border-[#d9ff00] bg-[#d9ff00]/5' : 'border-white/5 bg-black/50'}`}>
                  <Building2 className={`w-8 h-8 ${loginCity === 'Bhopal' ? 'text-[#d9ff00]' : 'text-gray-600'}`} />
                  <span className="font-black uppercase tracking-widest text-sm">Bhopal</span>
                </button>
                <button type="button" onClick={() => setLoginCity('Indore')} className={`py-10 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${loginCity === 'Indore' ? 'border-[#d9ff00] bg-[#d9ff00]/5' : 'border-white/5 bg-black/50'}`}>
                  <Map className={`w-8 h-8 ${loginCity === 'Indore' ? 'text-[#d9ff00]' : 'text-gray-600'}`} />
                  <span className="font-black uppercase tracking-widest text-sm">Indore</span>
                </button>
              </div>
              <button type="submit" className="w-full bg-[#d9ff00] text-black py-6 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">Start Running <ArrowRight className="w-5 h-5" /></button>
            </form>
          </motion.div>
        </section>
      ) : (
        <>
          <header className="relative h-[90svh] flex flex-col items-center justify-center text-center px-4 pt-20">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="px-6 py-2 bg-zinc-900 border border-[#d9ff00]/30 rounded-full flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#d9ff00] rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Welcome, {currentUser.name} from {currentUser.city}</span>
                </div>
              </div>
              <GradientText text="RUN THE" as="h1" className="text-[12vw] md:text-[8vw] leading-[0.85] font-black uppercase" />
              <GradientText text="WEEKEND" as="h1" className="text-[12vw] md:text-[8vw] leading-[0.85] font-black uppercase text-[#d9ff00]" />
              <div className="mt-12 flex flex-wrap gap-4 justify-center">
                <a href="#events" className="bg-[#d9ff00] text-black px-12 py-5 font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-[#d9ff00]/10">Browse Events</a>
                <button onClick={() => { setIsAdminOpen(true); setAdminTab('runs'); }} className="border border-white/10 px-12 py-5 font-black uppercase tracking-widest text-xs backdrop-blur-md rounded-xl">Host Event</button>
              </div>
            </motion.div>
          </header>

          <section id="events" className="py-32 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-12">
              <h2 className="text-5xl md:text-7xl font-heading font-black uppercase leading-none mb-6">Explore <br/><span className="text-[#d9ff00]">Sprints</span></h2>
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
                    <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-lg border border-white/10">{run.city}</div>
                    <div className="absolute bottom-6 right-6 bg-[#d9ff00] text-black px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-lg shadow-lg">{run.distance}</div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4"><Calendar className="w-4 h-4 text-[#d9ff00]" /> {run.day} • {run.date}</div>
                    <h3 className="text-2xl font-black uppercase leading-tight mb-4 group-hover:text-[#d9ff00] transition-colors">{run.title}</h3>
                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 line-clamp-3">{run.description}</p>
                    <button onClick={() => initiateJoinRun(run)} className="mt-auto w-full py-5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#d9ff00] hover:text-black transition-all rounded-2xl flex items-center justify-center gap-3">Secure Entry <ChevronRight className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="tickets" className="py-32 px-6 bg-black/40 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-24">
                <span className="text-[#d9ff00] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Runner Dashboard</span>
                <h2 className="text-4xl md:text-6xl font-black uppercase">Active <span className="text-[#d9ff00]">Passes</span></h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {['Bhopal', 'Indore'].map(city => (
                  <div key={city} className="space-y-8">
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5"><MapPin className="text-[#d9ff00] w-6 h-6" /></div>
                        <h3 className="text-xl font-black uppercase tracking-tighter">{city}</h3>
                      </div>
                    </div>
                    {ticketsByCity(city).map(ticket => <TicketCard key={ticket.id} ticket={ticket} events={events} />)}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Admin Panel */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 p-6 md:p-10 my-auto shadow-2xl rounded-[3rem] min-h-[70vh] flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black rounded-xl border border-white/5"><Lock className="text-[#d9ff00] w-6 h-6" /></div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Terminal</h3>
                </div>
                <button onClick={() => { setIsAdminOpen(false); setIsAuth(false); stopCamera(); }} className="hover:rotate-90 transition-transform p-3 bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
              </div>

              {!isAuth ? (
                <div className="space-y-8 py-10 max-w-md mx-auto w-full">
                  <input type="password" placeholder="ACCESS KEY" autoFocus className="w-full bg-black border border-white/10 p-6 text-white font-mono text-center text-2xl focus:border-[#d9ff00] outline-none rounded-2xl tracking-widest" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()} />
                  <button onClick={handleAdminAuth} className="w-full bg-[#d9ff00] text-black py-6 rounded-2xl font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all text-sm">Authenticate</button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex gap-2 p-1.5 bg-black rounded-[1.2rem] mb-12 overflow-x-auto border border-white/5">
                    {['checkin', 'tickets', 'runs'].map(tab => (
                      <button key={tab} onClick={() => { setAdminTab(tab as any); stopCamera(); }} className={`flex-1 py-4 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${adminTab === tab ? 'bg-[#d9ff00] text-black' : 'text-gray-500 hover:text-white'}`}>
                        {tab === 'checkin' ? <Zap className="w-4 h-4" /> : tab === 'tickets' ? <ClipboardList className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {adminTab === 'checkin' ? (
                      <div className="space-y-10 relative">
                        <AnimatePresence>
                          {checkInStatusMsg && (
                            <motion.div initial={{ opacity: 0, scale: 0.8, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] px-12 py-8 rounded-[2rem] border-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 backdrop-blur-xl ${checkInStatusMsg.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-red-500 border-red-400 text-white'}`}>
                               {checkInStatusMsg.type === 'success' ? <CheckCircle className="w-16 h-16" /> : <AlertCircle className="w-16 h-16" />}
                               <span className="font-black uppercase tracking-widest text-xl">{checkInStatusMsg.msg}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="bg-[#d9ff00] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                          {isCameraActive && (
                             <div className="absolute inset-0 z-10 bg-black">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 border-2 border-[#d9ff00] m-10 rounded-3xl animate-pulse flex items-center justify-center"><div className="w-full h-0.5 bg-[#d9ff00] absolute animate-scan" /></div>
                                <button onClick={stopCamera} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[10px]">Stop Camera</button>
                             </div>
                          )}
                          <div className="flex justify-between items-center mb-6">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">Auto-Terminal v2.0</h4>
                             {!isCameraActive && <button onClick={startCamera} className="bg-black text-[#d9ff00] px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><Camera className="w-4 h-4" /> Start Camera</button>}
                          </div>
                          <div className="flex flex-col md:flex-row gap-6">
                            <input ref={autoInputRef} type="text" placeholder="READY FOR SCAN..." className="flex-1 bg-black/10 border-2 border-black/10 p-6 outline-none rounded-3xl text-black font-mono font-bold text-xl placeholder-black/30" autoFocus onChange={(e) => {
                                if (handleManualCheckIn(e.target.value)) {
                                   e.target.value = '';
                                }
                              }} />
                            <div className="bg-black text-[#d9ff00] px-12 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"><RefreshCcw className="w-4 h-4 animate-spin-slow" /> Automatic</div>
                          </div>
                        </div>

                        {/* Recent Scans Log */}
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Recently Verified</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {recentScans.map(t => (
                               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={t.id + Math.random()} className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-black uppercase text-emerald-400">{t.runnerName}</div>
                                    <div className="text-[9px] text-gray-600 font-mono">{t.id}</div>
                                  </div>
                                  <CheckCircle className="text-emerald-500 w-5 h-5" />
                               </motion.div>
                             ))}
                             {recentScans.length === 0 && <div className="col-span-full py-10 text-center text-gray-700 uppercase font-black tracking-widest text-[10px]">Waiting for scans...</div>}
                          </div>
                        </div>
                      </div>
                    ) : adminTab === 'runs' ? (
                       <form onSubmit={addEvent} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                        <input name="title" required placeholder="Event Title" className="md:col-span-2 w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00]" />
                        <select name="city" required className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00] appearance-none">
                          <option value="Bhopal">Bhopal</option>
                          <option value="Indore">Indore</option>
                        </select>
                        <input name="distance" required placeholder="Distance (e.g. 10K)" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00]" />
                        <input name="date" required placeholder="Date (e.g. OCT 26)" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00]" />
                        <input name="startTime" required placeholder="Time (e.g. 6:00 AM)" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00]" />
                        <textarea name="description" required rows={3} placeholder="Description..." className="md:col-span-2 w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9ff00] resize-none"></textarea>
                        <button type="submit" className="md:col-span-2 bg-[#d9ff00] text-black py-6 rounded-2xl font-black uppercase tracking-[0.3em] hover:scale-[1.01] transition-all">Publish Event</button>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {userTickets.map((ticket) => (
                          <div key={ticket.id} className="bg-black/50 border border-white/5 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-[#d9ff00]/20 transition-all">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                              <div className="w-16 h-16 bg-[#d9ff00]/5 rounded-2xl flex items-center justify-center text-[#d9ff00] font-black text-xl border border-[#d9ff00]/10">{ticket.runnerName.charAt(0)}</div>
                              <div className="min-w-0">
                                <div className="text-lg font-black uppercase truncate group-hover:text-[#d9ff00]">{ticket.runnerName}</div>
                                <div className="text-[9px] text-gray-600 font-mono mt-1 tracking-widest">{ticket.id} • {ticket.runnerPhone}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                              <button onClick={() => sendWhatsAppTicket(ticket)} className="p-5 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest border border-emerald-500/10"><MessageCircle className="w-5 h-5" /> Push Ticket</button>
                              <div className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${ticket.checkInStatus ? 'bg-[#d9ff00]/10 text-[#d9ff00] border-[#d9ff00]/20' : 'bg-gray-500/10 text-gray-500 border-white/5'}`}>{ticket.checkInStatus ? 'Verified' : 'Pending'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-gray-600">
                    <button type="button" onClick={() => { setIsAuth(false); setAdminPass(''); stopCamera(); }} className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"><LogOut className="w-5 h-5" /> Terminate Session</button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {showTermsModal && selectedRunToJoin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="bg-[#d9ff00] p-8">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="text-black w-6 h-6" />
                  <h3 className="text-2xl font-black uppercase text-black tracking-tighter">Guidelines & Safety</h3>
                </div>
                <p className="text-black/60 text-[10px] font-black uppercase tracking-widest">Mandatory Agreement for {selectedRunToJoin.title}</p>
              </div>
              <div className="p-8 overflow-y-auto space-y-4 text-sm font-medium leading-relaxed custom-scrollbar bg-black/20">
                {TERMS_AND_CONDITIONS.map((line, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="text-[#d9ff00] font-black text-xs pt-1">{i + 1}.</span>
                    <p className="text-gray-300 group-hover:text-white transition-colors">{line}</p>
                  </div>
                ))}
                <div className="pt-8 text-center">
                   <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">For Queries reach out to Gen Run Crew on Whatsapp @9334220235</p>
                </div>
              </div>
              <div className="p-8 border-t border-white/5 bg-zinc-900 flex flex-col md:flex-row gap-4">
                <button onClick={() => { setShowTermsModal(false); setSelectedRunToJoin(null); }} className="flex-1 py-5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">Decline</button>
                <button onClick={finalizeJoinRun} className="flex-1 py-5 bg-[#d9ff00] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all">I Accept & Agree</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-24 border-t border-white/5 text-center text-gray-600 px-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2 bg-white/5 rounded-lg"><Trophy className="w-5 h-5 text-[#d9ff00]" /></div>
          <span className="font-heading font-bold text-white text-xl tracking-tighter">STRIDE</span>
        </div>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Support & Queries</p>
          <a href="https://wa.me/919334220235" target="_blank" className="inline-flex items-center gap-2 bg-[#d9ff00]/10 text-[#d9ff00] px-4 py-2 rounded-full border border-[#d9ff00]/20 hover:bg-[#d9ff00]/20 transition-all font-bold text-sm">
            <MessageCircle className="w-4 h-4" /> Whatsapp @+91 9334220235
          </a>
        </div>
        <p className="text-sm max-w-xl mx-auto leading-relaxed font-light text-gray-500 mb-8">The ultimate platform for Madhya Pradesh's weekend running culture. Join the pack and redefine your limits.</p>
        <div className="text-[10px] text-gray-800 uppercase tracking-widest font-black">© 2025 Gen Run Club Elite</div>
      </footer>

      <style>{`
        @keyframes scan { 0% { top: 10%; } 100% { top: 90%; } }
        .animate-scan { animation: scan 2s linear infinite; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default App;
