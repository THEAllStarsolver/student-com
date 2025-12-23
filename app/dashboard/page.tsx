'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Code,
  Map,
  TrendingUp,
  MessageSquare,
  Zap,
  Gamepad2,
  Film,
  ShoppingBag,
  UtensilsCrossed,
  Video,
  Calendar,
  Activity,
  GraduationCap,
  DollarSign,
  TrendingDown,
  Clock,
  Users,
  Brain
} from 'lucide-react';

const quotes = [
  "Believe you can and you're halfway there.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
];

const features = [
  {
    id: 'mood',
    title: 'Mood Check',
    description: 'Mental wellness monitoring',
    icon: Brain,
    href: '/companion?tab=questionnaire',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
    color: 'from-purple-500/20 to-purple-500/5'
  },
  {
    id: 'chatbot',
    title: 'AI Assistant',
    description: 'Intelligent guidance system',
    icon: MessageSquare,
    href: '/companion?tab=chatbot',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
    color: 'from-blue-500/20 to-blue-500/5'
  },
  {
    id: 'travel',
    title: 'Travel',
    description: 'Book flights & hotels',
    icon: Map,
    href: '/travel',
    image: '/icons/travel.jpeg',
    color: 'from-cyan-500/20 to-cyan-500/5'
  },
  {
    id: 'academics',
    title: 'Academics',
    description: 'View your marks',
    icon: BookOpen,
    href: '/academics',
    image: '/icons/marks.jpg',
    color: 'from-green-500/20 to-green-500/5'
  },
  {
    id: 'internships',
    title: 'Internships',
    description: 'Explore opportunities',
    icon: Zap,
    href: '/internships',
    image: '/icons/internship.jpg',
    color: 'from-orange-500/20 to-orange-500/5'
  },
  {
    id: 'events',
    title: 'Events',
    description: 'Campus events',
    icon: Calendar,
    href: '/events',
    image: '/icons/events.png',
    color: 'from-pink-500/20 to-pink-500/5'
  },
  {
    id: 'games',
    title: 'Games',
    description: 'Relax with fun games',
    icon: Gamepad2,
    href: '/games',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    color: 'from-red-500/20 to-red-500/5'
  },
  {
    id: 'movies',
    title: 'Movies',
    description: 'Watch latest films',
    icon: Film,
    href: '/movies',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    color: 'from-yellow-500/20 to-yellow-500/5'
  },
  {
    id: 'shopping',
    title: 'Shopping',
    description: 'Browse & buy products',
    icon: ShoppingBag,
    href: '/shopping',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    color: 'from-indigo-500/20 to-indigo-500/5'
  },
  {
    id: 'snacks',
    title: 'Snacks',
    description: 'Quick delivery to hostel',
    icon: UtensilsCrossed,
    href: '/snacks',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800',
    color: 'from-rose-500/20 to-rose-500/5'
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Chat with peers',
    icon: Users,
    href: '/community',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
    color: 'from-violet-500/20 to-violet-500/5'
  },
  {
    id: 'videocall',
    title: 'Video Call',
    description: 'Connect via Google Meet',
    icon: Video,
    href: '/videocall',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800',
    color: 'from-sky-500/20 to-sky-500/5'
  },
  {
    id: 'todo',
    title: 'Todo List',
    description: 'Manage your tasks',
    icon: CheckSquare,
    href: '/todo',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
    color: 'from-lime-500/20 to-lime-500/5'
  },
  {
    id: 'attendance',
    title: 'Attendance',
    description: 'Monitor class attendance',
    icon: Clock,
    href: '/attendance',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    color: 'from-amber-500/20 to-amber-500/5'
  },
  {
    id: 'tracker',
    title: 'Habit Tracker',
    description: 'Track goals & habits',
    icon: Activity,
    href: '/tracker',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    color: 'from-teal-500/20 to-teal-500/5'
  },
  {
    id: 'learning',
    title: 'Learning',
    description: 'W3Schools & guides',
    icon: GraduationCap,
    href: '/learning',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    color: 'from-fuchsia-500/20 to-fuchsia-500/5'
  },
  {
    id: 'money',
    title: 'Money Manager',
    description: 'Track expenses & budget',
    icon: DollarSign,
    href: '/money',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    color: 'from-emerald-500/20 to-emerald-500/5'
  },
  {
    id: 'stocks',
    title: 'Stock Market',
    description: 'Learn & practice trading',
    icon: TrendingDown,
    href: '/stocks',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    color: 'from-slate-500/20 to-slate-500/5'
  },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [lastMood, setLastMood] = useState<any>(null);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
        if (docSnap.exists()) {
          setUserName(docSnap.data().name || 'Student');
        }
      });

      const moodQuery = query(
        collection(db, 'moodEntries'),
        where('uid', '==', user.uid),
        limit(1)
      );
      getDocs(moodQuery).then((snapshot) => {
        if (!snapshot.empty) {
          setLastMood(snapshot.docs[0].data());
        }
      }).catch(() => { });
    }
  }, [user]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const getMoodEmoji = (mood: string) => {
    const emojis: any = {
      stressed: '😰',
      tired: '😴',
      motivated: '🔥',
      neutral: '😊',
    };
    return emojis[mood] || '😊';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <motion.div 
        className="mb-12 pb-8 border-b border-indigo-500/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
          Welcome Back, <span className="text-indigo-400">{userName || 'Student'}</span>
        </h1>
        <p className="text-slate-400 text-lg font-mono">{quote}</p>
      </motion.div>

      {/* Features Grid - 3 Columns */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Link href={feature.href}>
                <div className={`group relative h-72 rounded-2xl overflow-hidden cursor-pointer border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300`}>
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b ${feature.color} group-hover:via-indigo-500/10`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    {/* Icon Top */}
                    <div className="flex items-start">
                      <div className="p-3 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-all duration-300 border border-indigo-500/20 group-hover:border-indigo-500/50">
                        <Icon size={24} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                      </div>
                    </div>

                    {/* Title & Description Bottom */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-200">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-200">
                        {feature.description}
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-indigo-400 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>→ Explore</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 rounded-2xl" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
