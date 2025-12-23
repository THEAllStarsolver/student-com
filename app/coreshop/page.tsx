'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GlassCard from '@/components/ui/GlassCard';

const coreShoppingPlatforms = [
  {
    name: 'Robu.in',
    url: 'https://robu.in/',
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=100&fit=crop',
    description: 'Electronics & robotics components',
    category: 'Electronics'
  },
  {
    name: 'Robocraze',
    url: 'https://robocraze.com/',
    logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=100&fit=crop',
    description: 'Robotics kits & sensors',
    category: 'Robotics'
  },
  {
    name: 'Element14',
    url: 'https://in.element14.com/',
    logo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=100&fit=crop',
    description: 'Electronic components & tools',
    category: 'Electronics'
  },
  {
    name: 'Electronicscomp',
    url: 'https://www.electronicscomp.com/',
    logo: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=100&fit=crop',
    description: 'Arduino, Raspberry Pi & modules',
    category: 'Development Boards'
  },
  {
    name: 'Techtonics',
    url: 'https://www.techtonics.in/',
    logo: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200&h=100&fit=crop',
    description: 'Sensors & IoT components',
    category: 'IoT'
  },
  {
    name: 'Crazy Engineers',
    url: 'https://www.crazyengineers.com/shop/',
    logo: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=200&h=100&fit=crop',
    description: 'Engineering project kits',
    category: 'Project Kits'
  }
];

export default function CoreShopPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<typeof coreShoppingPlatforms[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const categories = ['All', ...Array.from(new Set(coreShoppingPlatforms.map(p => p.category)))];
  const filteredPlatforms = selectedCategory === 'All' 
    ? coreShoppingPlatforms 
    : coreShoppingPlatforms.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Core Field Shopping 🔧
        </h1>
        <p className="text-xl text-slate-300">Shop for electronics, robotics, and engineering components</p>
      </div>

      {selectedPlatform ? (
        <GlassCard className="h-[85vh]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedPlatform.name}</h2>
              <p className="text-slate-400">{selectedPlatform.category}</p>
            </div>
            <button
              onClick={() => setSelectedPlatform(null)}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
            >
              Back to Shops
            </button>
          </div>
          <iframe
            src={selectedPlatform.url}
            className="w-full h-full rounded-xl border border-white/10"
            frameBorder="0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-top-navigation-by-user-activation"
          />
        </GlassCard>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlatforms.map((platform) => (
              <GlassCard
                key={platform.name}
                onClick={() => setSelectedPlatform(platform)}
                className="group cursor-pointer overflow-hidden p-0 hover:scale-105 transition-transform"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-neon-purple/20 border border-neon-purple/30 text-neon-purple rounded-lg text-xs">
                      {platform.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <span className="text-4xl">🔧</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 text-white">{platform.name}</h3>
                  <p className="text-slate-400 text-sm">{platform.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {!selectedPlatform && (
        <GlassCard className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Popular Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-3xl mb-2">🤖</div>
              <p className="text-sm text-slate-300">Robotics Kits</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-3xl mb-2">📡</div>
              <p className="text-sm text-slate-300">Sensors</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-3xl mb-2">💻</div>
              <p className="text-sm text-slate-300">Dev Boards</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-3xl mb-2">🔌</div>
              <p className="text-sm text-slate-300">Components</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}