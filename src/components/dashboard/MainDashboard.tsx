import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgression } from '../../contexts/ProgressionContext';
import { useNova } from '../../contexts/NovaContext';
import SkillTree from '../progression/SkillTree';
import AchievementsPanel from '../progression/AchievementsPanel';
import OpportunityMatcher from '../opportunities/OpportunityMatcher';
import { Achievement } from '../../services/progression/ProgressionSystem';

type DashboardTab = 'overview' | 'skills' | 'achievements' | 'opportunities';

interface DashboardStats {
  level: number;
  experience: number;
  nextLevelExperience: number;
  progress: number;
}

const MainDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    level: 1,
    experience: 0,
    nextLevelExperience: 100,
    progress: 0,
  });

  const { progressionSystem, level, experience, nextLevelExperience, progress } = useProgression();
  const { messages, isTyping } = useNova();

  useEffect(() => {
    setStats({
      level,
      experience,
      nextLevelExperience,
      progress,
    });
  }, [level, experience, nextLevelExperience, progress]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6"
          >
            <div className="glass p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Level {stats.level}</span>
                    <span>{stats.experience} / {stats.nextLevelExperience} XP</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Skills</h3>
                    <p className="text-3xl font-bold text-primary">
                      {progressionSystem.getSkills().length}
                    </p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Achievements</h3>
                    <p className="text-3xl font-bold text-secondary">
                      {progressionSystem.getAchievements().filter((a: Achievement) => a.unlocked).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Insights</h2>
              <div className="space-y-4">
                {messages.slice(-3).map(message => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.sender === 'nova'
                        ? 'bg-secondary/20 ml-4'
                        : 'bg-primary/20 mr-4'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                ))}
                {isTyping && (
                  <div className="bg-secondary/20 p-4 rounded-lg ml-4">
                    <p>Nova is typing...</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      case 'skills':
        return <SkillTree />;
      case 'achievements':
        return <AchievementsPanel />;
      case 'opportunities':
        return <OpportunityMatcher />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">Dots</h1>
              <div className="hidden md:flex space-x-4">
                {(['overview', 'skills', 'achievements', 'opportunities'] as DashboardTab[]).map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm">
              Level {stats.level} • {stats.experience} XP
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MainDashboard; 