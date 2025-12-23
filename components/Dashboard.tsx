'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Zap, Brain, Shield, Satellite } from 'lucide-react';
import ApiStatus from './ApiStatus';
import AIAssistant from './AIAssistant';

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const stats = [
    {
      label: 'Neural Efficiency',
      value: '94%',
      change: '+2%',
      icon: Brain,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
    },
    {
      label: 'Performance Index',
      value: 'A-',
      change: '+0.3',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      label: 'Mission Progress',
      value: '12/15',
      change: '+3',
      icon: Target,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
    },
    {
      label: 'Arc Reactor',
      value: '100%',
      change: 'MAX',
      icon: Zap,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
    },
  ];

  const recentActivities = [
    { action: 'Neural Network Training Complete', time: '2 hours ago', status: 'success' },
    { action: 'Quantum Physics Module Accessed', time: '4 hours ago', status: 'info' },
    { action: 'Project Stark Protocol Initiated', time: '1 day ago', status: 'success' },
    { action: 'Security Breach Detected & Neutralized', time: '2 days ago', status: 'warning' },
  ];

  const systemDiagnostics = [
    { label: 'Neural Network', status: 'Optimal', value: 98, color: 'from-indigo-400 to-purple-500' },
    { label: 'Threat Assessment', status: 'Secure', value: 100, color: 'from-green-400 to-emerald-500' },
    { label: 'Data Processing', status: 'Active', value: 87, color: 'from-cyan-400 to-blue-500' },
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Hero Section */}
      <motion.div
        className="stark-glass p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 space-y-4">
            <motion.h1
              className="text-4xl lg:text-5xl font-bold gradient-nightshade hud-font"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Welcome, {user?.displayName || 'Agent'}
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-300 hud-font"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Nightshade Protocol is online and ready
            </motion.p>
            
            <motion.div
              className="flex items-center space-x-4 text-sm nightshade-text hud-font"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-indigo-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>STARK_OS ACTIVE</span>
              </div>
              <div>|</div>
              <div>NIGHTSHADE PROTOCOL</div>
            </motion.div>
          </div>
          
          <motion.div
            className="lg:ml-8 mt-6 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                className="w-32 h-32 rounded-full border-2 border-indigo-400/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm" />
                <motion.div
                  className="absolute inset-8 rounded-full bg-indigo-400"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(129, 140, 248, 0.5)',
                      '0 0 40px rgba(129, 140, 248, 0.8)',
                      '0 0 20px rgba(129, 140, 248, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="system-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div className={`text-sm font-medium hud-font ${stat.color}`}>
                  {stat.change}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white hud-font">{stat.value}</div>
                <div className="text-sm text-gray-400 hud-font">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <motion.div
          className="stark-glass p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center hud-font">
            <Zap className="mr-2 nightshade-text" size={20} />
            System Activities
          </h3>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + 0.1 * index, duration: 0.4 }}
              >
                <motion.div 
                  className={`w-3 h-3 rounded-full ${
                    activity.status === 'success' ? 'bg-green-400' :
                    activity.status === 'warning' ? 'bg-yellow-400' :
                    'bg-indigo-400'
                  }`}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                />
                
                <div className="flex-1">
                  <div className="text-white font-medium hud-font text-sm">{activity.action}</div>
                  <div className="text-xs text-gray-400 hud-font">{activity.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Assistant */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <AIAssistant />
        </motion.div>
      </div>

      {/* Quick Actions Grid */}
      <motion.div
        className="stark-glass p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center hud-font">
          <Target className="mr-2 nightshade-text" size={20} />
          Protocol Actions
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Neural Scan', color: 'from-indigo-500 to-purple-600', icon: Brain },
            { label: 'Mission Brief', color: 'from-purple-500 to-pink-600', icon: Target },
            { label: 'Threat Analysis', color: 'from-cyan-500 to-blue-600', icon: Shield },
            { label: 'Satellite Link', color: 'from-blue-500 to-indigo-600', icon: Satellite },
          ].map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <motion.button
                key={action.label}
                className={`p-4 rounded-lg bg-gradient-to-br ${action.color} text-white font-medium hud-font text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + 0.1 * index, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ActionIcon size={16} className="mx-auto mb-2" />
                {action.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* System Diagnostics */}
      <motion.div
        className="stark-glass p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center hud-font">
          <Shield className="mr-2 nightshade-text" size={20} />
          System Diagnostics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemDiagnostics.map((diagnostic, index) => (
            <div key={diagnostic.label} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 hud-font text-sm">{diagnostic.label}</span>
                <span className="text-green-400 text-xs hud-font">{diagnostic.status}</span>
              </div>
              
              <div className="w-full bg-nightshade-border rounded-full h-2">
                <motion.div
                  className={`h-2 bg-gradient-to-r ${diagnostic.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${diagnostic.value}%` }}
                  transition={{ delay: 1 + 0.2 * index, duration: 1.5, ease: "easeOut" }}
                />
              </div>
              
              <div className="text-right text-sm text-gray-400 hud-font">{diagnostic.value}%</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* API Services Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <ApiStatus />
      </motion.div>
    </div>
  );
}