import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { progressionSystem } from '../../services/progression/ProgressionSystem';
import type { Achievement } from '../../services/progression/ProgressionSystem';

export const AchievementsPanel: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    // Initialize with data from progression system
    const progress = progressionSystem.getProgress();
    setAchievements(progress.achievements);

    // Subscribe to achievement updates
    const unsubscribe = progressionSystem.subscribeToAchievements((newAchievement: Achievement) => {
      handleNewAchievement(newAchievement);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleNewAchievement = (achievement: Achievement) => {
    setUnlockedAchievement(achievement);
    setShowUnlockAnimation(true);
    setTimeout(() => {
      setShowUnlockAnimation(false);
      setUnlockedAchievement(null);
    }, 3000);
  };

  const filteredAchievements = achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const categories = ['all', ...new Set(achievements.map(a => a.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filters */}
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            className={`relative overflow-hidden rounded-lg ${
              achievement.isUnlocked
                ? 'bg-gradient-to-br from-primary-900/50 to-primary-800/50'
                : 'bg-gray-900/50'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30" />
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                {achievement.isUnlocked && (
                  <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{achievement.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Reward */}
              <div className="text-sm">
                <span className="text-gray-400">Reward: </span>
                <span className="text-primary-300">
                  {achievement.reward.description}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievement Unlock Animation */}
      <AnimatePresence>
        {showUnlockAnimation && unlockedAchievement && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              className="relative bg-gray-900 rounded-lg p-8 text-center"
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
            >
              <div className="text-6xl mb-4">{unlockedAchievement.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Achievement Unlocked!
              </h2>
              <p className="text-xl text-primary-300 mb-4">
                {unlockedAchievement.name}
              </p>
              <p className="text-gray-400">
                {unlockedAchievement.reward.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementsPanel; 