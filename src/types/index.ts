export type ItemType = 'folder' | 'bookmark';

export type Position = {
  x: number;
  y: number;
};

// Base types for all items
export type BaseDesktopItem = {
  id: string;
  name: string;
  notes?: string;
  position: Position;
};

// Desktop item types with strict type literals
export type BookmarkItem = BaseDesktopItem & {
  readonly type: 'bookmark';
  url: string;
};

export type FolderItem = BaseDesktopItem & {
  readonly type: 'folder';
  children: (BookmarkItem | FolderItem)[];
};

export type DesktopItem = BookmarkItem | FolderItem;

// Form data types
export type BaseFormData = {
  name: string;
  notes?: string;
};

export type BookmarkFormData = BaseFormData & {
  readonly type: 'bookmark';
  url: string;
};

export type FolderFormData = BaseFormData & {
  readonly type: 'folder';
};

export type ItemFormData = BookmarkFormData | FolderFormData;

// Type guard functions with improved type inference
export function isBookmarkItem(item: DesktopItem): item is BookmarkItem {
  return item.type === 'bookmark';
}

export function isFolderItem(item: DesktopItem): item is FolderItem {
  return item.type === 'folder';
}

// Component props types
export type CreateItemModalProps = {
  type: ItemType;
  onSubmit: (item: ItemFormData) => void;
  onClose: () => void;
  editingItem: DesktopItem | null;
};

export interface DesktopProps {
  className?: string;
}

// Search and validation types
export type SearchResult = DesktopItem & {
  matchedTerms: {
    name?: string[];
    url?: string[];
    notes?: string[];
  };
};

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export type ValidationResults = Map<string, ValidationResult>;

// Navigation types
export type FolderPath = {
  id: string;
  name: string;
};

// Helper type for folder operations
export type FolderOperation = {
  type: 'folder';
  children: DesktopItem[];
};

// Helper type for folder updates
export type FolderUpdate = {
  type: 'folder';
  children: DesktopItem[];
  id: string;
  name: string;
  notes?: string;
  position: { x: number; y: number };
};

// Helper type for creating new items
export type CreateFolderItem = {
  type: 'folder';
  name: string;
  notes?: string;
  children: DesktopItem[];
};

export type CreateBookmarkItem = {
  type: 'bookmark';
  name: string;
  notes?: string;
  url: string;
};

export type CreateDesktopItem = CreateFolderItem | CreateBookmarkItem;

// Helper type for updating items
export type UpdateFolderItem = {
  type: 'folder';
  name: string;
  notes?: string;
  children: DesktopItem[];
  id: string;
  position: { x: number; y: number };
};

export type UpdateBookmarkItem = {
  type: 'bookmark';
  name: string;
  notes?: string;
  url: string;
  id: string;
  position: { x: number; y: number };
};

export type UpdateDesktopItem = UpdateFolderItem | UpdateBookmarkItem;