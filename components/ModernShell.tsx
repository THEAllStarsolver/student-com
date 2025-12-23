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
  DollarSign, TrendingDown, Clock, Users, ChevronDown,
  Sun, Moon, LogOut
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
  const { user, loading: authLoading, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
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

  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    CORE: true,
    PRODUCTIVITY: true,
    LEARNING: false,
    TOOLS: false,
    COMMERCE: false,
    FINANCE: false,
    SOCIAL: false,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleLogout = async () => {
    setIsNavigating(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsNavigating(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Theme switching logic can be added here
  };

  const navCategories = {
    CORE: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { id: 'mood', label: 'Mood Check', icon: Brain, href: '/companion?tab=questionnaire' },
      { id: 'chatbot', label: 'AI Assistant', icon: MessageSquare, href: '/companion?tab=chatbot' },
      { id: 'videocall', label: 'Video Call', icon: Video, href: '/videocall' },
    ],
    PRODUCTIVITY: [
      { id: 'todo', label: 'Todo List', icon: CheckSquare, href: '/todo' },
      { id: 'attendance', label: 'Attendance', icon: Clock, href: '/attendance' },
      { id: 'tracker', label: 'Habit Tracker', icon: Activity, href: '/tracker' },
      { id: 'academics', label: 'Academics', icon: BookOpen, href: '/academics' },
    ],
    LEARNING: [
      { id: 'learning', label: 'Learning Hub', icon: GraduationCap, href: '/learning' },
      { id: 'coding', label: 'Coding', icon: Code, href: '/coding' },
    ],
    TOOLS: [
      { id: 'games', label: 'Games', icon: Gamepad2, href: '/games' },
      { id: 'travel', label: 'Travel', icon: Map, href: '/travel' },
      { id: 'events', label: 'Events', icon: Calendar, href: '/events' },
      { id: 'internships', label: 'Internships', icon: Zap, href: '/internships' },
    ],
    COMMERCE: [
      { id: 'shopping', label: 'Shopping', icon: ShoppingBag, href: '/shopping' },
      { id: 'snacks', label: 'Snacks', icon: UtensilsCrossed, href: '/snacks' },
    ],
    FINANCE: [
      { id: 'money', label: 'Money Manager', icon: DollarSign, href: '/money' },
      { id: 'stocks', label: 'Stock Market', icon: TrendingDown, href: '/stocks' },
    ],
    SOCIAL: [
      { id: 'community', label: 'Community', icon: Users, href: '/community' },
      { id: 'movies', label: 'Movies', icon: Film, href: '/movies' },
    ],
  };

  return (
    <div className={`fixed inset-0 ${theme.bg} text-slate-100 overflow-hidden font-sans`}>
      <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${theme.grid} bg-[size:60px_60px] z-0`} />
      
      <SciFiArcReactor isVisible={loading || isNavigating} />

      {!loading && (
        <>
          <header className={`fixed top-0 left-0 right-0 h-20 z-[60] px-8 flex items-center justify-between border-b ${theme.border} ${theme.panel} backdrop-blur-xl`}>
            <div className="flex items-center gap-4">
              <img 
                src="/icons/iconsage.png" 
                alt="Sage" 
                className="w-8 h-8 drop-shadow-lg filter brightness-110 contrast-125 invert"
              />
              <div className="flex flex-col">
                <span className={`text-lg font-sans font-black text-indigo-300 tracking-wider uppercase`}>Sage</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
               <span className="text-sm font-sans font-semibold text-indigo-400 uppercase tracking-wider">Session Active</span>
            </div>
          </header>

          <aside className={`fixed left-4 top-24 bottom-12 z-[50] transition-all duration-500 rounded-2xl ${theme.panel} border ${theme.border} ${isSidebarOpen ? 'w-72' : 'w-16'} backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden`}>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="h-16 flex items-center justify-center border-b border-white/5 hover:bg-white/5">
              <motion.div animate={{ rotate: isSidebarOpen ? 180 : 0 }}><ChevronRight size={22} className="text-indigo-400" /></motion.div>
            </button>
            <nav className="flex-1 py-6 px-3 overflow-y-auto custom-scrollbar">
              {isSidebarOpen ? (
                /* Categories View */
                Object.entries(navCategories).map(([category, items]) => (
                  <div key={category} className="mb-6">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between px-3 py-2 mb-2 rounded-lg hover:bg-indigo-500/10 transition-colors"
                    >
                      <span className="text-sm font-bold uppercase tracking-wider text-indigo-400/70">
                        {category}
                      </span>
                      <motion.div
                        animate={{ rotate: expandedCategories[category] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 text-indigo-400/50" />
                      </motion.div>
                    </button>

                    {/* Category Items */}
                    <AnimatePresence>
                      {expandedCategories[category] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2"
                        >
                          {items.map((item) => {
                            const ItemIcon = item.icon;
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '?');
                            return (
                              <motion.button
                                key={item.id}
                                onClick={() => handleLinkClick(item.href)}
                                className={`w-full flex items-center gap-4 px-3 py-2 rounded-lg transition-all ${
                                  isActive
                                    ? 'bg-indigo-500/30 text-indigo-400 border border-indigo-500/50'
                                    : 'text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-400'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <ItemIcon className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium text-left">{item.label}</span>
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                /* Collapsed View - Icons Only */
                Object.entries(navCategories).flatMap(([_, items]) => items).map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '?');
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleLinkClick(item.href)}
                      className={`w-full flex items-center justify-center p-3 rounded-lg transition-all mb-2 ${
                        isActive
                          ? 'bg-indigo-500/30 text-indigo-400 border border-indigo-500/50'
                          : 'text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-400'
                      }`}
                      title={item.label}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ItemIcon className="w-5 h-5" />
                    </motion.button>
                  );
                })
              )}
              
              {/* Theme Toggle and Logout - always visible */}
              <div className={`mt-6 pt-6 border-t border-indigo-500/20 space-y-2 ${isSidebarOpen ? '' : 'flex flex-col gap-2'}`}>
                <motion.button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-4 px-3 py-2 rounded-lg text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all"
                  title="Toggle Light/Dark Mode"
                  whileHover={{ scale: isSidebarOpen ? 1.02 : 1.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isDarkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
                  {isSidebarOpen && <span className="text-sm font-medium text-left">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-3 py-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                  title="Logout"
                  whileHover={{ scale: isSidebarOpen ? 1.02 : 1.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && <span className="text-sm font-medium text-left">Logout</span>}
                </motion.button>
              </div>
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
