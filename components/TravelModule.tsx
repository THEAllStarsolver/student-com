'use client';

import { motion } from 'framer-motion';
import { Plane, Radar, Navigation, MapPin, Clock, Fuel } from 'lucide-react';

export default function TravelModule() {
  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Travel Animation Container */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Takeoff Plane */}
        <motion.div
          className="absolute plane-takeoff"
          style={{ 
            left: '10%', 
            top: '70%',
            color: '#818cf8'
          }}
        >
          <Plane size={24} />
        </motion.div>
        
        {/* Landing Plane */}
        <motion.div
          className="absolute plane-landing"
          style={{ 
            right: '10%', 
            top: '30%',
            color: '#a78bfa'
          }}
        >
          <Plane size={24} />
        </motion.div>
        
        {/* Radar Pulses */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-32 h-32 border border-indigo-400/30 rounded-full radar-pulse"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.div
            className="absolute inset-0 w-32 h-32 border border-indigo-400/20 rounded-full radar-pulse"
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.4, 0, 0.4]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 1,
              ease: "easeOut"
            }}
          />
        </div>
        
        {/* Navigation Icons */}
        <motion.div
          className="absolute top-20 right-20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <Navigation size={20} className="text-indigo-400" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 left-20"
          animate={{
            rotate: [0, 360],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
        >
          <Radar size={20} className="text-purple-400" />
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-nightshade mb-4 hud-font">
            TRAVEL LOGISTICS
          </h1>
          <p className="text-gray-300 hud-font text-sm">
            Advanced travel planning and logistics management system
          </p>
        </motion.div>
        
        {/* Travel Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Flight Status */}
          <motion.div
            className="system-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Plane className="text-indigo-400" size={24} />
                <h3 className="text-lg font-semibold hud-font">Flight Status</h3>
              </div>
              <motion.div
                className="w-3 h-3 bg-green-400 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="space-y-3 hud-font text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Next Flight:</span>
                <span className="text-indigo-400">AI-2847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Route:</span>
                <span>DEL → BOM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Departure:</span>
                <span>14:30 IST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gate:</span>
                <span>A12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">ON TIME</span>
              </div>
            </div>
          </motion.div>
          
          {/* Route Planning */}
          <motion.div
            className="system-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MapPin className="text-purple-400" size={24} />
                <h3 className="text-lg font-semibold hud-font">Route Planning</h3>
              </div>
              <motion.div
                className="w-3 h-3 bg-purple-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="space-y-3 hud-font text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Origin:</span>
                <span>DEL - Delhi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Destination:</span>
                <span>BOM - Mumbai</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Distance:</span>
                <span className="text-purple-400">1,144 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span>2h 15m</span>
              </div>
            </div>
          </motion.div>
          
          {/* Travel Analytics */}
          <motion.div
            className="system-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Clock className="text-cyan-400" size={24} />
                <h3 className="text-lg font-semibold hud-font">Analytics</h3>
              </div>
              <motion.div
                className="w-3 h-3 bg-cyan-400 rounded-full"
                animate={{ 
                  boxShadow: [
                    '0 0 5px rgba(34, 211, 238, 0.5)',
                    '0 0 20px rgba(34, 211, 238, 0.8)',
                    '0 0 5px rgba(34, 211, 238, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="space-y-3 hud-font text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Trips:</span>
                <span className="text-cyan-400">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Miles Flown:</span>
                <span>125,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Delay:</span>
                <span>12 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Efficiency:</span>
                <span className="text-green-400">94.2%</span>
              </div>
            </div>
          </motion.div>
          
          {/* Fuel & Resources */}
          <motion.div
            className="system-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Fuel className="text-orange-400" size={24} />
                <h3 className="text-lg font-semibold hud-font">Resources</h3>
              </div>
              <motion.div
                className="w-3 h-3 bg-orange-400 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <div className="space-y-3 hud-font text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Fuel Level:</span>
                <span className="text-orange-400">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Consumption:</span>
                <span>2.4L/km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Range:</span>
                <span>4,200 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Efficiency:</span>
                <span className="text-green-400">OPTIMAL</span>
              </div>
            </div>
          </motion.div>
          
          {/* Weather Conditions */}
          <motion.div
            className="system-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Navigation className="text-blue-400" size={24} />
                <h3 className="text-lg font-semibold hud-font">Weather</h3>
              </div>
              <motion.div
                className="w-3 h-3 bg-blue-400 rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
            <div className="space-y-3 hud-font text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Visibility:</span>
                <span className="text-green-400">10+ km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Wind Speed:</span>
                <span>15 kt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Turbulence:</span>
                <span className="text-green-400">LIGHT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Conditions:</span>
                <span className="text-green-400">CLEAR</span>
              </div>
            </div>
          </motion.div>
          
          {/* System Diagnostics */}
          <motion.div
            className="system-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Radar className="text-red-400" size={24} />
                <h3 className="text-lg font-semibold hud-font">Diagnostics</h3>
              </div>
              <motion.div
                className="w-3 h-3 bg-red-400 rounded-full"
                animate={{ 
                  boxShadow: [
                    '0 0 5px rgba(239, 68, 68, 0.5)',
                    '0 0 15px rgba(239, 68, 68, 0.8)',
                    '0 0 5px rgba(239, 68, 68, 0.5)'
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="space-y-3 hud-font text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Engine Status:</span>
                <span className="text-green-400">NOMINAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Navigation:</span>
                <span className="text-green-400">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Communication:</span>
                <span className="text-green-400">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Overall:</span>
                <span className="text-green-400">OPTIMAL</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}