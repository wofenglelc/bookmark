import React, { useState } from 'react';
import { HelpCircle, X, MousePointer2, FolderPlus, BookmarkPlus, Search, Move, Menu } from 'lucide-react';

const UserGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const instructions = [
    {
      icon: <MousePointer2 className="w-5 h-5" />,
      title: "Basic Operations",
      content: "Click bookmark to open link, click folder to enter folder"
    },
    {
      icon: <BookmarkPlus className="w-5 h-5" />,
      title: "Create Bookmark",
      content: 'Right-click on empty space, select "New Bookmark", enter name and URL'
    },
    {
      icon: <FolderPlus className="w-5 h-5" />,
      title: "Create Folder",
      content: 'Right-click on empty space, select "New Folder", enter folder name'
    },
    {
      icon: <Move className="w-5 h-5" />,
      title: "Drag & Drop",
      content: "Drag bookmarks or folders to new position, drop into folders to organize"
    },
    {
      icon: <Menu className="w-5 h-5" />,
      title: "Management Options",
      content: "Right-click on bookmark or folder to rename, delete or edit"
    },
    {
      icon: <Search className="w-5 h-5" />,
      title: "Search Feature",
      content: "Use the search bar at the top to quickly find bookmarks with real-time search"
    }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
        title="User Guide"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl w-80 p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">User Guide</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {instructions.map((instruction, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 text-blue-500">
              {instruction.icon}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">{instruction.title}</h4>
              <p className="text-sm text-gray-600">{instruction.content}</p>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.2s ease-out;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default UserGuide; 