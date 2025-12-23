'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import StarkLayout from '@/components/StarkLayout';
import Dashboard from '@/components/Dashboard';
import Academics from '@/components/Academics';
import PlaceholderModule from '@/components/PlaceholderModule';
import ArcReactorLoader from '@/components/ArcReactorLoader';
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
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Show Arc Reactor loader during initialization
  if (isInitializing || authLoading) {
    return (
      <div className="min-h-screen bg-stark-bg flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <ArcReactorLoader loading={true} size={150} />
          
          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold gradient-stark">STARK COMPANION</h1>
            <p className="text-stark-cyan font-mono text-sm tracking-widest uppercase">
              Initializing AI Systems...
            </p>
            
            <motion.div
              className="flex items-center justify-center space-x-4 text-xs text-gray-400 font-mono"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>NEURAL NETWORK: ONLINE</span>
              <span>|</span>
              <span>SECURITY: ACTIVE</span>
              <span>|</span>
              <span>POWER: 100%</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-stark-bg flex items-center justify-center">
        <motion.div
          className="glass-card p-8 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold gradient-stark mb-4">Access Required</h2>
          <p className="text-gray-300 mb-6">Please authenticate to access the Stark Companion system.</p>
          <button className="px-6 py-3 bg-gradient-to-r from-stark-cyan to-cyan-600 text-white rounded-lg font-medium stark-hover">
            Initialize Login Sequence
          </button>
        </motion.div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      
      case 'academics':
        return <Academics />;
      
      case 'todo':
        return (
          <PlaceholderModule
            title="Task Management"
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
            title="Development Hub"
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
            title="Design Studio"
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
            title="Financial Management"
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
            title="Simulation Lab"
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
