import { DesktopItem } from '../types';

const STORAGE_KEY = 'desktop-bookmarks';

export const saveItems = (items: DesktopItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save items to localStorage:', error);
  }
};

export const loadItems = (): DesktopItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load items from localStorage:', error);
    return [];
  }
};

export const clearItems = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear items from localStorage:', error);
  }
};