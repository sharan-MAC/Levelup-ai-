
import { AppState, UserProfile, UserStats, LearningMaterial } from '../types';

const STORAGE_KEY = 'studygenie_data';

// Added missing xpHistory property to satisfy UserStats interface
const DEFAULT_STATS: UserStats = {
  accuracy: 0,
  speed: 0,
  retention: 0,
  consistency: 0,
  totalQuizzes: 0,
  weakTopics: [],
  xpHistory: []
};

export const storageService = {
  saveState: (state: Partial<AppState>) => {
    const current = storageService.getState();
    const updated = { ...current, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getState: (): AppState => {
    const data = localStorage.getItem(STORAGE_KEY);
    // Added missing chatHistory and notificationsEnabled property to satisfy AppState interface requirements in default return
    if (!data) return { user: null, materials: [], stats: DEFAULT_STATS, isDarkMode: false, notificationsEnabled: true, chatHistory: [] };
    const parsed = JSON.parse(data);
    // Ensure default values for new fields
    return {
      notificationsEnabled: true,
      ...parsed
    };
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
