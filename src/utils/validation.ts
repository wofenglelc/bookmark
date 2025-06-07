import { DesktopItem, BookmarkItem, isBookmarkItem, isFolderItem, ValidationResult } from '../types';

export const validateUrl = async (url: string): Promise<ValidationResult> => {
  try {
    const finalUrl = url.startsWith('http') ? url : `https://${url}`;
    const response = await fetch(finalUrl, { method: 'HEAD', mode: 'no-cors' });
    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Unable to access this URL. Please check if it is correct and accessible.' 
    };
  }
};

export const validateBookmark = async (item: DesktopItem): Promise<ValidationResult> => {
  if (!isBookmarkItem(item)) {
    return { isValid: true };
  }

  if (!item.url) {
    return { 
      isValid: false, 
      error: 'Bookmark URL is required.' 
    };
  }

  try {
    new URL(item.url.startsWith('http') ? item.url : `https://${item.url}`);
  } catch {
    return { 
      isValid: false, 
      error: 'Invalid URL format.' 
    };
  }

  return validateUrl(item.url);
};

export const validateBookmarks = async (items: DesktopItem[]): Promise<Map<string, ValidationResult>> => {
  const results = new Map<string, ValidationResult>();

  const validateItem = async (item: DesktopItem) => {
    if (isBookmarkItem(item)) {
      results.set(item.id, await validateBookmark(item));
    } else if (isFolderItem(item)) {
      await Promise.all(item.children.map(validateItem));
    }
  };

  await Promise.all(items.map(validateItem));
  return results;
}; 