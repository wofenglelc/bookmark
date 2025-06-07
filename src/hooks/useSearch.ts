import { useState, useEffect, useCallback } from 'react';
import { DesktopItem, FolderItem, SearchResult, isFolderItem } from '../types';

export const useSearch = (items: DesktopItem[], currentFolder: FolderItem | null) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const searchItems = useCallback((query: string, itemList: DesktopItem[]): SearchResult[] => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);

    const findMatches = (text: string, terms: string[]): string[] => {
      const matches: string[] = [];
      terms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
          matches.push(match[1]);
        }
      });
      return [...new Set(matches)];
    };

    const searchInItem = (item: DesktopItem) => {
      const nameMatches = findMatches(item.name.toLowerCase(), searchTerms);
      const urlMatches = 'url' in item ? findMatches(item.url.toLowerCase(), searchTerms) : [];
      const notesMatches = item.notes ? findMatches(item.notes.toLowerCase(), searchTerms) : [];

      if (nameMatches.length || urlMatches.length || notesMatches.length) {
        results.push({
          ...item,
          matchedTerms: {
            name: nameMatches.length ? nameMatches : undefined,
            url: urlMatches.length ? urlMatches : undefined,
            notes: notesMatches.length ? notesMatches : undefined
          }
        });
      }

      if (isFolderItem(item)) {
        item.children.forEach(searchInItem);
      }
    };

    itemList.forEach(searchInItem);

    // Sort results by relevance
    return results.sort((a, b) => {
      const aScore = (
        (a.matchedTerms.name?.length || 0) * 3 +
        (a.matchedTerms.url?.length || 0) * 2 +
        (a.matchedTerms.notes?.length || 0)
      );
      const bScore = (
        (b.matchedTerms.name?.length || 0) * 3 +
        (b.matchedTerms.url?.length || 0) * 2 +
        (b.matchedTerms.notes?.length || 0)
      );
      return bScore - aScore;
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const itemsToSearch = currentFolder ? currentFolder.children : items;
      const results = searchItems(searchQuery, itemsToSearch);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, items, currentFolder, searchItems]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchTerms: searchQuery ? searchQuery.toLowerCase().split(' ').filter(Boolean) : []
  };
}; 