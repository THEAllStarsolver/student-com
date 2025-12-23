'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface Tracker {
  id: string;
  name: string;
  type: 'study' | 'habit' | 'goal';
  target: number;
  progress: number;
  date: string;
  uid: string;
}

export default function TrackerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTracker, setEditingTracker] = useState<Tracker | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'study' as 'study' | 'habit' | 'goal',
    target: '',
    progress: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTrackers();
    }
  }, [user]);

  const fetchTrackers = async () => {
    try {
      const trackersQuery = query(
        collection(db, 'trackers'),
        where('uid', '==', user!.uid),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(trackersQuery);
      const trackersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tracker[];
      setTrackers(trackersData);
    } catch (error) {
      console.error('Error fetching trackers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        type: formData.type,
        target: parseFloat(formData.target),
        progress: parseFloat(formData.progress),
        date: formData.date,
        uid: user!.uid
      };

      if (editingTracker) {
        await updateDoc(doc(db, 'trackers', editingTracker.id), data);
      } else {
        await addDoc(collection(db, 'trackers'), data);
      }
      
      setFormData({ name: '', type: 'study', target: '', progress: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      setEditingTracker(null);
      fetchTrackers();
    } catch (error) {
      console.error('Error saving tracker:', error);
    }
  };

  const deleteTracker = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'trackers', id));
      fetchTrackers();
    } catch (error) {
      console.error('Error deleting tracker:', error);
    }
  };

  const editTracker = (tracker: Tracker) => {
    setEditingTracker(tracker);
    setFormData({
      name: tracker.name,
      type: tracker.type,
      target: tracker.target.toString(),
      progress: tracker.progress.toString(),
      date: tracker.date
    });
    setShowForm(true);
  };

  const updateProgress = async (tracker: Tracker, newProgress: number) => {
    try {
      await updateDoc(doc(db, 'trackers', tracker.id), {
        progress: Math.min(newProgress, tracker.target)
      });
      fetchTrackers();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getProgressPercentage = (progress: number, target: number) => {
    return target > 0 ? Math.min((progress / target) * 100, 100) : 0;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'study': return '📚';
      case 'habit': return '🎯';
      case 'goal': return '🏆';
      default: return '📊';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'text-blue-400 border-blue-400';
      case 'habit': return 'text-green-400 border-green-400';
      case 'goal': return 'text-purple-400 border-purple-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const groupedTrackers = trackers.reduce((acc, tracker) => {
    if (!acc[tracker.type]) acc[tracker.type] = [];
    acc[tracker.type].push(tracker);
    return acc;
  }, {} as Record<string, Tracker[]>);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Habit Tracker 📈
        </h1>
        <p className="text-xl text-slate-300">Track your study hours, habits, and goals</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="text-slate-300">
          <span className="text-neon-cyan font-semibold">{trackers.length}</span> items tracked
        </div>
        <PrimaryButton onClick={() => setShowForm(true)}>
          Add New Tracker
        </PrimaryButton>
      </div>

      {showForm && (
        <GlassCard className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingTracker ? 'Edit Tracker' : 'Add New Tracker'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tracker name (e.g., Study Hours, Exercise, Reading)"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as 'study' | 'habit' | 'goal'})}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
              >
                <option value="study">Study</option>
                <option value="habit">Habit</option>
                <option value="goal">Goal</option>
              </select>
              <input
                type="number"
                placeholder="Target (hours/count)"
                value={formData.target}
                onChange={(e) => setFormData({...formData, target: e.target.value})}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
                min="0"
                step="0.1"
                required
              />
              <input
                type="number"
                placeholder="Current progress"
                value={formData.progress}
                onChange={(e) => setFormData({...formData, progress: e.target.value})}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
                min="0"
                step="0.1"
                required
              />
            </div>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
              required
            />
            <div className="flex gap-2">
              <PrimaryButton type="submit">
                {editingTracker ? 'Update Tracker' : 'Add Tracker'}
              </PrimaryButton>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTracker(null);
                  setFormData({ name: '', type: 'study', target: '', progress: '', date: new Date().toISOString().split('T')[0] });
                }}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {Object.entries(groupedTrackers).map(([type, typeTrackers]) => (
        <div key={type} className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>{getTypeIcon(type)}</span>
            {type.charAt(0).toUpperCase() + type.slice(1)} Trackers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typeTrackers.map((tracker) => {
              const percentage = getProgressPercentage(tracker.progress, tracker.target);
              
              return (
                <GlassCard key={tracker.id}>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{tracker.name}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs border ${getTypeColor(tracker.type)}`}>
                        {tracker.type}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">Date: {new Date(tracker.date).toLocaleDateString()}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                      <span>Progress</span>
                      <span>{tracker.progress} / {tracker.target}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-neon-purple to-neon-pink h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-center text-sm text-slate-300 mt-1">{percentage.toFixed(1)}%</p>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => updateProgress(tracker, tracker.progress + 0.5)}
                      className="flex-1 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-all"
                    >
                      +0.5
                    </button>
                    <button
                      onClick={() => updateProgress(tracker, tracker.progress + 1)}
                      className="flex-1 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-all"
                    >
                      +1
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editTracker(tracker)}
                      className="flex-1 px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTracker(tracker.id)}
                      className="flex-1 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      ))}

      {trackers.length === 0 && !showForm && (
        <GlassCard className="text-center py-12">
          <h3 className="text-xl font-bold text-white mb-2">No Trackers Added</h3>
          <p className="text-slate-400 mb-4">Start tracking your habits, study hours, and goals</p>
          <PrimaryButton onClick={() => setShowForm(true)}>
            Add Your First Tracker
          </PrimaryButton>
        </GlassCard>
      )}
    </div>
  );
}