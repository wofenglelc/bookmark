import React, { useState, useRef, useEffect } from 'react';
import { Folder, ExternalLink } from 'lucide-react';
import { DesktopItem as DesktopItemType, ValidationResult, isFolderItem } from '../types';

interface DesktopItemProps {
  item: DesktopItemType;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>, item: DesktopItemType) => void;
  onDragStart: (item: DesktopItemType) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  isDraggedOver: boolean;
  validationResult?: ValidationResult;
  onClick?: (item: DesktopItemType) => void;
}

const DesktopItemComponent: React.FC<DesktopItemProps> = ({
  item,
  onContextMenu,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  isDraggedOver,
  validationResult,
  onClick
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onClick) {
      onClick(item);
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, item);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
    
    // Set custom drag image
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(itemRef.current, rect.width / 2, rect.height / 2);
    }
    
    onDragStart(item);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onDragEnd();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isFolderItem(item)) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      onDragOver(e);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isFolderItem(item)) {
      e.preventDefault();
      e.stopPropagation();
      onDrop(e);
    }
  };

  return (
    <div
      ref={itemRef}
      data-item-id={item.id}
      className={`absolute cursor-pointer transition-all duration-200 select-none ${
        isDragging ? 'opacity-50 scale-95 z-50' : 'z-10'
      } ${isDraggedOver && item.type === 'folder' ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
      style={{ 
        left: item.position.x, 
        top: item.position.y,
        zIndex: isDragging ? 1000 : 1
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-200 hover:bg-white/50 ${
        isDraggedOver && item.type === 'folder' ? 'bg-blue-50' : ''
      }`}>
        <div className={`p-3 rounded-lg transition-all duration-200 ${
          item.type === 'folder' 
            ? 'bg-yellow-400 text-yellow-800' 
            : validationResult?.isValid === false
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
        } shadow-md hover:shadow-lg`}>
          {item.type === 'folder' ? (
            <Folder size={24} />
          ) : (
            <ExternalLink size={24} />
          )}
        </div>
        <div className="text-center max-w-[100px]">
          <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
          {item.notes && (
            <p className="text-xs text-gray-600 truncate">{item.notes}</p>
          )}
          {validationResult?.isValid === false && (
            <p className="text-xs text-red-500 truncate">{validationResult.error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopItemComponent;