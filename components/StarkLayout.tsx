'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  Code, 
  Palette, 
  DollarSign, 
  Users, 
  Zap,
  Menu,
  X
} from 'lucide-react';
import ArcReactorLoader from './ArcReactorLoader';

interface StarkLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'academics', label: 'Academics', icon: BookOpen },
  { id: 'todo', label: 'Todo', icon: CheckSquare },
  { id: 'devhub', label: 'Dev Hub', icon: Code },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'network', label: 'Network', icon: Users },
  { id: 'simulation', label: 'Simulation', icon: Zap },
];

export default function StarkLayout({ children, currentPage, onPageChange }: StarkLayoutProps) {
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePageChange = (page: string) => {
    if (page === currentPage) return;
    
    setIsRecalibrating(true);
    setIsSidebarOpen(false);
    
    setTimeout(() => {
      onPageChange(page);
      setIsRecalibrating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-stark-bg relative">
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 h-16 glass-header z-50 flex items-center justify-between px-6"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-lg glass-card stark-hover"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stark-cyan to-cyan-400 arc-glow flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <h1 className="text-xl font-bold gradient-stark">STARK COMPANION</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-stark-cyan font-mono">
            {new Date().toLocaleTimeString()}
          </div>
          <div className="w-2 h-2 rounded-full bg-stark-emerald animate-pulse" />
        </div>
      </motion.header>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <>
            {/* Mobile Overlay */}
            {isMobile && (
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            
            {/* Sidebar */}
            <motion.aside
              className={`fixed left-4 top-20 bottom-4 w-64 glass-sidebar z-40 p-4 ${
                isMobile ? 'left-4' : ''
              }`}
              initial={{ x: isMobile ? -280 : -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handlePageChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-stark-cyan/20 border border-stark-cyan/40 text-stark-cyan arc-glow'
                          : 'hover:bg-white/5 hover:border-stark-cyan/20 border border-transparent text-gray-300 stark-hover'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 rounded-full bg-stark-cyan"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* System Status */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass-card p-3 space-y-2">
                  <div className="text-xs text-gray-400 uppercase tracking-wider">System Status</div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Power Core</span>
                    <span className="text-stark-emerald">100%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Network</span>
                    <span className="text-stark-emerald">Online</span>
                  </div>
                  <div className="w-full bg-stark-surface rounded-full h-1">
                    <motion.div
                      className="h-1 bg-gradient-to-r from-stark-cyan to-stark-emerald rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`pt-16 ${!isMobile ? 'ml-72' : 'ml-0'} p-6 min-h-screen`}>
        <AnimatePresence mode="wait">
          {isRecalibrating ? (
            <motion.div
              key="recalibrating"
              className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ArcReactorLoader loading={true} size={120} />
              <motion.div
                className="mt-8 text-stark-cyan font-mono text-sm tracking-widest uppercase"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Recalibrating System...
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}