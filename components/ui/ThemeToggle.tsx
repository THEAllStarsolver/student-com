'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    if (saved) {
      const theme = saved === 'dark';
      setIsDark(theme);
      updateTheme(theme);
    } else {
      updateTheme(true); // Default to dark
    }
  }, []);

  const updateTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    updateTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)'
      }}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {/* Toggle Indicator */}
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
          isDark ? 'left-0.5' : 'left-6'
        }`}
        style={{
          background: 'var(--text-accent)',
          border: '1px solid var(--text-accent)',
          boxShadow: '0 0 8px var(--arc-glow)'
        }}
      >
        {/* Arc Reactor Ring */}
        <div className="absolute inset-0.5 rounded-full border border-white/60" />
        <div className="absolute inset-1 rounded-full border border-white/30" />
      </div>

      {/* System Labels */}
      <div className="absolute -top-6 left-0 right-0 flex justify-between">
        <span className="system-label text-xs opacity-60">DARK</span>
        <span className="system-label text-xs opacity-60">LIGHT</span>
      </div>
    </button>
  );
}