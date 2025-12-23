'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';

const quotes = [
  "Believe you can and you're halfway there.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [lastMood, setLastMood] = useState<any>(null);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
        if (docSnap.exists()) {
          setUserName(docSnap.data().name || 'Student');
        }
      });

      const moodQuery = query(
        collection(db, 'moodEntries'),
        where('uid', '==', user.uid),
        limit(1)
      );
      getDocs(moodQuery).then((snapshot) => {
        if (!snapshot.empty) {
          setLastMood(snapshot.docs[0].data());
        }
      }).catch(() => { });
    }
  }, [user]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const getMoodEmoji = (mood: string) => {
    const emojis: any = {
      stressed: '😰',
      tired: '😴',
      motivated: '🔥',
      neutral: '😊',
    };
    return emojis[mood] || '😊';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="tech-label mb-2 block">MISSION CONTROL</span>
            <h1 className="tech-heading text-4xl mb-3">
              OPERATOR: {userName.toUpperCase()}
            </h1>
            <p className="text-slate-400">System Status: Operational</p>
          </div>
          <div className="status-indicator status-active">
            <div className="status-dot"></div>
            <span className="tech-label">ONLINE</span>
          </div>
        </div>
        <div className="tech-separator" />
      </div>

      {lastMood && (
        <GlassCard className="mb-12" variant="elevated">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 tech-panel flex items-center justify-center text-2xl">
                {getMoodEmoji(lastMood.moodLabel)}
              </div>
              <div>
                <span className="tech-label">PSYCHOLOGICAL STATUS</span>
                <h3 className="tech-heading text-xl mb-1">STATE: {lastMood.moodLabel.toUpperCase()}</h3>
                <p className="tech-data text-sm">LAST SCAN: {new Date(lastMood.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="status-indicator status-active">
              <div className="status-dot"></div>
              <span className="tech-label">MONITORED</span>
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard className="mb-12" variant="elevated">
        <div className="text-center">
          <span className="tech-label mb-4 block">DAILY BRIEFING</span>
          <p className="text-lg text-slate-300 leading-relaxed">
            "{quote}"
          </p>
        </div>
      </GlassCard>

      <div className="mb-8">
        <span className="tech-label">SYSTEM MODULES</span>
        <div className="tech-separator mb-6" />
      </div>
      
      <div className="tech-grid-layout">
        <GlassCard onClick={() => router.push('/companion?tab=questionnaire')} variant="interactive" className="group p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800" alt="Mood Check" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="tech-label">MODULE 01</span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="tech-heading text-lg mb-2">PSYCHOLOGICAL ANALYSIS</h3>
            <p className="text-slate-400 text-sm mb-4">Mental wellness monitoring system</p>
            <div className="status-indicator status-active">
              <div className="status-dot"></div>
              <span className="tech-label text-xs">READY</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/companion?tab=chatbot')} variant="interactive" className="group p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800" alt="Chatbot" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="tech-label">MODULE 02</span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="tech-heading text-lg mb-2">AI ASSISTANT</h3>
            <p className="text-slate-400 text-sm mb-4">Intelligent guidance system</p>
            <div className="status-indicator status-active">
              <div className="status-dot"></div>
              <span className="tech-label text-xs">ONLINE</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/travel')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="/icons/travel.jpeg" alt="Travel" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Plan Travel</h3>
            <p className="text-slate-400 text-sm">Book flights & hotels</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/academics')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="/icons/marks.jpg" alt="Marks" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Check Marks</h3>
            <p className="text-slate-400 text-sm">View your academic progress</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/internships')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="/icons/internship.jpg" alt="Internships" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Find Internships</h3>
            <p className="text-slate-400 text-sm">Explore opportunities</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/events')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="/icons/events.png" alt="Events" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Browse Events</h3>
            <p className="text-slate-400 text-sm">Discover campus events</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/games')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800" alt="Games" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Play Games</h3>
            <p className="text-slate-400 text-sm">Relax with fun games</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/movies')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800" alt="Movies" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Book Movies</h3>
            <p className="text-slate-400 text-sm">Watch latest films</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/shopping')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800" alt="Shopping" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Shop Online</h3>
            <p className="text-slate-400 text-sm">Browse & buy products</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/snacks')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800" alt="Snacks" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Order Snacks</h3>
            <p className="text-slate-400 text-sm">Quick delivery to hostel</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/community')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800" alt="Community" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Join Community</h3>
            <p className="text-slate-400 text-sm">Chat with peers</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/videocall')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800" alt="Video Call" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Video Call Family</h3>
            <p className="text-slate-400 text-sm">Connect via Google Meet</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/todo')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800" alt="Todo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Todo List</h3>
            <p className="text-slate-400 text-sm">Manage your tasks</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/attendance')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800" alt="Attendance" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Track Attendance</h3>
            <p className="text-slate-400 text-sm">Monitor class attendance</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/tracker')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800" alt="Tracker" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Habit Tracker</h3>
            <p className="text-slate-400 text-sm">Track goals & habits</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/learning')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800" alt="Learning" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Learning Docs</h3>
            <p className="text-slate-400 text-sm">W3Schools & guides</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/money')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800" alt="Money Manager" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Money Manager</h3>
            <p className="text-slate-400 text-sm">Track expenses & budget</p>
          </div>
        </GlassCard>

        <GlassCard onClick={() => router.push('/stocks')} className="group cursor-pointer overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800" alt="Stock Market" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Stock Market</h3>
            <p className="text-slate-400 text-sm">Learn & practice trading</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
