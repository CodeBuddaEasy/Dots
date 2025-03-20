import { userPreferences } from '../preferences/UserPreferences';

export type NotificationType = 'achievement' | 'opportunity' | 'message' | 'reminder' | 'system';

export interface NotificationData {
  achievementId?: string;
  opportunityId?: string;
  messageId?: string;
  userId?: string;
  skillId?: string;
  progress?: number;
  url?: string;
  [key: string]: string | number | undefined;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: NotificationData;
  action?: {
    label: string;
    url: string;
  };
}

class NotificationService {
  private notifications: Notification[] = [];
  private subscribers: ((notifications: Notification[]) => void)[] = [];
  private static readonly STORAGE_KEY = 'voluntify_notifications';
  private static readonly MAX_NOTIFICATIONS = 50;

  constructor() {
    this.loadNotifications();
    this.setupNotificationPermission();

    // Clean up old notifications periodically
    setInterval(() => this.cleanOldNotifications(), 24 * 60 * 60 * 1000); // Daily cleanup
  }

  private async setupNotificationPermission() {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        await Notification.requestPermission();
      }
    }
  }

  private loadNotifications() {
    try {
      const stored = localStorage.getItem(NotificationService.STORAGE_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored);
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem(NotificationService.STORAGE_KEY, JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  public async notify(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const prefs = userPreferences.getPreferences();
    
    // Check if notifications are enabled for this type
    if (!prefs.notifications[notification.type as keyof typeof prefs.notifications]) {
      return;
    }

    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false
    };

    // Add to internal list
    this.notifications.unshift(newNotification);
    if (this.notifications.length > NotificationService.MAX_NOTIFICATIONS) {
      this.notifications.pop();
    }

    // Save and notify subscribers
    this.saveNotifications();
    this.notifySubscribers();

    // Show system notification if supported and allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const systemNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png', // Make sure to add your logo
          badge: '/badge.png', // Make sure to add your badge
          tag: notification.type
        });

        if (notification.action) {
          systemNotification.onclick = () => {
            window.open(notification.action!.url, '_blank');
          };
        }
      } catch (error) {
        console.error('Error showing system notification:', error);
      }
    }

    return newNotification;
  }

  public markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifySubscribers();
    }
  }

  public markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifySubscribers();
  }

  public deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.notifySubscribers();
  }

  public clearAll() {
    this.notifications = [];
    this.saveNotifications();
    this.notifySubscribers();
  }

  public getNotifications(): Notification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    const notifications = this.getNotifications();
    this.subscribers.forEach(callback => callback(notifications));
  }

  private cleanOldNotifications() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const oldLength = this.notifications.length;
    this.notifications = this.notifications.filter(n => n.timestamp > thirtyDaysAgo);
    
    if (this.notifications.length !== oldLength) {
      this.saveNotifications();
      this.notifySubscribers();
    }
  }
}

export const notificationService = new NotificationService(); 