'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';
import StarkLayout from './components/NightshadeLayout';
import Dashboard from './components/Dashboard';
import Academics from './components/Academics';
import TravelModule from './components/TravelModule';
import PlaceholderModule from './components/PlaceholderModule';
import StarkArcReactor from './components/NightshadeArcReactor';
import { 
  CheckSquare, 
  Code, 
  Palette, 
  DollarSign, 
  Users, 
  Zap 
} from 'lucide-react';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulate system initialization
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Show Stark Arc Reactor loader during initialization
  if (isInitializing || authLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <StarkArcReactor 
            loading={true} 
            size={220}
            onComplete={() => setIsInitializing(false)}
          />
          
          <motion.div
            className="mt-12 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-indigo-400 hud-font">
              STARK INDUSTRIES OS
            </h1>
            <p className="text-indigo-400 hud-font text-sm tracking-widest uppercase">
              Nightshade Protocol Initializing...
            </p>
            
            <motion.div
              className="flex items-center justify-center space-x-6 text-xs text-gray-400 hud-font"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>NEURAL NETWORK: ONLINE</span>
              <span>|</span>
              <span>SECURITY: ACTIVE</span>
              <span>|</span>
              <span>POWER: 100%</span>
            </motion.div>
            
            <motion.div
              className="text-xs text-indigo-400 hud-font"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Arc Reactor: Stable • Repulsors: Charged • HUD: Active
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="stark-glass p-8 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-indigo-400 mb-4 hud-font">
            ACCESS REQUIRED
          </h2>
          <p className="text-gray-300 mb-6 hud-font text-sm">
            Please authenticate to access the Stark Industries OS.
          </p>
          <motion.button 
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hud-font transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Initialize Login Sequence
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      
      case 'travel':
        return <TravelModule />;
      
      case 'academics':
        return <Academics />;
      
      case 'todo':
        return (
          <PlaceholderModule
            title="Task Matrix"
            description="Advanced AI-powered task management and productivity optimization system"
            icon={CheckSquare}
            features={[
              'Smart Task Prioritization',
              'AI Deadline Prediction',
              'Collaborative Workspaces',
              'Progress Analytics',
              'Voice Commands',
              'Calendar Integration'
            ]}
          />
        );
      
      case 'devhub':
        return (
          <PlaceholderModule
            title="Development Protocol"
            description="Comprehensive development environment with AI-assisted coding and project management"
            icon={Code}
            features={[
              'Code Repository Manager',
              'AI Code Review',
              'Deployment Pipeline',
              'Performance Monitoring',
              'Collaboration Tools',
              'Learning Resources'
            ]}
          />
        );
      
      case 'design':
        return (
          <PlaceholderModule
            title="Design Laboratory"
            description="Creative design workspace with AI-powered tools and collaborative features"
            icon={Palette}
            features={[
              'AI Design Assistant',
              'Asset Library',
              'Collaboration Board',
              'Version Control',
              'Export Tools',
              'Template Gallery'
            ]}
          />
        );
      
      case 'finance':
        return (
          <PlaceholderModule
            title="Resource Management"
            description="Smart financial tracking and budgeting system for students"
            icon={DollarSign}
            features={[
              'Expense Tracking',
              'Budget Planning',
              'Scholarship Finder',
              'Investment Simulator',
              'Financial Goals',
              'Spending Analytics'
            ]}
          />
        );
      
      case 'network':
        return (
          <PlaceholderModule
            title="Network Hub"
            description="Professional networking and collaboration platform for students and professionals"
            icon={Users}
            features={[
              'Professional Profiles',
              'Mentorship Matching',
              'Study Groups',
              'Event Discovery',
              'Skill Sharing',
              'Career Opportunities'
            ]}
          />
        );
      
      case 'simulation':
        return (
          <PlaceholderModule
            title="Simulation Core"
            description="Advanced simulation environment for learning and experimentation"
            icon={Zap}
            features={[
              'Physics Simulations',
              'Virtual Experiments',
              'Data Modeling',
              'Algorithm Visualization',
              'Interactive Learning',
              'Research Tools'
            ]}
          />
        );
      
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <StarkLayout 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </StarkLayout>
    </motion.div>
  );
}