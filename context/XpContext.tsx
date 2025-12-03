'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface XpContextType {
  xp: number;
  level: number;
  xpMultiplier: number;
  updateXp: (amount: number, activity?: string) => void;
  resetXp: () => void;
  calculateLevel: (xp: number) => number;
}

const XpContext = createContext<XpContextType | undefined>(undefined);

export const XpProvider = ({ children }: { children: ReactNode }) => {
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [xpMultiplier, setXpMultiplier] = useState<number>(1.0);

  // Get user ID from localStorage or default to 'default_user'
  let userId = 'default_user';
  if (typeof window !== 'undefined') {
    userId = localStorage.getItem('fitsync_user_id') || 
             (JSON.parse(localStorage.getItem('demoSession') || 'null')?.username) || 
             'default_user';
  }

  // Load XP from unified storage on initial render
  useEffect(() => {
    const loadXp = async () => {
      if (typeof window !== 'undefined') {
        const xpSystem = await import('@/lib/xp/xp-system');
        const xpValue = await xpSystem.default.getXp(userId);
        setXp(xpValue);
        setLevel(xpSystem.default.calculateLevel(xpValue));
      }
    };

    loadXp();
  }, [userId]);

  // Load XP multiplier on initial render and update it periodically
  useEffect(() => {
    const loadXpMultiplier = async () => {
      if (typeof window !== 'undefined') {
        const xpSystem = await import('@/lib/xp/xp-system');
        const multiplier = await xpSystem.default.calculateXpBonus(userId);
        setXpMultiplier(multiplier);
      }
    };

    // Load initially
    loadXpMultiplier();

    // Set up interval to update multiplier periodically (every 5 minutes)
    const interval = setInterval(loadXpMultiplier, 5 * 60 * 1000);

    // Clean up
    return () => clearInterval(interval);
  }, [userId]);

  // Update XP in unified storage and recalculate level
  const updateXp = async (amount: number, activity?: string) => {
    if (typeof window !== 'undefined') {
      const xpSystem = await import('@/lib/xp/xp-system');
      const newXp = await xpSystem.default.addXP(userId, amount, activity);
      setXp(newXp);
      setLevel(xpSystem.default.calculateLevel(newXp));
      
      // Update multiplier after XP change
      const multiplier = await xpSystem.default.calculateXpBonus(userId);
      setXpMultiplier(multiplier);
    }
  };

  const calculateLevel = (xp: number): number => {
    // Simple level calculation: level = floor(sqrt(totalXP / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  };

  const resetXp = () => {
    setXp(0);
    setLevel(1);
  };

  const value = {
    xp,
    level,
    xpMultiplier,
    updateXp,
    resetXp,
    calculateLevel
  };

  return (
    <XpContext.Provider value={value}>
      {children}
    </XpContext.Provider>
  );
};

export const useXp = (): XpContextType => {
  const context = useContext(XpContext);
  if (!context) {
    throw new Error('useXp must be used within an XpProvider');
  }
  return context;
};