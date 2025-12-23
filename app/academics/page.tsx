'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface Mark {
  id: string;
  subjectName: string;
  internalMarks: number;
  externalMarks: number;
  total: number;
  semester: string;
}

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Done';
  notes: string;
}

export default function AcademicsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'marks' | 'assignments'>('marks');
  const [marks, setMarks] = useState<Mark[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [markForm, setMarkForm] = useState({
    subjectName: '',
    internalMarks: 0,
    externalMarks: 0,
    semester: '',
  });
  const [assignmentForm, setAssignmentForm] = useState({
    subject: '',
    title: '',
    dueDate: '',
    status: 'Pending' as const,
    notes: '',
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchMarks();
      fetchAssignments();
    }
  }, [user]);

  const fetchMarks = async () => {
    if (!user) return;
    const q = query(collection(db, 'marks'), where('uid', '==', user.uid));
    const snapshot = await getDocs(q);
    const marksData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Mark[];
    setMarks(marksData);
  };

  const fetchAssignments = async () => {
    if (!user) return;
    const q = query(collection(db, 'assignments'), where('uid', '==', user.uid));
    const snapshot = await getDocs(q);
    const assignmentsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Assignment[];
    setAssignments(assignmentsData);
  };

  const handleMarkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const total = markForm.internalMarks + markForm.externalMarks;
    await addDoc(collection(db, 'marks'), {
      ...markForm,
      total,
      uid: user.uid,
    });

    setMarkForm({ subjectName: '', internalMarks: 0, externalMarks: 0, semester: '' });
    setShowMarkForm(false);
    fetchMarks();
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await addDoc(collection(db, 'assignments'), {
      ...assignmentForm,
      uid: user.uid,
    });

    setAssignmentForm({ subject: '', title: '', dueDate: '', status: 'Pending', notes: '' });
    setShowAssignmentForm(false);
    fetchAssignments();
  };

  const handleDeleteMark = async (id: string) => {
    await deleteDoc(doc(db, 'marks', id));
    fetchMarks();
  };

  const handleDeleteAssignment = async (id: string) => {
    await deleteDoc(doc(db, 'assignments', id));
    fetchAssignments();
  };

  const handleAskChatbot = (assignment: Assignment) => {
    const prompt = `Help me break down this assignment: ${assignment.title}, subject: ${assignment.subject}, due on ${assignment.dueDate}, notes: ${assignment.notes}. Give me a step-by-step plan.`;
    router.push(`/companion?tab=chatbot&prompt=${encodeURIComponent(prompt)}`);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">Academics 📚</h1>
      <p className="text-slate-600 dark:text-gray-300 mb-8">Track your marks and assignments</p>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('marks')}
          className={`px-6 py-3 rounded-xl transition-all font-medium ${activeTab === 'marks'
            ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg'
            : 'bg-white/40 dark:bg-white/10 text-slate-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/20'
            }`}
        >
          📊 Current Marks
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-6 py-3 rounded-xl transition-all font-medium ${activeTab === 'assignments'
            ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg'
            : 'bg-white/40 dark:bg-white/10 text-slate-600 dark:text-gray-300 hover:bg-white/20'
            }`}
        >
          📝 Assignments
        </button>
      </div>

      {activeTab === 'marks' ? (
        <>
          <div className="mb-6">
            <PrimaryButton onClick={() => setShowMarkForm(!showMarkForm)}>
              {showMarkForm ? 'Cancel' : '+ Add Marks'}
            </PrimaryButton>
          </div>

          {showMarkForm && (
            <GlassCard className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Add Marks</h2>
              <form onSubmit={handleMarkSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Subject</label>
                    <input
                      type="text"
                      value={markForm.subjectName}
                      onChange={(e) => setMarkForm({ ...markForm, subjectName: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Semester</label>
                    <input
                      type="text"
                      value={markForm.semester}
                      onChange={(e) => setMarkForm({ ...markForm, semester: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Internal Marks</label>
                    <input
                      type="number"
                      value={markForm.internalMarks}
                      onChange={(e) => setMarkForm({ ...markForm, internalMarks: parseInt(e.target.value) })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">External Marks</label>
                    <input
                      type="number"
                      value={markForm.externalMarks}
                      onChange={(e) => setMarkForm({ ...markForm, externalMarks: parseInt(e.target.value) })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                </div>
                <PrimaryButton type="submit" className="w-full">
                  Add Marks
                </PrimaryButton>
              </form>
            </GlassCard>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marks.map((mark) => (
              <GlassCard key={mark.id}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{mark.subjectName}</h3>
                  <span className="px-2 py-1 text-xs rounded-lg bg-cyan-600/10 dark:bg-neon-cyan/30 text-cyan-700 dark:text-neon-cyan font-medium">
                    {mark.semester}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-gray-300">
                  <p>Internal: {mark.internalMarks}</p>
                  <p>External: {mark.externalMarks}</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-neon-purple">Total: {mark.total}</p>
                </div>
                <button
                  onClick={() => handleDeleteMark(mark.id)}
                  className="mt-4 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </GlassCard>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <PrimaryButton onClick={() => setShowAssignmentForm(!showAssignmentForm)}>
              {showAssignmentForm ? 'Cancel' : '+ Add Assignment'}
            </PrimaryButton>
          </div>

          {showAssignmentForm && (
            <GlassCard className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Add Assignment</h2>
              <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Subject</label>
                    <input
                      type="text"
                      value={assignmentForm.subject}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Due Date</label>
                    <input
                      type="date"
                      value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Notes</label>
                  <textarea
                    value={assignmentForm.notes}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Status</label>
                  <select
                    value={assignmentForm.status}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, status: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white focus:border-neon-purple focus:outline-none"
                  >
                    <option value="Pending" className="text-black">Pending</option>
                    <option value="In Progress" className="text-black">In Progress</option>
                    <option value="Done" className="text-black">Done</option>
                  </select>
                </div>
                <PrimaryButton type="submit" className="w-full">
                  Add Assignment
                </PrimaryButton>
              </form>
            </GlassCard>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((assignment) => (
              <GlassCard key={assignment.id}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{assignment.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-lg font-medium ${assignment.status === 'Done'
                      ? 'bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300'
                      : assignment.status === 'In Progress'
                        ? 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-300'
                        : 'bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-300'
                      }`}
                  >
                    {assignment.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-gray-300 mb-4">
                  <p>📚 {assignment.subject}</p>
                  <p>📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  {assignment.notes && <p>📝 {assignment.notes}</p>}
                </div>
                <div className="flex space-x-2">
                  <PrimaryButton onClick={() => handleAskChatbot(assignment)} className="flex-1">
                    Ask Chatbot
                  </PrimaryButton>
                  <button
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-all font-medium"
                  >
                    Delete
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
