'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { callLLM } from '@/lib/llm';
import GlassCard from './ui/GlassCard';
import PrimaryButton from './ui/PrimaryButton';

const questions = [
  'How stressed do you feel today?',
  'How well did you sleep last night?',
  'How motivated are you to study?',
  'How anxious do you feel?',
  'How energetic do you feel?',
  'How satisfied are you with your progress?',
];

export default function MoodQuestionnaire() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(3));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSliderChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitted(true);

    try {
      const moodResult = await getAnalysis();
      setResult(moodResult);

      if (user) {
        await addDoc(collection(db, 'moodEntries'), {
          uid: user.uid,
          timestamp: new Date().toISOString(),
          answers,
          moodScore: moodResult.score,
          moodLabel: moodResult.label,
        });
      }
    } catch (error) {
      console.error('Error submitting mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnalysis = async () => {
    const prompt = `
      Based on these survey answers (1-5 scale, where 1 is low/poor and 5 is high/good):
      1. Stress level: ${answers[0]}
      2. Sleep quality: ${answers[1]}
      3. Motivation: ${answers[2]}
      4. Anxiety: ${answers[3]}
      5. Energy: ${answers[4]}
      6. Satisfaction: ${answers[5]}

      Analyze the student's mood. Return a valid JSON object ONLY, with no extra text or markdown formatting.
      Structure:
      {
        "score": number (average of inputs, 1 decimal),
        "label": string (one word summary like "stressed", "motivated", "tired", "anxious", "content"),
        "suggestions": string[] (4 specific, actionable tips based on the specific low scores)
      }
    `;

    try {
      const response = await callLLM(prompt);
      // Clean up markdown if present (e.g. ```json ... ```)
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(jsonStr);
      return data;
    } catch (e) {
      console.error("Mood analysis failed", e);
      // Fallback
      return {
        score: answers.reduce((a, b) => a + b, 0) / answers.length,
        label: "neutral",
        suggestions: ["Take a deep breath", "Stay hydrated", "Rest well", "Keep going"]
      };
    }
  };

  // We need to change the component state to handle async loading


  if (submitted) {
    if (loading || !result) {
      return (
        <GlassCard>
          <div className="flex flex-col items-center justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-xl">Analyzing your mood...</p>
          </div>
        </GlassCard>
      );
    }

    return (
      <GlassCard>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {result.label === 'stressed' && '😰'}
            {result.label === 'tired' && '😴'}
            {result.label === 'motivated' && '🔥'}
            {result.label === 'neutral' && '😊'}
          </div>
          <h2 className="text-2xl font-bold mb-2">You're feeling {result.label}</h2>
          <p className="text-gray-300">Mood Score: {result.score.toFixed(1)}/5</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Suggestions for you:</h3>
          {result.suggestions.map((suggestion: string, i: number) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm">✨ {suggestion}</p>
            </div>
          ))}
        </div>

        <PrimaryButton onClick={() => setSubmitted(false)} className="w-full mt-6">
          Take Another Check
        </PrimaryButton>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-6">How are you feeling today?</h2>
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-2">{question}</label>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400">Low</span>
              <input
                type="range"
                min="1"
                max="5"
                value={answers[index]}
                onChange={(e) => handleSliderChange(index, parseInt(e.target.value))}
                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-400">High</span>
              <span className="text-sm font-semibold w-8 text-center">{answers[index]}</span>
            </div>
          </div>
        ))}
      </div>
      <PrimaryButton onClick={handleSubmit} className="w-full mt-6">
        Submit
      </PrimaryButton>
    </GlassCard>
  );
}
