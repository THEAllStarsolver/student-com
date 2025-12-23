'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  Cpu, Terminal, ChevronRight, LayoutDashboard, 
  BookOpen, CheckSquare, Code, Map, 
  TrendingUp, MessageSquare, 
  Radar, Navigation, Plane
} from 'lucide-react';
import { auth } from '@/lib/firebase'; // Use existing firebase init

// --- THEME (LOCKED TO NIGHTSHADE) ---
const theme = {
  name: "Nightshade Protocol",
  bg: 'bg-[#050508]',
  panel: 'bg-[#0a0a15]/90',
  border: 'border-[#1a1a2e]',
  accent: 'text-indigo-400',
  accentFill: 'fill-indigo-400',
  accentStroke: 'stroke-indigo-500',
  glow: 'shadow-[0_0_25px_rgba(129,140,248,0.4)]',
  coreGlow: 'shadow-[0_0_50px_rgba(129,140,248,0.8)]',
  grid: 'bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]',
};

// --- COMPONENTS ---

const SciFiArcReactor = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ 
          scale: 12,
          filter: 'blur(80px)',
          opacity: 0,
          transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] } 
        }}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${theme.bg}`}
      >
        <div className="relative w-80 h-80 flex items-center justify-center">
          {/* Layered Spinners */}
          {[10, 6, 3].map((dur, i) => (
            <motion.div
              key={i}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
              className={`absolute border border-indigo-500/20 rounded-full`}
              style={{ inset: i * 20 }}
            />
          ))}
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-20 border-2 ${theme.accent} rounded-full flex items-center justify-center ${theme.glow}`}
          >
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`absolute w-0.5 h-6 bg-indigo-400 top-0 origin-[0_40px]`} style={{ transform: `rotate(${i * 30}deg)` }} />
            ))}
          </motion.div>

          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: ["0 0 20px #818cf8", "0 0 60px #818cf8", "0 0 20px #818cf8"]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-white z-10 flex items-center justify-center"
          >
             <div className="w-12 h-12 rounded-full bg-indigo-500 mix-blend-overlay animate-pulse" />
          </motion.div>
        </div>
        <div className="mt-12 font-mono text-center">
          <span className={`${theme.accent} text-[10px] tracking-[0.8em] font-bold block mb-2`}>INITIALIZING MARKS</span>
          <span className="text-white/20 text-[8px] tracking-[0.4em]">STARK NEURAL LINK // 2.0</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const AnimatedIronManHUD = () => (
  <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <div className="relative w-[600px] h-[600px]">
      {/* Rotating Data Ring */}
      <motion.svg 
        animate={{ rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="95" stroke="#818cf8" strokeWidth="0.5" fill="none" strokeDasharray="1 4" />
      </motion.svg>

      {/* The Face HUD */}
      <svg viewBox="0 0 200 240" className={`w-full h-full stroke-indigo-500/30 stroke-[0.4] fill-none`}>
        <motion.path 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3 }}
          d="M40,60 Q100,20 160,60 L170,110 L155,180 L100,210 L45,180 L30,110 Z" 
        />
        {/* Breathing Eyes */}
        <motion.path 
          animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          d="M55,100 L90,100 L85,115 L55,115 Z" className="fill-indigo-500/20" 
        />
        <motion.path 
          animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          d="M110,100 L145,100 L145,115 L115,115 Z" className="fill-indigo-500/20" 
        />
      </svg>
    </div>
  </motion.div>
);

