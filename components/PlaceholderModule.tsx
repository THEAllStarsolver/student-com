'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PlaceholderModuleProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  comingSoon?: boolean;
}

export default function PlaceholderModule({ 
  title, 
  description, 
  icon: Icon, 
  features,
  comingSoon = true 
}: PlaceholderModuleProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="glass-card p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-stark-cyan to-cyan-600 mb-6 arc-glow"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon size={40} className="text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-bold gradient-stark mb-4">{title}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">{description}</p>
        
        {comingSoon && (
          <motion.div
            className="inline-flex items-center px-4 py-2 mt-6 rounded-full bg-yellow-500/20 border border-yellow-400/30"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse" />
            <span className="text-yellow-400 font-medium">Coming Soon</span>
          </motion.div>
        )}
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature}
            className="glass-card p-6 stark-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-stark-cyan animate-pulse" />
              <h3 className="text-lg font-semibold text-white">{feature}</h3>
            </div>
            
            <div className="h-24 bg-gradient-to-br from-white/5 to-white/10 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-sm">Feature Preview</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Development Status */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Icon className="mr-2 text-stark-cyan" size={20} />
          Development Roadmap
        </h3>
        
        <div className="space-y-4">
          {[
            { phase: 'Phase 1', status: 'Planning', progress: 25 },
            { phase: 'Phase 2', status: 'Design', progress: 0 },
            { phase: 'Phase 3', status: 'Development', progress: 0 },
            { phase: 'Phase 4', status: 'Testing', progress: 0 },
          ].map((phase, index) => (
            <div key={phase.phase} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{phase.phase}: {phase.status}</span>
                <span className="text-stark-cyan text-sm">{phase.progress}%</span>
              </div>
              
              <div className="w-full bg-stark-surface rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-stark-cyan to-stark-emerald rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progress}%` }}
                  transition={{ delay: 1 + 0.2 * index, duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}