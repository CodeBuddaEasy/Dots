import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProgressionSystem } from '../services/progression/ProgressionSystem';

interface ProgressionContextType {
  progressionSystem: ProgressionSystem;
  level: number;
  experience: number;
  nextLevelExperience: number;
  progress: number;
}

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

export const useProgression = () => {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error('useProgression must be used within a ProgressionProvider');
  }
  return context;
};

export const ProgressionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressionSystem] = useState(() => new ProgressionSystem());
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [nextLevelExperience, setNextLevelExperience] = useState(100);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      setLevel(progressionSystem.getLevel());
      setExperience(progressionSystem.getExperience());
      setNextLevelExperience(progressionSystem.getNextLevelExperience());
      const currentExp = progressionSystem.getExperience();
      const nextExp = progressionSystem.getNextLevelExperience();
      setProgress((currentExp / nextExp) * 100);
    };

    updateStats();
    // Subscribe to progression updates
    const unsubscribe = progressionSystem.subscribeToAchievements(() => {
      updateStats();
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [progressionSystem]);

  return (
    <ProgressionContext.Provider
      value={{
        progressionSystem,
        level,
        experience,
        nextLevelExperience,
        progress,
      }}
    >
      {children}
    </ProgressionContext.Provider>
  );
}; 