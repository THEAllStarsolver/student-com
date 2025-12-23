'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import FinancialInsights from '@/components/FinancialInsights';

interface Expense {
  id: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
  notes: string;
  uid: string;
  createdAt: any;
}

const categories = ['food', 'travel', 'snacks', 'subscription', 'hostel', 'misc'];
const paymentMethods = ['UPI', 'cash', 'card'];

export default function MoneyManagerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'expenses'),
        where('uid', '==', user.uid),
        orderBy('date', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const expenseData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Expense[];
        setExpenses(expenseData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'expenses'), {
        ...formData,
        amount: parseFloat(formData.amount),
        uid: user.uid,
        createdAt: new Date()
      });
      
      setFormData({
        amount: '',
        category: 'food',
        paymentMethod: 'UPI',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `bank-statements/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      await addDoc(collection(db, 'bankStatements'), {
        uid: user.uid,
        fileName: file.name,
        uploadDate: new Date(),
        downloadURL,
        processed: false
      });

      const response = await fetch('/api/pdf-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: downloadURL, uid: user.uid })
      });

      if (response.ok) {
        alert('Bank statement uploaded and processing started!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const getMonthlyTotal = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategoryTotals = () => {
    const totals: { [key: string]: number } = {};
    categories.forEach(cat => totals[cat] = 0);
    
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    
    return totals;
  };

  const categoryTotals = getCategoryTotals();
  const monthlyTotal = getMonthlyTotal();
  const highestCategory = Object.entries(categoryTotals).reduce((a, b) => a[1] > b[1] ? a : b);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Money Manager 💰
        </h1>
        <p className="text-xl text-slate-300">Track expenses and analyze spending habits</p>
        <div className="text-sm text-slate-400 mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          ⚠️ Legal Compliance: This app does not access UPI/banking data directly. All data is manually entered or uploaded by users.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-2">This Month</h3>
          <p className="text-3xl font-bold text-green-400">₹{monthlyTotal.toFixed(2)}</p>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-2">Highest Category</h3>
          <p className="text-xl font-bold text-purple-400 capitalize">{highestCategory[0]}</p>
          <p className="text-sm text-slate-400">₹{highestCategory[1].toFixed(2)}</p>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-blue-400">{expenses.length}</p>
        </GlassCard>
      </div>

      <GlassCard className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {categories.map(category => {
            const total = categoryTotals[category];
            const percentage = monthlyTotal > 0 ? (total / monthlyTotal) * 100 : 0;
            return (
              <div key={category} className="flex items-center justify-between">
                <span className="capitalize text-white font-medium">{category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-slate-300 min-w-[80px] text-right">₹{total.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="flex gap-4 mb-8">
        <PrimaryButton onClick={() => setShowAddForm(true)}>
          Add Expense
        </PrimaryButton>
        
        <label className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <PrimaryButton disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Bank Statement'}
          </PrimaryButton>
        </label>
      </div>

      {showAddForm && (
        <GlassCard className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Add New Expense</h3>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-800 capitalize">{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method} className="bg-slate-800">{method}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400"
                rows={3}
                placeholder="Optional notes..."
              />
            </div>
            
            <div className="flex gap-3">
              <PrimaryButton type="submit">Add Expense</PrimaryButton>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Financial Insights */}
      <FinancialInsights expenses={expenses} />

      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-4">Recent Expenses</h3>
        <div className="space-y-3">
          {expenses.slice(0, 10).map(expense => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">₹{expense.amount.toFixed(2)}</p>
                <p className="text-sm text-slate-400 capitalize">{expense.category} • {expense.paymentMethod}</p>
                {expense.notes && <p className="text-xs text-slate-500">{expense.notes}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-300">{new Date(expense.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <p className="text-slate-400 text-center py-8">No expenses recorded yet. Add your first expense!</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}