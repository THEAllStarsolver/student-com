'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';
import IronManHelmet from './IronManHelmet';

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const stats = [
    {
      label: 'Attendance',
      value: '94%',
      change: '+2%',
      icon: Calendar,
      color: 'text-stark-emerald',
      bgColor: 'bg-emerald-500/20',
    },
    {
      label: 'Grade Average',
      value: 'A-',
      change: '+0.3',
      icon: TrendingUp,
      color: 'text-stark-cyan',
      bgColor: 'bg-cyan-500/20',
    },
    {
      label: 'Tasks Completed',
      value: '12/15',
      change: '+3',
      icon: Target,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
    {
      label: 'Power Level',
      value: '100%',
      change: 'MAX',
      icon: Zap,
      color: 'text-stark-cyan',
      bgColor: 'bg-cyan-500/20',
    },
  ];

  const recentActivities = [
    { action: 'Completed Physics Assignment', time: '2 hours ago', status: 'success' },
    { action: 'Attended Machine Learning Lecture', time: '4 hours ago', status: 'info' },
    { action: 'Submitted Project Proposal', time: '1 day ago', status: 'success' },
    { action: 'Missed Chemistry Lab', time: '2 days ago', status: 'warning' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        className="glass-card p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 space-y-4">
            <motion.h1
              className="text-4xl lg:text-5xl font-bold gradient-stark"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Welcome back, {user?.displayName || 'Student'}
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Your personal AI companion is ready to assist
            </motion.p>
            
            <motion.div
              className="flex items-center space-x-4 text-sm text-stark-cyan font-mono"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-stark-emerald animate-pulse" />
                <span>SYSTEM ONLINE</span>
              </div>
              <div>|</div>
              <div>STARK INDUSTRIES TECH</div>
            </motion.div>
          </div>
          
          <motion.div
            className="lg:ml-8 mt-6 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <IronManHelmet size={150} />
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
              className="glass-card p-6 stark-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div className={`text-sm font-medium ${stat.color}`}>
                  {stat.change}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Zap className="mr-2 text-stark-cyan" size={20} />
            Recent Activities
          </h3>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-lg bg-white/5 stark-hover"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + 0.1 * index, duration: 0.4 }}
              >
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-stark-emerald' :
                  activity.status === 'warning' ? 'bg-yellow-400' :
                  'bg-stark-cyan'
                }`} />
                
                <div className="flex-1">
                  <div className="text-white font-medium">{activity.action}</div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Target className="mr-2 text-stark-cyan" size={20} />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'View Grades', color: 'from-stark-cyan to-cyan-600' },
              { label: 'Add Task', color: 'from-stark-emerald to-emerald-600' },
              { label: 'Check Schedule', color: 'from-yellow-400 to-yellow-600' },
              { label: 'Study Mode', color: 'from-purple-400 to-purple-600' },
            ].map((action, index) => (
              <motion.button
                key={action.label}
                className={`p-4 rounded-lg bg-gradient-to-br ${action.color} text-white font-medium stark-hover`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + 0.1 * index, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Diagnostics */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Zap className="mr-2 text-stark-cyan" size={20} />
          System Diagnostics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Neural Network', status: 'Optimal', value: 98 },
            { label: 'Data Processing', status: 'Active', value: 87 },
            { label: 'Security Protocols', status: 'Secure', value: 100 },
          ].map((diagnostic, index) => (
            <div key={diagnostic.label} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{diagnostic.label}</span>
                <span className="text-stark-emerald text-sm">{diagnostic.status}</span>
              </div>
              
              <div className="w-full bg-stark-surface rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-stark-cyan to-stark-emerald rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${diagnostic.value}%` }}
                  transition={{ delay: 1 + 0.2 * index, duration: 1.5, ease: "easeOut" }}
                />
              </div>
              
              <div className="text-right text-sm text-gray-400">{diagnostic.value}%</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}