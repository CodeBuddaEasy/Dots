import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { notificationService, Notification } from '../../services/notifications/NotificationService';
import { Button, Badge } from '../common';
import { colors } from '../../styles/theme';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AutoSizerProps {
  height: number;
  width: number;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | Notification['type']>('all');

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = notificationService.subscribe(setNotifications);
    
    // Load initial notifications
    setNotifications(notificationService.getNotifications());

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredNotifications = useMemo(() => 
    notifications.filter(
      notification => selectedType === 'all' || notification.type === selectedType
    ),
    [notifications, selectedType]
  );

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'opportunity':
        return '🎯';
      case 'message':
        return '💬';
      case 'reminder':
        return '⏰';
      case 'system':
        return '🔔';
      default:
        return '📝';
    }
  };

  const getNotificationVariant = (type: Notification['type']): 'success' | 'info' | 'warning' | 'default' => {
    switch (type) {
      case 'achievement':
        return 'success';
      case 'opportunity':
        return 'info';
      case 'reminder':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      notificationService.markAsRead(notification.id);
    }
    if (notification.action) {
      window.open(notification.action.url, '_blank');
    }
  };

  const handleClearAll = () => {
    notificationService.clearAll();
    onClose();
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const NotificationItem = React.memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const notification = filteredNotifications[index];
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className={`p-4 border-b ${colors.border.primary} cursor-pointer transition-colors hover:bg-white/5`}
        onClick={() => handleNotificationClick(notification)}
        style={style}
      >
        <div className="flex items-start space-x-3">
          <span className="text-2xl">
            {getNotificationIcon(notification.type)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium ${notification.read ? colors.text.muted : colors.text.primary}`}>
                {notification.title}
              </h3>
              <Badge
                variant={getNotificationVariant(notification.type)}
                size="sm"
              >
                {notification.type}
              </Badge>
            </div>
            <p className={`text-sm ${colors.text.secondary} line-clamp-2`}>
              {notification.message}
            </p>
            <p className={`text-xs ${colors.text.muted} mt-1`}>
              {new Date(notification.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    );
  });

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <span className="text-4xl mb-4">📭</span>
      <p className={`text-center ${colors.text.muted}`}>
        No notifications to display
      </p>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-gray-900 border-l ${colors.border.primary} z-50`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Header */}
            <div className={`p-4 border-b ${colors.border.primary}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${colors.text.primary}`}>
                  Notifications
                </h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {(['all', 'achievement', 'opportunity', 'message', 'reminder', 'system'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className={`p-4 border-b ${colors.border.primary} flex justify-between`}>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClearAll}
              >
                Clear all
              </Button>
            </div>

            {/* Notifications List */}
            <div className="h-[calc(100vh-180px)]">
              {filteredNotifications.length > 0 ? (
                <AutoSizer>
                  {({ height, width }: AutoSizerProps) => (
                    <List
                      height={height}
                      itemCount={filteredNotifications.length}
                      itemSize={120}
                      width={width}
                    >
                      {NotificationItem}
                    </List>
                  )}
                </AutoSizer>
              ) : (
                <EmptyState />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 