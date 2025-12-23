'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ArcReactorLoader from '@/components/animations/ArcReactorLoader';
import { CinematicIntro } from '@/components/animations/CinematicIntros';

type PageType = 'companion' | 'todo' | 'coding' | 'games' | 'travel' | 'design' | 'community' | 'dashboard';

interface AnimationContextType {
  showLoader: (operation?: string) => void;
  hideLoader: () => void;
  showPageIntro: (page: PageType) => void;
  isLoading: boolean;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [operation, setOperation] = useState('OPERATION');
  const [showIntro, setShowIntro] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType | null>(null);

  const showLoader = useCallback((op: string = 'OPERATION') => {
    setOperation(op);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const showPageIntro = useCallback((page: PageType) => {
    setCurrentPage(page);
    setShowIntro(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setCurrentPage(null);
  }, []);

  return (
    <AnimationContext.Provider value={{ showLoader, hideLoader, showPageIntro, isLoading }}>
      {children}
      <ArcReactorLoader
        isVisible={isLoading}
        operation={operation}
        onComplete={hideLoader}
      />
      {currentPage && (
        <CinematicIntro
          type={currentPage}
          isVisible={showIntro}
          onComplete={handleIntroComplete}
        />
      )}
    </AnimationContext.Provider>
  );
}

export function useAnimations() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimations must be used within AnimationProvider');
  }
  return context;
}