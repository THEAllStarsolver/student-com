'use client';

import { useState, useEffect } from 'react';
import GlassCard from './ui/GlassCard';
import PrimaryButton from './ui/PrimaryButton';

interface Expense {
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
}

interface FinancialInsightsProps {
  expenses: Expense[];
}

export default function FinancialInsights({ expenses }: FinancialInsightsProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    if (expenses.length === 0) return;

    setLoading(true);
    try {
      // Analyze spending patterns
      const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as { [key: string]: number });

      const totalSpending = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
      const highestCategory = Object.entries(categoryTotals).reduce((a, b) => a[1] > b[1] ? a : b);
      
      // Calculate monthly average
      const monthlySpending = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          const currentMonth = new Date().getMonth();
          return expenseDate.getMonth() === currentMonth;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

      // Generate AI-powered insights
      const prompt = `Analyze this student's spending data and provide 3-4 practical financial insights:
      
      Total spending: ₹${totalSpending}
      Monthly spending: ₹${monthlySpending}
      Highest category: ${highestCategory[0]} (₹${highestCategory[1]})
      Category breakdown: ${JSON.stringify(categoryTotals)}
      
      Provide actionable advice for a college student in India. Focus on budgeting, saving tips, and spending optimization.`;

      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: prompt,
          context: 'financial_analysis'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiInsights = data.response.split('\n').filter((line: string) => line.trim());
        
        // Add some rule-based insights
        const ruleBasedInsights = [];
        
        if (categoryTotals.food > totalSpending * 0.4) {
          ruleBasedInsights.push("🍽️ Food spending is over 40% of total expenses. Consider meal planning and cooking at home to save money.");
        }
        
        if (categoryTotals.subscription > 1000) {
          ruleBasedInsights.push("📱 Review your subscriptions. Cancel unused services and consider family plans to reduce costs.");
        }
        
        if (monthlySpending > 15000) {
          ruleBasedInsights.push("💡 Monthly spending is high for a student. Set a weekly budget limit to track expenses better.");
        }
        
        const upiExpenses = expenses.filter(e => e.paymentMethod === 'UPI').length;
        if (upiExpenses > expenses.length * 0.8) {
          ruleBasedInsights.push("💳 Most transactions are UPI-based. Enable spending notifications to stay aware of each transaction.");
        }

        setInsights([...ruleBasedInsights, ...aiInsights.slice(0, 2)]);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      // Fallback to rule-based insights only
      const fallbackInsights = [
        "📊 Track your daily expenses to identify spending patterns",
        "🎯 Set category-wise monthly budgets to control spending",
        "💰 Try the 50-30-20 rule: 50% needs, 30% wants, 20% savings"
      ];
      setInsights(fallbackInsights);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expenses.length > 0) {
      generateInsights();
    }
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-4">💡 Financial Insights</h3>
        <p className="text-slate-400">Add some expenses to get personalized financial insights and recommendations.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">💡 AI Financial Insights</h3>
        <PrimaryButton onClick={generateInsights} disabled={loading}>
          {loading ? 'Analyzing...' : 'Refresh Insights'}
        </PrimaryButton>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-slate-200 leading-relaxed">{insight}</p>
          </div>
        ))}
        
        {insights.length === 0 && !loading && (
          <p className="text-slate-400 text-center py-4">Click "Refresh Insights" to get AI-powered financial advice.</p>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-xs text-slate-400">
          💡 These insights are AI-generated suggestions for educational purposes only. 
          Not personalized financial advice. Consult a financial advisor for investment decisions.
        </p>
      </div>
    </GlassCard>
  );
}