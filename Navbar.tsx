'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Companion', path: '/companion', icon: '💬' },
  { name: 'Travel', path: '/travel', icon: '✈️' },
  { name: 'Internships', path: '/internships', icon: '💼' },
  { name: 'Events', path: '/events', icon: '📅' },
  { name: 'Academics', path: '/academics', icon: '📚' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium text-sm
                    ${pathname === item.path
                      ? 'backdrop-blur-xl bg-white/10 text-white border border-white/20 shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
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