const TravelPage = () => (
  <div className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-black/40 border border-indigo-500/10">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#1e1b4b_0%,transparent_70%)]" />
    
    {/* Plane Animation */}
    <motion.div 
      initial={{ x: -100, y: 100, rotate: 0, opacity: 0 }}
      animate={{ 
        x: [ -100, 0, 400, 800 ],
        y: [ 100, 50, -100, -300 ],
        rotate: [ -10, -20, -15, -10 ],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute z-20"
    >
      <Plane size={48} className="text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
    </motion.div>

    {/* Landing Plane */}
    <motion.div 
      initial={{ x: 800, y: -200, rotate: 20, opacity: 0 }}
      animate={{ 
        x: [ 800, 400, 0, -200 ],
        y: [ -200, -50, 100, 150 ],
        rotate: [ 20, 15, 10, 5 ],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ duration: 8, repeat: Infinity, delay: 4, ease: "easeInOut" }}
      className="absolute z-20"
    >
      <Plane size={48} className="text-indigo-600 scale-x-[-1] blur-[1px]" />
    </motion.div>

    <div className="z-10 text-center space-y-6">
      <div className="flex justify-center gap-12">
        <div className="flex flex-col items-center">
          <Radar className="text-indigo-500 animate-spin-slow mb-2" />
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Global Radar</span>
        </div>
        <div className="flex flex-col items-center">
          <Navigation className="text-indigo-500 animate-pulse mb-2" />
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Auto-Pilot</span>
        </div>
      </div>
      <h2 className="text-3xl font-black text-white tracking-widest uppercase italic">Flight Logistics</h2>
      <p className="text-indigo-300/50 font-mono text-[10px] uppercase">Tracking Stark Jet tail #Mark-85</p>
    </div>
  </div>
);

const Dashboard = ({ user }: { user: User | null }) => (
  <div className="relative space-y-8 min-h-[70vh] flex flex-col justify-center">
    <AnimatedIronManHUD />
    <div className="relative z-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-8 h-1 bg-indigo-500`} />
          <span className={`text-indigo-400 font-mono text-[10px] tracking-[0.5em] uppercase font-bold`}>Protocol Engaged</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter uppercase text-white">
          GREETINGS <span className="text-indigo-400">{user?.displayName?.split(' ')[0] || 'STARK'}</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {[
          { label: 'Neural Link', value: 'SYNCED', status: 'STABLE' },
          { label: 'Satellite', value: '4/4', status: 'LOCKED' },
          { label: 'Threat Level', value: 'LOW', status: 'CLEAR' }
        ].map((stat) => (
          <div key={stat.label} className={`backdrop-blur-xl bg-white/5 border ${theme.border} rounded-xl p-6 hover:bg-indigo-500/5 transition-all group`}>
            <p className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors">{stat.value}</h3>
              <span className={`text-indigo-400 text-[9px] font-mono font-bold tracking-tighter`}>{stat.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function StarkInterface() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a custom token passed from server (not applicable in this client-side only demo, but kept for structure)
        // For now, we just listen to auth state
      } catch (err) { console.error(err); }
    };
    initAuth();
    
    if (!auth) return;

    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Simulate "boot up" sequence
      setTimeout(() => setLoading(false), 2500);
    });
  }, []);

  const handleNav = (id: string) => {
    if (id === activeTab) return;
    setIsNavigating(true);
    setTimeout(() => {
      setActiveTab(id);
      setIsNavigating(false);
    }, 1500); 
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'todo', label: 'Tasks', icon: CheckSquare },
    { id: 'coding', label: 'Dev Hub', icon: Code },
    { id: 'travel', label: 'Logistics', icon: Map },
    { id: 'money', label: 'Finance', icon: TrendingUp },
    { id: 'community', label: 'Network', icon: MessageSquare },
  ];

  return (
    <div className={`fixed inset-0 ${theme.bg} text-slate-100 overflow-hidden font-sans`}>
      <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${theme.grid} bg-[size:60px_60px] z-0`} />
      
      <SciFiArcReactor isVisible={loading || isNavigating} />

      {!loading && (
        <>
          <header className={`fixed top-0 left-0 right-0 h-16 z-[60] px-8 flex items-center justify-between border-b ${theme.border} ${theme.panel} backdrop-blur-xl`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 bg-indigo-500 rounded-lg ${theme.glow}`}>
                <Cpu size={20} className="text-black" />
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] font-mono text-indigo-400 font-bold tracking-[0.4em] uppercase`}>Stark_OS</span>
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Protocol: Nightshade</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
               <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">Encrypted Session</span>
            </div>
          </header>

          <aside className={`fixed left-4 top-20 bottom-12 z-[50] transition-all duration-500 rounded-2xl ${theme.panel} border ${theme.border} ${isSidebarOpen ? 'w-64' : 'w-16'} backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden`}>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="h-16 flex items-center justify-center border-b border-white/5 hover:bg-white/5">
              <motion.div animate={{ rotate: isSidebarOpen ? 180 : 0 }}><ChevronRight size={18} className="text-indigo-400" /></motion.div>
            </button>
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
              {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => handleNav(item.id)} 
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative ${activeTab === item.id ? `bg-indigo-500/10 text-indigo-400` : 'text-slate-500 hover:text-white'}`}
                >
                  <item.icon size={18} />
                  {isSidebarOpen && <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold">{item.label}</span>}
                </button>
              ))}
            </nav>
          </aside>

          <main className={`relative h-full pt-20 pb-12 transition-all duration-500 z-10 ${isSidebarOpen ? 'pl-72' : 'pl-24'} pr-8`}>
            <div className="h-full max-w-6xl mx-auto overflow-y-auto custom-scrollbar py-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                >
                  {activeTab === 'dashboard' ? <Dashboard user={user} /> : 
                   activeTab === 'travel' ? <TravelPage /> : (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                      <Terminal size={80} className={`text-indigo-400 opacity-5 mb-8`} />
                      <h2 className={`text-2xl font-mono text-indigo-400 tracking-[0.5em] uppercase`}>Module_{activeTab}</h2>
                      <div className={`h-1 w-24 mt-4 bg-indigo-500 opacity-20`} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <footer className={`fixed bottom-0 left-0 right-0 h-8 z-[60] ${theme.panel} border-t ${theme.border} backdrop-blur-md flex items-center justify-between px-8`}>
             <span className={`text-[8px] font-mono text-indigo-400 opacity-40 uppercase tracking-[0.3em]`}>Neural_Link_Stable</span>
             <span className="text-[8px] font-mono text-slate-700 uppercase tracking-[0.5em]">Nightshade Protocol // 2025</span>
          </footer>
        </>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(129, 140, 248, 0.2); }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
