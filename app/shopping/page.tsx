'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import EmbeddedFrame from '@/components/ui/EmbeddedFrame';

const ArcReactorLoader = () => (
  <motion.div
    className="flex items-center justify-center h-screen bg-[#05070a]"
    exit={{ scale: 4, filter: 'blur(40px)', opacity: 0 }}
    transition={{ duration: 0.8, ease: "circIn" }}
  >
    <div className="relative w-32 h-32">
      {/* Outer Circle - Anticlockwise */}
      <motion.div
        className="absolute inset-0 border-2 border-cyan-400/30 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner Circle - Clockwise */}
      <motion.div
        className="absolute inset-4 border-2 border-cyan-400/60 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      {/* Core Glow - Breathing */}
      <motion.div
        className="absolute inset-8 bg-cyan-400 rounded-full shadow-[0_0_30px_#22d3ee]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
    <div className="absolute mt-48 text-center">
      <div className="text-cyan-400 text-lg mb-2 font-mono tracking-wider">INITIALIZING SYSTEM</div>
      <div className="text-cyan-400/60 text-sm font-mono">Loading commerce module...</div>
    </div>
  </motion.div>
);

const shoppingPlatforms = [
  {
    name: 'Amazon',
    url: 'https://m.amazon.in/',
    logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&h=100&fit=crop',
    description: 'Shop everything online'
  },
  {
    name: 'Flipkart',
    url: 'https://m.flipkart.com/',
    logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=100&fit=crop',
    description: 'India\'s leading e-commerce'
  }
];

export default function ShoppingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<typeof shoppingPlatforms[0] | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const handlePlatformSelect = (platform: typeof shoppingPlatforms[0]) => {
    setIsRecalibrating(true);
    setTimeout(() => {
      setSelectedPlatform(platform);
      setIsRecalibrating(false);
    }, 1200);
  };

  if (loading || isRecalibrating) {
    return <ArcReactorLoader />;
  }

  return (
    <div className="min-h-screen bg-[#05070a] bg-[radial-gradient(circle_at_50px_50px,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px]">
      <AnimatePresence mode="wait">
        {selectedPlatform ? (
          <motion.div
            key="embedded"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="h-screen"
          >
            <EmbeddedFrame
              src={selectedPlatform.url}
              title={selectedPlatform.name}
              onBack={() => setSelectedPlatform(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="shopping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="p-6"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-mono">
                  COMMERCE HUB
                </h1>
                <p className="text-xl text-cyan-400/80 font-mono tracking-wide">ACCESS GLOBAL MARKETPLACE NETWORKS</p>
                <div className="w-24 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent mt-4"></div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {shoppingPlatforms.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      onClick={() => handlePlatformSelect(platform)}
                      className="group cursor-pointer backdrop-blur-xl bg-white/5 border border-cyan-400/20 rounded-2xl overflow-hidden hover:border-cyan-400/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={platform.logo}
                          alt={platform.name}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a]/90 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="backdrop-blur-sm bg-cyan-400/10 p-4 rounded-full border border-cyan-400/30">
                            <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-cyan-400 font-mono">{platform.name}</h3>
                        <p className="text-cyan-400/60 text-sm font-mono tracking-wide">{platform.description}</p>
                        <div className="mt-4 flex items-center text-emerald-400 text-xs font-mono">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                          SYSTEM READY
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}