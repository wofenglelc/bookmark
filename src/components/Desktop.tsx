import React, { useState, useEffect, useRef, useCallback } from 'react';
import ContextMenu from './ContextMenu';
import DesktopItemComponent from './DesktopItem';
import CreateItemModal from './CreateItemModal';
import FolderView from './FolderView';
import Toolbar from './Toolbar';
import SearchResults from './SearchResults';
import UserGuide from './UserGuide';
import StartButton from './StartButton';
import StartMenu from './StartMenu';
import WelcomeSection from './WelcomeSection';
import PrivacyPolicy from './PrivacyPolicy';
import { 
  DesktopItem, 
  FolderItem, 
  BookmarkItem, 
  ItemType, 
  FolderPath, 
  BaseDesktopItem,
  isBookmarkItem,
  isFolderItem,
  ItemFormData,
  ValidationResults,
  DesktopProps,
  SearchResult,
  CreateItemModalProps
} from '../types';
import { loadItems, saveItems } from '../utils/storage';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useSearch } from '../hooks/useSearch';
import { validateBookmarks } from '../utils/validation';
import { findNearestNonOverlappingPosition } from '../utils/collision';

const Desktop: React.FC<DesktopProps> = () => {
  // State
  const [items, setItems] = useState<DesktopItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
  const [folderPath, setFolderPath] = useState<FolderPath[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    show: boolean;
    targetItem?: { id: string; name: string; type: ItemType };
  }>({
    x: 0,
    y: 0,
    show: false
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<ItemType>('bookmark');
  const [editingItem, setEditingItem] = useState<DesktopItem | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResults>(new Map());
  const [showStartMenu, setShowStartMenu] = useState(false);
  
  // Refs
  const desktopRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const {
    draggedItem,
    dragOverItem,
    isDraggingPosition,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handlePositionDrag
  } = useDragAndDrop(items, setItems, currentFolder, setCurrentFolder);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchTerms
  } = useSearch(items, currentFolder);

  // Effects
  useEffect(() => {
    const savedItems = loadItems();
    if (savedItems && savedItems.length > 0) {
      setItems(savedItems);
    }
  }, []);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  useEffect(() => {
    const validateAllBookmarks = async () => {
      const results = await validateBookmarks(items);
      setValidationResults(results);
    };

    validateAllBookmarks();
  }, [items]);

  // Callbacks
  const updateItemInTree = useCallback((id: string, updatedItem: DesktopItem, itemList: DesktopItem[]): DesktopItem[] => {
    return itemList.map(item => {
      if (item.id === id) {
        return updatedItem;
      }
      if (isFolderItem(item)) {
        const updatedChildren = updateItemInTree(id, updatedItem, item.children);
        return {
          ...item,
          children: updatedChildren
        };
      }
      return item;
    });
  }, []);

  const handleItemCreated = useCallback((formData: ItemFormData) => {
    const currentItems = currentFolder ? currentFolder.children : items;
    
    // Generate a random position, then find the nearest non-overlapping position
    const randomPosition = { 
      x: Math.random() * (window.innerWidth - 200) + 50, 
      y: Math.random() * (window.innerHeight - 300) + 100 
    };
    
    const safePosition = findNearestNonOverlappingPosition(
      randomPosition,
      currentItems,
      undefined
    );

    const baseItem = {
      id: Date.now().toString(),
      name: formData.name,
      notes: formData.notes,
      position: safePosition
    };

    const newItem: DesktopItem = formData.type === 'folder'
      ? {
          ...baseItem,
          type: 'folder',
          children: []
        }
      : {
          ...baseItem,
          type: 'bookmark',
          url: formData.url
        };

    if (editingItem) {
      // When editing existing items, maintain original position (unless adjustment needed to avoid overlap)
      const editPosition = findNearestNonOverlappingPosition(
        editingItem.position,
        currentItems,
        editingItem.id
      );

      const updatedItem: DesktopItem = formData.type === 'folder'
        ? {
            ...baseItem,
            id: editingItem.id,
            position: editPosition,
            type: 'folder',
            children: isFolderItem(editingItem) ? editingItem.children : []
          }
        : {
            ...baseItem,
            id: editingItem.id,
            position: editPosition,
            type: 'bookmark',
            url: formData.url
          };

      if (currentFolder && isFolderItem(currentFolder)) {
        const updatedChildren = currentFolder.children.map(child =>
          child.id === editingItem.id ? updatedItem : child
        );
        
        const updatedFolder: FolderItem = {
          ...currentFolder,
          children: updatedChildren
        };
        
        setCurrentFolder(updatedFolder);
        setItems(updateItemInTree(currentFolder.id, updatedFolder, items));
      } else {
        setItems(updateItemInTree(editingItem.id, updatedItem, items));
      }
    } else {
      if (currentFolder && isFolderItem(currentFolder)) {
        const updatedFolder: FolderItem = {
          ...currentFolder,
          children: [...currentFolder.children, newItem]
        };
        setCurrentFolder(updatedFolder);
        setItems(updateItemInTree(currentFolder.id, updatedFolder, items));
      } else {
        setItems([...items, newItem]);
      }
    }
    
    setShowCreateModal(false);
    setEditingItem(null);
  }, [currentFolder, editingItem, items, updateItemInTree]);

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>, targetItem?: DesktopItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      show: true,
      targetItem: targetItem ? { id: targetItem.id, name: targetItem.name, type: targetItem.type } : undefined
    });
  }, []);

  const handleDesktopClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleContextMenu(e);
  }, [handleContextMenu]);

  const handleCreateItem = useCallback((type: ItemType) => {
    setCreateType(type);
    setEditingItem(null);
    setShowCreateModal(true);
    setContextMenu({ ...contextMenu, show: false });
  }, [contextMenu]);

  const handleRenameItem = useCallback((id: string) => {
    const item = currentFolder 
      ? currentFolder.children.find(child => child.id === id)
      : items.find(item => item.id === id);
    
    if (item) {
      setEditingItem(item);
      setCreateType(item.type);
      setShowCreateModal(true);
    }
    setContextMenu({ ...contextMenu, show: false });
  }, [contextMenu, currentFolder, items]);

  const handleDeleteItem = useCallback((id: string) => {
    if (currentFolder) {
      // Delete from current folder
      const updatedFolder: FolderItem = {
        ...currentFolder,
        children: currentFolder.children.filter(child => child.id !== id)
      };
      setCurrentFolder(updatedFolder);
      setItems(updateItemInTree(currentFolder.id, updatedFolder, items));
    } else {
      // Delete from root
      setItems(items.filter(item => item.id !== id));
    }
    setContextMenu({ ...contextMenu, show: false });
  }, [contextMenu, currentFolder, items, updateItemInTree]);

  const handleNavigateBack = useCallback(() => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      const lastFolder = newPath[newPath.length - 1];
      
      if (lastFolder) {
        const folder = items.find(item => item.id === lastFolder.id);
        if (folder && isFolderItem(folder)) {
          setCurrentFolder(folder);
          setFolderPath(newPath);
        }
      } else {
        setCurrentFolder(null);
        setFolderPath([]);
      }
    }
  }, [folderPath, items]);

  const handleNavigateToRoot = useCallback(() => {
    setCurrentFolder(null);
    setFolderPath([]);
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedItems = JSON.parse(e.target?.result as string);
            setItems(importedItems);
          } catch (error) {
            console.error('Error importing bookmarks:', error);
            alert('Failed to import bookmarks. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const handleExport = useCallback(() => {
    const exportData = JSON.stringify(items, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookmarks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [items]);

  const handleItemClick = useCallback((item: DesktopItem) => {
    if (isFolderItem(item)) {
      setCurrentFolder(item);
      setFolderPath(prev => [...prev, { id: item.id, name: item.name }]);
    }
  }, []);

  const handleStartMenuToggle = useCallback(() => {
    setShowStartMenu(prev => !prev);
  }, []);

  const handleStartMenuClose = useCallback(() => {
    setShowStartMenu(false);
  }, []);

  const handleRecentBookmarkClick = useCallback((bookmark: BookmarkItem) => {
    // Track the bookmark usage
    const saveRecentBookmark = (bookmark: BookmarkItem) => {
      try {
        const saved = localStorage.getItem('recent-bookmarks');
        const recent = saved ? JSON.parse(saved) : [];
        
        const filtered = recent.filter((item: any) => item.id !== bookmark.id);
        const newEntry = { ...bookmark, lastUsed: Date.now() };
        const updated = [newEntry, ...filtered].slice(0, 20);
        
        localStorage.setItem('recent-bookmarks', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save recent bookmark:', error);
      }
    };
    
    saveRecentBookmark(bookmark);
  }, []);

  // Update the existing handleItemClick for DesktopItem to track bookmark usage
  const handleDesktopItemClick = useCallback((item: DesktopItem) => {
    if (isFolderItem(item)) {
      setCurrentFolder(item);
      setFolderPath(prev => [...prev, { id: item.id, name: item.name }]);
    } else if (isBookmarkItem(item)) {
      // Track usage and open bookmark
      handleRecentBookmarkClick(item);
      if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
    }
  }, [handleRecentBookmarkClick]);

  // Render
  return (
    <div 
      ref={desktopRef}
      className="relative w-full h-full overflow-hidden bg-transparent"
      onContextMenu={handleDesktopClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Toolbar
        onCreateItem={handleCreateItem}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        currentFolder={currentFolder}
        onNavigateBack={handleNavigateBack}
        onNavigateToRoot={handleNavigateToRoot}
        onImport={handleImport}
        onExport={handleExport}
      />
      
      {searchQuery ? (
        <SearchResults
          results={searchResults}
          searchTerms={searchTerms}
          onItemClick={handleItemClick}
          onClose={() => setSearchQuery('')}
        />
      ) : currentFolder && isFolderItem(currentFolder) ? (
        <FolderView
          folder={currentFolder}
          onContextMenu={handleContextMenu}
          draggedItem={draggedItem}
          dragOverItem={dragOverItem}
          isDraggingPosition={isDraggingPosition}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onPositionDrag={handlePositionDrag}
          validationResults={validationResults}
          onItemClick={handleDesktopItemClick}
        />
      ) : (
        <div className="relative w-full h-full">
          {items.map(item => (
            <DesktopItemComponent
              key={item.id}
              item={item}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={draggedItem?.id === item.id}
              isDraggedOver={dragOverItem?.id === item.id}
              validationResult={validationResults.get(item.id)}
              onClick={handleDesktopItemClick}
            />
          ))}
        </div>
      )}

      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          targetItem={contextMenu.targetItem}
          onCreateItem={handleCreateItem}
          onRenameItem={handleRenameItem}
          onDeleteItem={handleDeleteItem}
          onClose={() => setContextMenu({ ...contextMenu, show: false })}
        />
      )}

      {showCreateModal && (
        <CreateItemModal
          type={createType}
          onSubmit={handleItemCreated}
          onClose={() => setShowCreateModal(false)}
          editingItem={editingItem}
        />
      )}

      <StartButton 
        onClick={handleStartMenuToggle}
        isActive={showStartMenu}
      />

      <StartMenu
        isOpen={showStartMenu}
        onClose={handleStartMenuClose}
        onBookmarkClick={handleRecentBookmarkClick}
      />

      <UserGuide />

      <PrivacyPolicy />

      <WelcomeSection show={items.length === 0 && !searchQuery && !currentFolder} />
    </div>
  );
};

export default Desktop;