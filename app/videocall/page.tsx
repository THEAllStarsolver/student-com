'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface CallRecord {
  id: string;
  userId: string;
  startedAt: any;
  type: string;
  notes: string;
}

export default function VideoCallPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [meetUrl, setMeetUrl] = useState('');
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [callNotes, setCallNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchCalls();
    }
  }, [user]);

  const fetchCalls = async () => {
    try {
      const callsQuery = query(
        collection(db, 'calls'),
        where('userId', '==', user!.uid),
        orderBy('startedAt', 'desc')
      );
      const snapshot = await getDocs(callsQuery);
      const callsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CallRecord[];
      setCalls(callsData);
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  const saveCallNotes = async () => {
    if (!callNotes.trim()) return;
    
    try {
      await addDoc(collection(db, 'calls'), {
        userId: user!.uid,
        startedAt: new Date(),
        type: 'notes',
        notes: callNotes
      });
      setCallNotes('');
      setShowNotes(false);
      fetchCalls();
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const createMeetLink = async () => {
    try {
      const callData = {
        userId: user!.uid,
        startedAt: new Date(),
        type: 'new_meeting',
        notes: ''
      };
      
      await addDoc(collection(db, 'calls'), callData);
      const meetUrl = 'https://meet.google.com/new';
      setMeetUrl(meetUrl);
      window.open(meetUrl, '_blank');
      fetchCalls();
    } catch (error) {
      console.error('Error creating call record:', error);
      window.open('https://meet.google.com/new', '_blank');
    }
  };

  const joinMeetDirectly = () => {
    window.open('https://meet.google.com/', '_blank');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Video Call Family 📹
        </h1>
        <p className="text-xl text-slate-300">Connect with your family via Google Meet</p>
        <p className="text-lg text-slate-400 mt-2">
          Logged in as: <span className="text-neon-cyan">{user?.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard>
          <div className="text-center">
            <div className="text-6xl mb-4">📞</div>
            <h3 className="text-2xl font-bold text-white mb-4">Create New Meeting</h3>
            <p className="text-slate-300 mb-6">
              Start a new Google Meet session and share the link with your family
            </p>
            <PrimaryButton onClick={createMeetLink} className="w-full">
              Create Meeting
            </PrimaryButton>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-center">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-2xl font-bold text-white mb-4">Join Meeting</h3>
            <p className="text-slate-300 mb-6">
              Join an existing meeting or access Google Meet directly
            </p>
            <PrimaryButton onClick={joinMeetDirectly} className="w-full">
              Open Google Meet
            </PrimaryButton>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Call Notes</h3>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-all"
            >
              {showNotes ? 'Hide' : 'Add Notes'}
            </button>
          </div>
          
          {showNotes && (
            <div className="mb-4">
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Add notes about your call..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white h-24 mb-2"
              />
              <PrimaryButton onClick={saveCallNotes} className="w-full">
                Save Notes
              </PrimaryButton>
            </div>
          )}
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {calls.slice(0, 5).map((call) => (
              <div key={call.id} className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-white">{call.type}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(call.startedAt.toDate()).toLocaleString()}
                    </p>
                  </div>
                </div>
                {call.notes && (
                  <p className="text-sm text-slate-300 mt-2">{call.notes}</p>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-bold text-white mb-4">Quick Tips</h3>
          <ul className="text-slate-300 space-y-2">
            <li>• Your Google account ({user?.email}) will be used automatically</li>
            <li>• Share the meeting link with family members via WhatsApp or SMS</li>
            <li>• Make sure your camera and microphone permissions are enabled</li>
            <li>• For best experience, use a stable internet connection</li>
            <li>• Use call notes to remember important points from your conversations</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}