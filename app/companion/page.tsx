'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MoodQuestionnaire from '@/components/MoodQuestionnaire';
import ChatbotNew from '@/components/ChatbotNew';
import YouTubePlayer from '@/components/YouTubePlayer';
import FocusMode from '@/components/FocusMode';

function CompanionContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'questionnaire' | 'chatbot' | 'youtube' | 'focus'>('questionnaire');
  const [chatPrompt, setChatPrompt] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'chatbot' || tab === 'questionnaire') {
      setActiveTab(tab);
    }
    const prompt = searchParams.get('prompt');
    if (prompt) {
      setChatPrompt(prompt);
      setActiveTab('chatbot');
    }
  }, [searchParams]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-white">Your Companion</h1>
      <p className="text-slate-400 mb-8">Mental wellness and AI assistance</p>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setActiveTab('questionnaire')}
          className={`
            px-6 py-3 rounded-xl transition-all font-medium
            ${activeTab === 'questionnaire'
              ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
              : 'bg-indigo-500/10 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'
            }
          `}
        >
          Mood Check
        </button>
        <button
          onClick={() => setActiveTab('chatbot')}
          className={`
            px-6 py-3 rounded-xl transition-all font-medium
            ${activeTab === 'chatbot'
              ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
              : 'bg-indigo-500/10 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'
            }
          `}
        >
          AI Chat
        </button>
        <button
          onClick={() => setActiveTab('youtube')}
          className={`
            px-6 py-3 rounded-xl transition-all font-medium
            ${activeTab === 'youtube'
              ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
              : 'bg-indigo-500/10 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'
            }
          `}
        >
          YouTube
        </button>
        <button
          onClick={() => setActiveTab('focus')}
          className={`
            px-6 py-3 rounded-xl transition-all font-medium
            ${activeTab === 'focus'
              ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
              : 'bg-indigo-500/10 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'
            }
          `}
        >
          Focus Mode
        </button>
      </div>

      {activeTab === 'questionnaire' && <MoodQuestionnaire />}
      {activeTab === 'chatbot' && <ChatbotNew initialPrompt={chatPrompt} />}
      {activeTab === 'youtube' && <YouTubePlayer />}
      {activeTab === 'focus' && <FocusMode />}
    </div>
  );
}

export default function CompanionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <CompanionContent />
    </Suspense>
  );
}
