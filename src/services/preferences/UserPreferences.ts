interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    achievements: boolean;
    opportunities: boolean;
    messages: boolean;
    reminders: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    shareProgress: boolean;
    showProfilePublic: boolean;
    allowMentoring: boolean;
  };
  dashboard: {
    defaultTab: 'overview' | 'skills' | 'achievements' | 'opportunities';
    pinnedSkills: string[];
    favoriteOpportunities: string[];
  };
}

class UserPreferencesService {
  private static readonly STORAGE_KEY = 'voluntify_preferences';
  private preferences: UserPreferences;
  private subscribers: ((prefs: UserPreferences) => void)[] = [];

  constructor() {
    const defaultPreferences: UserPreferences = {
      theme: 'system',
      notifications: {
        achievements: true,
        opportunities: true,
        messages: true,
        reminders: true
      },
      accessibility: {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium'
      },
      privacy: {
        shareProgress: true,
        showProfilePublic: true,
        allowMentoring: true
      },
      dashboard: {
        defaultTab: 'overview',
        pinnedSkills: [],
        favoriteOpportunities: []
      }
    };

    try {
      const stored = localStorage.getItem(UserPreferencesService.STORAGE_KEY);
      this.preferences = stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch (error) {
      console.error('Error loading user preferences:', error);
      this.preferences = defaultPreferences;
    }

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', (event) => {
      if (event.key === UserPreferencesService.STORAGE_KEY) {
        try {
          const newPrefs = JSON.parse(event.newValue || '');
          this.preferences = newPrefs;
          this.notifySubscribers();
        } catch (error) {
          console.error('Error processing storage event:', error);
        }
      }
    });

    // Save initial preferences if not exists
    this.savePreferences();
  }

  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>) {
    this.preferences = {
      ...this.preferences,
      ...updates
    };
    this.savePreferences();
    this.notifySubscribers();
  }

  public subscribe(callback: (prefs: UserPreferences) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private savePreferences() {
    try {
      localStorage.setItem(UserPreferencesService.STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  private notifySubscribers() {
    const prefs = this.getPreferences();
    this.subscribers.forEach(callback => callback(prefs));
  }

  // Utility methods for common operations
  public toggleTheme() {
    const currentTheme = this.preferences.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.updatePreferences({ theme: newTheme });
  }

  public pinSkill(skillId: string) {
    const pinnedSkills = new Set(this.preferences.dashboard.pinnedSkills);
    pinnedSkills.add(skillId);
    this.updatePreferences({
      dashboard: {
        ...this.preferences.dashboard,
        pinnedSkills: Array.from(pinnedSkills)
      }
    });
  }

  public unpinSkill(skillId: string) {
    const pinnedSkills = new Set(this.preferences.dashboard.pinnedSkills);
    pinnedSkills.delete(skillId);
    this.updatePreferences({
      dashboard: {
        ...this.preferences.dashboard,
        pinnedSkills: Array.from(pinnedSkills)
      }
    });
  }

  public toggleFavoriteOpportunity(opportunityId: string) {
    const favorites = new Set(this.preferences.dashboard.favoriteOpportunities);
    if (favorites.has(opportunityId)) {
      favorites.delete(opportunityId);
    } else {
      favorites.add(opportunityId);
    }
    this.updatePreferences({
      dashboard: {
        ...this.preferences.dashboard,
        favoriteOpportunities: Array.from(favorites)
      }
    });
  }

  public setAccessibilitySettings(settings: Partial<UserPreferences['accessibility']>) {
    this.updatePreferences({
      accessibility: {
        ...this.preferences.accessibility,
        ...settings
      }
    });
  }

  public setNotificationPreferences(settings: Partial<UserPreferences['notifications']>) {
    this.updatePreferences({
      notifications: {
        ...this.preferences.notifications,
        ...settings
      }
    });
  }

  public setPrivacySettings(settings: Partial<UserPreferences['privacy']>) {
    this.updatePreferences({
      privacy: {
        ...this.preferences.privacy,
        ...settings
      }
    });
  }
}

export const userPreferences = new UserPreferencesService(); 