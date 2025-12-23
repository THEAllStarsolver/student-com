'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  createdBy: string;
  isCollegeEvent: boolean;
}

export default function EventsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    dateTime: '',
    isCollegeEvent: false,
  });

  // TODO: Replace with real role/claim check
  const isAdmin = true;

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    const q = query(collection(db, 'events'), orderBy('dateTime', 'asc'));
    const snapshot = await getDocs(q);
    const eventsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];
    setEvents(eventsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await addDoc(collection(db, 'events'), {
      ...formData,
      createdBy: user.uid,
    });

    setFormData({
      title: '',
      description: '',
      location: '',
      dateTime: '',
      isCollegeEvent: false,
    });
    setShowForm(false);
    fetchEvents();
  };

  const handleDelete = async (eventId: string) => {
    if (confirm('Delete this event?')) {
      await deleteDoc(doc(db, 'events', eventId));
      fetchEvents();
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Events 📅</h1>
          <p className="text-gray-300">Discover and manage campus events</p>
        </div>
        {isAdmin && (
          <PrimaryButton onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Event'}
          </PrimaryButton>
        )}
      </div>

      {showForm && isAdmin && (
        <GlassCard className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isCollegeEvent}
                onChange={(e) => setFormData({ ...formData, isCollegeEvent: e.target.checked })}
                className="mr-2 rounded border-gray-300 text-neon-purple focus:ring-neon-purple"
              />
              <label className="text-sm text-slate-700 dark:text-gray-300">College Event</label>
            </div>
            <PrimaryButton type="submit" className="w-full">
              Create Event
            </PrimaryButton>
          </form>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <div className="col-span-2 text-center text-slate-500 dark:text-gray-400 py-12">
            No events yet. {isAdmin && 'Create one to get started!'}
          </div>
        ) : (
          events.map((event) => (
            <GlassCard key={event.id}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{event.title}</h3>
                {event.isCollegeEvent && (
                  <span className="px-2 py-1 text-xs rounded-lg bg-neon-purple/10 dark:bg-neon-purple/30 text-purple-700 dark:text-neon-purple font-medium">
                    College
                  </span>
                )}
              </div>
              <p className="text-slate-600 dark:text-gray-300 text-sm mb-3">{event.description}</p>
              <div className="space-y-1 text-sm text-slate-500 dark:text-gray-400">
                <p>📍 {event.location}</p>
                <p>🕒 {new Date(event.dateTime).toLocaleString()}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(event.id)}
                  className="mt-4 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
