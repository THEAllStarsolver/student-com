'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Companion', path: '/companion', icon: '💬' },
  { name: 'Video Call', path: '/videocall', icon: '📹' },
  { name: 'Todo', path: '/todo', icon: '✅' },
  { name: 'Attendance', path: '/attendance', icon: '📋' },
  { name: 'Tracker', path: '/tracker', icon: '📈' },
  { name: 'Learning', path: '/learning', icon: '📖' },
  { name: 'Coding', path: '/coding', icon: '💻' },
  { name: 'Design', path: '/design', icon: '🎨' },
  { name: 'Core Shop', path: '/coreshop', icon: '🔧' },
  { name: 'Games', path: '/games', icon: '🎮' },
  { name: 'Movies', path: '/movies', icon: '🎬' },
  { name: 'Shopping', path: '/shopping', icon: '🛒' },
  { name: 'Snacks', path: '/snacks', icon: '🍿' },
  { name: 'Community', path: '/community', icon: '👥' },
  { name: 'Money', path: '/money', icon: '💰' },
  { name: 'Stocks', path: '/stocks', icon: '📈' },
  { name: 'Travel', path: '/travel', icon: '✈️' },
  { name: 'Internships', path: '/internships', icon: '💼' },
  { name: 'Events', path: '/events', icon: '📅' },
  { name: 'Academics', path: '/academics', icon: '📚' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [focusModeActive, setFocusModeActive] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'focusMode', user.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setFocusModeActive(data.isActive || false);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (!user || pathname === '/login' || pathname === '/register') return null;

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="max-w-[85rem] w-full backdrop-blur-2xl bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 px-6 py-3 transition-all duration-300 hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-neon-purple/10 hover:border-black/10 dark:hover:border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link href="/dashboard" className="text-2xl font-bold text-white hover:scale-105 transition-transform">
              Student Companion
            </Link>
            <div className="hidden md:flex space-x-2">
              {navItems.map((item) => {
                const allowedInFocus = ['Dashboard', 'Companion', 'Coding'];
                const isRestricted = focusModeActive && !allowedInFocus.includes(item.name);
                return (
                  <Link
                    key={item.path}
                    href={isRestricted ? '#' : item.path}
                    className={`
                      px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium text-sm
                      ${isRestricted
                        ? 'text-slate-500 cursor-not-allowed opacity-50'
                        : pathname === item.path
                        ? 'backdrop-blur-xl bg-white/10 text-white border border-white/20 shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                    onClick={isRestricted ? (e) => e.preventDefault() : undefined}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                    {isRestricted && <span className="text-xs">🔒</span>}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={logout}
              className="px-5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}