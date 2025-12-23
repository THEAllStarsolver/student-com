'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import EmbeddedFrame from '@/components/ui/EmbeddedFrame';

const deliveryPlatforms = [
  {
    name: 'Flipkart 10 minutes',
    url: 'https://www.flipkart.com/flipkart-minutes-store?marketplace=HYPERLOCAL',
    logo: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=100&fit=crop',
    description: '10-minute grocery delivery'
  },
  {
    name: 'Blinkit',
    url: 'https://blinkit.com/',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=100&fit=crop',
    description: 'Quick commerce delivery'
  }
];

export default function SnacksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<typeof deliveryPlatforms[0] | null>(null);
  const [userHostel, setUserHostel] = useState('');
  const [showHostelSelect, setShowHostelSelect] = useState(false);

  const hostels = [
    'Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Hostel E',
    'PG 1', 'PG 2', 'PG 3', 'Off Campus'
  ];

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchUserHostel();
    }
  }, [user]);

  const fetchUserHostel = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user!.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserHostel(userData.hostel || '');
        if (!userData.hostel) {
          setShowHostelSelect(true);
        }
      }
    } catch (error) {
      console.error('Error fetching user hostel:', error);
    }
  };

  const updateUserHostel = async (hostel: string) => {
    try {
      await updateDoc(doc(db, 'users', user!.uid), { hostel });
      setUserHostel(hostel);
      setShowHostelSelect(false);
    } catch (error) {
      console.error('Error updating hostel:', error);
    }
  };

  const openPlatform = (platform: typeof deliveryPlatforms[0]) => {
    if (!userHostel) {
      setShowHostelSelect(true);
      return;
    }
    setSelectedPlatform(platform);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="system-value text-lg mb-2">INITIALIZING SYSTEM</div>
          <div className="system-label">Loading snacks module...</div>
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
                Midnight Snacks 🍿
              </h1>
              <p className="text-xl text-slate-300">Quick delivery to your hostel</p>
              {userHostel && (
                <p className="text-lg text-slate-400 mt-2">
                  Delivering to: <span className="text-cyan-400 font-semibold">{userHostel}</span>
                  <button
                    onClick={() => setShowHostelSelect(true)}
                    className="ml-2 text-sm text-cyan-400 hover:underline"
                  >
                    Change
                  </button>
                </p>
              )}
            </div>

            {showHostelSelect && (
              <GlassCard className="mb-8" variant="elevated">
                <h3 className="text-xl font-bold text-primary mb-4">Select Your Hostel</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hostels.map((hostel) => (
                    <button
                      key={hostel}
                      onClick={() => updateUserHostel(hostel)}
                      className="tech-button tech-hover px-4 py-2"
                    >
                      {hostel}
                    </button>
                  ))}
                </div>
              </GlassCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {deliveryPlatforms.map((platform) => (
                <GlassCard
                  key={platform.name}
                  onClick={() => openPlatform(platform)}
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
                        <span className="text-4xl">🍿</span>
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