'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import EmbeddedFrame from '@/components/ui/EmbeddedFrame';

const moviePlatforms = [
  {
    name: 'BookMyShow',
    url: 'https://m.bookmyshow.com/',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=100&fit=crop',
    description: 'Book movie tickets online'
  },
  {
    name: 'Paytm Movies',
    url: 'https://tickets.paytm.com/movies',
    logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=100&fit=crop',
    description: 'Movies & entertainment booking'
  }
];

export default function MoviesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<typeof moviePlatforms[0] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="system-value text-lg mb-2">INITIALIZING SYSTEM</div>
          <div className="system-label">Loading movies module...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {selectedPlatform ? (
        <EmbeddedFrame
          src={selectedPlatform.url}
          title={selectedPlatform.name}
          onBack={() => setSelectedPlatform(null)}
        />
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Movies 🎬
              </h1>
              <p className="text-xl text-slate-300">Book movie tickets from top platforms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {moviePlatforms.map((platform) => (
                <GlassCard
                  key={platform.name}
                  onClick={() => setSelectedPlatform(platform)}
                  variant="interactive"
                  className="group cursor-pointer overflow-hidden p-0"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={platform.logo}
                      alt={platform.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="glass-panel p-4 rounded-full">
                        <span className="text-4xl">🎬</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2 text-primary">{platform.name}</h3>
                    <p className="text-secondary text-sm">{platform.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}