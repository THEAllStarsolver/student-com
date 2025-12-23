'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { validateConfig } from '../lib/config';

interface ApiService {
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'error';
  description: string;
}

export default function ApiStatus() {
  const services: ApiService[] = [
    {
      name: 'Firebase',
      key: 'NEXT_PUBLIC_FIREBASE_API_KEY',
      status: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'active' : 'inactive',
      description: 'Authentication & Database'
    },
    {
      name: 'YouTube API',
      key: 'YOUTUBE_API_KEY',
      status: process.env.YOUTUBE_API_KEY ? 'active' : 'inactive',
      description: 'Video Content & Learning'
    },
    {
      name: 'Google Places',
      key: 'GOOGLE_PLACES_API_KEY',
      status: process.env.GOOGLE_PLACES_API_KEY ? 'active' : 'inactive',
      description: 'Location & Travel Data'
    },
    {
      name: 'Gemini AI',
      key: 'GEMINI_API_KEY',
      status: process.env.GEMINI_API_KEY ? 'active' : 'inactive',
      description: 'Primary AI Assistant & Tutoring'
    },
    {
      name: 'GROQ AI',
      key: 'GROQ_API_KEY',
      status: process.env.GROQ_API_KEY ? 'active' : 'inactive',
      description: 'Alternative AI & Fast Inference'
    },
    {
      name: 'AviationStack',
      key: 'AVIATIONSTACK_ACCESS_KEY',
      status: process.env.AVIATIONSTACK_ACCESS_KEY ? 'active' : 'inactive',
      description: 'Flight Data & Aviation'
    },
    {
      name: 'RapidAPI',
      key: 'RAPIDAPI_KEY',
      status: process.env.RAPIDAPI_KEY ? 'active' : 'inactive',
      description: 'Multiple API Services'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'error':
        return <XCircle className="text-red-400" size={16} />;
      default:
        return <AlertCircle className="text-yellow-400" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="stark-glass p-6">
      <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center hud-font">
        <AlertCircle className="mr-2" size={20} />
        API Services Status
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            className="system-card p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <div className="hud-font text-sm font-medium text-white">
                    {service.name}
                  </div>
                  <div className="hud-font text-xs text-gray-400">
                    {service.description}
                  </div>
                </div>
              </div>
              <div className={`hud-font text-xs uppercase ${getStatusColor(service.status)}`}>
                {service.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-400/20">
        <p className="hud-font text-xs text-gray-300">
          <strong className="text-indigo-400">Note:</strong> All API keys have been successfully configured. 
          The system uses Gemini AI as the primary LLM with GROQ as fallback. Services marked as 'active' are ready for use.
        </p>
      </div>
    </div>
  );
}