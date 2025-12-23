// API Configuration
// Centralized configuration for all API keys and endpoints

export const config = {
  // Firebase Configuration
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },

  // YouTube API Configuration
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY,
    baseUrl: 'https://www.googleapis.com/youtube/v3',
  },

  // Google Places API Configuration
  googlePlaces: {
    apiKey: process.env.GOOGLE_PLACES_API_KEY,
    baseUrl: 'https://maps.googleapis.com/maps/api/place',
  },

  // Gemini AI API Configuration (Primary LLM)
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },

  // GROQ API Configuration (Alternative LLM)
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: 'https://api.groq.com/openai/v1',
  },

  // AviationStack API Configuration
  aviationStack: {
    accessKey: process.env.AVIATIONSTACK_ACCESS_KEY,
    baseUrl: 'http://api.aviationstack.com/v1',
  },

  // RapidAPI Configuration
  rapidApi: {
    key: process.env.RAPIDAPI_KEY,
    host: 'rapidapi.com',
  },
};

// API Endpoints
export const endpoints = {
  // YouTube endpoints
  youtube: {
    search: `${config.youtube.baseUrl}/search`,
    videos: `${config.youtube.baseUrl}/videos`,
    channels: `${config.youtube.baseUrl}/channels`,
  },

  // Google Places endpoints
  places: {
    search: `${config.googlePlaces.baseUrl}/textsearch/json`,
    details: `${config.googlePlaces.baseUrl}/details/json`,
    nearby: `${config.googlePlaces.baseUrl}/nearbysearch/json`,
  },

  // Gemini AI endpoints
  gemini: {
    generateContent: `${config.gemini.baseUrl}/models/gemini-pro:generateContent`,
    generateContentVision: `${config.gemini.baseUrl}/models/gemini-pro-vision:generateContent`,
  },

  // GROQ endpoints
  groq: {
    chat: `${config.groq.baseUrl}/chat/completions`,
  },

  // AviationStack endpoints
  aviation: {
    flights: `${config.aviationStack.baseUrl}/flights`,
    airlines: `${config.aviationStack.baseUrl}/airlines`,
    airports: `${config.aviationStack.baseUrl}/airports`,
    routes: `${config.aviationStack.baseUrl}/routes`,
  },
};

// Validation function to check if required API keys are present
export const validateConfig = () => {
  const requiredKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'YOUTUBE_API_KEY',
    'GOOGLE_PLACES_API_KEY',
    'GEMINI_API_KEY',
    'GROQ_API_KEY',
    'AVIATIONSTACK_ACCESS_KEY',
    'RAPIDAPI_KEY',
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  if (missingKeys.length > 0) {
    console.warn('Missing API keys:', missingKeys);
    return false;
  }
  
  return true;
};

// Helper function to get headers for different APIs
export const getApiHeaders = (apiType: 'youtube' | 'places' | 'gemini' | 'groq' | 'rapidapi'): Record<string, string> => {
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  switch (apiType) {
    case 'gemini':
      if (config.gemini.apiKey) {
        baseHeaders['x-goog-api-key'] = config.gemini.apiKey;
      }
      return baseHeaders;
    
    case 'groq':
      if (config.groq.apiKey) {
        baseHeaders['Authorization'] = `Bearer ${config.groq.apiKey}`;
      }
      return baseHeaders;
    
    case 'rapidapi':
      if (config.rapidApi.key) {
        baseHeaders['X-RapidAPI-Key'] = config.rapidApi.key;
        baseHeaders['X-RapidAPI-Host'] = config.rapidApi.host;
      }
      return baseHeaders;
    
    default:
      return baseHeaders;
  }
};

export default config;