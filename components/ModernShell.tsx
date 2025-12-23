'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Cpu, ChevronRight, LayoutDashboard, 
  BookOpen, CheckSquare, Code, Map, 
  TrendingUp, MessageSquare, Brain, Zap,
  Gamepad2, Film, ShoppingBag, UtensilsCrossed,
  Video, Calendar, Activity, GraduationCap,
  DollarSign, TrendingDown, Clock, Users
} from 'lucide-react';

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
          <span className={`${theme.accent} text-[10px] tracking-[0.8em] font-bold block mb-2`}>NAVIGATING SYSTEM</span>
          <span className="text-white/20 text-[8px] tracking-[0.4em]">LOADING MODULE // 2.0</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function ModernShell({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [userName, setUserName] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (user && user.displayName) {
      setUserName(user.displayName);
    } else if (user && user.email) {
      setUserName(user.email.split('@')[0]);
    }
  }, [user]);

  useEffect(() => {
    // Simulate initial boot sequence
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show animation on route change
    if (prevPathname.current !== pathname) {
      setIsNavigating(false);
    }
    prevPathname.current = pathname;
  }, [pathname]);

  const handleLinkClick = (href: string) => {
    if (pathname === href) return;
    setIsNavigating(true);
    setTimeout(() => {
      router.push(href);
    }, 600);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'mood', label: 'Mood Check', icon: Brain, href: '/companion?tab=questionnaire' },
    { id: 'chatbot', label: 'AI Assistant', icon: MessageSquare, href: '/companion?tab=chatbot' },
    { id: 'academics', label: 'Academics', icon: BookOpen, href: '/academics' },
    { id: 'internships', label: 'Internships', icon: Zap, href: '/internships' },
    { id: 'travel', label: 'Travel', icon: Map, href: '/travel' },
    { id: 'events', label: 'Events', icon: Calendar, href: '/events' },
    { id: 'games', label: 'Games', icon: Gamepad2, href: '/games' },
    { id: 'movies', label: 'Movies', icon: Film, href: '/movies' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, href: '/shopping' },
    { id: 'snacks', label: 'Snacks', icon: UtensilsCrossed, href: '/snacks' },
    { id: 'community', label: 'Community', icon: Users, href: '/community' },
    { id: 'videocall', label: 'Video Call', icon: Video, href: '/videocall' },
    { id: 'todo', label: 'Todo List', icon: CheckSquare, href: '/todo' },
    { id: 'attendance', label: 'Attendance', icon: Clock, href: '/attendance' },
    { id: 'tracker', label: 'Habit Tracker', icon: Activity, href: '/tracker' },
    { id: 'learning', label: 'Learning', icon: GraduationCap, href: '/learning' },
    { id: 'money', label: 'Money Manager', icon: DollarSign, href: '/money' },
    { id: 'stocks', label: 'Stock Market', icon: TrendingDown, href: '/stocks' },
  ];

  return (
    <div className={`fixed inset-0 ${theme.bg} text-slate-100 overflow-hidden font-sans`}>
      <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${theme.grid} bg-[size:60px_60px] z-0`} />
      
      <SciFiArcReactor isVisible={loading || isNavigating} />

      {!loading && (
        <>
          <header className={`fixed top-0 left-0 right-0 h-16 z-[60] px-8 flex items-center justify-between border-b ${theme.border} ${theme.panel} backdrop-blur-xl`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 bg-indigo-500 rounded-lg ${theme.glow} overflow-hidden`}>
                <img 
                  src="/icons/iconsage.png" 
                  alt="Sage" 
                  className="w-5 h-5 drop-shadow-lg filter brightness-110 contrast-125 invert"
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] font-mono text-indigo-400 font-bold tracking-[0.4em] uppercase`}>Sage</span>
                <span className="text-[8px] font-mono text-indigo-400/70 uppercase tracking-widest">{userName || 'Account'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
               <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">Session Active</span>
            </div>
          </header>

          <aside className={`fixed left-4 top-20 bottom-12 z-[50] transition-all duration-500 rounded-2xl ${theme.panel} border ${theme.border} ${isSidebarOpen ? 'w-64' : 'w-16'} backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden`}>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="h-16 flex items-center justify-center border-b border-white/5 hover:bg-white/5">
              <motion.div animate={{ rotate: isSidebarOpen ? 180 : 0 }}><ChevronRight size={18} className="text-indigo-400" /></motion.div>
            </button>
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.href)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative ${isActive ? `bg-indigo-500/10 text-indigo-400` : 'text-slate-500 hover:text-white'}`}
                  >
                    <item.icon size={18} />
                    {isSidebarOpen && <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className={`relative h-full pt-20 pb-12 transition-all duration-500 z-10 ${isSidebarOpen ? 'pl-72' : 'pl-24'} pr-8`}>
            <div className="h-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar py-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={pathname} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <footer className={`fixed bottom-0 left-0 right-0 h-8 z-[60] ${theme.panel} border-t ${theme.border} backdrop-blur-md flex items-center justify-between px-8`}>
             <span className={`text-[8px] font-mono text-indigo-400 opacity-40 uppercase tracking-[0.3em]`}>System_Stable</span>
             <span className="text-[8px] font-mono text-slate-700 uppercase tracking-[0.5em]">Nightshade Protocol // 2025</span>
          </footer>
        </>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(129, 140, 248, 0.2); }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
