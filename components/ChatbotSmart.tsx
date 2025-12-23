'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, Plane, Zap } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

export default function ChatbotSmart({ initialPrompt }: { initialPrompt?: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    setError('');
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setLoading(true);

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/llm-smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get response. Please try again.');
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: `Error: ${err.message}` }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'Show flights from Lucknow to Mumbai tomorrow',
    'Find videos about studying',
    'What features do you have?',
    'Help me with internship search',
  ];

  return (
    <div className="flex flex-col h-full bg-[#050508] rounded-xl border border-indigo-500/20 overflow-hidden">
      {/* Header */}
      <div className="border-b border-indigo-500/20 bg-indigo-500/5 px-6 py-4">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold text-white">AI Smart Assistant</h2>
          <Zap className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-sm text-indigo-400/70">Powered by Groq • Can access app features</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Hey! 👋</h3>
              <p className="text-slate-400 mb-6">I can help you with flights, hotels, internships, and more!</p>
              
              <div className="space-y-2">
                <p className="text-sm text-indigo-400/70 font-semibold mb-3">Try asking me:</p>
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => setInput(q), 0);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-500/30 text-indigo-100 border border-indigo-500/50'
                    : 'bg-slate-800/50 text-slate-100 border border-slate-700/30'
                }`}
              >
                <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {message.content}
                </div>

                {/* Flight Results */}
                {message.data?.flights && Array.isArray(message.data.flights) && (
                  <div className="mt-4 space-y-2">
                    {message.data.flights.map((flight: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Plane className="w-4 h-4 text-indigo-400" />
                          <span className="font-semibold text-indigo-300">{flight.airline}</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          {flight.departure} → {flight.arrival}
                        </p>
                        <p className="text-xs text-slate-400">₹{flight.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-slate-800/50 border border-slate-700/30 text-slate-100 px-4 py-3 rounded-lg flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-sm">Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-6 mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Input */}
      <div className="border-t border-indigo-500/20 bg-indigo-500/5 p-4">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything... (flights, internships, etc)"
            rows={2}
            className="flex-1 bg-slate-800 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center h-full"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(129, 140, 248, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(129, 140, 248, 0.5);
        }
      `}</style>
    </div>
  );
}
