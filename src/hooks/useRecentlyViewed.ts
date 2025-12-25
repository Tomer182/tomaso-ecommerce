import { useState, useEffect, useCallback } from 'react';

const RECENTLY_VIEWED_KEY = 'autopilot_recent';
const MAX_RECENT_ITEMS = 8;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Add product to recently viewed
  const addToRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item !== id);
      return [id, ...filtered].slice(0, MAX_RECENT_ITEMS);
    });
  }, []);

  // Clear recently viewed
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
};

