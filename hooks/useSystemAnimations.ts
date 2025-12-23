'use client';

import { useState, useEffect, useCallback } from 'react';

export type AnimationType = 'loading' | 'page-intro' | 'search' | 'fetch';
export type PageType = 'companion' | 'todo' | 'coding' | 'games' | 'travel' | 'community' | 'dashboard';

interface AnimationState {
  isInitializing: boolean;
  showPageIntro: boolean;
  currentOperation: string;
  pageType: PageType | null;
}

export function useSystemAnimations() {
  const [state, setState] = useState<AnimationState>({
    isInitializing: false,
    showPageIntro: false,
    currentOperation: 'OPERATION',
    pageType: null
  });

  const startInitialization = useCallback((operation: string = 'OPERATION') => {
    setState(prev => ({
      ...prev,
      isInitializing: true,
      currentOperation: operation
    }));
  }, []);

  const completeInitialization = useCallback(() => {
    setState(prev => ({
      ...prev,
      isInitializing: false
    }));
  }, []);

  const startPageIntro = useCallback((pageType: PageType) => {
    setState(prev => ({
      ...prev,
      showPageIntro: true,
      pageType
    }));
  }, []);

  const completePageIntro = useCallback(() => {
    setState(prev => ({
      ...prev,
      showPageIntro: false,
      pageType: null
    }));
  }, []);

  const triggerSearch = useCallback(() => {
    startInitialization('SEARCH');
  }, [startInitialization]);

  const triggerFetch = useCallback((resource: string = 'DATA') => {
    startInitialization(`${resource} FETCH`);
  }, [startInitialization]);

  useEffect(() => {
    if (state.isInitializing) {
      const timer = setTimeout(() => {
        completeInitialization();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.isInitializing, completeInitialization]);

  return {
    ...state,
    startInitialization,
    completeInitialization,
    startPageIntro,
    completePageIntro,
    triggerSearch,
    triggerFetch
  };
}