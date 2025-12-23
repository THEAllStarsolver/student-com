import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stark: {
          bg: '#05070a',
          surface: '#0a0e14',
          border: '#1a1f2e',
          cyan: '#22d3ee',
          emerald: '#34d399',
          gold: '#fbbf24',
          red: '#ef4444',
        },
        nightshade: {
          bg: '#050508',
          panel: 'rgba(10, 10, 21, 0.9)',
          border: '#1a1a2e',
          accent: '#818cf8',
          text: '#e2e8f0',
        },
        neon: {
          purple: '#a855f7',
          cyan: '#06b6d4',
          pink: '#ec4899',
        },
        jarvis: {
          blue: '#22d3ee',
          purple: '#8b5cf6',
          dark: '#0f172a',
          darker: '#020617',
        },
      },
      fontFamily: {
        'hud': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'arc-reactor-inner': 'spin 1.5s linear infinite',
        'arc-reactor-outer': 'spin-reverse 4s linear infinite',
        'arc-reactor-core': 'breathe 2s ease-in-out infinite',
        'helmet-pulse': 'helmet-pulse 3s ease-in-out infinite',
        'plane-takeoff': 'plane-takeoff 8s ease-in-out infinite',
        'plane-landing': 'plane-landing 8s ease-in-out infinite',
        'radar-pulse': 'radar-pulse 2s ease-in-out infinite',
        'hud-rotate': 'hud-rotate 20s linear infinite',
        'eye-pulse': 'eye-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        'helmet-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'plane-takeoff': {
          '0%': { transform: 'translate(-100px, 100px) rotate(-45deg)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translate(100px, -100px) rotate(-45deg)', opacity: '0' },
        },
        'plane-landing': {
          '0%': { transform: 'translate(100px, -100px) rotate(135deg)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translate(-100px, 100px) rotate(135deg)', opacity: '0' },
        },
        'radar-pulse': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        'hud-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'eye-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)
        `,
        'nightshade-gradient': `
          radial-gradient(circle at 25% 25%, rgba(129, 140, 248, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(129, 140, 248, 0.05) 0%, transparent 50%)
        `,
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}
export default config
