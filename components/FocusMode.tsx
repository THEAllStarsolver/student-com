'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from './ui/GlassCard';
import PrimaryButton from './ui/PrimaryButton';
import ChatbotNew from './ChatbotNew';
import YouTubePlayer from './YouTubePlayer';
import { X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FocusSession {
  isActive: boolean;
  timerDuration: number;
  startedAt: any;
  endTime: number;
}

export default function FocusMode({ onFocusEnd }: { onFocusEnd?: () => void }) {
  const { user } = useAuth();
  const [focusSession, setFocusSession] = useState<FocusSession | null>(null);
  const [customDuration, setCustomDuration] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [activeTab, setActiveTab] = useState<'youtube' | 'chatbot'>('youtube');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFocusSession();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (focusSession?.isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endFocusSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [focusSession?.isActive, timeRemaining]);

  // Enter fullscreen when focus starts
  useEffect(() => {
    if (focusSession?.isActive && !isFullscreen) {
      enterFullscreen();
    }
  }, [focusSession?.isActive]);

  // Prevent escape key from exiting fullscreen during focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusSession?.isActive && e.key === 'Escape') {
        e.preventDefault();
        setShowExitWarning(true);
      }
    };

    if (focusSession?.isActive) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusSession?.isActive]);

  const fetchFocusSession = async () => {
    try {
      const focusDoc = await getDoc(doc(db, 'focusMode', user!.uid));
      if (focusDoc.exists()) {
        const data = focusDoc.data() as FocusSession;
        setFocusSession(data);
        
        if (data.isActive && data.endTime) {
          const remaining = Math.max(0, data.endTime - Date.now());
          setTimeRemaining(Math.floor(remaining / 1000));
          
          if (remaining <= 0) {
            endFocusSession();
          }
        }
      }
    } catch (error) {
      console.error('Error fetching focus session:', error);
    }
  };

  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('Fullscreen request failed:', error);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error('Exit fullscreen failed:', err));
      setIsFullscreen(false);
    }
  };

  const startFocusSession = async (duration: number) => {
    const endTime = Date.now() + (duration * 60 * 1000);
    const sessionData: FocusSession = {
      isActive: true,
      timerDuration: duration,
      startedAt: serverTimestamp(),
      endTime
    };

    try {
      await setDoc(doc(db, 'focusMode', user!.uid), sessionData);
      setFocusSession(sessionData);
      setTimeRemaining(duration * 60);
      setShowExitWarning(false);
    } catch (error) {
      console.error('Error starting focus session:', error);
    }
  };

  const endFocusSession = async () => {
    try {
      await updateDoc(doc(db, 'focusMode', user!.uid), {
        isActive: false
      });
      setFocusSession(prev => prev ? { ...prev, isActive: false } : null);
      setTimeRemaining(0);
      exitFullscreen();
      setShowExitWarning(false);
      if (onFocusEnd) onFocusEnd();
    } catch (error) {
      console.error('Error ending focus session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pomodoroPresets = [
    { name: 'Pomodoro', duration: 25 },
    { name: 'Short Break', duration: 5 },
    { name: 'Long Break', duration: 15 },
    { name: 'Deep Work', duration: 90 }
  ];

  // Fullscreen Active View
  if (focusSession?.isActive && isFullscreen) {
    return (
      <div className="fixed inset-0 bg-[#050508] z-[9999] flex flex-col">
        {/* Header */}
        <div className="border-b border-indigo-500/20 bg-indigo-500/5 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Focus Mode Active</h1>
            <p className="text-indigo-400/70 text-lg">Stay focused • No distractions</p>
          </div>
          <div className="text-center">
            <div className="text-7xl font-mono font-bold text-indigo-400 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-slate-400">Time Remaining</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tab Buttons */}
          <div className="flex justify-center gap-6 px-8 py-6 border-b border-indigo-500/20">
            <button
              onClick={() => setActiveTab('youtube')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                activeTab === 'youtube'
                  ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                  : 'bg-indigo-500/10 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'
              }`}
            >
              YouTube
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                activeTab === 'chatbot'
                  ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                  : 'bg-indigo-500/10 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'
              }`}
            >
              AI Chat
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto px-8 py-6">
            {activeTab === 'youtube' ? <YouTubePlayer /> : <ChatbotNew initialPrompt="" />}
          </div>
        </div>

        {/* Exit Warning Modal */}
        {showExitWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#050508] border-2 border-red-500/50 rounded-xl p-8 max-w-md mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-2xl font-bold text-white">Exit Focus Mode?</h3>
              </div>
              <p className="text-slate-300 mb-6">
                You still have {formatTime(timeRemaining)} remaining. Are you sure you want to exit?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowExitWarning(false)}
                  className="flex-1 px-4 py-3 bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 rounded-lg hover:bg-indigo-500/40 font-semibold transition-all"
                >
                  Keep Focusing
                </button>
                <button
                  onClick={endFocusSession}
                  className="flex-1 px-4 py-3 bg-red-500/30 text-red-300 border border-red-500/50 rounded-lg hover:bg-red-500/40 font-semibold transition-all"
                >
                  Exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }

  // Non-fullscreen active view (fallback)
  if (focusSession?.isActive) {
    return (
      <div className="space-y-6">
        <GlassCard className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Focus Mode Active</h2>
          <div className="text-6xl font-mono text-indigo-400 mb-4">
            {formatTime(timeRemaining)}
          </div>
          <p className="text-slate-300 mb-6">
            Stay focused! Only YouTube and AI Chat are available.
          </p>
          <button
            onClick={() => setShowExitWarning(true)}
            className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all font-semibold"
          >
            Exit Focus Mode
          </button>
        </GlassCard>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-6 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'youtube'
                ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                : 'bg-indigo-500/10 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`px-6 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'chatbot'
                ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                : 'bg-indigo-500/10 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'
            }`}
          >
            AI Chat
          </button>
        </div>

        {activeTab === 'youtube' ? <YouTubePlayer /> : <ChatbotNew initialPrompt="" />}

        {showExitWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#050508] border-2 border-red-500/50 rounded-xl p-8 max-w-md mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-2xl font-bold text-white">Exit Focus Mode?</h3>
              </div>
              <p className="text-slate-300 mb-6">
                You still have {formatTime(timeRemaining)} remaining. Are you sure you want to exit?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowExitWarning(false)}
                  className="flex-1 px-4 py-3 bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 rounded-lg hover:bg-indigo-500/40 font-semibold transition-all"
                >
                  Keep Focusing
                </button>
                <button
                  onClick={endFocusSession}
                  className="flex-1 px-4 py-3 bg-red-500/30 text-red-300 border border-red-500/50 rounded-lg hover:bg-red-500/40 font-semibold transition-all"
                >
                  Exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }

  // Setup view (not in focus mode)
  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-6 text-white">Focus Mode</h2>
      
      <div className="mb-6">
        <p className="text-slate-300 mb-6">
          Enter fullscreen focus mode to eliminate distractions. Only YouTube and AI Chat will be available. 
          You cannot exit or access other features until the timer is complete.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {pomodoroPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => startFocusSession(preset.duration)}
              className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all text-center"
            >
              <div className="text-lg font-semibold text-white">{preset.duration}m</div>
              <div className="text-sm text-slate-400">{preset.name}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={customDuration}
            onChange={(e) => setCustomDuration(parseInt(e.target.value) || 25)}
            min="1"
            max="180"
            className="px-4 py-3 rounded-xl bg-slate-800 border border-indigo-500/30 focus:border-indigo-500 focus:outline-none text-white w-24"
          />
          <span className="flex items-center text-slate-300">minutes</span>
          <PrimaryButton
            onClick={() => startFocusSession(customDuration)}
            className="ml-auto"
          >
            Start Custom Session
          </PrimaryButton>
        </div>
      </div>
    </GlassCard>
  );
}
          >
            💬 AI Chat
          </button>
        </div>

        {activeTab === 'youtube' ? <YouTubePlayer /> : <Chatbot />}
      </div>
    );
  }

  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-6 text-white">Focus Mode 🎯</h2>
      
      <div className="mb-6">
        <p className="text-slate-300 mb-4">
          Start a focus session to limit distractions. Only YouTube and AI Chat will be available.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {pomodoroPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => startFocusSession(preset.duration)}
              className="p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-center"
            >
              <div className="text-lg font-semibold text-white">{preset.duration}m</div>
              <div className="text-sm text-slate-400">{preset.name}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={customDuration}
            onChange={(e) => setCustomDuration(parseInt(e.target.value) || 25)}
            min="1"
            max="180"
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white w-24"
          />
          <span className="flex items-center text-slate-300">minutes</span>
          <PrimaryButton
            onClick={() => startFocusSession(customDuration)}
            className="ml-auto"
          >
            Start Custom Session
          </PrimaryButton>
        </div>
      </div>
    </GlassCard>
  );
}