'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { llmService, LLMResponse } from '../lib/services/llmService';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<LLMResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('AI Assistant: Sending request:', prompt);
      const result = await llmService.generateContent(prompt);
      console.log('AI Assistant: Received response:', result);
      setResponse(result);
    } catch (error: any) {
      console.error('AI Assistant Error:', error);
      setError(error.message || 'An unexpected error occurred');
      
      // Provide fallback response
      setResponse({
        content: `**Error occurred while processing your request:**

${error.message || 'Unknown error'}

**Troubleshooting Steps:**
1. Check your internet connection
2. Verify the Gemini API key is correct
3. Try a simpler question
4. Refresh the page and try again

**Your question was:** "${prompt}"

The AI system is configured and should be working. This might be a temporary connectivity issue.`,
        provider: 'gemini'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setPrompt(action);
    setError(null);
  };

  const providerStatus = llmService.getProviderStatus();

  return (
    <div className="stark-glass p-6">
      <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center hud-font">
        <Brain className="mr-2" size={20} />
        STARK AI Assistant
      </h3>

      {/* Provider Status */}
      <div className="mb-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-400/20">
        <div className="hud-font text-xs text-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-indigo-400">Active Provider:</strong> {providerStatus.primary.toUpperCase()}
              {providerStatus.fallback !== providerStatus.primary && (
                <span> | <strong className="text-purple-400">Fallback:</strong> {providerStatus.fallback.toUpperCase()}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {providerStatus.geminiAvailable ? (
                <CheckCircle className="text-green-400" size={14} />
              ) : (
                <AlertCircle className="text-red-400" size={14} />
              )}
              <span className="text-xs">Gemini</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-500/10 border border-red-400/20 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-400" size={16} />
            <span className="hud-font text-sm text-red-400">Connection Error</span>
          </div>
          <p className="hud-font text-xs text-gray-300 mt-1">{error}</p>
        </motion.div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything about academics, travel, coding..."
            className="flex-1 px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white placeholder-gray-400 hud-font text-sm focus:outline-none focus:border-indigo-400"
            disabled={loading}
          />
          <motion.button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hud-font text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Send size={16} />
            )}
          </motion.button>
        </div>
      </form>

      {/* Response */}
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="system-card p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Brain className="text-indigo-400" size={16} />
              <span className="hud-font text-sm font-medium text-indigo-400">
                AI Response
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="hud-font text-xs text-gray-400 uppercase">
                {response.provider}
              </div>
              {!error && <CheckCircle className="text-green-400" size={14} />}
            </div>
          </div>
          
          <div className="hud-font text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {response.content}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="mt-6">
        <h4 className="hud-font text-sm font-medium text-gray-400 mb-3">Quick Actions:</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            'Explain quantum physics basics',
            'Plan a trip to Tokyo',
            'Review my JavaScript code',
            'Help with calculus homework'
          ].map((action, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="p-3 text-left bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/20 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="hud-font text-xs text-gray-300">{action}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Test Connection Buttons */}
      <div className="mt-4 pt-4 border-t border-indigo-400/20">
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            onClick={() => handleQuickAction('Hello, please respond to test the connection')}
            className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 rounded-lg transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="hud-font text-xs text-indigo-400">Test Chat</div>
          </motion.button>
          
          <motion.button
            onClick={async () => {
              setLoading(true);
              try {
                const response = await fetch('/api/verify-gemini');
                const data = await response.json();
                console.log('API Verification Result:', data);
                
                if (data.success) {
                  setResponse({
                    content: `✅ **API Verification Successful!**\n\n**Gemini Response:** ${data.response}\n\n**API Key Status:** Valid (${data.apiKeyLength} chars)\n**Key Prefix:** ${data.apiKeyPrefix}`,
                    provider: 'gemini'
                  });
                  setError(null);
                } else {
                  setError(`API Verification Failed: ${data.error}`);
                  setResponse({
                    content: `❌ **API Verification Failed**\n\n**Error:** ${data.error}\n\n**Status Code:** ${data.status || 'Unknown'}\n**API Key Length:** ${data.apiKeyLength || 'Unknown'}\n**Key Prefix:** ${data.apiKeyPrefix || 'Unknown'}\n\n**Troubleshooting:**\n1. Verify your API key is correct\n2. Check if the Gemini API is enabled\n3. Ensure you have proper permissions`,
                    provider: 'gemini'
                  });
                }
              } catch (err: any) {
                setError(`Verification Error: ${err.message}`);
              } finally {
                setLoading(false);
              }
            }}
            className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
          >
            <div className="hud-font text-xs text-green-400">
              {loading ? 'Verifying...' : 'Verify API'}
            </div>
          </motion.button>

          <motion.button
            onClick={async () => {
              setLoading(true);
              try {
                const response = await fetch('/api/test-gemini', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt: 'Hello, this is a test. Please respond with "Direct API test successful".' })
                });
                const data = await response.json();
                console.log('Direct API Test Result:', data);
                
                if (data.success) {
                  setResponse({
                    content: `✅ **Direct API Test Successful!**\n\nGemini Response: ${data.response}`,
                    provider: 'gemini'
                  });
                  setError(null);
                } else {
                  setError(`Direct API Test Failed: ${data.error}`);
                }
              } catch (err: any) {
                setError(`Direct API Test Error: ${err.message}`);
              } finally {
                setLoading(false);
              }
            }}
            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
          >
            <div className="hud-font text-xs text-purple-400">
              {loading ? 'Testing...' : 'Direct Test'}
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}