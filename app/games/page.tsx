'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';

interface Game {
  id: string;
  title: string;
  gameUrl: string;
  thumbnail: string;
  isActive: boolean;
}

export default function GamesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loadingGames, setLoadingGames] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchGames();
    }
  }, [user]);

  const fetchGames = async () => {
    try {
      const gamesQuery = query(
        collection(db, 'games'),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(gamesQuery);
      const gamesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Game[];
      setGames(gamesData);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoadingGames(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Games 🎮
        </h1>
        <p className="text-xl text-slate-300">Take a break and play some games</p>
      </div>

      {selectedGame ? (
        <GlassCard className="h-[85vh] p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">{selectedGame.title}</h2>
            <button
              onClick={() => setSelectedGame(null)}
              className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all font-semibold"
            >
              ✕ Close Game
            </button>
          </div>
          <div className="w-full h-full rounded-xl overflow-hidden border border-white/10">
            <iframe
              src={selectedGame.gameUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms"
              style={{ 
                minHeight: 'calc(85vh - 120px)',
                background: 'linear-gradient(135deg, #050508 0%, #1a1a2e 100%)'
              }}
            />
          </div>
        </GlassCard>
      ) : (
        <>
          {loadingGames ? (
            <div className="text-center text-slate-300">Loading games...</div>
          ) : games.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <GlassCard
                onClick={() => setSelectedGame({
                  id: 'snake',
                  title: 'Snake Game',
                  gameUrl: '/games/snake.html',
                  thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
                  isActive: true
                })}
                className="group cursor-pointer overflow-hidden p-0 hover:scale-105 transition-transform"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800"
                    alt="Snake Game"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <span className="text-4xl">🐍</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 text-white">Snake Game</h3>
                  <p className="text-slate-400 text-sm">Classic snake game</p>
                </div>
              </GlassCard>

              <GlassCard
                onClick={() => setSelectedGame({
                  id: 'tetris',
                  title: 'Tetris Game',
                  gameUrl: '/games/tetris.html',
                  thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
                  isActive: true
                })}
                className="group cursor-pointer overflow-hidden p-0 hover:scale-105 transition-transform"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800"
                    alt="Tetris Game"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <span className="text-4xl">🧩</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 text-white">Tetris Game</h3>
                  <p className="text-slate-400 text-sm">Classic block puzzle</p>
                </div>
              </GlassCard>

              <GlassCard
                onClick={() => setSelectedGame({
                  id: 'geofs',
                  title: 'GeoFS Flight Simulator',
                  gameUrl: 'https://www.geo-fs.com/geofs.php',
                  thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
                  isActive: true
                })}
                className="group cursor-pointer overflow-hidden p-0 hover:scale-105 transition-transform"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800"
                    alt="Flight Simulator"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <span className="text-4xl">✈️</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 text-white">Flight Simulator</h3>
                  <p className="text-slate-400 text-sm">Fly aircraft worldwide</p>
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map((game) => (
                <GlassCard
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className="group cursor-pointer overflow-hidden p-0 hover:scale-105 transition-transform"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <span className="text-4xl">▶️</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2 text-white">{game.title}</h3>
                    <p className="text-slate-400 text-sm">Click to play</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}