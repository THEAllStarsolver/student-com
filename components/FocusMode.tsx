'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from './ui/GlassCard';
import PrimaryButton from './ui/PrimaryButton';
import Chatbot from './Chatbot';
import YouTubePlayer from './YouTubePlayer';

interface FocusSession {
  isActive: boolean;
  timerDuration: number;
  startedAt: any;
  endTime: number;
}

export default function FocusMode() {
  const { user } = useAuth();
  const [focusSession, setFocusSession] = useState<FocusSession | null>(null);
  const [customDuration, setCustomDuration] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [activeTab, setActiveTab] = useState<'youtube' | 'chatbot'>('youtube');

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
    } catch (error) {
      console.error('Error ending focus session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pomodoroPresets = [
    { name: 'Pomodoro', duration: 25 },
    { name: 'Short Break', duration: 5 },
    { name: 'Long Break', duration: 15 },
    { name: 'Deep Work', duration: 90 }
  ];

  if (focusSession?.isActive) {
    return (
      <div className="space-y-6">
        <GlassCard className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Focus Mode Active 🎯</h2>
          <div className="text-6xl font-mono text-neon-cyan mb-4">
            {formatTime(timeRemaining)}
          </div>
          <p className="text-slate-300 mb-4">
            Stay focused! Only YouTube and AI Chat are available.
          </p>
          <button
            onClick={endFocusSession}
            className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
          >
            End Focus Session
          </button>
        </GlassCard>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-6 py-3 rounded-xl transition-all ${
              activeTab === 'youtube'
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            📺 YouTube
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`px-6 py-3 rounded-xl transition-all ${
              activeTab === 'chatbot'
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
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