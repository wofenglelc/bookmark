import { DesktopItem, BookmarkItem, isBookmarkItem, isFolderItem, ValidationResult } from '../types';

export const validateUrl = async (url: string): Promise<ValidationResult> => {
  try {
    const finalUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // First, validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(finalUrl);
    } catch {
      return { 
        isValid: false, 
        error: 'Invalid URL format.' 
      };
    }

    // Check if it's a valid domain format
    const domain = parsedUrl.hostname;
    if (!domain || domain.length === 0) {
      return { 
        isValid: false, 
        error: 'Invalid domain name.' 
      };
    }

    // Basic domain format validation
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domain)) {
      return { 
        isValid: false, 
        error: 'Invalid domain name format.' 
      };
    }

    // Try multiple validation methods
    const validationPromises = [
      // Method 1: Try HEAD request with no-cors (will succeed for some sites)
      tryFetchValidation(finalUrl),
      // Method 2: Try loading as image (works for many sites)
      tryImageValidation(domain)
    ];

    const results = await Promise.allSettled(validationPromises);
    
    // If any method succeeds, consider it valid
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.isValid) {
        return { isValid: true };
      }
    }

    // If all methods fail, but domain format is valid, assume it's reachable
    // This is better than blocking valid domains due to CORS restrictions
    return { 
      isValid: true,
      warning: 'Domain format is valid, but connectivity could not be verified due to CORS restrictions.'
    };

  } catch (error) {
    return { 
      isValid: false, 
      error: 'Unable to validate this URL. Please check if it is correct.' 
    };
  }
};

const tryFetchValidation = async (url: string): Promise<ValidationResult> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    await fetch(url, { 
      method: 'HEAD', 
      mode: 'no-cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Fetch failed' };
  }
};

const tryImageValidation = async (domain: string): Promise<ValidationResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      resolve({ isValid: false, error: 'Image validation timeout' });
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve({ isValid: true });
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve({ isValid: false, error: 'Image validation failed' });
    };

    // Try to load favicon or a common image path
    img.src = `https://${domain}/favicon.ico?t=${Date.now()}`;
  });
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
