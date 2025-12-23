'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Menu, 
  X, 
  Home, 
  Plane, 
  GraduationCap, 
  CheckSquare, 
  Code, 
  Palette, 
  DollarSign, 
  Users, 
  Zap,
  Shield,
  Satellite,
  Brain
} from 'lucide-react';
import StarkHUD from './IronManHUD';

interface StarkLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function StarkLayout({ 
  children, 
  currentPage, 
  onPageChange 
}: StarkLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Command Center', icon: Home },
    { id: 'travel', label: 'Travel Logistics', icon: Plane },
    { id: 'academics', label: 'Neural Academy', icon: GraduationCap },
    { id: 'todo', label: 'Task Matrix', icon: CheckSquare },
    { id: 'devhub', label: 'Dev Protocol', icon: Code },
    { id: 'design', label: 'Design Lab', icon: Palette },
    { id: 'finance', label: 'Resource Mgmt', icon: DollarSign },
    { id: 'network', label: 'Network Hub', icon: Users },
    { id: 'simulation', label: 'Simulation Core', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-black relative">
      {/* Stark HUD Background */}
      <StarkHUD />
      
      {/* Glassmorphic Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 stark-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Brand */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg stark-glass hover:bg-indigo-500/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <motion.div
                className="p-2 rounded-lg arc-reactor-pulse"
                animate={{ 
                  boxShadow: [
                    '0 0 10px rgba(129, 140, 248, 0.5)',
                    '0 0 20px rgba(129, 140, 248, 0.8)',
                    '0 0 10px rgba(129, 140, 248, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Cpu className="text-indigo-400" size={24} />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-indigo-400 hud-font">
                  STARK INDUSTRIES OS
                </h1>
                <p className="text-xs text-gray-400 hud-font">
                  NIGHTSHADE PROTOCOL
                </p>
              </div>
            </div>
          </div>
          
          {/* Right: System Integrity Pulse */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-2 px-4 py-2 stark-glass rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-3 h-3 bg-indigo-400 rounded-full"
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="hud-font text-sm text-indigo-400">SYSTEM INTEGRITY</span>
            </motion.div>
          </div>
        </div>
      </motion.header>
      
      {/* Collapsible Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar Panel */}
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-64 z-50 stark-sidebar m-4 p-6"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="mb-8 pt-20">
                  <h2 className="text-lg font-bold text-indigo-400 hud-font mb-2">
                    NAVIGATION MATRIX
                  </h2>
                  <p className="text-xs text-gray-400 hud-font">
                    Select operational module
                  </p>
                </div>
                
                {/* Navigation Items */}
                <nav className="flex-1 space-y-2">
                  {navigationItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        onPageChange(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hud-font text-sm ${
                        currentPage === item.id
                          ? 'bg-indigo-500/20 border border-indigo-400/50 text-indigo-400'
                          : 'hover:bg-indigo-500/10 text-gray-300 hover:text-indigo-400'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                      {currentPage === item.id && (
                        <motion.div
                          className="ml-auto w-2 h-2 bg-indigo-400 rounded-full"
                          animate={{ 
                            boxShadow: [
                              '0 0 5px rgba(129, 140, 248, 0.5)',
                              '0 0 15px rgba(129, 140, 248, 0.8)',
                              '0 0 5px rgba(129, 140, 248, 0.5)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  ))}
                </nav>
                
                {/* System Status */}
                <div className="mt-8 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 hud-font mb-4">
                    SYSTEM STATUS
                  </h3>
                  {[
                    { label: 'Neural Link', status: 'ONLINE', icon: Brain, color: 'text-green-400' },
                    { label: 'Satellite', status: 'ACTIVE', icon: Satellite, color: 'text-blue-400' },
                    { label: 'Threat Level', status: 'MINIMAL', icon: Shield, color: 'text-yellow-400' },
                  ].map((system) => (
                    <motion.div
                      key={system.label}
                      className="system-card p-4"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <system.icon className={system.color} size={16} />
                          <div className="hud-font text-xs">
                            <div className="text-gray-300">{system.label}</div>
                            <div className={system.color}>{system.status}</div>
                          </div>
                        </div>
                        <motion.div
                          className={`w-2 h-2 rounded-full ${
                            system.color.includes('green') ? 'bg-green-400' :
                            system.color.includes('blue') ? 'bg-blue-400' :
                            'bg-yellow-400'
                          }`}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content with Dynamic Padding */}
      <main 
        className={`pt-20 transition-all duration-300 ${
          sidebarOpen ? 'pl-64' : 'pl-16'
        } relative z-10`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}