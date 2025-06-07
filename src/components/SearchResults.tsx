import React from 'react';
import { Folder, ExternalLink, X } from 'lucide-react';
import { DesktopItem, SearchResult, isBookmarkItem } from '../types';

interface SearchResultsProps {
  results: SearchResult[];
  searchTerms: string[];
  onClose: () => void;
  onItemClick: (item: DesktopItem) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchTerms,
  onClose,
  onItemClick
}) => {
  if (!results.length) return null;

  const highlightMatches = (text: string, matches: string[]) => {
    if (!matches?.length) return text;

    let result = text;
    const pattern = new RegExp(`(${matches.join('|')})`, 'gi');
    result = result.replace(pattern, '<mark class="bg-yellow-200">$1</mark>');
    return result;
  };

  const handleItemClick = (item: DesktopItem) => {
    if (isBookmarkItem(item) && item.url) {
      // For bookmarks, open URL directly
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      // For folders, navigate
      onItemClick(item);
    }
  };

  const handleItemDoubleClick = (item: DesktopItem) => {
    // Remove double click functionality - everything is now single click
    return;
  };

  return (
    <div className="fixed left-4 top-20 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-md max-h-[80vh] overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Search Results ({results.length})
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-2">
        {results.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-150"
            onClick={() => handleItemClick(item)}
            onDoubleClick={() => handleItemDoubleClick(item)}
          >
            <div className={`p-2 rounded-lg ${
              item.type === 'folder' 
                ? 'bg-yellow-400 text-yellow-800' 
                : 'bg-blue-500 text-white'
            }`}>
              {item.type === 'folder' ? (
                <Folder size={20} />
              ) : (
                <ExternalLink size={20} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">
                <span dangerouslySetInnerHTML={{ 
                  __html: highlightMatches(item.name, item.matchedTerms.name || []) 
                }} />
              </p>
              {isBookmarkItem(item) && item.url && (
                <p className="text-sm text-gray-600 truncate">
                  <span dangerouslySetInnerHTML={{ 
                    __html: highlightMatches(item.url, item.matchedTerms.url || []) 
                  }} />
                </p>
              )}
              {item.notes && (
                <p className="text-sm text-gray-500 truncate">
                  <span dangerouslySetInnerHTML={{ 
                    __html: highlightMatches(item.notes, item.matchedTerms.notes || []) 
                  }} />
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {results.length > 10 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Showing all {results.length} results
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 