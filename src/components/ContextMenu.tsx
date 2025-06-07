import React from 'react';
import { Folder, Bookmark, Edit3, Trash2 } from 'lucide-react';
import { ItemType } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCreateItem: (type: ItemType) => void;
  onRenameItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  targetItem?: { id: string; name: string; type: ItemType };
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onCreateItem,
  onRenameItem,
  onDeleteItem,
  targetItem
}) => {
  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={handleClickOutside}
    >
      <div
        className="absolute bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[160px] animate-in fade-in duration-150"
        style={{ left: x, top: y }}
      >
        {targetItem ? (
          // Item-specific context menu
          <>
            <button
              onClick={() => {
                onRenameItem(targetItem.id);
                onClose();
              }}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-150"
            >
              <Edit3 size={16} className="text-green-500" />
              <span>Rename</span>
            </button>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${targetItem.name}"?`)) {
                  onDeleteItem(targetItem.id);
                }
                onClose();
              }}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-150"
            >
              <Trash2 size={16} className="text-red-500" />
              <span>Delete</span>
            </button>
          </>
        ) : (
          // Create menu
          <>
            <button
              onClick={() => {
                onCreateItem('folder');
                onClose();
              }}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-150"
            >
              <Folder size={16} className="text-yellow-500" />
              <span>New Folder</span>
            </button>
            <button
              onClick={() => {
                onCreateItem('bookmark');
                onClose();
              }}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-150"
            >
              <Bookmark size={16} className="text-blue-500" />
              <span>New Bookmark</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContextMenu;