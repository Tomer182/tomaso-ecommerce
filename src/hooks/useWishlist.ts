import { useState, useEffect, useCallback } from 'react';

const WISHLIST_STORAGE_KEY = 'autopilot_wishlist';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  // Persist wishlist to localStorage
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  // Toggle wishlist item
  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  }, []);

  // Add to wishlist
  const addToWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  // Remove from wishlist
  const removeFromWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.filter(item => item !== id));
  }, []);

  // Check if item is in wishlist
  const isWishlisted = useCallback((id: string) => {
    return wishlist.includes(id);
  }, [wishlist]);

  // Clear wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return {
    wishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    clearWishlist,
    wishlistCount: wishlist.length,
  };
};

