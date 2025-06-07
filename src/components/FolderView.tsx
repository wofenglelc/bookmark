import React from 'react';
import { DesktopItem, FolderItem, ValidationResults } from '../types';
import DesktopItemComponent from './DesktopItem';

interface FolderViewProps {
  folder: FolderItem;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>, targetItem?: DesktopItem) => void;
  draggedItem: DesktopItem | null;
  dragOverItem: DesktopItem | null;
  isDraggingPosition: boolean;
  onDragStart: (item: DesktopItem) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onPositionDrag: (item: DesktopItem, newPosition: { x: number; y: number }) => void;
  validationResults: ValidationResults;
  onItemClick?: (item: DesktopItem) => void;
}

const FolderView: React.FC<FolderViewProps> = ({
  folder,
  onContextMenu,
  draggedItem,
  dragOverItem,
  isDraggingPosition,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onPositionDrag,
  validationResults,
  onItemClick
}) => {
  return (
    <div 
      className="relative w-full h-full min-h-screen pt-16 pb-4"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="relative p-4">
        {folder.children.map((item) => (
          <DesktopItemComponent
            key={item.id}
            item={item}
            onContextMenu={onContextMenu}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={onDrop}
            isDragging={draggedItem?.id === item.id}
            isDraggedOver={dragOverItem?.id === item.id}
            validationResult={validationResults.get(item.id)}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderView;