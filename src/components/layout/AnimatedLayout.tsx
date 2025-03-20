import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { colors, animations } from '../../styles/theme';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { notificationService } from '../../services/notifications/NotificationService';
import { Button } from '../common';

interface ProgressIndicator {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progressPercentage: number;
}

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

export const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressIndicator>({
    level: 1,
    currentXP: 350,
    nextLevelXP: 1000,
    progressPercentage: 35
  });
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // In a real app, we would fetch this data from our progression system
    // For now, we'll use mock data
    const mockProgress = {
      level: 1,
      currentXP: 350,
      nextLevelXP: 1000,
      progressPercentage: 35
    };
    setProgress(mockProgress);
  }, []);

  useEffect(() => {
    // Subscribe to notifications to update unread count
    const unsubscribe = notificationService.subscribe(() => {
      setUnreadCount(notificationService.getUnreadCount());
    });

    // Set initial unread count
    setUnreadCount(notificationService.getUnreadCount());

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br ${colors.background.primary}`}
      {...animations.fadeIn}
    >
      {/* Header with Progress */}
      <header className={`${colors.background.overlay} backdrop-blur-lg border-b ${colors.border.primary}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-bold ${colors.text.primary}`}>Voluntify</h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`text-sm ${colors.text.secondary}`}>Level {progress.level}</p>
                  <p className={`text-xs ${colors.text.muted}`}>
                    {progress.currentXP} / {progress.nextLevelXP} XP
                  </p>
                </div>
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.accent.primary}`}
                    style={{ width: `${progress.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="secondary"
                  className="relative"
                  onClick={() => setIsNotificationCenterOpen(true)}
                >
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </motion.div>
  );
}; 