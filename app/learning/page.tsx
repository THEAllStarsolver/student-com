'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface LearningSession {
  id: string;
  userId: string;
  platform: string;
  topic: string;
  url: string;
  openedAt: any;
  duration?: number;
}

interface LearningNote {
  id: string;
  userId: string;
  topic: string;
  content: string;
  updatedAt: any;
}

const learningTopics = [
  { name: 'HTML Basics', platform: 'W3Schools', url: 'https://www.w3schools.com/html/' },
  { name: 'CSS Styling', platform: 'W3Schools', url: 'https://www.w3schools.com/css/' },
  { name: 'JavaScript', platform: 'W3Schools', url: 'https://www.w3schools.com/js/' },
  { name: 'Python', platform: 'W3Schools', url: 'https://www.w3schools.com/python/' },
  { name: 'SQL Database', platform: 'W3Schools', url: 'https://www.w3schools.com/sql/' },
  { name: 'React', platform: 'W3Schools', url: 'https://www.w3schools.com/react/' },
  { name: 'Node.js', platform: 'W3Schools', url: 'https://www.w3schools.com/nodejs/' },
  { name: 'Data Structures', platform: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/data-structures/' }
];

export default function LearningPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [notes, setNotes] = useState<LearningNote[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [activeNote, setActiveNote] = useState<LearningNote | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchSessions();
      fetchNotes();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const sessionsQuery = query(
        collection(db, 'learningSessions'),
        where('userId', '==', user!.uid),
        orderBy('openedAt', 'desc')
      );
      const snapshot = await getDocs(sessionsQuery);
      const sessionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LearningSession[];
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const notesQuery = query(
        collection(db, 'learningNotes'),
        where('userId', '==', user!.uid)
      );
      const snapshot = await getDocs(notesQuery);
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LearningNote[];
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const openResource = async (topic: any) => {
    try {
      const sessionData = {
        userId: user!.uid,
        platform: topic.platform,
        topic: topic.name,
        url: topic.url,
        openedAt: new Date()
      };
      
      await addDoc(collection(db, 'learningSessions'), sessionData);
      window.open(topic.url, '_blank');
      fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const saveNote = async () => {
    if (!selectedTopic || !noteContent.trim()) return;
    
    try {
      const noteData = {
        userId: user!.uid,
        topic: selectedTopic,
        content: noteContent,
        updatedAt: new Date()
      };
      
      if (activeNote) {
        await updateDoc(doc(db, 'learningNotes', activeNote.id), noteData);
      } else {
        await addDoc(collection(db, 'learningNotes'), noteData);
      }
      
      setNoteContent('');
      setSelectedTopic('');
      setActiveNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const editNote = (note: LearningNote) => {
    setActiveNote(note);
    setSelectedTopic(note.topic);
    setNoteContent(note.content);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Learning Hub 📖
        </h1>
        <p className="text-xl text-slate-300">Study resources with notes and progress tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-6">Learning Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningTopics.map((topic) => (
              <GlassCard key={topic.name} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{topic.name}</h3>
                    <p className="text-sm text-slate-400">{topic.platform}</p>
                  </div>
                  <span className="text-2xl">📚</span>
                </div>
                <PrimaryButton 
                  onClick={() => openResource(topic)}
                  className="w-full"
                >
                  Open Resource
                </PrimaryButton>
              </GlassCard>
            ))}
          </div>

          {sessions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Sessions</h2>
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session) => (
                  <GlassCard key={session.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-white">{session.topic}</h4>
                        <p className="text-sm text-slate-400">{session.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-300">
                          {new Date(session.openedAt.toDate()).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => window.open(session.url, '_blank')}
                          className="text-xs text-neon-purple hover:underline"
                        >
                          Reopen
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Notes</h2>
          <GlassCard className="p-6 mb-6">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white mb-4"
            >
              <option value="">Select topic...</option>
              {learningTopics.map((topic) => (
                <option key={topic.name} value={topic.name}>{topic.name}</option>
              ))}
            </select>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your notes here..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white h-32 mb-4"
            />
            <div className="flex gap-2">
              <PrimaryButton onClick={saveNote} className="flex-1">
                {activeNote ? 'Update' : 'Save'} Note
              </PrimaryButton>
              {activeNote && (
                <button
                  onClick={() => {
                    setActiveNote(null);
                    setSelectedTopic('');
                    setNoteContent('');
                  }}
                  className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </GlassCard>

          <div className="space-y-4">
            {notes.map((note) => (
              <GlassCard key={note.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{note.topic}</h4>
                  <button
                    onClick={() => editNote(note)}
                    className="text-xs text-neon-purple hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-slate-300 line-clamp-3">{note.content}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}