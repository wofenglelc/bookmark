import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, Clock } from 'lucide-react';
import { BookmarkItem, isBookmarkItem } from '../types';

interface RecentBookmark extends BookmarkItem {
  lastUsed: number;
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBookmarkClick: (bookmark: BookmarkItem) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onBookmarkClick
}) => {
  const [recentBookmarks, setRecentBookmarks] = useState<RecentBookmark[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadRecentBookmarks();
    }
  }, [isOpen]);

  const loadRecentBookmarks = () => {
    try {
      const saved = localStorage.getItem('recent-bookmarks');
      const recent = saved ? JSON.parse(saved) : [];
      const sortedRecent = recent
        .sort((a: RecentBookmark, b: RecentBookmark) => b.lastUsed - a.lastUsed)
        .slice(0, 10);
      setRecentBookmarks(sortedRecent);
    } catch (error) {
      console.error('Failed to load recent bookmarks:', error);
      setRecentBookmarks([]);
    }
  };

  const saveRecentBookmark = (bookmark: BookmarkItem) => {
    try {
      const saved = localStorage.getItem('recent-bookmarks');
      const recent: RecentBookmark[] = saved ? JSON.parse(saved) : [];
      
      // Remove existing entry if present
      const filtered = recent.filter(item => item.id !== bookmark.id);
      
      // Add new entry at the beginning
      const newEntry: RecentBookmark = {
        ...bookmark,
        lastUsed: Date.now()
      };
      
      const updated = [newEntry, ...filtered].slice(0, 20); // Keep max 20 items
      localStorage.setItem('recent-bookmarks', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent bookmark:', error);
    }
  };

  const handleBookmarkClick = (bookmark: RecentBookmark) => {
    // Track the usage
    saveRecentBookmark(bookmark);
    
    // Notify parent component
    onBookmarkClick(bookmark);
    
    // Open bookmark URL
    if (bookmark.url) {
      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    }
    
    // Close menu
    onClose();
  };

  const formatLastUsed = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Start Menu */}
      <div className="fixed bottom-16 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4 min-w-[300px] max-h-[500px] overflow-y-auto z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock size={20} className="text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">最近常用</h3>
          </div>
        </div>

        {recentBookmarks.length > 0 ? (
          <div className="space-y-1">
            {recentBookmarks.map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => handleBookmarkClick(bookmark)}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-150 text-left"
              >
                <div className="p-2 rounded-lg bg-blue-500 text-white flex-shrink-0">
                  <ExternalLink size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{bookmark.name}</p>
                  {bookmark.url && (
                    <p className="text-sm text-gray-600 truncate">{bookmark.url}</p>
                  )}
                  <p className="text-xs text-gray-500">{formatLastUsed(bookmark.lastUsed)}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent bookmarks</p>
            <p className="text-sm text-gray-400 mt-1">
              Double-click bookmarks to add them here
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default StartMenu; 