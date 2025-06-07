import { useState, useCallback, useRef } from 'react';
import { DesktopItem, FolderItem, isFolderItem } from '../types';
import { findNearestNonOverlappingPosition, Position } from '../utils/collision';

type DragAndDropHook = {
  draggedItem: DesktopItem | null;
  dragOverItem: DesktopItem | null;
  isDraggingPosition: boolean;
  handleDragStart: (item: DesktopItem) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, targetFolder?: FolderItem) => void;
  handlePositionDrag: (item: DesktopItem, newPosition: Position) => void;
};

type UpdateItemInTreeFn = (id: string, updatedItem: DesktopItem, itemList: DesktopItem[]) => DesktopItem[];

export const useDragAndDrop = (
  items: DesktopItem[],
  setItems: React.Dispatch<React.SetStateAction<DesktopItem[]>>,
  currentFolder: FolderItem | null,
  setCurrentFolder: React.Dispatch<React.SetStateAction<FolderItem | null>>
): DragAndDropHook => {
  const [draggedItem, setDraggedItem] = useState<DesktopItem | null>(null);
  const [dragOverItem, setDragOverItem] = useState<DesktopItem | null>(null);
  const [isDraggingPosition, setIsDraggingPosition] = useState(false);
  const dragStartPosition = useRef<Position | null>(null);
  const dragThreshold = 10; // 拖动阈值，超过这个距离才认为是拖动

  const updateItemInTree: UpdateItemInTreeFn = useCallback((id, updatedItem, itemList) => {
    return itemList.map(item => {
      if (item.id === id) {
        return updatedItem;
      }
      if (isFolderItem(item)) {
        return {
          ...item,
          children: updateItemInTree(id, updatedItem, item.children)
        };
      }
      return item;
    });
  }, []);

  const removeItemFromTree = useCallback((id: string, itemList: DesktopItem[]): DesktopItem[] => {
    return itemList.filter(item => {
      if (item.id === id) return false;
      if (isFolderItem(item)) {
        item.children = removeItemFromTree(id, item.children);
      }
      return true;
    });
  }, []);

  const handleDragStart = useCallback((item: DesktopItem) => {
    setDraggedItem(item);
    setIsDraggingPosition(false);
    dragStartPosition.current = { x: item.position.x, y: item.position.y };
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverItem(null);
    setIsDraggingPosition(false);
    dragStartPosition.current = null;
    
    // 清除所有拖放样式
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.target as HTMLElement;
    const itemElement = target.closest('[data-item-id]');
    const itemId = itemElement?.getAttribute('data-item-id');
    
    if (!itemId || !draggedItem) {
      setDragOverItem(null);
      return;
    }
    
    const currentItems = currentFolder ? currentFolder.children : items;
    const overItem = currentItems.find(item => item.id === itemId);
    
    if (overItem && isFolderItem(overItem) && draggedItem.id !== overItem.id) {
      setDragOverItem(overItem);
      
      // 检查拖动距离
      if (dragStartPosition.current) {
        const distance = Math.sqrt(
          Math.pow(e.clientX - dragStartPosition.current.x, 2) +
          Math.pow(e.clientY - dragStartPosition.current.y, 2)
        );
        
        if (distance > dragThreshold) {
          setIsDraggingPosition(true);
        }
      }
    } else {
      setDragOverItem(null);
    }
  }, [currentFolder, draggedItem, items, dragThreshold]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetFolder?: FolderItem) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem) return;

    const dropTarget = targetFolder || dragOverItem;
    
    // 计算拖放位置
    const rect = e.currentTarget.getBoundingClientRect();
    const dropPosition: Position = {
      x: e.clientX - rect.left - 60, // 调整偏移量
      y: e.clientY - rect.top - 60
    };

    // 如果拖放到文件夹上
    if (dropTarget && isFolderItem(dropTarget) && draggedItem.id !== dropTarget.id) {
      // 移除项目从当前位置
      let newItems = [...items];
      if (currentFolder) {
        const updatedCurrentFolder: FolderItem = {
          ...currentFolder,
          children: currentFolder.children.filter(child => child.id !== draggedItem.id)
        };
        setCurrentFolder(updatedCurrentFolder);
        newItems = updateItemInTree(currentFolder.id, updatedCurrentFolder, newItems);
      } else {
        newItems = removeItemFromTree(draggedItem.id, newItems);
      }

      // 添加到目标文件夹
      const updatedDraggedItem = {
        ...draggedItem,
        position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 }
      };

      const updatedTargetFolder: FolderItem = {
        ...dropTarget,
        children: [...dropTarget.children, updatedDraggedItem]
      };

      if (currentFolder && dropTarget.id === currentFolder.id) {
        setCurrentFolder(updatedTargetFolder);
      }
      
      newItems = updateItemInTree(dropTarget.id, updatedTargetFolder, newItems);
      setItems(newItems);
    } else {
      // 位置拖动
      handlePositionDrag(draggedItem, dropPosition);
    }

    handleDragEnd();
  }, [draggedItem, dragOverItem, currentFolder, items, setItems, setCurrentFolder, updateItemInTree, removeItemFromTree, handleDragEnd]);

  const handlePositionDrag = useCallback((item: DesktopItem, newPosition: Position) => {
    const currentItems = currentFolder ? currentFolder.children : items;
    
    // 找到最近的非重叠位置
    const adjustedPosition = findNearestNonOverlappingPosition(
      newPosition,
      currentItems,
      item.id
    );

    const updatedItem: DesktopItem = {
      ...item,
      position: adjustedPosition
    };

    if (currentFolder) {
      // 更新文件夹中的项目
      const updatedChildren = currentFolder.children.map(child =>
        child.id === item.id ? updatedItem : child
      );
      
      const updatedFolder: FolderItem = {
        ...currentFolder,
        children: updatedChildren
      };
      
      setCurrentFolder(updatedFolder);
      setItems(updateItemInTree(currentFolder.id, updatedFolder, items));
    } else {
      // 更新根级项目
      setItems(updateItemInTree(item.id, updatedItem, items));
    }
  }, [currentFolder, items, setItems, setCurrentFolder, updateItemInTree]);

  return {
    draggedItem,
    dragOverItem,
    isDraggingPosition,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handlePositionDrag
  };
};