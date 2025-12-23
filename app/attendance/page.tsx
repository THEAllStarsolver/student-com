'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface AttendanceRecord {
  id: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  uid: string;
}

export default function AttendancePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [formData, setFormData] = useState({
    subjectName: '',
    totalClasses: '',
    attendedClasses: ''
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    try {
      const recordsQuery = query(
        collection(db, 'attendance'),
        where('uid', '==', user!.uid)
      );
      const snapshot = await getDocs(recordsQuery);
      const recordsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AttendanceRecord[];
      setRecords(recordsData);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        subjectName: formData.subjectName,
        totalClasses: parseInt(formData.totalClasses),
        attendedClasses: parseInt(formData.attendedClasses),
        uid: user!.uid
      };

      if (editingRecord) {
        await updateDoc(doc(db, 'attendance', editingRecord.id), data);
      } else {
        await addDoc(collection(db, 'attendance'), data);
      }
      
      setFormData({ subjectName: '', totalClasses: '', attendedClasses: '' });
      setShowForm(false);
      setEditingRecord(null);
      fetchRecords();
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'attendance', id));
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const editRecord = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setFormData({
      subjectName: record.subjectName,
      totalClasses: record.totalClasses.toString(),
      attendedClasses: record.attendedClasses.toString()
    });
    setShowForm(true);
  };

  const calculatePercentage = (attended: number, total: number) => {
    return total > 0 ? ((attended / total) * 100).toFixed(1) : '0.0';
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage < 75) return { color: 'text-red-400 border-red-400', status: 'Low' };
    if (percentage < 85) return { color: 'text-yellow-400 border-yellow-400', status: 'Good' };
    return { color: 'text-green-400 border-green-400', status: 'Excellent' };
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const overallAttendance = records.length > 0 
    ? records.reduce((acc, record) => {
        acc.total += record.totalClasses;
        acc.attended += record.attendedClasses;
        return acc;
      }, { total: 0, attended: 0 })
    : { total: 0, attended: 0 };

  const overallPercentage = parseFloat(calculatePercentage(overallAttendance.attended, overallAttendance.total));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Attendance Tracker 📋
        </h1>
        <p className="text-xl text-slate-300">Monitor your class attendance</p>
      </div>

      {records.length > 0 && (
        <GlassCard className="mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Overall Attendance</h3>
            <div className="text-4xl font-bold mb-2">
              <span className={getAttendanceStatus(overallPercentage).color}>
                {overallPercentage}%
              </span>
            </div>
            <p className="text-slate-300">
              {overallAttendance.attended} / {overallAttendance.total} classes attended
            </p>
            <span className={`inline-block px-3 py-1 rounded-lg text-sm border mt-2 ${getAttendanceStatus(overallPercentage).color}`}>
              {getAttendanceStatus(overallPercentage).status}
            </span>
          </div>
        </GlassCard>
      )}

      <div className="flex justify-between items-center mb-8">
        <div className="text-slate-300">
          <span className="text-neon-cyan font-semibold">{records.length}</span> subjects tracked
        </div>
        <PrimaryButton onClick={() => setShowForm(true)}>
          Add Subject
        </PrimaryButton>
      </div>

      {showForm && (
        <GlassCard className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingRecord ? 'Edit Subject' : 'Add New Subject'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Subject name"
              value={formData.subjectName}
              onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Total classes"
                value={formData.totalClasses}
                onChange={(e) => setFormData({...formData, totalClasses: e.target.value})}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
                min="0"
                required
              />
              <input
                type="number"
                placeholder="Attended classes"
                value={formData.attendedClasses}
                onChange={(e) => setFormData({...formData, attendedClasses: e.target.value})}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
                min="0"
                max={formData.totalClasses}
                required
              />
            </div>
            <div className="flex gap-2">
              <PrimaryButton type="submit">
                {editingRecord ? 'Update Subject' : 'Add Subject'}
              </PrimaryButton>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingRecord(null);
                  setFormData({ subjectName: '', totalClasses: '', attendedClasses: '' });
                }}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => {
          const percentage = parseFloat(calculatePercentage(record.attendedClasses, record.totalClasses));
          const status = getAttendanceStatus(percentage);
          
          return (
            <GlassCard key={record.id}>
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-2">{record.subjectName}</h3>
                <div className="text-3xl font-bold mb-2">
                  <span className={status.color}>{percentage}%</span>
                </div>
                <p className="text-slate-300 text-sm mb-2">
                  {record.attendedClasses} / {record.totalClasses} classes
                </p>
                <span className={`inline-block px-2 py-1 rounded-lg text-xs border ${status.color}`}>
                  {status.status}
                </span>
              </div>
              
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => editRecord(record)}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRecord(record.id)}
                  className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all"
                >
                  Delete
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {records.length === 0 && !showForm && (
        <GlassCard className="text-center py-12">
          <h3 className="text-xl font-bold text-white mb-2">No Subjects Added</h3>
          <p className="text-slate-400 mb-4">Start tracking your attendance by adding subjects</p>
          <PrimaryButton onClick={() => setShowForm(true)}>
            Add Your First Subject
          </PrimaryButton>
        </GlassCard>
      )}
    </div>
  );
}