export interface Letter {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  unlockDate: string;
  mood: string;
  isOpened: boolean;
}

export type ViewType = 'home' | 'write' | 'letters' | 'settings' | 'open-letter';

export type FilterStatus = 'all' | 'locked' | 'unlocked';
export type SortType = 'newest' | 'oldest' | 'unlockSoon';

export interface ThemeContextProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}
