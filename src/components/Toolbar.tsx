import React from 'react';
import { Download, Upload, Search, ChevronLeft, Home } from 'lucide-react';
import { DesktopItem, FolderPath, ItemType } from '../types';

interface ToolbarProps {
  onCreateItem: (type: ItemType) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  currentFolder: DesktopItem | null;
  onNavigateBack: () => void;
  onNavigateToRoot: () => void;
  onImport: () => void;
  onExport: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onCreateItem,
  onSearch,
  searchQuery,
  currentFolder,
  onNavigateBack,
  onNavigateToRoot,
  onImport,
  onExport
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {currentFolder && (
            <button
              onClick={onNavigateBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 text-gray-600 hover:text-gray-800"
              title="Go Back"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <button
            onClick={onNavigateToRoot}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 text-gray-600 hover:text-gray-800"
            title="Go to Root"
          >
            <Home size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              className="pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          </div>
          
          <button
            onClick={() => onCreateItem('bookmark')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 text-gray-600 hover:text-gray-800"
            title="Create Bookmark"
          >
            <span>📑</span>
          </button>
          
          <button
            onClick={() => onCreateItem('folder')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 text-gray-600 hover:text-gray-800"
            title="Create Folder"
          >
            <span>📁</span>
          </button>

          <button
            onClick={onImport}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 text-gray-600 hover:text-gray-800"
            title="Import Bookmarks"
          >
            <Upload size={20} />
          </button>

          <button
            onClick={onExport}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 text-gray-600 hover:text-gray-800"
            title="Export Bookmarks"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar; 