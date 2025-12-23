'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFocus } from '@/context/FocusContext';
import { 
  Cpu, ChevronRight, LayoutDashboard, 
  BookOpen, CheckSquare, Code, Map, 
  TrendingUp, MessageSquare, Brain, Zap,
  Gamepad2, Film, ShoppingBag, UtensilsCrossed,
  Video, Calendar, Activity, GraduationCap,
  DollarSign, TrendingDown, Clock, Users, ChevronDown,
  Sun, Moon, LogOut
} from 'lucide-react';

// --- THEME (DYNAMIC DARK/LIGHT) ---
const getTheme = (isDark: boolean) => ({
  name: isDark ? "Nightshade Protocol" : "Light Mode",
  bg: isDark ? 'bg-[#050508]' : 'bg-[#f8f9fa]',
  panel: isDark ? 'bg-[#0a0a15]/90' : 'bg-white/95',
  border: isDark ? 'border-[#1a1a2e]' : 'border-[#d1d5db]',
  accent: isDark ? 'text-indigo-400' : 'text-indigo-600',
  accentFill: isDark ? 'fill-indigo-400' : 'fill-indigo-600',
  accentStroke: isDark ? 'stroke-indigo-500' : 'stroke-indigo-600',
  glow: isDark ? 'shadow-[0_0_25px_rgba(129,140,248,0.4)]' : 'shadow-[0_0_25px_rgba(79,70,229,0.2)]',
  coreGlow: isDark ? 'shadow-[0_0_50px_rgba(129,140,248,0.8)]' : 'shadow-[0_0_50px_rgba(79,70,229,0.4)]',
  grid: isDark ? 'bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#d1d5db_1px,transparent_1px),linear-gradient(to_bottom,#d1d5db_1px,transparent_1px)]',
  text: isDark ? 'text-slate-100' : 'text-gray-900',
  secondaryText: isDark ? 'text-slate-400' : 'text-gray-700',
  tertiary: isDark ? 'text-slate-300' : 'text-gray-800',
  headerText: isDark ? 'text-indigo-300' : 'text-indigo-800',
  hoverBg: isDark ? 'hover:bg-indigo-500/10' : 'hover:bg-indigo-100',
  activeBg: isDark ? 'bg-indigo-500/30' : 'bg-indigo-100',
  activeBorder: isDark ? 'border-indigo-500/50' : 'border-indigo-400',
  label: isDark ? 'text-slate-400' : 'text-gray-700',
});

// --- COMPONENTS ---

