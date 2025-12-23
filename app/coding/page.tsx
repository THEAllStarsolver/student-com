'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { callLLM } from '@/lib/llm';

interface CodingProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: string;
  starterCode: string;
  testCases: { input: string; output: string }[];
}

const externalPlatforms = [
  { name: 'LeetCode', url: 'https://leetcode.com/', description: 'Algorithm problems' },
  { name: 'HackerRank', url: 'https://www.hackerrank.com/', description: 'Coding challenges' },
  { name: 'CodeChef', url: 'https://www.codechef.com/', description: 'Programming contests' },
  { name: 'Codeforces', url: 'https://codeforces.com/', description: 'Competitive programming' }
];

export default function CodingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'playground' | 'external'>('playground');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProblems();
    }
  }, [user]);

  useEffect(() => {
    if (selectedProblem) {
      setCode(selectedProblem.starterCode);
    }
  }, [selectedProblem]);

  const fetchProblems = async () => {
    try {
      const problemsQuery = query(collection(db, 'codingProblems'));
      const snapshot = await getDocs(problemsQuery);
      const problemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CodingProblem[];
      setProblems(problemsData);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const runCode = async () => {
    if (!selectedProblem) return;
    
    setIsRunning(true);
    try {
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          language: selectedProblem.language 
        })
      });
      
      const data = await response.json();
      setOutput(data.output || data.error || 'No output');
    } catch (error) {
      setOutput('Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const getAIHelp = async () => {
    if (!code.trim()) return;
    
    try {
      const prompt = `Analyze this code and provide suggestions for improvement:\n\n${code}`;
      const response = await callLLM(prompt);
      setOutput(`AI Suggestions:\n${response}`);
    } catch (error) {
      setOutput('AI help unavailable');
    }
  };

  const openExternalPlatform = (platform: typeof externalPlatforms[0]) => {
    window.open(platform.url, '_blank');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Coding Practice 💻
        </h1>
        <p className="text-xl text-slate-300">Internal playground and external platforms</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('playground')}
          className={`px-6 py-3 rounded-xl transition-all ${
            activeTab === 'playground'
              ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          🎨 Code Playground
        </button>
        <button
          onClick={() => setActiveTab('external')}
          className={`px-6 py-3 rounded-xl transition-all ${
            activeTab === 'external'
              ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          🌐 External Platforms
        </button>
      </div>

      {activeTab === 'playground' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <GlassCard className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">Problems</h3>
              <div className="space-y-2">
                {problems.length === 0 ? (
                  <p className="text-slate-400 text-sm">No problems available. Admin needs to add problems.</p>
                ) : (
                  problems.map((problem) => (
                    <button
                      key={problem.id}
                      onClick={() => setSelectedProblem(problem)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedProblem?.id === problem.id
                          ? 'bg-neon-purple/20 border border-neon-purple/30'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-sm font-semibold text-white">{problem.title}</div>
                      <div className="text-xs text-slate-400">{problem.difficulty}</div>
                    </button>
                  ))
                )}
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-3">
            {selectedProblem ? (
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedProblem.title}</h2>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        selectedProblem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        selectedProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedProblem.difficulty}
                      </span>
                    </div>
                    <span className="text-sm text-slate-400">{selectedProblem.language}</span>
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedProblem.description}</p>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Code Editor</h3>
                    <div className="flex gap-2">
                      <PrimaryButton onClick={runCode} disabled={isRunning}>
                        {isRunning ? 'Running...' : 'Run Code'}
                      </PrimaryButton>
                      <button
                        onClick={getAIHelp}
                        className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
                      >
                        AI Help
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 px-4 py-3 rounded-xl bg-slate-900 border border-white/20 focus:border-neon-purple focus:outline-none text-white font-mono text-sm"
                    placeholder="Write your code here..."
                  />
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Output</h3>
                  <pre className="bg-slate-900 p-4 rounded-xl text-green-400 font-mono text-sm whitespace-pre-wrap">
                    {output || 'Run your code to see output...'}
                  </pre>
                </GlassCard>
              </div>
            ) : (
              <GlassCard className="p-12 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Select a Problem</h3>
                <p className="text-slate-400">Choose a problem from the sidebar to start coding</p>
              </GlassCard>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {externalPlatforms.map((platform) => (
            <GlassCard key={platform.name} className="p-6 text-center">
              <div className="text-6xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{platform.description}</p>
              <PrimaryButton 
                onClick={() => openExternalPlatform(platform)}
                className="w-full"
              >
                Open {platform.name}
              </PrimaryButton>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}