'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressContextType {
  activeDays: string[];
  focusMinutes: number;
  codeRuns: number;
  badges: Record<string, any>;
  dailyFocus: Record<string, number>;
  interviewHistory: any[];
  getSkillLevel: (skill: string) => { percentage: number };
  addInterviewSession: (session: { date: string, score: number }) => void;
  addXP: (amount: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeDays, setActiveDays] = useState(['2026-03-01', '2026-03-02', '2026-03-03', '2026-03-04', '2026-03-05', '2026-03-06']);
  const [focusMinutes, setFocusMinutes] = useState(720);
  const [codeRuns, setCodeRuns] = useState(28);
  const [badges, setBadges] = useState({
    'active_7': true,
    'code_warrior': true
  });
  const [dailyFocus, setDailyFocus] = useState({
    '2026-03-06': 120,
    '2026-03-05': 90,
    '2026-03-04': 150,
    '2026-03-03': 60,
    '2026-03-02': 110,
    '2026-03-01': 80,
  });
  const [interviewHistory, setInterviewHistory] = useState<any[]>([]);

  // Function to add XP - although we have GameContext, 
  // we follow the provided requirement to have it in ProgressContext if needed
  const addXP = (amount: number) => {
    // In a full implementation, this might sync with GameContext
    console.log(`Adding ${amount} XP`);
  };

  const addInterviewSession = (session: { date: string, score: number }) => {
    setInterviewHistory(prev => [session, ...prev]);
  };

  const getSkillLevel = (skill: string) => ({ percentage: skill === 'AWS' ? 75 : 45 });

  return (
    <ProgressContext.Provider value={{
      activeDays,
      focusMinutes,
      codeRuns,
      badges,
      dailyFocus,
      interviewHistory,
      getSkillLevel,
      addInterviewSession,
      addXP
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    return {
      activeDays: ['2026-03-01', '2026-03-06'],
      focusMinutes: 420,
      codeRuns: 18,
      badges: {},
      dailyFocus: {},
      interviewHistory: [],
      getSkillLevel: () => ({ percentage: 0 }),
      addInterviewSession: () => {},
      addXP: () => {}
    } as ProgressContextType;
  }
  return context;
};
