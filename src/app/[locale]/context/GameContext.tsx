'use client';

import React, { createContext, useContext, useState } from 'react';

interface GameContextType {
  xp: number;
  streak: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [xp] = useState(12450);
  const [streak] = useState(6);

  return (
    <GameContext.Provider value={{ xp, streak }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    return { xp: 12450, streak: 6 };
  }
  return context;
};