const SciFiArcReactor = ({ isVisible, theme }: { isVisible: boolean; theme: ReturnType<typeof getTheme> }) => (
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
              className={`absolute border ${theme.accent}/20 rounded-full`}
              style={{ inset: i * 20 }}
            />
          ))}
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-20 border-2 ${theme.accent} rounded-full flex items-center justify-center ${theme.glow}`}
          >
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`absolute w-0.5 h-6 ${theme.accent.replace('text', 'bg')} top-0 origin-[0_40px]`} style={{ transform: `rotate(${i * 30}deg)` }} />
            ))}
          </motion.div>

          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: theme.accent === 'text-indigo-400' 
                ? ["0 0 20px #818cf8", "0 0 60px #818cf8", "0 0 20px #818cf8"]
                : ["0 0 20px #4f46e5", "0 0 60px #4f46e5", "0 0 20px #4f46e5"]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className={`w-16 h-16 rounded-full ${theme.bg === 'bg-[#050508]' ? 'bg-white' : 'bg-gray-900'} z-10 flex items-center justify-center`}
          >
             <div className={`w-12 h-12 rounded-full ${theme.accent.replace('text', 'bg')} mix-blend-overlay animate-pulse`} />
          </motion.div>
        </div>
        <div className="mt-12 font-mono text-center">
          <span className={`${theme.accent} text-[10px] tracking-[0.8em] font-bold block mb-2`}>NAVIGATING SYSTEM</span>
          <span className={`${theme.secondaryText} text-[8px] tracking-[0.4em]`}>LOADING MODULE // 2.0</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function ModernShell({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, logout } = useAuth();
  const { isFocusActive } = useFocus();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userName, setUserName] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [headerHovered, setHeaderHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const prevPathname = useRef(pathname);

  const theme = getTheme(isDarkMode);

  useEffect(() => {
    if (user && user.displayName) {
      setUserName(user.displayName);
    } else if (user && user.email) {
      setUserName(user.email.split('@')[0]);
    }
  }, [user]);

  // Scroll detection for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Show header if at top (scrollPosition < 50) or if user hovers
      setIsScrolled(scrollPosition > 50);
      setShowHeader(scrollPosition < 50 || headerHovered);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHovered]);

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

  // Category icons mapping
  const categoryIcons: Record<string, any> = {
    CORE: Brain,
    PRODUCTIVITY: CheckSquare,
    LEARNING: GraduationCap,
    TOOLS: Zap,
    COMMERCE: ShoppingBag,
    FINANCE: DollarSign,
    SOCIAL: Users,
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
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // Update root element class for CSS variables
    if (newMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
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
    <div className={`fixed inset-0 ${theme.bg} ${theme.text} overflow-hidden font-sans transition-colors duration-300`}>
      <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${theme.grid} bg-[size:60px_60px] z-0`} />
      
      <SciFiArcReactor isVisible={loading || isNavigating} theme={theme} />

      {!loading && (
        <>
          <header 
            onMouseEnter={() => setHeaderHovered(true)}
            onMouseLeave={() => setHeaderHovered(false)}
            className={`fixed top-0 left-0 right-0 h-20 z-[60] px-8 flex items-center justify-between border-b ${theme.border} ${theme.panel} backdrop-blur-xl transition-all duration-300 ${isFocusActive ? 'opacity-0 pointer-events-none' : isScrolled && !showHeader ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="flex items-center gap-4">
              <img 
                src="/icons/iconsage.png" 
                alt="Sage" 
                title="Sage - AI Student Companion"
                className={`w-12 h-12 drop-shadow-lg filter brightness-110 contrast-125 ${isDarkMode ? 'invert' : ''} hover:scale-110 transition-transform`}
              />
              <div className="flex flex-col">
                <span className={`text-xl font-sans font-black ${theme.headerText} tracking-wider uppercase`}>Sage</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className={`h-2 w-2 rounded-full ${theme.accent.replace('text', 'bg')} animate-pulse`} />
               <span className={`text-sm font-sans font-semibold ${theme.accent} uppercase tracking-wider`}>Session Active</span>
            </div>
          </header>

          <aside className={`fixed left-4 top-24 bottom-12 z-[50] transition-all duration-500 rounded-2xl ${theme.panel} border ${theme.border} ${isSidebarOpen ? 'w-72' : 'w-16'} backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden ${isFocusActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={`h-16 flex items-center justify-center border-b ${theme.border} ${theme.hoverBg}`}>
              <motion.div animate={{ rotate: isSidebarOpen ? 180 : 0 }}><ChevronRight size={22} className={theme.accent} /></motion.div>
            </button>
            <nav className="flex-1 py-6 px-3 overflow-y-auto custom-scrollbar">
              {isSidebarOpen ? (
                /* Categories View */
                Object.entries(navCategories).map(([category, items]) => (
                  <div key={category} className="mb-6">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category)}
                      className={`w-full flex items-center justify-between px-3 py-2 mb-2 rounded-lg ${theme.hoverBg} transition-colors`}
                    >
                      <span className={`text-base font-bold uppercase tracking-wider ${theme.accent}`}>
                        {category}
                      </span>
                      <motion.div
                        animate={{ rotate: expandedCategories[category] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className={`w-4 h-4 ${theme.accent}/50`} />
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
                                    ? `${theme.activeBg} ${theme.accent} border ${theme.activeBorder}`
                                    : `${theme.secondaryText} ${theme.hoverBg} hover:${theme.accent}`
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <ItemIcon className="w-5 h-5 flex-shrink-0" />
                                <span className={`text-sm font-medium text-left ${isActive ? theme.accent : theme.secondaryText}`}>{item.label}</span>
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                /* Collapsed View - Category Icons Only */
                Object.entries(navCategories).map(([category, items]) => {
                  const CategoryIcon = categoryIcons[category];
                  const isActive = items.some(item => pathname === item.href || pathname.startsWith(item.href + '?'));
                  
                  return (
                    <motion.button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`w-full flex items-center justify-center p-3 rounded-lg transition-all mb-2 ${
                        isActive
                          ? `${theme.activeBg} ${theme.accent} border ${theme.activeBorder}`
                          : `${theme.secondaryText} ${theme.hoverBg} hover:${theme.accent}`
                      }`}
                      title={category}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CategoryIcon className="w-6 h-6" />
                    </motion.button>
                  );
                })
              )}
              
              {/* Theme Toggle and Logout - always visible */}
              <div className={`mt-6 pt-6 border-t ${theme.border} space-y-2 ${isSidebarOpen ? '' : 'flex flex-col gap-2'}`}>
                <motion.button
                  onClick={toggleTheme}
                  className={`w-full flex items-center gap-4 px-3 py-2 rounded-lg ${theme.secondaryText} ${theme.hoverBg} transition-all`}
                  title="Toggle Light/Dark Mode"
                  whileHover={{ scale: isSidebarOpen ? 1.02 : 1.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isDarkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
                  {isSidebarOpen && <span className={`text-sm font-medium text-left ${theme.secondaryText}`}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-4 px-3 py-2 rounded-lg ${theme.secondaryText} hover:bg-red-500/10 hover:text-red-400 transition-all`}
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
             <span className={`text-[8px] font-mono ${theme.accent} opacity-40 uppercase tracking-[0.3em]`}>System_Stable</span>
             <span className={`text-[8px] font-mono ${theme.secondaryText} uppercase tracking-[0.5em]`}>Nightshade Protocol // 2025</span>
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
