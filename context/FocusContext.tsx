'use client';

import React, { createContext, useContext, useState } from 'react';

interface FocusContextType {
  isFocusActive: boolean;
  setIsFocusActive: (active: boolean) => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [isFocusActive, setIsFocusActive] = useState(false);

  return (
    <FocusContext.Provider value={{ isFocusActive, setIsFocusActive }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within FocusProvider');
  }
  return context;
}
